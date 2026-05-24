import { createHmac } from 'crypto'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { createServiceClient } from '@/lib/supabase/server'
import { getTenantConfigFresh } from '@/lib/supabase/tenant'
import { env } from '@/lib/config/env'
import { orderConfirmationEmail } from '@/lib/email/templates'

export async function POST(req: Request) {
  const body = await req.text()
  const url = new URL(req.url)

  // Verificar firma si hay secret configurado
  const webhookSecret = env.MP_WEBHOOK_SECRET
  if (webhookSecret) {
    const xSignature = req.headers.get('x-signature') ?? ''
    const xRequestId = req.headers.get('x-request-id') ?? ''
    const dataId = url.searchParams.get('data.id') ?? url.searchParams.get('id') ?? ''

    const tsPart = xSignature.split(',').find((s) => s.startsWith('ts='))
    const vPart = xSignature.split(',').find((s) => s.startsWith('v1='))
    const ts = tsPart?.split('=')[1] ?? ''
    const v1 = vPart?.split('=')[1] ?? ''

    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`
    const expected = createHmac('sha256', webhookSecret).update(manifest).digest('hex')

    if (v1 && v1 !== expected) {
      return new Response('Unauthorized', { status: 401 })
    }
  }

  let payload: { type?: string; action?: string; data?: { id?: string } }
  try {
    payload = JSON.parse(body)
  } catch {
    return new Response('Bad Request', { status: 400 })
  }

  // Soportar formato legacy (type: 'payment') y v2 (action: 'payment.created' / 'payment.updated')
  const isPaymentEvent =
    payload.type === 'payment' ||
    (payload.action?.startsWith('payment') ?? false)
  const paymentId = payload.data?.id

  if (!isPaymentEvent || !paymentId) {
    return new Response('OK', { status: 200 })
  }

  const sb = createServiceClient()
  const TENANT_ID = env.NEXT_PUBLIC_TENANT_ID

  const tenant = await getTenantConfigFresh()
  if (!tenant.mp_access_token) {
    return new Response('OK', { status: 200 })
  }

  // Obtener detalles del pago desde MP
  const mpClient = new MercadoPagoConfig({ accessToken: tenant.mp_access_token })
  const paymentClient = new Payment(mpClient)

  let payment
  try {
    payment = await paymentClient.get({ id: paymentId })
  } catch {
    return new Response('OK', { status: 200 })
  }

  if (!payment || !payment.external_reference) {
    return new Response('OK', { status: 200 })
  }

  const orderId = payment.external_reference

  // Guardar payload ANTES de mutar estado (auditoría)
  await sb.from('payment_events').insert({
    tenant_id: TENANT_ID,
    order_id: orderId,
    provider: 'mercadopago',
    provider_event_id: String(payment.id),
    status: payment.status ?? 'unknown',
    payload: payment as object,
  })

  // Mapear estado MP → estado de orden
  const statusMap: Record<string, string> = {
    approved: 'paid',
    rejected: 'payment_failed',
    cancelled: 'cancelled',
    pending: 'pending_payment',
    in_process: 'pending_payment',
    authorized: 'pending_payment',
  }

  const newStatus = statusMap[payment.status ?? ''] ?? 'pending_payment'

  await sb
    .from('orders')
    .update({
      status: newStatus,
      payment_status: payment.status ?? 'pending',
      mp_payment_id: String(payment.id),
    })
    .eq('id', orderId)
    .eq('tenant_id', TENANT_ID)

  // Enviar email de confirmación si el pago fue aprobado
  if (newStatus === 'paid' && tenant.resend_api_key && tenant.contact_email) {
    try {
      const { data: order } = await sb
        .from('orders')
        .select(`
          customer_first_name, payer_email, tracking_token,
          shipping_carrier, shipping_cost,
          order_items(name, variant_name, unit_price, quantity)
        `)
        .eq('id', orderId)
        .single()

      if (order?.payer_email) {
        const { Resend } = await import('resend')
        const resend = new Resend(tenant.resend_api_key)
        const ref = (order.tracking_token as string).slice(0, 8).toUpperCase()
        const trackingUrl = `${env.NEXT_PUBLIC_URL}/pedidos/${order.tracking_token}`
        const items = (order.order_items as { name: string; variant_name: string | null; unit_price: number; quantity: number }[]) ?? []

        await resend.emails.send({
          from: `${tenant.name} <${tenant.contact_email}>`,
          to: order.payer_email,
          subject: `Pedido confirmado #${ref} — ${tenant.name}`,
          html: orderConfirmationEmail({
            businessName: tenant.name ?? 'Tienda',
            businessAddress: 'Saenz 987, Baradero · Lun–Sáb 9:00–21:00',
            businessPhone: tenant.whatsapp ?? undefined,
            customerName: order.customer_first_name ?? '',
            orderRef: ref,
            trackingUrl,
            items: items.map((i) => ({
              name: i.name,
              variantName: i.variant_name,
              quantity: i.quantity,
              unitPrice: i.unit_price,
            })),
            shippingLabel: (order.shipping_carrier as string) ?? 'Envío',
            shippingCost: (order.shipping_cost as number) ?? 0,
            total: items.reduce((s, i) => s + i.unit_price * i.quantity, 0) + ((order.shipping_cost as number) ?? 0),
          }),
        })
      }
    } catch {
      // Fallo de email no afecta el flujo del pedido
    }
  }

  return new Response('OK', { status: 200 })
}

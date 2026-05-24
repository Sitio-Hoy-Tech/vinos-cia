'use server'

import { randomUUID } from 'crypto'
import { MercadoPagoConfig, Preference, Payment as MercadoPagoPayment } from 'mercadopago'
import { createServiceClient } from '@/lib/supabase/server'
import { getTenantConfig } from '@/lib/supabase/tenant'
import { orderConfirmationEmail } from '@/lib/email/templates'
import { env } from '@/lib/config/env'

export type CheckoutInput = {
  firstName: string
  lastName: string
  email: string
  phone: string
  zoneId: string
  address: string
  items: { productId: string; variantId?: string; quantity: number }[]
}

export type CheckoutResult =
  | { ok: true; preferenceId: string; trackingToken: string; orderId: string; total: number }
  | { ok: false; error: string }

export type PaymentInput = {
  orderId: string
  token: string
  paymentMethodId: string
  issuerId: string | null
  installments: number
  identificationNumber: string
  identificationType: string
}

export type PaymentResult =
  | { ok: true; status: string; trackingToken: string }
  | { ok: false; error: string }

export async function createCheckoutPreference(
  input: CheckoutInput,
): Promise<CheckoutResult> {
  const sb = createServiceClient()
  const TENANT_ID = env.NEXT_PUBLIC_TENANT_ID

  // 1. Validar items y obtener precios desde la BD (nunca confiar en el cliente)
  const productIds = input.items.map((i) => i.productId)
  const { data: products } = await sb
    .from('products')
    .select('id, name, price, stock, stock_unlimited, product_variants(id, price, stock)')
    .in('id', productIds)
    .eq('tenant_id', TENANT_ID)
    .eq('active', true)

  if (!products || products.length !== productIds.length) {
    return { ok: false, error: 'Algunos productos no están disponibles.' }
  }

  const validatedItems: {
    productId: string
    variantId: string | null
    name: string
    price: number
    quantity: number
  }[] = []

  for (const cartItem of input.items) {
    const product = products.find((p) => p.id === cartItem.productId)
    if (!product) return { ok: false, error: 'Producto no encontrado.' }

    let price = product.price
    let stock = product.stock as number
    let stockUnlimited = product.stock_unlimited as boolean

    if (cartItem.variantId) {
      const variants = product.product_variants as { id: string; price: number | null; stock: number | null }[]
      const variant = variants?.find((v) => v.id === cartItem.variantId)
      if (!variant) return { ok: false, error: `Variante no encontrada en "${product.name}".` }
      if (variant.price != null) price = variant.price
      stock = variant.stock ?? 0
      stockUnlimited = false
    }

    if (!stockUnlimited && stock < cartItem.quantity) {
      return { ok: false, error: `Stock insuficiente para "${product.name}".` }
    }

    validatedItems.push({
      productId: cartItem.productId,
      variantId: cartItem.variantId ?? null,
      name: product.name as string,
      price,
      quantity: cartItem.quantity,
    })
  }

  // 2. Validar zona de envío
  const { data: zone } = await sb
    .from('shipping_zones')
    .select('id, name, price')
    .eq('id', input.zoneId)
    .eq('tenant_id', TENANT_ID)
    .eq('active', true)
    .single()

  if (!zone) return { ok: false, error: 'Zona de envío no válida.' }

  // 3. Calcular total server-side
  const subtotal = validatedItems.reduce((s, i) => s + i.price * i.quantity, 0)
  const total = subtotal + (zone.price as number)

  // 4. Crear orden en BD
  const orderId = randomUUID()
  const { data: order, error: orderError } = await sb
    .from('orders')
    .insert({
      id: orderId,
      tenant_id: TENANT_ID,
      status: 'pending_payment',
      payment_status: 'pending',
      payment_provider: 'mercadopago',
      payer_email: input.email,
      customer_first_name: input.firstName,
      customer_last_name: input.lastName,
      customer_phone: input.phone,
      shipping_carrier: zone.name,
      shipping_cost: zone.price,
      shipping_address: input.address ? { street: input.address } : null,
      total,
      currency: 'ARS',
      external_reference: orderId,
    })
    .select('id, tracking_token')
    .single()

  if (orderError || !order) {
    return { ok: false, error: 'No se pudo crear el pedido. Intentá de nuevo.' }
  }

  // 5. Crear order_items
  await sb.from('order_items').insert(
    validatedItems.map((i) => ({
      tenant_id: TENANT_ID,
      order_id: order.id,
      product_id: i.productId,
      variant_id: i.variantId,
      name: i.name,
      unit_price: i.price,
      quantity: i.quantity,
    })),
  )

  // 6. Crear preferencia en MercadoPago
  const tenant = await getTenantConfig()
  if (!tenant.mp_access_token) {
    return { ok: false, error: 'Pagos no configurados. Contactanos por WhatsApp.' }
  }

  const mpClient = new MercadoPagoConfig({ accessToken: tenant.mp_access_token })
  const preferenceClient = new Preference(mpClient)

  let preference
  try {
    preference = await preferenceClient.create({
      body: {
        items: validatedItems.map((i) => ({
          id: i.productId,
          title: i.name,
          quantity: i.quantity,
          unit_price: i.price,
          currency_id: 'ARS',
        })),
        payer: {
          email: input.email,
          name: input.firstName,
          surname: input.lastName,
          phone: { area_code: '', number: input.phone },
        },
        // MP no acepta localhost en back_urls ni notification_url
        ...(env.NEXT_PUBLIC_URL.startsWith('http://localhost')
          ? {}
          : {
              back_urls: {
                success: `${env.NEXT_PUBLIC_URL}/checkout/success`,
                failure: `${env.NEXT_PUBLIC_URL}/checkout/failure`,
                pending: `${env.NEXT_PUBLIC_URL}/checkout/pending`,
              },
              auto_return: 'approved' as const,
              notification_url: `${env.NEXT_PUBLIC_URL}/api/webhook/mercadopago`,
            }),
        external_reference: orderId,
      },
      requestOptions: { idempotencyKey: orderId },
    })
  } catch (err) {
    console.error('[checkout] MP preference error:', err)
    // Limpiar la orden si MP falla
    await sb.from('orders').delete().eq('id', orderId)
    return { ok: false, error: 'No se pudo conectar con MercadoPago. Intentá de nuevo.' }
  }

  if (!preference.id) {
    await sb.from('orders').delete().eq('id', orderId)
    return { ok: false, error: 'MercadoPago no devolvió una preferencia válida.' }
  }

  // 7. Guardar preference ID en la orden
  await sb
    .from('orders')
    .update({ mp_payment_id: preference.id })
    .eq('id', order.id)

  return {
    ok: true,
    preferenceId: preference.id,
    trackingToken: order.tracking_token as string,
    orderId: order.id,
    total,
  }
}

export async function processPayment(input: PaymentInput): Promise<PaymentResult> {
  const sb = createServiceClient()
  const TENANT_ID = env.NEXT_PUBLIC_TENANT_ID

  // 1. Buscar la orden
  const { data: order } = await sb
    .from('orders')
    .select('id, total, payer_email, tracking_token, status, payment_status')
    .eq('id', input.orderId)
    .eq('tenant_id', TENANT_ID)
    .single()

  if (!order) return { ok: false, error: 'Pedido no encontrado.' }
  if (order.status !== 'pending_payment') {
    return { ok: false, error: 'Este pedido ya fue procesado.' }
  }

  // 2. Obtener credenciales MP
  const tenant = await getTenantConfig()
  if (!tenant.mp_access_token) {
    return { ok: false, error: 'Pagos no configurados. Contactanos por WhatsApp.' }
  }

  const mpClient = new MercadoPagoConfig({ accessToken: tenant.mp_access_token })
  const mpPayment = new MercadoPagoPayment(mpClient)

  // 3. Crear pago en MP
  let paymentResponse
  try {
    paymentResponse = await mpPayment.create({
      body: {
        transaction_amount: order.total as number,
        token: input.token,
        payment_method_id: input.paymentMethodId,
        issuer_id: input.issuerId ? parseInt(input.issuerId) : undefined,
        installments: input.installments,
        payer: {
          email: order.payer_email as string,
          identification: {
            type: input.identificationType,
            number: input.identificationNumber,
          },
        },
        external_reference: input.orderId,
      },
      requestOptions: { idempotencyKey: `pay-${input.orderId}` },
    })
  } catch (err) {
    console.error('[processPayment] MP error:', err)
    return { ok: false, error: 'Error al procesar el pago. Intentá de nuevo.' }
  }

  const mpStatus = paymentResponse?.status
  const mpStatusDetail = paymentResponse?.status_detail
  const mpPaymentId = paymentResponse?.id?.toString() ?? null

  // 4. Guardar evento de pago ANTES de mutar estado
  await sb.from('payment_events').insert({
    tenant_id: TENANT_ID,
    order_id: order.id,
    provider: 'mercadopago',
    event_type: 'payment.created',
    status: mpStatus ?? 'unknown',
    payload: paymentResponse as unknown as Record<string, unknown>,
  })

  // 5. Mapear estado MP → estado orden
  let newStatus: string
  let newPaymentStatus: string

  if (mpStatus === 'approved') {
    newStatus = 'paid'
    newPaymentStatus = 'paid'
  } else if (mpStatus === 'in_process' || mpStatus === 'pending') {
    newStatus = 'pending_payment'
    newPaymentStatus = 'pending'
  } else {
    newStatus = 'payment_failed'
    newPaymentStatus = 'failed'
  }

  // 6. Actualizar orden
  await sb
    .from('orders')
    .update({
      status: newStatus,
      payment_status: newPaymentStatus,
      mp_payment_id: mpPaymentId,
      paid_at: mpStatus === 'approved' ? new Date().toISOString() : null,
    })
    .eq('id', order.id)

  // 7. Si aprobado, enviar email de confirmación
  if (mpStatus === 'approved') {
    try {
      const { data: orderFull } = await sb
        .from('orders')
        .select(`
          id, total, shipping_carrier, shipping_cost, tracking_token,
          customer_first_name, customer_last_name,
          order_items(name, unit_price, quantity)
        `)
        .eq('id', order.id)
        .single()

      const { data: tenantRow } = await sb
        .from('tenants')
        .select('name, contact_email, resend_api_key, address, phone')
        .eq('id', TENANT_ID)
        .single()

      if (tenantRow?.resend_api_key && tenantRow.contact_email && orderFull) {
        const { Resend } = await import('resend')
        const resend = new Resend(tenantRow.resend_api_key as string)
        const trackingUrl = `${env.NEXT_PUBLIC_URL}/pedidos/${orderFull.tracking_token}`

        await resend.emails.send({
          from: `${tenantRow.name} <${tenantRow.contact_email}>`,
          to: order.payer_email as string,
          subject: `Confirmación de pedido — ${tenantRow.name}`,
          html: orderConfirmationEmail({
            businessName: tenantRow.name as string,
            businessAddress: (tenantRow.address as string) ?? '',
            businessPhone: tenantRow.phone as string | undefined,
            customerName: `${orderFull.customer_first_name} ${orderFull.customer_last_name}`,
            orderRef: (orderFull.tracking_token as string).slice(0, 8).toUpperCase(),
            trackingUrl,
            items: (orderFull.order_items as { name: string; unit_price: number; quantity: number }[]).map((i) => ({
              name: i.name,
              quantity: i.quantity,
              unitPrice: i.unit_price,
            })),
            shippingLabel: orderFull.shipping_carrier as string,
            shippingCost: orderFull.shipping_cost as number,
            total: orderFull.total as number,
          }),
        })
      }
    } catch (emailErr) {
      console.error('[processPayment] email error:', emailErr)
      // No fallar la transacción por el email
    }
  }

  if (mpStatus === 'rejected') {
    const detail = mpStatusDetail ?? 'rejected'
    return { ok: false, error: `Pago rechazado (${detail}). Verificá los datos e intentá de nuevo.` }
  }

  return {
    ok: true,
    status: mpStatus ?? 'pending',
    trackingToken: order.tracking_token as string,
  }
}

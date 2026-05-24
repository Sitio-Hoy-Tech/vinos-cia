import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { env } from '@/lib/config/env'

export const metadata: Metadata = { title: 'Seguimiento de pedido — Vinos & Cia' }

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:         { label: 'Pendiente',          color: '#92400e' },
  pending_payment: { label: 'Esperando pago',      color: '#92400e' },
  paid:            { label: 'Pago confirmado',     color: '#065f46' },
  payment_failed:  { label: 'Pago rechazado',      color: '#991b1b' },
  processing:      { label: 'En preparación',      color: '#1e40af' },
  confirmed:       { label: 'Confirmado',          color: '#065f46' },
  shipped:         { label: 'Enviado',             color: '#1e40af' },
  delivered:       { label: 'Entregado',           color: '#065f46' },
  cancelled:       { label: 'Cancelado',           color: '#6b7280' },
  refunded:        { label: 'Reembolsado',         color: '#6b7280' },
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(n)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function PedidoPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const sb = createServiceClient()

  const { data: order } = await sb
    .from('orders')
    .select(`
      id, status, total, shipping_cost, shipping_carrier, shipping_address,
      shipping_tracking_number, customer_first_name, customer_last_name,
      payer_email, tracking_token, created_at,
      order_items(id, name, variant_name, unit_price, quantity)
    `)
    .eq('tracking_token', token)
    .eq('tenant_id', env.NEXT_PUBLIC_TENANT_ID)
    .single()

  if (!order) notFound()

  const statusInfo = STATUS_LABEL[order.status] ?? { label: order.status, color: '#6b7280' }
  const ref = (order.tracking_token as string).slice(0, 8).toUpperCase()
  const items = (order.order_items as { id: string; name: string; variant_name: string | null; unit_price: number; quantity: number }[]) ?? []

  return (
    <main>
      <section className="py-10 md:py-14" style={{ background: 'var(--color-secondary)' }}>
        <div className="container">
          <p
            className="mb-1 text-xs font-medium uppercase tracking-[0.25em]"
            style={{ color: 'var(--color-accent)' }}
          >
            Seguimiento
          </p>
          <h1
            className="text-3xl font-light md:text-4xl"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary-foreground)' }}
          >
            Pedido #{ref}
          </h1>
        </div>
      </section>

      <section className="py-10 md:py-16" style={{ background: 'var(--color-bg)' }}>
        <div className="container max-w-2xl">
          <div className="flex flex-col gap-8">

            {/* Estado */}
            <div
              className="flex items-center justify-between rounded p-4"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                  Estado
                </p>
                <p className="mt-1 text-lg font-medium" style={{ color: statusInfo.color }}>
                  {statusInfo.label}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Fecha del pedido
                </p>
                <p className="mt-1 text-sm">{formatDate(order.created_at as string)}</p>
              </div>
            </div>

            {/* Número de seguimiento de envío */}
            {order.shipping_tracking_number && (
              <div
                className="rounded p-4"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>
                  Seguimiento de envío
                </p>
                <p className="text-sm font-medium">{order.shipping_tracking_number}</p>
              </div>
            )}

            {/* Productos */}
            <div
              className="rounded p-4 flex flex-col gap-4"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <h2 className="text-sm font-medium uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                Productos
              </h2>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-2 text-sm">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      {item.variant_name && (
                        <span className="ml-1" style={{ color: 'var(--color-text-muted)' }}>
                          — {item.variant_name}
                        </span>
                      )}
                      <span className="ml-1" style={{ color: 'var(--color-text-muted)' }}>
                        x{item.quantity}
                      </span>
                    </div>
                    <span className="shrink-0 font-medium">
                      {formatPrice(item.unit_price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div
                className="flex flex-col gap-1.5 border-t pt-3 text-sm"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex justify-between">
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    {order.shipping_carrier ?? 'Envío'}
                  </span>
                  <span>
                    {(order.shipping_cost as number) === 0
                      ? 'Gratis'
                      : formatPrice(order.shipping_cost as number)}
                  </span>
                </div>
                <div className="flex justify-between font-medium text-base">
                  <span>Total</span>
                  <span style={{ color: 'var(--color-primary)' }}>
                    {formatPrice(order.total as number)}
                  </span>
                </div>
              </div>
            </div>

            {/* Entrega */}
            <div
              className="rounded p-4"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <h2 className="mb-2 text-sm font-medium uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                Entrega
              </h2>
              <p className="text-sm font-medium">{order.shipping_carrier}</p>
              {order.shipping_address && (
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {(order.shipping_address as { street?: string }).street}
                </p>
              )}
            </div>

            <Link
              href="/productos"
              className="self-start text-sm underline underline-offset-4"
              style={{ color: 'var(--color-text-muted)' }}
            >
              ← Seguir comprando
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

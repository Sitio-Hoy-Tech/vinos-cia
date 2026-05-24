import type { Metadata } from 'next'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { env } from '@/lib/config/env'

export const metadata: Metadata = { title: 'Pago pendiente — Vinos & Cia' }

export default async function CheckoutPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ external_reference?: string }>
}) {
  const { external_reference } = await searchParams
  let trackingToken: string | null = null

  if (external_reference) {
    const sb = createServiceClient()
    const { data } = await sb
      .from('orders')
      .select('tracking_token')
      .eq('id', external_reference)
      .eq('tenant_id', env.NEXT_PUBLIC_TENANT_ID)
      .single()
    trackingToken = data?.tracking_token ?? null
  }

  return (
    <main>
      <section className="py-24 text-center" style={{ background: 'var(--color-bg)' }}>
        <div className="container max-w-lg">
          <p className="mb-4 text-4xl">⏳</p>
          <h1
            className="mb-3 text-3xl font-light"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Pago en proceso
          </h1>
          <p className="mb-8 text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Tu pago está siendo procesado. Te avisaremos por email cuando se confirme.
          </p>
          {trackingToken && (
            <Link
              href={`/pedidos/${trackingToken}`}
              className="inline-flex items-center rounded px-6 py-3 text-sm font-medium tracking-widest"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              SEGUIR MI PEDIDO
            </Link>
          )}
        </div>
      </section>
    </main>
  )
}

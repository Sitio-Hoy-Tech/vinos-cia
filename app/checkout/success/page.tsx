import type { Metadata } from 'next'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { env } from '@/lib/config/env'
import { ClearCart } from './_clear-cart'

export const metadata: Metadata = { title: 'Pago confirmado — Vinos & Cia' }

export default async function CheckoutSuccessPage({
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
      <ClearCart />
      <section className="py-24 text-center" style={{ background: 'var(--color-bg)' }}>
        <div className="container max-w-lg">
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-2xl"
            style={{ background: 'var(--color-surface)' }}
          >
            ✓
          </div>
          <h1
            className="mb-3 text-3xl font-light md:text-4xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ¡Pago recibido!
          </h1>
          <p className="mb-8 text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Tu pedido fue confirmado. En breve recibirás un email con los detalles.
            {trackingToken && (
              <> Podés hacer seguimiento usando tu número de pedido.</>
            )}
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {trackingToken && (
              <Link
                href={`/pedidos/${trackingToken}`}
                className="inline-flex items-center rounded px-6 py-3 text-sm font-medium tracking-widest"
                style={{ background: 'var(--color-primary)', color: '#fff' }}
              >
                VER MI PEDIDO
              </Link>
            )}
            <Link
              href="/productos"
              className="inline-flex items-center rounded px-6 py-3 text-sm font-medium tracking-widest"
              style={{ border: '1px solid var(--color-border)' }}
            >
              SEGUIR COMPRANDO
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

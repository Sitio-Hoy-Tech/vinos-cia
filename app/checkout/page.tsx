import type { Metadata } from 'next'
import { getTenantConfig } from '@/lib/supabase/tenant'
import { getShippingZones } from '@/lib/data/shipping'
import { CheckoutForm } from './_components/checkout-form'

export const metadata: Metadata = {
  title: 'Checkout — Vinos & Cia',
}

export default async function CheckoutPage() {
  const [tenant, zones] = await Promise.all([
    getTenantConfig(),
    getShippingZones(),
  ])

  return (
    <main>
      <section className="py-10 md:py-14" style={{ background: 'var(--color-secondary)' }}>
        <div className="container">
          <p
            className="mb-1 text-xs font-medium uppercase tracking-[0.25em]"
            style={{ color: 'var(--color-accent)' }}
          >
            Compra segura
          </p>
          <h1
            className="text-3xl font-light md:text-4xl"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary-foreground)' }}
          >
            Finalizar compra
          </h1>
        </div>
      </section>

      <CheckoutForm
        mpPublicKey={tenant.mp_public_key ?? null}
        zones={zones}
      />
    </main>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Pago no procesado — Vinos & Cia' }

export default function CheckoutFailurePage() {
  return (
    <main>
      <section className="py-24 text-center" style={{ background: 'var(--color-bg)' }}>
        <div className="container max-w-lg">
          <p className="mb-4 text-4xl">✗</p>
          <h1
            className="mb-3 text-3xl font-light"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            El pago no fue procesado
          </h1>
          <p className="mb-8 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Podés intentarlo de nuevo o escribirnos por WhatsApp para coordinar el pago.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/checkout"
              className="inline-flex items-center rounded px-6 py-3 text-sm font-medium tracking-widest"
              style={{ background: 'var(--color-primary)', color: '#fff' }}
            >
              INTENTAR DE NUEVO
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center rounded px-6 py-3 text-sm font-medium tracking-widest"
              style={{ border: '1px solid var(--color-border)' }}
            >
              CONTACTARNOS
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

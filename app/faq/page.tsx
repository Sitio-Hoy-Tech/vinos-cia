import type { Metadata } from 'next'
import Link from 'next/link'
import { FaqInline } from '@/components/home/faq-inline'

export const metadata: Metadata = {
  title: 'Preguntas frecuentes — Vinos & Cia',
  description:
    'Respondemos las dudas más comunes sobre nuestros productos, formas de pago y retiro en local.',
}

export default function FaqPage() {
  return (
    <main>
      {/* Header */}
      <section
        className="py-14 md:py-20"
        style={{ background: 'var(--color-secondary)' }}
      >
        <div className="container">
          <p
            className="mb-2 text-xs font-medium uppercase tracking-[0.25em]"
            style={{ color: 'var(--color-accent)' }}
          >
            Ayuda
          </p>
          <h1
            className="text-4xl font-light md:text-5xl"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-primary-foreground)',
            }}
          >
            Preguntas frecuentes
          </h1>
        </div>
      </section>

      {/* FAQ reutiliza el componente del home */}
      <FaqInline />

      {/* CTA contacto */}
      <section className="py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="container text-center">
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            ¿No encontraste lo que buscabas?{' '}
            <Link
              href="/contacto"
              className="font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-primary)' }}
            >
              Escribinos
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

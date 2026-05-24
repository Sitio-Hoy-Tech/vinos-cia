import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Nosotros — Vinos & Cia',
  description:
    'Conocé la historia de Vinos & Cia, tu vinoteca de confianza en Baradero, Buenos Aires.',
}

export default function NosotrosPage() {
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
            Nuestra historia
          </p>
          <h1
            className="text-4xl font-light md:text-5xl"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-primary-foreground)',
            }}
          >
            Más de una vinoteca,
            <br />
            <em>una experiencia</em>
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center md:gap-16">
            <div
              className="relative aspect-[4/3] overflow-hidden rounded"
              style={{ background: 'var(--color-surface)' }}
            >
              <Image
                src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=80"
                alt="Interior de Vinos & Cia"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div
                className="absolute -bottom-3 -right-3 h-full w-full rounded"
                style={{ border: '2px solid var(--color-accent)', zIndex: -1 }}
                aria-hidden="true"
              />
            </div>

            <div>
              <p
                className="mb-6 text-sm leading-relaxed"
                style={{ color: 'var(--color-text-muted)' }}
              >
                En Vinos &amp; Cia creemos que elegir un vino debe ser un placer,
                no una tarea. Por eso acompañamos cada compra con atención
                personalizada y una selección cuidada de vinos, espumantes y
                copas de calidad.
              </p>
              <p
                className="mb-6 text-sm leading-relaxed"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Somos una vinoteca familiar ubicada en el corazón de Baradero,
                Buenos Aires. Trabajamos con bodegas premium para traerte lo
                mejor de la vitivinicultura argentina y del mundo, a un precio
                accesible y con el asesoramiento que cada ocasión merece.
              </p>
              <p
                className="mb-8 text-sm leading-relaxed"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Ya sea que busques un Malbec para compartir en familia, un
                espumante para celebrar o las copas perfectas para potenciar cada
                varietal, estamos acá para ayudarte.
              </p>

              <div className="flex flex-col gap-1 text-sm">
                <p style={{ color: 'var(--color-text)' }}>
                  📍 Saenz 987, Baradero, Buenos Aires
                </p>
                <p style={{ color: 'var(--color-text-muted)' }}>
                  Lunes a Sábados · 9:00 a 21:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        className="py-16 md:py-24"
        style={{ background: 'var(--color-surface)' }}
      >
        <div className="container">
          <div className="mb-12 text-center">
            <p
              className="mb-2 text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: 'var(--color-accent)' }}
            >
              Nuestros valores
            </p>
            <h2
              className="text-3xl md:text-4xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Por qué elegirnos
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                icon: '🍷',
                title: 'Selección cuidada',
                desc: 'Cada producto pasa por nuestra curaduría. Solo ofrecemos lo que nosotros mismos elegiríamos.',
              },
              {
                icon: '🤝',
                title: 'Asesoramiento real',
                desc: 'Te ayudamos a elegir el vino perfecto para cada ocasión, maridaje o regalo.',
              },
              {
                icon: '⭐',
                title: 'Calidad garantizada',
                desc: 'Trabajamos directamente con bodegas y distribuidores de confianza.',
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col gap-4 rounded p-6"
                style={{
                  background: 'var(--color-bg)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <span className="text-3xl">{icon}</span>
                <h3
                  className="text-lg font-light"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: 'var(--color-bg)' }}>
        <div className="container text-center">
          <h2
            className="mb-4 text-2xl font-light"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ¿Querés conocernos?
          </h2>
          <p
            className="mb-8 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Visitanos en Baradero o escribinos por WhatsApp.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 rounded px-7 py-3 text-sm font-medium tracking-widest transition-colors"
              style={{
                background: 'var(--color-secondary)',
                color: 'var(--color-secondary-foreground)',
              }}
            >
              CONTACTO
            </Link>
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 rounded border px-7 py-3 text-sm font-medium tracking-widest transition-colors"
              style={{
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              VER PRODUCTOS
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

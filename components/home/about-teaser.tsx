import Link from 'next/link'
import Image from 'next/image'

export function AboutTeaser() {
  return (
    <section className="py-16 md:py-24" style={{ background: 'var(--color-bg)' }}>
      <div className="container">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-16">
          {/* Image */}
          <div
            className="relative aspect-[4/3] overflow-hidden rounded"
            style={{ background: 'var(--color-surface)' }}
          >
            <Image
              src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=80"
              alt="Vinos & Cia — Baradero"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Accent border */}
            <div
              className="absolute -bottom-3 -right-3 h-full w-full rounded"
              style={{
                border: '2px solid var(--color-accent)',
                zIndex: -1,
              }}
              aria-hidden="true"
            />
          </div>

          {/* Text */}
          <div>
            <p
              className="mb-3 text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: 'var(--color-accent)' }}
            >
              Nuestra historia
            </p>
            <h2
              className="mb-5 text-3xl font-light leading-snug md:text-4xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Más de una vinoteca,
              <br />
              <em>una experiencia</em>
            </h2>
            <p
              className="mb-4 text-sm leading-relaxed"
              style={{ color: 'var(--color-text-muted)' }}
            >
              En Vinos &amp; Cia creemos que elegir un vino debe ser un placer,
              no una tarea. Por eso acompañamos cada compra con atención
              personalizada y una selección cuidada de vinos, espumantes y copas
              de calidad.
            </p>
            <p
              className="mb-8 text-sm leading-relaxed"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Estamos en Saenz 987, Baradero, Buenos Aires. Lunes a Sábados de
              9:00 a 21:00.
            </p>
            <Link
              href="/nosotros"
              className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-primary)' }}
            >
              Conocernos mejor →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'
import Image from 'next/image'

export function Hero({ whatsapp = '+543329808080' }: { whatsapp?: string }) {
  const waHref = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('¡Hola! Quiero consultar sobre sus productos.')}`
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'var(--color-secondary)', minHeight: '92vh' }}
    >
      {/* Background image — wine bottles, dark overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1600&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
          aria-hidden="true"
        />
        {/* Gradient overlay: dark left, fade right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgb(24 24 27 / 0.97) 0%, rgb(24 24 27 / 0.75) 55%, rgb(24 24 27 / 0.45) 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="container relative flex min-h-[92vh] flex-col justify-center py-20 lg:py-24">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <p
            className="mb-6 text-xs font-medium uppercase tracking-[0.25em]"
            style={{ color: 'var(--color-accent)' }}
          >
            Baradero · Buenos Aires
          </p>

          {/* Headline */}
          <h1
            className="mb-6 text-5xl font-light italic leading-[1.05] sm:text-6xl lg:text-7xl"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-primary-foreground)',
            }}
          >
            Momentos
            <br />
            <span style={{ color: 'var(--color-accent)' }}>y&nbsp;Sabores</span>
          </h1>

          {/* Subheadline */}
          <p
            className="mb-10 max-w-md text-base leading-relaxed sm:text-lg"
            style={{ color: 'rgb(250 248 245 / 0.7)', fontWeight: 300 }}
          >
            Vinos, espumantes y copas de calidad con atención personalizada.
            Retiro en local en Baradero.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/productos"
              className="hero-cta-primary inline-flex items-center gap-2 rounded px-7 py-3.5 text-sm font-medium tracking-widest transition-all"
            >
              VER CATÁLOGO
            </Link>
            <Link
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta-secondary inline-flex items-center gap-2 rounded px-7 py-3.5 text-sm font-medium tracking-widest transition-all"
            >
              CONSULTAR
            </Link>
          </div>

          {/* Scroll hint */}
          <div
            className="mt-16 hidden items-center gap-2 sm:flex"
            style={{ color: 'rgb(250 248 245 / 0.35)' }}
          >
            <div className="h-px w-8 bg-current" />
            <span className="text-xs tracking-widest uppercase">Explorar</span>
          </div>
        </div>
      </div>
    </section>
  )
}

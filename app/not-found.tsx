import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-20 text-center">
      <span
        className="text-8xl font-light leading-none"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}
        aria-hidden="true"
      >
        404
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
          Página no encontrada
        </h1>
        <p
          className="text-sm max-w-xs mx-auto"
          style={{ color: 'var(--color-text-muted)' }}
        >
          El contenido que buscás no existe o fue movido. Explorá nuestros
          vinos y espumantes.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded px-6 py-2.5 text-sm font-medium tracking-wide transition-colors"
          style={{
            background: 'var(--color-secondary)',
            color: 'var(--color-secondary-foreground)',
            letterSpacing: 'var(--tracking-wide)',
          }}
        >
          Inicio
        </Link>
        <Link
          href="/productos"
          className="rounded px-6 py-2.5 text-sm font-medium tracking-wide transition-colors"
          style={{
            background: 'var(--color-primary)',
            color: 'var(--color-primary-foreground)',
            letterSpacing: 'var(--tracking-wide)',
          }}
        >
          Ver productos
        </Link>
        <Link
          href="/contacto"
          className="rounded border px-6 py-2.5 text-sm font-medium transition-colors"
          style={{
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}
        >
          Contacto
        </Link>
      </div>
    </section>
  )
}

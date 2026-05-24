import Link from 'next/link'

export function PromoBanner() {
  return (
    <section
      className="py-12 md:py-16"
      style={{
        background: 'var(--color-primary)',
      }}
    >
      <div className="container flex flex-col items-center gap-5 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <p
            className="mb-1 text-xs font-medium uppercase tracking-[0.2em]"
            style={{ color: 'rgb(250 248 245 / 0.6)' }}
          >
            Envío gratis
          </p>
          <h2
            className="text-2xl font-light md:text-3xl"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-primary-foreground)',
            }}
          >
            Retirá sin costo en Baradero
          </h2>
          <p
            className="mt-1 text-sm"
            style={{ color: 'rgb(250 248 245 / 0.7)' }}
          >
            Saenz 987 · Lun–Sáb 9:00–21:00
          </p>
        </div>
        <Link
          href="/productos"
          className="inline-flex shrink-0 items-center gap-2 rounded border px-7 py-3 text-sm font-medium tracking-widest transition-colors hover:bg-white/10"
          style={{
            border: '1px solid rgb(250 248 245 / 0.4)',
            color: 'var(--color-primary-foreground)',
            letterSpacing: 'var(--tracking-wider)',
          }}
        >
          COMPRAR AHORA
        </Link>
      </div>
    </section>
  )
}

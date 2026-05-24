'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section
      className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-20 text-center"
      role="alert"
    >
      <span
        className="text-7xl font-light"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-border-strong)' }}
        aria-hidden="true"
      >
        500
      </span>
      <div className="flex flex-col gap-2">
        <h1
          className="text-2xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Algo salió mal
        </h1>
        <p className="text-sm max-w-xs mx-auto" style={{ color: 'var(--color-text-muted)' }}>
          Ocurrió un error inesperado. Podés intentar nuevamente o volver al inicio.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded px-6 py-2.5 text-sm font-medium tracking-wide transition-colors"
          style={{
            background: 'var(--color-secondary)',
            color: 'var(--color-secondary-foreground)',
            letterSpacing: 'var(--tracking-wide)',
          }}
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="rounded border px-6 py-2.5 text-sm font-medium transition-colors"
          style={{
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
          }}
        >
          Ir al inicio
        </Link>
      </div>
    </section>
  )
}

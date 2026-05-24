import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  page: number
  totalPages: number
  categorySlug?: string
}

function buildHref(page: number, categorySlug?: string) {
  const params = new URLSearchParams()
  if (categorySlug) params.set('categoria', categorySlug)
  if (page > 1) params.set('pagina', String(page))
  const qs = params.toString()
  return `/productos${qs ? `?${qs}` : ''}`
}

export function CatalogPagination({ page, totalPages, categorySlug }: Props) {
  if (totalPages <= 1) return null

  const btnBase = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.5rem 1rem',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)',
    transition: 'background var(--transition-fast)',
  }

  return (
    <div className="mt-12 flex items-center justify-between">
      <div>
        {page > 1 ? (
          <Link
            href={buildHref(page - 1, categorySlug)}
            style={{ ...btnBase, color: 'var(--color-text)' }}
          >
            <ChevronLeft size={15} />
            Anterior
          </Link>
        ) : (
          <span style={{ ...btnBase, opacity: 0.35, cursor: 'not-allowed', color: 'var(--color-text-muted)' }}>
            <ChevronLeft size={15} />
            Anterior
          </span>
        )}
      </div>

      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        Página {page} de {totalPages}
      </p>

      <div>
        {page < totalPages ? (
          <Link
            href={buildHref(page + 1, categorySlug)}
            style={{ ...btnBase, color: 'var(--color-text)' }}
          >
            Siguiente
            <ChevronRight size={15} />
          </Link>
        ) : (
          <span style={{ ...btnBase, opacity: 0.35, cursor: 'not-allowed', color: 'var(--color-text-muted)' }}>
            Siguiente
            <ChevronRight size={15} />
          </span>
        )}
      </div>
    </div>
  )
}

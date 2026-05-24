import Link from 'next/link'

interface Props {
  categories: { id: string; name: string; slug: string }[]
  active?: string
}

export function ProductFilters({ categories, active }: Props) {
  const baseStyle = {
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    padding: '0.5rem 1.25rem',
    transition: 'background var(--transition-fast), color var(--transition-fast)',
    border: '1px solid var(--color-border)',
    display: 'inline-block',
    whiteSpace: 'nowrap' as const,
  }
  const activeStyle = {
    ...baseStyle,
    background: 'var(--color-secondary)',
    color: 'var(--color-secondary-foreground)',
    border: '1px solid var(--color-secondary)',
  }
  const inactiveStyle = {
    ...baseStyle,
    background: 'transparent',
    color: 'var(--color-text-muted)',
  }

  return (
    <div
      className="flex flex-wrap gap-2 border-b pb-5"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <Link href="/productos" style={!active ? activeStyle : inactiveStyle}>
        Todos
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/productos?categoria=${cat.slug}`}
          style={active === cat.slug ? activeStyle : inactiveStyle}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )
}

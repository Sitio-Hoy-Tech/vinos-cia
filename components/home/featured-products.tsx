import Link from 'next/link'
import { ProductCard } from '@/components/ui/product-card'
import type { getFeaturedProducts } from '@/lib/data/products'

type Products = Awaited<ReturnType<typeof getFeaturedProducts>>

interface Props {
  products: Products
}

export function FeaturedProducts({ products }: Props) {
  if (products.length === 0) return null

  return (
    <section
      className="py-16 md:py-24"
      style={{ background: 'var(--color-surface)' }}
    >
      <div className="container">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p
              className="mb-2 text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: 'var(--color-accent)' }}
            >
              Selección
            </p>
            <h2
              className="text-3xl md:text-4xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Productos destacados
            </h2>
          </div>
          <Link
            href="/productos"
            className="hidden text-sm underline underline-offset-4 transition-opacity hover:opacity-70 sm:block"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Ver todo →
          </Link>
        </div>

        {/* Grid: 2 col mobile, 4 col desktop */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/productos"
            className="inline-block text-sm underline underline-offset-4"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Ver todos los productos →
          </Link>
        </div>
      </div>
    </section>
  )
}

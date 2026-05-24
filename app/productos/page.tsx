import type { Metadata } from 'next'
import { getProducts } from '@/lib/data/products'
import { getCategories } from '@/lib/data/categories'
import { ProductCard } from '@/components/ui/product-card'
import { ProductFilters } from '@/components/catalog/product-filters'
import { CatalogPagination } from '@/components/catalog/catalog-pagination'

export const metadata: Metadata = {
  title: 'Productos — Vinos & Cia',
  description:
    'Explorá nuestra selección de vinos, espumantes y copas. Retiro en local en Baradero, Buenos Aires.',
  openGraph: {
    title: 'Productos — Vinos & Cia',
    description: 'Vinos, espumantes y copas de las mejores bodegas.',
  },
}

const PER_PAGE = 12

interface Props {
  searchParams: Promise<{ categoria?: string; pagina?: string }>
}

export default async function ProductosPage({ searchParams }: Props) {
  const params = await searchParams
  const categorySlug = params.categoria
  const page = Math.max(1, parseInt(params.pagina ?? '1', 10))

  const [{ products, total }, categories] = await Promise.all([
    getProducts({ categorySlug, page, perPage: PER_PAGE }),
    getCategories(),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <main>
      {/* ── Page header ── */}
      <section
        className="py-14 md:py-20"
        style={{ background: 'var(--color-secondary)' }}
      >
        <div className="container">
          <p
            className="mb-2 text-xs font-medium uppercase tracking-[0.25em]"
            style={{ color: 'var(--color-accent)' }}
          >
            Catálogo
          </p>
          <h1
            className="text-4xl font-light md:text-5xl"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-primary-foreground)',
            }}
          >
            Nuestros productos
          </h1>
          {total > 0 && (
            <p
              className="mt-2 text-sm"
              style={{ color: 'rgb(250 248 245 / 0.45)' }}
            >
              {total} {total === 1 ? 'producto' : 'productos'}
              {categorySlug
                ? ` en ${categories.find((c) => c.slug === categorySlug)?.name ?? categorySlug}`
                : ''}
            </p>
          )}
        </div>
      </section>

      {/* ── Catalog ── */}
      <section
        className="py-10 md:py-16"
        style={{ background: 'var(--color-bg)' }}
      >
        <div className="container">
          <ProductFilters categories={categories} active={categorySlug} />

          <div className="mt-8">
            {products.length === 0 ? (
              <div className="py-24 text-center">
                <p
                  className="text-sm"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  No hay productos en esta categoría.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                <CatalogPagination
                  page={page}
                  totalPages={totalPages}
                  categorySlug={categorySlug}
                />
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

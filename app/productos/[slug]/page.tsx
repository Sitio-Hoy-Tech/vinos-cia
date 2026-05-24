import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { getProductBySlug, getProducts } from '@/lib/data/products'
import { ProductClient } from '@/components/product/product-client'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Producto no encontrado — Vinos & Cia' }

  const image = product.product_images
    ?.sort((a, b) => a.position - b.position)[0]?.url

  return {
    title: `${product.name} — Vinos & Cia`,
    description: product.description ?? `${product.name} disponible en Vinos & Cia, Baradero.`,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: image ? [{ url: image }] : undefined,
    },
  }
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const images = [...(product.product_images ?? [])].sort((a, b) => a.position - b.position)
  const mainImage = images[0]

  const categoryName = Array.isArray(product.categories)
    ? product.categories[0]?.name
    : (product.categories as { name: string } | null)?.name

  const categorySlug = Array.isArray(product.categories)
    ? product.categories[0]?.slug
    : (product.categories as { slug: string } | null)?.slug

  // Schema.org
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? undefined,
    image: mainImage?.url,
    sku: slug,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'ARS',
      price: product.price,
      availability:
        product.stock_unlimited || product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${process.env.NEXT_PUBLIC_URL}/productos/${slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="py-10 md:py-16" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-1 text-xs"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <Link href="/" className="transition-colors hover:text-[var(--color-primary)]">
              Inicio
            </Link>
            <ChevronRight size={12} className="shrink-0" />
            <Link
              href="/productos"
              className="transition-colors hover:text-[var(--color-primary)]"
            >
              Productos
            </Link>
            {categoryName && categorySlug && (
              <>
                <ChevronRight size={12} className="shrink-0" />
                <Link
                  href={`/productos?categoria=${categorySlug}`}
                  className="transition-colors hover:text-[var(--color-primary)]"
                >
                  {categoryName}
                </Link>
              </>
            )}
            <ChevronRight size={12} className="shrink-0" />
            <span style={{ color: 'var(--color-text)' }}>{product.name}</span>
          </nav>

          {/* Product layout */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            {/* ── Images ── */}
            <div className="flex flex-col gap-3">
              {/* Main image */}
              <div
                className="relative aspect-[4/5] overflow-hidden rounded"
                style={{ background: 'var(--color-surface)' }}
              >
                {mainImage ? (
                  <Image
                    src={mainImage.url}
                    alt={mainImage.alt ?? product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-6xl opacity-15">🍷</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(1, 5).map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-square overflow-hidden rounded"
                      style={{ background: 'var(--color-surface)' }}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt ?? product.name}
                        fill
                        sizes="25vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Info ── */}
            <div className="flex flex-col gap-6">
              {/* Category */}
              {categoryName && categorySlug && (
                <Link
                  href={`/productos?categoria=${categorySlug}`}
                  className="w-fit text-xs font-medium uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
                  style={{ color: 'var(--color-accent)' }}
                >
                  {categoryName}
                </Link>
              )}

              {/* Name */}
              <h1
                className="text-3xl font-light leading-snug md:text-4xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {product.name}
              </h1>

              {/* Description */}
              {product.description && (
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {product.description}
                </p>
              )}

              {/* Interactive: price, variants, add to cart */}
              <ProductClient
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  compare_at_price: product.compare_at_price,
                  stock: product.stock,
                  stock_unlimited: product.stock_unlimited,
                  product_variants: product.product_variants ?? [],
                  image: mainImage?.url,
                }}
              />

              {/* Shipping note */}
              <div
                className="flex flex-col gap-1 rounded p-4 text-sm"
                style={{
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <p style={{ color: 'var(--color-text)' }}>
                  🏪 Retiro en local · Sin costo
                </p>
                <p style={{ color: 'var(--color-text-muted)' }}>
                  Saenz 987, Baradero · Lun–Sáb 9:00–21:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

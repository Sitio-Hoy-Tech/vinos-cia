import Link from 'next/link'
import Image from 'next/image'
import { AddToCartButton } from './add-to-cart-button'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    compare_at_price?: number | null
    stock: number
    stock_unlimited: boolean
    product_images?: { url: string; alt?: string | null; position: number }[]
    product_variants?: { id: string }[]
  }
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(n)
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.product_images
    ?.sort((a, b) => a.position - b.position)[0]

  const hasVariants = (product.product_variants?.length ?? 0) > 0

  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.compare_at_price!) * 100)
    : 0

  const lowStock = !product.stock_unlimited && product.stock > 0 && product.stock <= 5
  const outOfStock = !product.stock_unlimited && (product.stock === 0 || product.stock === null)

  return (
    <article className={`product-card group${outOfStock ? ' product-card--out' : ''}`}>
      {/* Image */}
      <Link href={`/productos/${product.slug}`} className="product-card__img-wrap block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-surface)]">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt ?? product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-4xl opacity-20">🍷</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {hasDiscount && (
              <span className="product-badge product-badge--sale">
                -{discountPct}%
              </span>
            )}
            {outOfStock && (
              <span className="product-badge product-badge--out">Sin stock</span>
            )}
          </div>

          {lowStock && (
            <span className="product-badge product-badge--low absolute bottom-2 left-2">
              ¡Últimas {product.stock}!
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="product-card__body">
        <Link
          href={`/productos/${product.slug}`}
          className="product-card__name"
        >
          {product.name}
        </Link>

        <div className="mt-auto flex flex-col gap-2 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="product-card__price">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="product-card__compare">
                {formatPrice(product.compare_at_price!)}
              </span>
            )}
          </div>

          {hasVariants ? (
            <Link
              href={`/productos/${product.slug}`}
              className="add-to-cart-btn add-to-cart-btn--sm flex w-full items-center justify-center"
            >
              Ver opciones
            </Link>
          ) : (
            <AddToCartButton
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                stock: product.stock,
                stockUnlimited: product.stock_unlimited,
                image: image?.url,
              }}
              size="sm"
              className="w-full"
            />
          )}
        </div>
      </div>
    </article>
  )
}

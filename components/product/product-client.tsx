'use client'

import { useState } from 'react'
import { AddToCartButton } from '@/components/ui/add-to-cart-button'
import { useCartStore } from '@/lib/store/cart'

interface Variant {
  id: string
  name: string
  sku: string | null
  stock: number
  price: number | null
  price_modifier: number | null
}

interface Props {
  product: {
    id: string
    name: string
    slug: string
    price: number
    compare_at_price?: number | null
    stock: number
    stock_unlimited: boolean
    product_variants: Variant[]
    image?: string
  }
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(n)
}

export function ProductClient({ product }: Props) {
  const hasVariants = product.product_variants.length > 0
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    hasVariants ? product.product_variants[0].id : null,
  )
  const [quantity, setQuantity] = useState(1)
  const cartItems = useCartStore((s) => s.items)

  const selectedVariant = hasVariants
    ? product.product_variants.find((v) => v.id === selectedVariantId) ?? product.product_variants[0]
    : null

  const effectivePrice = selectedVariant
    ? selectedVariant.price ?? product.price + (selectedVariant.price_modifier ?? 0)
    : product.price

  const effectiveStock = selectedVariant ? selectedVariant.stock : product.stock
  const effectiveStockUnlimited = selectedVariant ? false : product.stock_unlimited

  const hasDiscount =
    product.compare_at_price &&
    product.compare_at_price > effectivePrice
  const discountPct = hasDiscount
    ? Math.round((1 - effectivePrice / product.compare_at_price!) * 100)
    : 0

  const lowStock = !effectiveStockUnlimited && effectiveStock > 0 && effectiveStock <= 5
  const outOfStock = !effectiveStockUnlimited && effectiveStock === 0

  const cartKey = selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id
  const cartQuantity = cartItems.find((i) => i.id === cartKey)?.quantity ?? 0
  const maxAddable = effectiveStockUnlimited
    ? Infinity
    : Math.max(0, effectiveStock - cartQuantity)

  return (
    <div className="flex flex-col gap-5">
      {/* Price */}
      <div className="flex flex-wrap items-baseline gap-3">
        <span
          className="text-3xl font-semibold md:text-4xl"
          style={{ color: 'var(--color-primary)' }}
        >
          {formatPrice(effectivePrice)}
        </span>
        {hasDiscount && (
          <>
            <span
              className="text-lg line-through"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {formatPrice(product.compare_at_price!)}
            </span>
            <span className="product-badge product-badge--sale">
              -{discountPct}%
            </span>
          </>
        )}
      </div>

      {/* Stock indicator */}
      {outOfStock && (
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
          Sin stock disponible
        </p>
      )}
      {lowStock && (
        <p
          className="text-sm font-medium"
          style={{ color: 'var(--color-accent)' }}
        >
          ¡Últimas {effectiveStock} unidades!
        </p>
      )}

      {/* Variant selector */}
      {hasVariants && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
            Variante
          </p>
          <div className="flex flex-wrap gap-2">
            {product.product_variants.map((v) => {
              const isSelected = v.id === selectedVariantId
              const isOut = v.stock === 0
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantId(v.id)}
                  disabled={isOut}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: isSelected ? 600 : 400,
                    border: isSelected
                      ? '2px solid var(--color-primary)'
                      : '1px solid var(--color-border)',
                    background: isSelected ? 'var(--color-primary)' : 'transparent',
                    color: isSelected
                      ? 'var(--color-primary-foreground)'
                      : isOut
                      ? 'var(--color-text-muted)'
                      : 'var(--color-text)',
                    opacity: isOut ? 0.45 : 1,
                    cursor: isOut ? 'not-allowed' : 'pointer',
                    textDecoration: isOut ? 'line-through' : 'none',
                    transition: 'background var(--transition-fast), border-color var(--transition-fast)',
                  }}
                >
                  {v.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Quantity + Add to cart */}
      {!outOfStock && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {/* Selector de cantidad */}
            <div
              className="flex items-center overflow-hidden rounded"
              style={{ border: '1px solid var(--color-border)' }}
            >
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Reducir cantidad"
                className="flex h-10 w-10 items-center justify-center text-lg transition-colors hover:bg-[var(--color-surface)]"
                style={{ color: 'var(--color-text)' }}
              >
                −
              </button>
              <span
                className="flex h-10 w-10 items-center justify-center text-sm font-medium"
                style={{ borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)' }}
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(q + 1, maxAddable))}
                aria-label="Aumentar cantidad"
                disabled={quantity >= maxAddable}
                className="flex h-10 w-10 items-center justify-center text-lg transition-colors hover:bg-[var(--color-surface)] disabled:opacity-40"
                style={{ color: 'var(--color-text)' }}
              >
                +
              </button>
            </div>

            <AddToCartButton
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: effectivePrice,
                stock: effectiveStock,
                stockUnlimited: effectiveStockUnlimited,
                image: product.image,
                variantId: selectedVariant?.id,
                variantName: selectedVariant?.name,
              }}
              quantity={quantity}
              size="lg"
              className="flex-1 sm:flex-none"
            />
          </div>

          {/* Aviso si ya tiene el máximo en el carrito */}
          {!effectiveStockUnlimited && cartQuantity > 0 && (
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {maxAddable === 0
                ? `Ya tenés el máximo disponible (${cartQuantity}) en el carrito.`
                : `Ya tenés ${cartQuantity} en el carrito. Podés agregar ${maxAddable} más.`}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

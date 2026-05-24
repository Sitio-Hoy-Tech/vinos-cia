'use client'

import { useState } from 'react'
import { ShoppingBag, Check } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'

interface AddToCartButtonProps {
  product: {
    id: string
    slug: string
    name: string
    price: number
    stock: number
    stockUnlimited: boolean
    image?: string
    variantId?: string
    variantName?: string
  }
  quantity?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function AddToCartButton({ product, quantity = 1, className = '', size = 'md' }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)

  const outOfStock = !product.stockUnlimited && product.stock === 0

  const handleAdd = () => {
    if (outOfStock) return
    addItem({
      id: product.variantId ? `${product.id}-${product.variantId}` : product.id,
      productId: product.id,
      slug: product.slug,
      name: product.variantName ? `${product.name} — ${product.variantName}` : product.name,
      price: product.price,
      stock: product.stock,
      stockUnlimited: product.stockUnlimited,
      image: product.image,
      quantity,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const isSmall = size === 'sm'
  const isLarge = size === 'lg'

  return (
    <button
      onClick={handleAdd}
      disabled={outOfStock}
      aria-label={outOfStock ? 'Sin stock' : `Agregar ${product.name} al carrito`}
      className={`add-to-cart-btn${added ? ' added' : ''}${outOfStock ? ' disabled' : ''} ${isSmall ? 'add-to-cart-btn--sm' : ''} ${isLarge ? 'add-to-cart-btn--lg' : ''} ${className}`}
    >
      {outOfStock ? (
        <span>Sin stock</span>
      ) : added ? (
        <>
          <Check size={isSmall ? 13 : 15} strokeWidth={2.5} />
          <span>Agregado</span>
        </>
      ) : (
        <>
          <ShoppingBag size={isSmall ? 13 : 15} />
          <span>Agregar</span>
        </>
      )}
    </button>
  )
}

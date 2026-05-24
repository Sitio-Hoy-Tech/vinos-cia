'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { refreshCartPrices } from '@/lib/actions/cart'

function formatPrice(n: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(n)
}

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, updatePrices } =
    useCartStore()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Refrescar precios desde BD cada vez que se abre el carrito
  useEffect(() => {
    if (!isOpen || items.length === 0) return
    const toRefresh = items.map((i) => ({
      id: i.id,
      productId: i.productId,
      variantId: i.variantId,
    }))
    refreshCartPrices(toRefresh).then((updates) => {
      if (updates.length) updatePrices(updates)
    })
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // Trap focus & close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, closeCart])

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={closeCart}
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: 'rgb(24 24 27 / 0.5)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-label="Carrito de compras"
        aria-modal="true"
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col shadow-lg transition-transform duration-300"
        style={{
          background: 'var(--color-bg)',
          borderLeft: '1px solid var(--color-border)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <h2
            className="text-lg font-medium"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Carrito
          </h2>
          <button
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-surface)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <ShoppingBag
                size={48}
                strokeWidth={1}
                style={{ color: 'var(--color-border-strong)' }}
              />
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Tu carrito está vacío
              </p>
              <button
                onClick={closeCart}
                className="text-sm underline underline-offset-4"
                style={{ color: 'var(--color-primary)' }}
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3"
                  style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}
                >
                  {/* Image */}
                  <div
                    className="relative h-20 w-16 shrink-0 overflow-hidden rounded"
                    style={{ background: 'var(--color-surface)' }}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ShoppingBag size={20} style={{ color: 'var(--color-border-strong)' }} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-1">
                    <Link
                      href={`/productos/${item.slug}`}
                      onClick={closeCart}
                      className="text-sm font-medium leading-snug hover:underline"
                    >
                      {item.name}
                    </Link>
                    {item.variantName && (
                      <span
                        className="text-xs"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {item.variantName}
                      </span>
                    )}
                    <span
                      className="text-sm font-semibold"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {formatPrice(item.price * item.quantity)}
                    </span>

                    {/* Quantity + Remove */}
                    <div className="mt-1 flex items-center gap-2">
                      <div
                        className="flex items-center rounded"
                        style={{ border: '1px solid var(--color-border)' }}
                      >
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Disminuir cantidad"
                          className="flex h-7 w-7 items-center justify-center transition-colors hover:bg-[var(--color-surface)]"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-7 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={!item.stockUnlimited && item.quantity >= item.stock}
                          aria-label="Aumentar cantidad"
                          className="flex h-7 w-7 items-center justify-center transition-colors hover:bg-[var(--color-surface)] disabled:opacity-40"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label="Eliminar producto"
                        className="flex h-7 w-7 items-center justify-center rounded transition-colors hover:text-red-600"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="flex flex-col gap-3 px-5 py-4"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal())}</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Envío calculado en el checkout
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex w-full items-center justify-center rounded py-3 text-sm font-medium tracking-wide transition-colors"
              style={{
                background: 'var(--color-secondary)',
                color: 'var(--color-secondary-foreground)',
                letterSpacing: 'var(--tracking-wider)',
              }}
            >
              IR AL CHECKOUT
            </Link>
            <button
              onClick={closeCart}
              className="text-center text-xs underline underline-offset-4"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}

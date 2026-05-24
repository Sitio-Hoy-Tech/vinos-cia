'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'

export function CartButton() {
  const { toggleCart, itemCount } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const count = mounted ? itemCount() : 0

  return (
    <button
      onClick={toggleCart}
      aria-label={`Carrito${count > 0 ? ` — ${count} producto${count !== 1 ? 's' : ''}` : ''}`}
      className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-surface)]"
    >
      <ShoppingBag size={20} />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold"
          style={{
            background: 'var(--color-primary)',
            color: '#fff',
            fontSize: '0.65rem',
          }}
        >
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  )
}

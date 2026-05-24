'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  name: string
  variantName?: string
  price: number
  quantity: number
  image?: string
  slug: string
  stock: number
  stockUnlimited: boolean
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  updatePrices: (updates: { id: string; price: number; stock: number; stockUnlimited: boolean }[]) => void
  itemCount: () => number
  subtotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (incoming) => {
        const key = incoming.variantId
          ? `${incoming.productId}-${incoming.variantId}`
          : incoming.productId

        set((state) => {
          const existing = state.items.find((i) => i.id === key)
          if (existing) {
            const maxQty = existing.stockUnlimited
              ? Infinity
              : existing.stock
            return {
              items: state.items.map((i) =>
                i.id === key
                  ? { ...i, quantity: Math.min(i.quantity + (incoming.quantity ?? 1), maxQty) }
                  : i,
              ),
              isOpen: true,
            }
          }
          return {
            items: [
              ...state.items,
              { ...incoming, id: key, quantity: incoming.quantity ?? 1 },
            ],
            isOpen: true,
          }
        })
      },

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((s) => ({
          items: s.items.map((i) => {
            if (i.id !== id) return i
            const max = i.stockUnlimited ? Infinity : i.stock
            return { ...i, quantity: Math.min(quantity, max) }
          }),
        }))
      },

      clearCart: () => set({ items: [] }),

      updatePrices: (updates) =>
        set((s) => ({
          items: s.items.map((item) => {
            const u = updates.find((u) => u.id === item.id)
            return u ? { ...item, price: u.price, stock: u.stock, stockUnlimited: u.stockUnlimited } : item
          }),
        })),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'vinos-cia-cart',
      partialize: (s) => ({ items: s.items }),
    },
  ),
)

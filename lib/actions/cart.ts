'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { env } from '@/lib/config/env'

export type CartPriceItem = {
  id: string         // productId o productId-variantId
  price: number
  stock: number
  stockUnlimited: boolean
}

export async function refreshCartPrices(
  items: { id: string; productId: string; variantId?: string }[],
): Promise<CartPriceItem[]> {
  if (!items.length) return []

  const sb = createServiceClient()
  const TENANT_ID = env.NEXT_PUBLIC_TENANT_ID

  const productIds = [...new Set(items.map((i) => i.productId))]

  const { data: products } = await sb
    .from('products')
    .select('id, price, stock, stock_unlimited, product_variants(id, price, stock)')
    .in('id', productIds)
    .eq('tenant_id', TENANT_ID)
    .eq('active', true)

  if (!products) return []

  return items.map((item) => {
    const product = products.find((p) => p.id === item.productId)
    if (!product) return { id: item.id, price: 0, stock: 0, stockUnlimited: false }

    let price = product.price as number
    let stock = product.stock as number
    let stockUnlimited = product.stock_unlimited as boolean

    if (item.variantId) {
      const variants = product.product_variants as { id: string; price: number | null; stock: number | null }[]
      const variant = variants?.find((v) => v.id === item.variantId)
      if (variant) {
        if (variant.price != null) price = variant.price
        stock = variant.stock ?? 0
        stockUnlimited = false
      }
    }

    return { id: item.id, price, stock, stockUnlimited }
  })
}

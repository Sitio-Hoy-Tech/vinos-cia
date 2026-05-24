import { unstable_cache } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { TAGS } from '@/lib/cache-tags'

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID!
const isDev = process.env.NODE_ENV === 'development'

// En dev saltea el cache para que los cambios del admin se vean de inmediato.
// En producción usa unstable_cache + ISR on-demand vía /api/revalidate.
function withCache<T>(
  fn: () => Promise<T>,
  keys: string[],
  opts: { tags: string[] },
): () => Promise<T> {
  if (isDev) return fn
  return unstable_cache(fn, keys, opts) as () => Promise<T>
}

function withCacheArgs<A, T>(
  fn: (a: A) => Promise<T>,
  keys: string[],
  opts: { tags: string[] },
): (a: A) => Promise<T> {
  if (isDev) return fn
  return unstable_cache(fn, keys, opts) as (a: A) => Promise<T>
}

export const getFeaturedProducts = withCache(
  async () => {
    const sb = createServiceClient()
    const { data, error } = await sb
      .from('products')
      .select(`
        id, name, slug, price, compare_at_price,
        stock, stock_unlimited, featured,
        product_images ( url, alt, position ),
        product_variants ( id )
      `)
      .eq('tenant_id', TENANT_ID)
      .eq('active', true)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) throw new Error(error.message)
    return data ?? []
  },
  [`featured-products-${TENANT_ID}`],
  { tags: [TAGS.PRODUCTS] },
)

export const getProducts = withCacheArgs(
  async (params: {
    categorySlug?: string
    page?: number
    perPage?: number
  }) => {
    const { categorySlug, page = 1, perPage = 12 } = params
    const sb = createServiceClient()

    let query = sb
      .from('products')
      .select(
        `id, name, slug, price, compare_at_price, stock, stock_unlimited,
         category_id, categories ( slug, name ),
         product_images ( url, alt, position ),
         product_variants ( id )`,
        { count: 'exact' },
      )
      .eq('tenant_id', TENANT_ID)
      .eq('active', true)
      .order('created_at', { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1)

    if (categorySlug) {
      const sbInner = createServiceClient()
      const { data: cat } = await sbInner
        .from('categories')
        .select('id')
        .eq('tenant_id', TENANT_ID)
        .eq('slug', categorySlug)
        .single()
      if (cat) query = query.eq('category_id', cat.id)
    }

    const { data, count, error } = await query
    if (error) throw new Error(error.message)
    return { products: data ?? [], total: count ?? 0 }
  },
  [`products-list-${TENANT_ID}`],
  { tags: [TAGS.PRODUCTS] },
)

export const getProductBySlug = withCacheArgs(
  async (slug: string) => {
    const sb = createServiceClient()
    const { data, error } = await sb
      .from('products')
      .select(`
        id, name, slug, description, price, compare_at_price,
        stock, stock_unlimited, weight_grams, shipping_required,
        categories ( id, name, slug ),
        product_images ( url, alt, position ),
        product_variants ( id, name, sku, stock, price, price_modifier )
      `)
      .eq('tenant_id', TENANT_ID)
      .eq('slug', slug)
      .eq('active', true)
      .single()

    if (error) return null
    return data
  },
  [`product-${TENANT_ID}`],
  { tags: [TAGS.PRODUCT('{slug}')] },
)

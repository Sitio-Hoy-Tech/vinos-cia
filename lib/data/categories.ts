import { unstable_cache } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { TAGS } from '@/lib/cache-tags'

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID!
const isDev = process.env.NODE_ENV === 'development'

async function fetchCategories() {
  const sb = createServiceClient()
  const { data, error } = await sb
    .from('categories')
    .select('id, name, slug, position')
    .eq('tenant_id', TENANT_ID)
    .eq('active', true)
    .order('position', { ascending: true })
  if (error) throw new Error(error.message)
  return data ?? []
}

// Categorías filtradas: solo las que tienen productos activos,
// con la imagen de portada del último producto subido en cada una.
async function fetchCategoriesWithImages() {
  const sb = createServiceClient()

  const { data: cats, error: catErr } = await sb
    .from('categories')
    .select('id, name, slug, position')
    .eq('tenant_id', TENANT_ID)
    .eq('active', true)
    .order('position', { ascending: true })

  if (catErr) throw new Error(catErr.message)
  if (!cats?.length) return []

  // Obtener el último producto con imagen de cada categoría en una sola query
  const { data: products } = await sb
    .from('products')
    .select('category_id, product_images ( url, alt, position )')
    .eq('tenant_id', TENANT_ID)
    .eq('active', true)
    .in('category_id', cats.map((c) => c.id))
    .order('created_at', { ascending: false })

  // category_id → primera imagen del último producto
  type PImage = { url: string; alt: string | null; position: number }
  const imageMap: Record<string, string | undefined> = {}
  const hasProd = new Set<string>()

  for (const p of products ?? []) {
    if (!p.category_id) continue
    hasProd.add(p.category_id)
    if (!imageMap[p.category_id]) {
      const imgs = (p.product_images as PImage[] | null) ?? []
      const sorted = [...imgs].sort((a, b) => a.position - b.position)
      imageMap[p.category_id] = sorted[0]?.url
    }
  }

  // Solo categorías con al menos un producto activo
  return cats
    .filter((c) => hasProd.has(c.id))
    .map((c) => ({ ...c, image: imageMap[c.id] ?? null }))
}

// Categorías con al menos un producto activo — para el header nav
async function fetchNavCategories() {
  const sb = createServiceClient()
  const { data } = await sb
    .from('products')
    .select('categories ( id, name, slug, position )')
    .eq('tenant_id', TENANT_ID)
    .eq('active', true)
    .not('category_id', 'is', null)

  if (!data) return []

  const seen = new Set<string>()
  const cats: { id: string; name: string; slug: string; position: number }[] = []

  for (const row of data) {
    const cat = row.categories as unknown as { id: string; name: string; slug: string; position: number } | null
    if (cat && !seen.has(cat.id)) {
      seen.add(cat.id)
      cats.push(cat)
    }
  }

  return cats.sort((a, b) => a.position - b.position)
}

export const getNavCategories = isDev
  ? fetchNavCategories
  : unstable_cache(fetchNavCategories, [`nav-categories-${TENANT_ID}`], {
      tags: [TAGS.CATEGORIES, TAGS.PRODUCTS],
    })

export const getCategories = isDev
  ? fetchCategories
  : unstable_cache(fetchCategories, [`categories-${TENANT_ID}`], {
      tags: [TAGS.CATEGORIES],
    })

export const getCategoriesWithImages = isDev
  ? fetchCategoriesWithImages
  : unstable_cache(
      fetchCategoriesWithImages,
      [`categories-images-${TENANT_ID}`],
      { tags: [TAGS.CATEGORIES, TAGS.PRODUCTS] },
    )

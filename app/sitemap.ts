import type { MetadataRoute } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { env } from '@/lib/config/env'

const BASE = env.NEXT_PUBLIC_URL

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sb = createServiceClient()
  const TENANT_ID = env.NEXT_PUBLIC_TENANT_ID

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/productos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/nosotros`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contacto`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/eventos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  // Productos
  const { data: products } = await sb
    .from('products')
    .select('slug, updated_at')
    .eq('tenant_id', TENANT_ID)
    .eq('active', true)

  const productPages: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${BASE}/productos/${p.slug}`,
    lastModified: new Date(p.updated_at as string),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Eventos/blog
  const { data: posts } = await sb
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('tenant_id', TENANT_ID)
    .eq('status', 'published')

  const eventPages: MetadataRoute.Sitemap = (posts ?? []).map((p) => ({
    url: `${BASE}/eventos/${p.slug}`,
    lastModified: new Date(p.updated_at as string),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...productPages, ...eventPages]
}

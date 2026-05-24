import { unstable_cache } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID!
const isDev = process.env.NODE_ENV === 'development'

async function fetchBlogPosts(page = 1, perPage = 9) {
  const sb = createServiceClient()
  const { data, count, error } = await sb
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image, published_at', { count: 'exact' })
    .eq('tenant_id', TENANT_ID)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1)
  if (error) throw new Error(error.message)
  return { posts: data ?? [], total: count ?? 0 }
}

async function fetchBlogPost(slug: string) {
  const sb = createServiceClient()
  const { data, error } = await sb
    .from('blog_posts')
    .select('id, title, slug, excerpt, content, cover_image, published_at, meta_title, meta_description')
    .eq('tenant_id', TENANT_ID)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (error) return null
  return data
}

export const getBlogPosts = isDev
  ? (page?: number, perPage?: number) => fetchBlogPosts(page, perPage)
  : unstable_cache(
      fetchBlogPosts,
      [`blog-posts-${TENANT_ID}`],
      { tags: [`blog-${TENANT_ID}`] },
    )

export const getBlogPost = isDev
  ? (slug: string) => fetchBlogPost(slug)
  : unstable_cache(
      fetchBlogPost,
      [`blog-post-${TENANT_ID}`],
      { tags: [`blog-${TENANT_ID}`] },
    )

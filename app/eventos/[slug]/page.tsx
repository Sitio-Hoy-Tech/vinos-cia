import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { getBlogPost } from '@/lib/data/blog'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: 'Artículo no encontrado — Vinos & Cia' }
  return {
    title: post.meta_title ?? `${post.title} — Vinos & Cia`,
    description: post.meta_description ?? post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.meta_description ?? post.excerpt ?? undefined,
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
  }
}

function formatDate(d: string | null) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  return (
    <main>
      <article>
        {/* Hero image */}
        {post.cover_image && (
          <div
            className="relative h-64 w-full overflow-hidden md:h-96"
            style={{ background: 'var(--color-secondary)' }}
          >
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-60"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgb(24 24 27 / 0.9) 0%, transparent 60%)',
              }}
              aria-hidden="true"
            />
          </div>
        )}

        <section className="py-12 md:py-16" style={{ background: 'var(--color-bg)' }}>
          <div className="container max-w-2xl">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex items-center gap-1 text-xs"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <Link href="/" className="transition-colors hover:text-[var(--color-primary)]">
                Inicio
              </Link>
              <ChevronRight size={12} />
              <Link href="/eventos" className="transition-colors hover:text-[var(--color-primary)]">
                Blog
              </Link>
              <ChevronRight size={12} />
              <span style={{ color: 'var(--color-text)' }}>{post.title}</span>
            </nav>

            {/* Meta */}
            {post.published_at && (
              <p
                className="mb-3 text-xs"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {formatDate(post.published_at)}
              </p>
            )}

            {/* Title */}
            <h1
              className="mb-6 text-3xl font-light leading-snug md:text-4xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p
                className="mb-8 text-base leading-relaxed"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {post.excerpt}
              </p>
            )}

            {/* Content */}
            {post.content && (
              <div
                className="prose prose-sm max-w-none text-sm leading-relaxed"
                style={{ color: 'var(--color-text-muted)' }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}

            {/* Back */}
            <div
              className="mt-12 border-t pt-8"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <Link
                href="/eventos"
                className="text-sm underline underline-offset-4 transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-primary)' }}
              >
                ← Volver a eventos
              </Link>
            </div>
          </div>
        </section>
      </article>
    </main>
  )
}

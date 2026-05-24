import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getBlogPosts } from '@/lib/data/blog'

export const metadata: Metadata = {
  title: 'Eventos — Vinos & Cia',
  description:
    'Eventos, catas y novedades de Vinos & Cia en Baradero.',
}

function formatDate(d: string | null) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function EventosPage() {
  const { posts } = await getBlogPosts()

  return (
    <main>
      <section
        className="py-14 md:py-20"
        style={{ background: 'var(--color-secondary)' }}
      >
        <div className="container">
          <p
            className="mb-2 text-xs font-medium uppercase tracking-[0.25em]"
            style={{ color: 'var(--color-accent)' }}
          >
            Agenda
          </p>
          <h1
            className="text-4xl font-light md:text-5xl"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-primary-foreground)',
            }}
          >
            Eventos
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          {posts.length === 0 ? (
            <div className="py-24 text-center">
              <p
                className="mb-2 text-2xl font-light"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Próximamente
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Estamos preparando contenido sobre vinos, maridajes y más.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id}>
                  <Link
                    href={`/eventos/${post.slug}`}
                    className="group flex flex-col gap-4"
                  >
                    <div
                      className="relative aspect-[16/9] overflow-hidden rounded"
                      style={{ background: 'var(--color-surface)' }}
                    >
                      {post.cover_image ? (
                        <Image
                          src={post.cover_image}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-4xl opacity-20">🍷</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {post.published_at && (
                        <p
                          className="text-xs"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {formatDate(post.published_at)}
                        </p>
                      )}
                      <h2
                        className="text-lg font-light leading-snug transition-colors group-hover:text-[var(--color-primary)]"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p
                          className="line-clamp-2 text-sm leading-relaxed"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

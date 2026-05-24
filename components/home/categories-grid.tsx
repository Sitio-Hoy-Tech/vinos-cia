import Link from 'next/link'
import Image from 'next/image'

interface Props {
  categories: { id: string; name: string; slug: string; image?: string | null }[]
}

// Fallback por slug si el producto no tiene imagen todavía
const FALLBACK_IMAGES: Record<string, string> = {
  vinos: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=800&q=80',
  espumantes: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&q=80',
  copas: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80',
}

const CATEGORY_DESC: Record<string, string> = {
  vinos: 'Tintos, blancos y rosados de las mejores bodegas',
  espumantes: 'Champagne, Prosecco y espumantes nacionales',
  copas: 'Copas de cristal para cada varietal',
}

export function CategoriesGrid({ categories }: Props) {
  if (categories.length === 0) return null

  return (
    <section className="py-16 md:py-24" style={{ background: 'var(--color-bg)' }}>
      <div className="container">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p
              className="mb-2 text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: 'var(--color-accent)' }}
            >
              Explorar
            </p>
            <h2 className="text-3xl md:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>
              Nuestras categorías
            </h2>
          </div>
          <Link
            href="/productos"
            className="hidden text-sm underline underline-offset-4 transition-opacity hover:opacity-70 sm:block"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Ver todo →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {categories.map((cat) => {
            const img =
              cat.image ??
              FALLBACK_IMAGES[cat.slug] ??
              'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80'
            const desc = CATEGORY_DESC[cat.slug] ?? ''

            return (
              <Link
                key={cat.id}
                href={`/productos?categoria=${cat.slug}`}
                className="category-card group relative overflow-hidden rounded"
                style={{ aspectRatio: '3/4' }}
              >
                <Image
                  src={img}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background:
                      'linear-gradient(to top, rgb(24 24 27 / 0.85) 0%, rgb(24 24 27 / 0.2) 60%, transparent 100%)',
                  }}
                  aria-hidden="true"
                />
                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3
                    className="mb-1 text-2xl font-light"
                    style={{ fontFamily: 'var(--font-display)', color: '#fff' }}
                  >
                    {cat.name}
                  </h3>
                  {desc && (
                    <p
                      className="text-xs leading-relaxed opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{ color: 'rgb(250 248 245 / 0.75)' }}
                    >
                      {desc}
                    </p>
                  )}
                  <span
                    className="mt-3 inline-block text-xs font-medium uppercase tracking-widest opacity-0 transition-all duration-300 group-hover:opacity-100"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    Explorar →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

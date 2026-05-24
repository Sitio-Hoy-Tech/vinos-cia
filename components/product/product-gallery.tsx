'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface ProductImage {
  url: string
  alt: string | null
  position: number
}

interface Props {
  images: ProductImage[]
  productName: string
}

export function ProductGallery({ images, productName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  function scrollToIndex(i: number) {
    setActiveIndex(i)
    const container = scrollRef.current
    if (!container) return
    const child = container.children[i] as HTMLElement
    if (child) child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  // En mobile: carrusel horizontal con scroll-snap
  // En desktop: imagen principal fija + thumbnails clickeables
  return (
    <div className="flex flex-col gap-3">

      {/* ── Mobile: carrusel ── */}
      <div className="relative block sm:hidden">
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory overflow-x-auto"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
          onScroll={(e) => {
            const el = e.currentTarget
            const index = Math.round(el.scrollLeft / el.offsetWidth)
            setActiveIndex(index)
          }}
        >
          {images.length > 0 ? images.map((img, i) => (
            <div
              key={i}
              className="relative aspect-[4/5] w-full shrink-0 snap-center overflow-hidden rounded"
              style={{ background: 'var(--color-surface)' }}
            >
              <Image
                src={img.url}
                alt={img.alt ?? productName}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          )) : (
            <div
              className="relative aspect-[4/5] w-full shrink-0 snap-center overflow-hidden rounded flex items-center justify-center"
              style={{ background: 'var(--color-surface)' }}
            >
              <span className="text-6xl opacity-15">🍷</span>
            </div>
          )}
        </div>

        {/* Dots */}
        {images.length > 1 && (
          <div className="mt-2 flex justify-center gap-1.5">
            {images.slice(0, 8).map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                aria-label={`Imagen ${i + 1}`}
                className="h-1.5 rounded-full transition-all duration-200"
                style={{
                  width: i === activeIndex ? '1.5rem' : '0.375rem',
                  background: i === activeIndex ? 'var(--color-primary)' : 'var(--color-border-strong)',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Desktop: imagen principal + thumbnails ── */}
      <div className="hidden sm:flex sm:flex-col sm:gap-3">
        {/* Imagen principal */}
        <div
          className="relative aspect-[4/5] overflow-hidden rounded"
          style={{ background: 'var(--color-surface)' }}
        >
          {images[activeIndex] ? (
            <Image
              src={images[activeIndex].url}
              alt={images[activeIndex].alt ?? productName}
              fill
              priority
              sizes="50vw"
              className="object-cover transition-opacity duration-200"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-6xl opacity-15">🍷</span>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.slice(0, 8).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Ver imagen ${i + 1}`}
                className="relative aspect-square overflow-hidden rounded transition-opacity"
                style={{
                  background: 'var(--color-surface)',
                  outline: i === activeIndex ? '2px solid var(--color-primary)' : '2px solid transparent',
                  outlineOffset: '2px',
                  opacity: i === activeIndex ? 1 : 0.65,
                }}
              >
                <Image
                  src={img.url}
                  alt={img.alt ?? productName}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

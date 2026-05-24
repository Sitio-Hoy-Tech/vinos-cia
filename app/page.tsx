import type { Metadata } from 'next'
import { Hero } from '@/components/home/hero'
import { CategoriesGrid } from '@/components/home/categories-grid'
import { FeaturedProducts } from '@/components/home/featured-products'
import { TrustBadges } from '@/components/home/trust-badges'
import { AboutTeaser } from '@/components/home/about-teaser'
import { PromoBanner } from '@/components/home/promo-banner'
import { FaqInline } from '@/components/home/faq-inline'
import { getFeaturedProducts } from '@/lib/data/products'
import { getCategoriesWithImages } from '@/lib/data/categories'
import { getTenantConfig } from '@/lib/supabase/tenant'

export const metadata: Metadata = {
  title: 'Vinos & Cia — Vinoteca en Baradero',
  description:
    'Vinos, espumantes y copas de calidad con atención personalizada. Retiro en local en Baradero, Buenos Aires.',
  openGraph: {
    title: 'Vinos & Cia — Vinoteca en Baradero',
    description:
      'Vinos, espumantes y copas de calidad. Envíos a todo el país.',
  },
}

export default async function HomePage() {
  const [products, categories, tenant] = await Promise.all([
    getFeaturedProducts(),
    getCategoriesWithImages(),
    getTenantConfig(),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LiquorStore',
    name: 'Vinos & Cia',
    description: 'Vinoteca en Baradero. Vinos, espumantes y copas de calidad.',
    url: process.env.NEXT_PUBLIC_URL,
    telephone: tenant.whatsapp ?? undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Saenz 987',
      addressLocality: 'Baradero',
      addressRegion: 'Buenos Aires',
      addressCountry: 'AR',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '21:00',
      },
    ],
    currenciesAccepted: 'ARS',
    paymentAccepted: 'Cash, Credit Card, MercadoPago',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero whatsapp={tenant.whatsapp ?? undefined} />
      <TrustBadges />
      <CategoriesGrid categories={categories} />
      <FeaturedProducts products={products} />
      <PromoBanner />
      <AboutTeaser />
      <FaqInline whatsapp={tenant.whatsapp ?? undefined} />
    </>
  )
}

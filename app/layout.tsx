import type { Metadata } from 'next'
import Script from 'next/script'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { WhatsAppButton } from '@/components/ui/whatsapp-button'
import { getTenantConfig } from '@/lib/supabase/tenant'
import '@/styles/tokens.css'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Vinos & Cia — Vinoteca en Baradero',
    template: '%s | Vinos & Cia',
  },
  description:
    'Vinos, espumantes y copas de calidad. Atención personalizada en Baradero, Buenos Aires.',
  metadataBase: process.env.NEXT_PUBLIC_URL
    ? new URL(process.env.NEXT_PUBLIC_URL)
    : undefined,
  openGraph: {
    siteName: 'Vinos & Cia',
    locale: 'es_AR',
    type: 'website',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Vinos & Cia' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-default.jpg'],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const tenant = await getTenantConfig()
  const waPhone = tenant.whatsapp ?? '+543329808080'
  const umamiSrc = tenant.umami_url ?? 'https://analytics.umami.is/script.js'
  const umamiId = tenant.umami_website_id ?? process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID

  return (
    <html lang="es-AR" className={`${cormorant.variable} ${jost.variable}`}>
      <body suppressHydrationWarning>
        <Header />
        <main>{children}</main>
        <Footer waPhone={waPhone} contactEmail={tenant.contact_email ?? ''} />
        <CartDrawer />
        <WhatsAppButton phone={waPhone} />

        {/* Umami Analytics — solo si está configurado */}
        {umamiId && !umamiId.startsWith('FILL_') && (
          <Script
            src={umamiSrc}
            data-website-id={umamiId}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}

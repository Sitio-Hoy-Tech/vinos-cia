'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'
import { CartButton } from '@/components/cart/cart-button'

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  {
    label: 'Productos',
    href: '/productos',
    children: [
      { label: 'Vinos', href: '/productos?categoria=vinos' },
      { label: 'Espumantes', href: '/productos?categoria=espumantes' },
      { label: 'Copas', href: '/productos?categoria=copas' },
    ],
  },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Eventos', href: '/eventos' },
  { label: 'Contacto', href: '/contacto' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header
        className="sticky top-0 z-30 w-full transition-shadow duration-300"
        style={{
          background: 'var(--color-secondary)',
          boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
        }}
      >
        <div className="container flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0" aria-label="Vinos & Cia — Inicio">
            <Image
              src="/logo-vinos-cia.jpg"
              alt="Vinos & Cia"
              width={52}
              height={52}
              className="rounded-full object-cover"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Navegación principal">
            {NAV_LINKS.map((link) =>
              link.children ? (
                /* Submenu — el área de hover incluye el puente invisible */
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setActiveSubmenu(link.href)}
                  onMouseLeave={() => setActiveSubmenu(null)}
                >
                  <button
                    className="flex items-center gap-1 py-5 text-sm font-medium tracking-wide transition-colors"
                    style={{
                      color: activeSubmenu === link.href
                        ? 'var(--color-accent)'
                        : 'rgb(250 248 245 / 0.85)',
                      letterSpacing: 'var(--tracking-wide)',
                    }}
                    aria-expanded={activeSubmenu === link.href}
                    aria-haspopup="true"
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className="transition-transform duration-200"
                      style={{
                        transform: activeSubmenu === link.href ? 'rotate(180deg)' : 'rotate(0)',
                      }}
                    />
                  </button>

                  {/* Puente invisible + dropdown — dentro del mismo div de hover */}
                  <div
                    className="absolute left-0 top-full w-44"
                    style={{ paddingTop: '4px' }} /* puente de 4px para no perder el hover */
                  >
                    {activeSubmenu === link.href && (
                      <div
                        className="w-full overflow-hidden rounded shadow-lg"
                        style={{
                          background: 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="nav-submenu-item block px-4 py-2.5 text-sm"
                            style={{ color: 'var(--color-text)' }}
                          >
                            {child.label}
                          </Link>
                        ))}
                        <Link
                          href={link.href}
                          className="nav-submenu-item block px-4 py-2.5 text-xs font-medium"
                          style={{
                            color: 'var(--color-accent)',
                            borderTop: '1px solid var(--color-border)',
                          }}
                        >
                          Ver todos →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link py-5 text-sm font-medium tracking-wide transition-colors"
                  style={{
                    color: 'rgb(250 248 245 / 0.85)',
                    letterSpacing: 'var(--tracking-wide)',
                  }}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          {/* Right actions */}
          <div
            className="flex items-center gap-1"
            style={{ color: 'var(--color-primary-foreground)' }}
          >
            {/* Cart — hover oscuro para header dark */}
            <div className="header-cart-btn">
              <CartButton />
            </div>

            {/* Mobile hamburger — solo visible en mobile/tablet */}
            <div className="lg:hidden">
              <button
                className="header-icon-btn"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile menu ──────────────────────────── */}
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
        className="fixed inset-0 z-20 lg:hidden transition-opacity duration-300"
        style={{
          background: 'rgb(0 0 0 / 0.5)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
        }}
      />

      {/* Drawer lateral */}
      <nav
        id="mobile-menu"
        aria-label="Menú mobile"
        className="fixed left-0 top-0 z-30 flex h-full flex-col lg:hidden transition-transform duration-300 ease-in-out"
        style={{
          width: '280px',
          background: 'var(--color-secondary)',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          borderRight: '1px solid rgb(255 255 255 / 0.08)',
        }}
      >
        {/* Drawer header */}
        <div
          className="flex h-16 items-center justify-between px-5"
          style={{ borderBottom: '1px solid rgb(255 255 255 / 0.08)' }}
        >
          <Link href="/" onClick={() => setMobileOpen(false)} aria-label="Inicio">
            <Image
              src="/logo-vinos-cia.jpg"
              alt="Vinos & Cia"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
            className="header-icon-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <ul className="flex flex-col overflow-y-auto py-4 px-5 flex-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-sm font-medium tracking-wide transition-colors hover:text-[var(--color-accent)]"
                style={{
                  color: 'rgb(250 248 245 / 0.9)',
                  borderBottom: '1px solid rgb(255 255 255 / 0.06)',
                  letterSpacing: 'var(--tracking-wide)',
                }}
              >
                {link.label}
              </Link>
              {link.children && (
                <ul className="pl-3 py-1">
                  {link.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-2 text-sm transition-colors hover:text-[var(--color-accent)]"
                        style={{ color: 'var(--color-accent)' }}
                      >
                        — {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Bottom contact */}
        <div
          className="px-5 py-4 text-xs"
          style={{
            borderTop: '1px solid rgb(255 255 255 / 0.08)',
            color: 'rgb(250 248 245 / 0.4)',
          }}
        >
          <p>Saenz 987, Baradero</p>
          <p>Lun–Sáb 9:00 – 21:00</p>
        </div>
      </nav>
    </>
  )
}

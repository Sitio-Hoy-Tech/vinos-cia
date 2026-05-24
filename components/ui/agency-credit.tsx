import Link from 'next/link'
import Image from 'next/image'

export function AgencyCredit() {
  return (
    <Link
      href="https://sitiohoy.com.ar"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 opacity-50 hover:opacity-80 transition-opacity"
      style={{ color: 'inherit' }}
      aria-label="Desarrollado por SitioHoy"
    >
      <span className="text-xs">Desarrollado por</span>
      <Image
        src="/logo-sitiohoy.png"
        alt="SitioHoy"
        width={64}
        height={20}
        className="object-contain"
        style={{ height: '16px', width: 'auto' }}
      />
    </Link>
  )
}

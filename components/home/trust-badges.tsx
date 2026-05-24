import { Truck, CreditCard, MessageCircle, ShieldCheck } from 'lucide-react'

const BADGES = [
  {
    icon: Truck,
    title: 'Entrega en Baradero',
    desc: 'Retiro en local sin costo',
  },
  {
    icon: CreditCard,
    title: 'Pagá con MercadoPago',
    desc: 'Tarjeta, débito y transferencia',
  },
  {
    icon: MessageCircle,
    title: 'Atención personalizada',
    desc: 'Respondemos por WhatsApp',
  },
  {
    icon: ShieldCheck,
    title: 'Productos de calidad',
    desc: 'Selección de bodegas premium',
  },
]

export function TrustBadges() {
  return (
    <section
      className="py-12 md:py-16"
      style={{
        background: 'var(--color-secondary)',
        borderTop: '1px solid rgb(255 255 255 / 0.06)',
        borderBottom: '1px solid rgb(255 255 255 / 0.06)',
      }}
    >
      <div className="container">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {BADGES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-3 text-center">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{
                  background: 'rgb(201 169 110 / 0.12)',
                  color: 'var(--color-accent)',
                }}
              >
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: 'rgb(250 248 245 / 0.9)' }}
                >
                  {title}
                </p>
                <p
                  className="mt-0.5 text-xs"
                  style={{ color: 'rgb(250 248 245 / 0.45)' }}
                >
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

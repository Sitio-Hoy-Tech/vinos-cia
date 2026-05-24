import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/contact-form'

export const metadata: Metadata = {
  title: 'Contacto — Vinos & Cia',
  description:
    'Contactate con Vinos & Cia. Estamos en Saenz 987, Baradero. WhatsApp +54 3329 80-8080.',
}

export default function ContactoPage() {
  return (
    <main>
      {/* Header */}
      <section
        className="py-14 md:py-20"
        style={{ background: 'var(--color-secondary)' }}
      >
        <div className="container">
          <p
            className="mb-2 text-xs font-medium uppercase tracking-[0.25em]"
            style={{ color: 'var(--color-accent)' }}
          >
            Contacto
          </p>
          <h1
            className="text-4xl font-light md:text-5xl"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-primary-foreground)',
            }}
          >
            Hablemos
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
            {/* Info */}
            <div>
              <h2
                className="mb-8 text-2xl font-light"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Encontranos
              </h2>

              <div className="flex flex-col gap-6">
                <InfoBlock icon="📍" title="Dirección">
                  Saenz 987, Baradero
                  <br />
                  Buenos Aires, Argentina
                </InfoBlock>

                <InfoBlock icon="🕐" title="Horario">
                  Lunes a Sábados
                  <br />
                  9:00 a 21:00
                </InfoBlock>

                <InfoBlock icon="💬" title="WhatsApp">
                  <a
                    href="https://wa.me/543329808080"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 transition-opacity hover:opacity-70"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    +54 3329 80-8080
                  </a>
                </InfoBlock>

                <InfoBlock icon="✉️" title="Email">
                  <a
                    href="mailto:contacto@vinosycia.com.ar"
                    className="underline underline-offset-4 transition-opacity hover:opacity-70"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    contacto@vinosycia.com.ar
                  </a>
                </InfoBlock>

                <InfoBlock icon="📱" title="Redes">
                  <div className="flex gap-4">
                    <a
                      href="https://www.instagram.com/vinotecavyc/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline underline-offset-4 transition-opacity hover:opacity-70"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      Instagram
                    </a>
                    <a
                      href="https://www.facebook.com/vinosycompania/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline underline-offset-4 transition-opacity hover:opacity-70"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      Facebook
                    </a>
                  </div>
                </InfoBlock>
              </div>
            </div>

            {/* Form */}
            <div>
              <h2
                className="mb-8 text-2xl font-light"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Envianos un mensaje
              </h2>
              <ContactForm />
            </div>
          </div>

          {/* Mapa */}
          <div className="mt-12">
            <h2
              className="mb-5 text-xl font-light"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Cómo llegar
            </h2>
            <div
              className="overflow-hidden rounded"
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                height: 360,
              }}
            >
              <iframe
                title="Ubicación de Vinos & Cia en Baradero"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-59.5200%2C-33.8800%2C-59.4900%2C-33.8570&layer=mapnik&marker=-33.8685%2C-59.5050"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p
              className="mt-2 text-xs"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <a
                href="https://www.openstreetmap.org/?mlat=-33.8685&mlon=-59.5050#map=16/-33.8685/-59.5050"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-70"
                style={{ color: 'var(--color-primary)' }}
              >
                Ver en OpenStreetMap →
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

function InfoBlock({
  icon,
  title,
  children,
}: {
  icon: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-4">
      <span className="mt-0.5 text-lg leading-none">{icon}</span>
      <div>
        <p className="mb-1 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
          {title}
        </p>
        <div className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

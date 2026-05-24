import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y privacidad — Vinos & Cia',
  description: 'Términos y condiciones y política de privacidad de Vinos & Cia.',
  robots: { index: false },
}

export default function LegalPage() {
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
            Legal
          </p>
          <h1
            className="text-4xl font-light md:text-5xl"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-primary-foreground)',
            }}
          >
            Términos y privacidad
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24" style={{ background: 'var(--color-bg)' }}>
        <div className="container max-w-3xl">
          <article
            className="flex flex-col gap-10 text-sm leading-relaxed"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <Section title="Términos y condiciones">
              <p>
                Al utilizar este sitio web aceptás los presentes términos. El
                contenido de este sitio es de carácter informativo y comercial.
                Los precios pueden cambiar sin previo aviso.
              </p>
              <p>
                Los productos están sujetos a disponibilidad de stock. Nos
                reservamos el derecho de cancelar pedidos en caso de error de
                precios o falta de disponibilidad, comunicándolo al cliente.
              </p>
              <p>
                El retiro de los productos se realiza exclusivamente en nuestro
                local: Saenz 987, Baradero, Buenos Aires, en el horario de
                atención (Lunes a Sábados de 9:00 a 21:00).
              </p>
            </Section>

            <Section title="Política de privacidad">
              <p>
                Vinos &amp; Cia respeta tu privacidad. Los datos personales que
                proporcionés (nombre, email, teléfono) son utilizados
                exclusivamente para gestionar tu pedido y responderte consultas.
              </p>
              <p>
                No compartimos tu información personal con terceros salvo que sea
                necesario para procesar tu pago (MercadoPago) o cumplir
                requerimientos legales.
              </p>
              <p>
                Podés solicitar la eliminación de tus datos en cualquier momento
                escribiéndonos a{' '}
                <a
                  href="mailto:contacto@vinosycia.com.ar"
                  style={{ color: 'var(--color-primary)' }}
                  className="underline underline-offset-2"
                >
                  contacto@vinosycia.com.ar
                </a>
                .
              </p>
            </Section>

            <Section title="Pagos">
              <p>
                Los pagos se procesan a través de MercadoPago. No almacenamos
                datos de tarjetas de crédito o débito en nuestros servidores.
              </p>
            </Section>

            <Section title="Contacto">
              <p>
                Para consultas sobre estos términos escribinos a{' '}
                <a
                  href="mailto:contacto@vinosycia.com.ar"
                  style={{ color: 'var(--color-primary)' }}
                  className="underline underline-offset-2"
                >
                  contacto@vinosycia.com.ar
                </a>{' '}
                o visitanos en Saenz 987, Baradero, Buenos Aires.
              </p>
            </Section>
          </article>
        </div>
      </section>
    </main>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h2
        className="mb-4 text-xl font-light"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
      >
        {title}
      </h2>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}

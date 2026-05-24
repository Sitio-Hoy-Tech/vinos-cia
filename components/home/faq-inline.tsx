'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    q: '¿Hacen envíos?',
    a: 'Por el momento trabajamos con retiro en local. Estamos en Saenz 987, Baradero, de Lunes a Sábados de 9:00 a 21:00. El retiro no tiene costo adicional.',
  },
  {
    q: '¿Cómo puedo pagar?',
    a: 'Aceptamos tarjetas de crédito, débito, prepaga y transferencia bancaria a través de MercadoPago.',
  },
  {
    q: '¿Puedo retirar en el local?',
    a: 'Por supuesto. Estamos en Saenz 987, Baradero, de Lunes a Sábados de 9:00 a 21:00. El retiro en local no tiene costo.',
  },
  {
    q: '¿Cómo sé si el vino está disponible?',
    a: 'El stock se actualiza en tiempo real. Si un producto no tiene stock, verás la leyenda "Sin stock" en la ficha del producto.',
  },
  {
    q: '¿Puedo pedir asesoramiento para elegir un vino?',
    a: '¡Claro! Escribinos por WhatsApp y te ayudamos a elegir el vino o espumante perfecto para la ocasión.',
  },
]

export function FaqInline({ whatsapp = '+543329808080' }: { whatsapp?: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const waHref = `https://wa.me/${whatsapp.replace(/\D/g, '')}`

  return (
    <section
      className="py-16 md:py-24"
      style={{ background: 'var(--color-surface)' }}
    >
      <div className="container max-w-3xl">
        <div className="mb-10 text-center">
          <p
            className="mb-2 text-xs font-medium uppercase tracking-[0.2em]"
            style={{ color: 'var(--color-accent)' }}
          >
            FAQ
          </p>
          <h2
            className="text-3xl md:text-4xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Preguntas frecuentes
          </h2>
        </div>

        <dl className="flex flex-col divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {FAQS.map((faq, i) => (
            <div key={i}>
              <dt>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium transition-colors hover:text-[var(--color-primary)]"
                  style={{ color: 'var(--color-text)' }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className="shrink-0 transition-transform duration-200"
                    style={{ transform: open === i ? 'rotate(180deg)' : 'rotate(0)' }}
                  />
                </button>
              </dt>
              {open === i && (
                <dd
                  className="pb-4 text-sm leading-relaxed"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {faq.a}
                </dd>
              )}
            </div>
          ))}
        </dl>

        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            ¿Tenés más preguntas?{' '}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-primary)' }}
            >
              Escribinos por WhatsApp
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

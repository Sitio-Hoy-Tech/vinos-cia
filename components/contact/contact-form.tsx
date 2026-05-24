'use client'

import { useActionState, useState } from 'react'
import { submitContact, type ContactState } from '@/lib/actions/contact'

const initial: ContactState = { ok: false }

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial)

  // Preservar valores para que los errores de validación no limpien el formulario
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  if (state.ok) {
    return (
      <div
        className="rounded p-8 text-center"
        style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}
      >
        <p className="mb-2 text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
          ¡Mensaje recibido!
        </p>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Te respondemos a la brevedad por email o WhatsApp.
        </p>
      </div>
    )
  }

  const fe = state.fieldErrors ?? {}

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Nombre *" error={fe.name?.[0]}>
          <input
            name="name"
            type="text"
            placeholder="Tu nombre"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field-input"
          />
        </Field>
        <Field label="Email *" error={fe.email?.[0]}>
          <input
            name="email"
            type="email"
            placeholder="tu@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field-input"
          />
        </Field>
      </div>

      <Field label="Teléfono / WhatsApp" error={fe.phone?.[0]}>
        <input
          name="phone"
          type="tel"
          placeholder="+54 9 ..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="field-input"
        />
      </Field>

      <Field label="Mensaje *" error={fe.message?.[0]}>
        <textarea
          name="message"
          rows={5}
          placeholder="¿En qué podemos ayudarte?"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="field-input resize-none"
        />
      </Field>

      {state.error && (
        <p className="text-sm" style={{ color: 'var(--color-primary)' }}>
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="add-to-cart-btn w-full sm:w-auto sm:self-start"
        style={{
          background: 'var(--color-secondary)',
          color: 'var(--color-secondary-foreground)',
          padding: '0.75rem 2.5rem',
          fontSize: 'var(--text-sm)',
          opacity: pending ? 0.6 : 1,
        }}
      >
        {pending ? 'Enviando…' : 'Enviar mensaje'}
      </button>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs" style={{ color: 'var(--color-primary)' }}>
          {error}
        </p>
      )}
    </div>
  )
}

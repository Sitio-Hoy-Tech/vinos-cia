'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { initMercadoPago, Payment } from '@mercadopago/sdk-react'
import { useCartStore } from '@/lib/store/cart'
import { createCheckoutPreference, processPayment } from '@/lib/actions/checkout'
import type { ShippingZone } from '@/lib/data/shipping'

function formatPrice(n: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(n)
}

interface CheckoutFormProps {
  mpPublicKey: string | null
  zones: ShippingZone[]
}

export function CheckoutForm({ mpPublicKey, zones }: CheckoutFormProps) {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCartStore()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [preferenceId, setPreferenceId] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderTotal, setOrderTotal] = useState<number>(0)
  const [trackingToken, setTrackingToken] = useState<string | null>(null)
  const [paymentProcessing, setPaymentProcessing] = useState(false)

  // Datos del formulario
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [zoneId, setZoneId] = useState(zones[0]?.id ?? '')
  const [address, setAddress] = useState('')

  const selectedZone = zones.find((z) => z.id === zoneId)
  const isRetiro = selectedZone?.price === 0
  const shippingCost = selectedZone?.price ?? 0
  const total = subtotal() + shippingCost

  useEffect(() => {
    if (mpPublicKey) {
      initMercadoPago(mpPublicKey, { locale: 'es-AR' })
    }
  }, [mpPublicKey])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!firstName || !lastName || !email) {
      setError('Completá nombre, apellido y email.')
      return
    }
    if (!isRetiro && !address) {
      setError('Ingresá la dirección de entrega.')
      return
    }

    startTransition(async () => {
      const result = await createCheckoutPreference({
        firstName,
        lastName,
        email,
        phone,
        zoneId,
        address: isRetiro ? '' : address,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      })

      if (!result.ok) {
        setError(result.error)
        return
      }

      setPreferenceId(result.preferenceId)
      setOrderId(result.orderId)
      setOrderTotal(result.total)
      setTrackingToken(result.trackingToken)
    })
  }

  // Carrito vacío
  if (items.length === 0 && !preferenceId) {
    return (
      <section className="py-24 text-center" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          <p className="mb-4 text-2xl font-light" style={{ fontFamily: 'var(--font-display)' }}>
            Tu carrito está vacío
          </p>
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 rounded px-6 py-3 text-sm font-medium tracking-widest"
            style={{ background: 'var(--color-primary)', color: '#fff' }}
          >
            VER PRODUCTOS
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-10 md:py-16" style={{ background: 'var(--color-bg)' }}>
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">

          {/* Columna izquierda: formulario o pago */}
          <div>
            {!preferenceId ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                {/* Datos de contacto */}
                <fieldset className="flex flex-col gap-4">
                  <legend
                    className="mb-4 text-xs font-medium uppercase tracking-[0.2em]"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    Datos de contacto
                  </legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="field-input"
                        placeholder="Juan"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                        Apellido *
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="field-input"
                        placeholder="Pérez"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="field-input"
                      placeholder="juan@ejemplo.com"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="field-input"
                      placeholder="+54 9 3329 000000"
                    />
                  </div>
                </fieldset>

                {/* Envío */}
                <fieldset className="flex flex-col gap-4">
                  <legend
                    className="mb-4 text-xs font-medium uppercase tracking-[0.2em]"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    Entrega
                  </legend>
                  <div className="flex flex-col gap-2">
                    {zones.map((zone) => (
                      <label
                        key={zone.id}
                        className="flex cursor-pointer items-start gap-3 rounded p-3 transition-colors"
                        style={{
                          border: `1px solid ${zoneId === zone.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          background: zoneId === zone.id ? 'var(--color-surface)' : 'transparent',
                        }}
                      >
                        <input
                          type="radio"
                          name="zone"
                          value={zone.id}
                          checked={zoneId === zone.id}
                          onChange={() => setZoneId(zone.id)}
                          className="mt-0.5 accent-[var(--color-primary)]"
                        />
                        <div className="flex flex-1 items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium">{zone.name}</p>
                            {zone.description && (
                              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                {zone.description}
                              </p>
                            )}
                          </div>
                          <span className="shrink-0 text-sm font-medium">
                            {zone.price === 0 ? 'Gratis' : formatPrice(zone.price)}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {!isRetiro && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                        Dirección de entrega *
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="field-input"
                        placeholder="Calle 123, Ciudad, Provincia"
                      />
                    </div>
                  )}
                </fieldset>

                {error && (
                  <p className="rounded p-3 text-sm" style={{ background: '#fee2e2', color: '#991b1b' }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center justify-center gap-2 rounded px-8 py-4 text-sm font-medium tracking-widest transition-opacity disabled:opacity-60"
                  style={{ background: 'var(--color-primary)', color: '#fff' }}
                >
                  {isPending ? 'Procesando...' : 'CONTINUAR AL PAGO'}
                </button>
              </form>
            ) : (
              /* Paso de pago con Payment Brick */
              <div className="flex flex-col gap-6">
                <div>
                  <p
                    className="mb-1 text-xs font-medium uppercase tracking-[0.2em]"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    Paso final
                  </p>
                  <h2
                    className="text-2xl font-light"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Completar pago
                  </h2>
                </div>

                {error && (
                  <p className="rounded p-3 text-sm" style={{ background: '#fee2e2', color: '#991b1b' }}>
                    {error}
                  </p>
                )}

                {mpPublicKey && preferenceId && orderId && (
                  <Payment
                    initialization={{
                      amount: orderTotal,
                      payer: {
                        email,
                        entityType: 'individual' as const,
                      },
                    }}
                    customization={{
                      paymentMethods: {
                        creditCard: 'all',
                        debitCard: 'all',
                        ticket: 'all',
                        mercadoPago: 'all',
                        maxInstallments: 1,
                      },
                    }}
                    onSubmit={async ({ selectedPaymentMethod, formData }) => {
                      if (paymentProcessing) return
                      setPaymentProcessing(true)
                      setError(null)

                      const result = await processPayment({
                        orderId: orderId,
                        token: (formData as { token?: string }).token ?? '',
                        paymentMethodId: (formData as { payment_method_id?: string }).payment_method_id ?? selectedPaymentMethod,
                        issuerId: (formData as { issuer_id?: string }).issuer_id ?? null,
                        installments: (formData as { installments?: number }).installments ?? 1,
                        identificationNumber: ((formData as { payer?: { identification?: { number?: string } } }).payer?.identification?.number) ?? '',
                        identificationType: ((formData as { payer?: { identification?: { type?: string } } }).payer?.identification?.type) ?? 'DNI',
                      })

                      setPaymentProcessing(false)

                      if (!result.ok) {
                        setError(result.error)
                        return
                      }

                      clearCart()

                      if (result.status === 'approved') {
                        router.push(`/pedidos/${result.trackingToken}?nuevo=1`)
                      } else {
                        router.push(`/checkout/pending?token=${result.trackingToken}`)
                      }
                    }}
                    onError={(error) => {
                      console.error('[Payment brick] error:', error)
                      setError('Ocurrió un error en el formulario de pago. Recargá la página e intentá de nuevo.')
                    }}
                  />
                )}

                {paymentProcessing && (
                  <p className="text-sm text-center" style={{ color: 'var(--color-text-muted)' }}>
                    Procesando pago...
                  </p>
                )}

                {trackingToken && (
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    Número de pedido:{' '}
                    <Link
                      href={`/pedidos/${trackingToken}`}
                      className="font-medium underline underline-offset-4"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {trackingToken.slice(0, 8).toUpperCase()}
                    </Link>
                    {' '}— podés usarlo para hacer seguimiento.
                  </p>
                )}

                <button
                  onClick={() => { setPreferenceId(null); setOrderId(null); setError(null) }}
                  className="text-sm underline underline-offset-4 self-start"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  ← Volver al formulario
                </button>
              </div>
            )}
          </div>

          {/* Columna derecha: resumen */}
          <aside>
            <div
              className="sticky top-24 rounded p-6 flex flex-col gap-4"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <h2
                className="text-lg font-light"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Resumen del pedido
              </h2>

              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    {item.image ? (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                      </div>
                    ) : (
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded"
                        style={{ background: 'var(--color-bg)' }}
                      >
                        <span className="text-lg opacity-20">🍷</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      {item.variantName && (
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.variantName}</p>
                      )}
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        x{item.quantity}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div
                className="flex flex-col gap-2 border-t pt-4 text-sm"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex justify-between">
                  <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
                  <span>{formatPrice(subtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    {selectedZone?.name ?? 'Envío'}
                  </span>
                  <span>{shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}</span>
                </div>
                <div
                  className="flex justify-between border-t pt-2 text-base font-medium"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <span>Total</span>
                  <span style={{ color: 'var(--color-primary)' }}>{formatPrice(total)}</span>
                </div>
              </div>

              <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
                Pagos procesados de forma segura por MercadoPago
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

'use server'

import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'
import { contactConfirmationEmail, contactNotificationEmail } from '@/lib/email/templates'

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID!

const schema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

export type ContactState = {
  ok: boolean
  error?: string
  fieldErrors?: Record<string, string[]>
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string | undefined,
    message: formData.get('message') as string,
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const sb = createServiceClient()

  // Obtener configuración de email del tenant
  const { data: tenantRow } = await sb
    .from('tenants')
    .select('contact_email, name, resend_api_key')
    .eq('id', TENANT_ID)
    .single()

  const { error } = await sb.from('contact_messages').insert({
    tenant_id: TENANT_ID,
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    message: parsed.data.message,
  })

  if (error) return { ok: false, error: 'No se pudo enviar el mensaje. Intentá de nuevo.' }

  // Intentar enviar emails — config 100% desde tenants
  const resendKey = tenantRow?.resend_api_key
  const notifyTo = tenantRow?.contact_email
  const fromAddress = notifyTo && tenantRow?.name
    ? `${tenantRow.name} <${notifyTo}>`
    : notifyTo ?? ''

  if (resendKey && !resendKey.startsWith('FILL_') && notifyTo) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(resendKey)

      // Email al local (notificación interna) → contact_email del tenant
      await resend.emails.send({
        from: fromAddress,
        to: notifyTo,
        subject: `Nuevo mensaje de contacto — ${parsed.data.name}`,
        html: contactNotificationEmail({
          businessName: tenantRow.name ?? 'Tienda',
          visitorName: parsed.data.name,
          visitorEmail: parsed.data.email,
          visitorPhone: parsed.data.phone,
          message: parsed.data.message,
        }),
      })

      // Email de confirmación al visitante
      await resend.emails.send({
        from: fromAddress,
        to: parsed.data.email,
        subject: `Recibimos tu mensaje — ${tenantRow.name}`,
        html: contactConfirmationEmail({
          businessName: tenantRow.name ?? 'Tienda',
          businessAddress: 'Saenz 987, Baradero · Lun–Sáb 9:00–21:00',
          visitorName: parsed.data.name,
        }),
      })
    } catch {
      // Si Resend falla, el mensaje ya quedó guardado en contact_messages
    }
  }

  return { ok: true }
}

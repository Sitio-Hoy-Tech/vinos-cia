/**
 * Templates de email con estilos inline.
 * Los clientes de email no soportan CSS externo ni <style> blocks — todo debe ser inline.
 */

const BRAND_COLOR = '#722F37'
const BG_COLOR = '#FAF8F5'
const SURFACE_COLOR = '#FFFFFF'
const TEXT_COLOR = '#18181B'
const MUTED_COLOR = '#71717A'
const BORDER_COLOR = '#E4E4E7'

function emailWrapper(content: string, businessName: string, businessAddress?: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${businessName}</title>
</head>
<body style="margin:0;padding:0;background-color:${BG_COLOR};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG_COLOR};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:${TEXT_COLOR};padding:28px 32px;border-radius:8px 8px 0 0;">
              <p style="margin:0;font-size:22px;font-weight:300;color:#FAF8F5;letter-spacing:0.05em;">
                ${businessName}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:${SURFACE_COLOR};padding:32px;border-left:1px solid ${BORDER_COLOR};border-right:1px solid ${BORDER_COLOR};">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:${BG_COLOR};padding:20px 32px;border:1px solid ${BORDER_COLOR};border-top:none;border-radius:0 0 8px 8px;">
              ${businessAddress ? `<p style="margin:0 0 4px;font-size:12px;color:${MUTED_COLOR};">${businessAddress}</p>` : ''}
              <p style="margin:0;font-size:11px;color:${MUTED_COLOR};">
                Este email fue enviado automáticamente, por favor no respondas a este mensaje.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/** Confirmación al visitante que mandó el formulario de contacto */
export function contactConfirmationEmail({
  businessName,
  businessAddress,
  businessPhone,
  visitorName,
}: {
  businessName: string
  businessAddress: string
  businessPhone?: string
  visitorName: string
}): string {
  const content = `
    <p style="margin:0 0 20px;font-size:24px;font-weight:300;color:${TEXT_COLOR};line-height:1.3;">
      Hola, <strong style="font-weight:600;">${visitorName}</strong>
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:${TEXT_COLOR};line-height:1.6;">
      Recibimos tu mensaje y te vamos a responder a la brevedad.
    </p>
    <p style="margin:0 0 28px;font-size:15px;color:${MUTED_COLOR};line-height:1.6;">
      Si necesitás una respuesta urgente, podés contactarnos directamente:
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER_COLOR};border-radius:6px;margin-bottom:28px;">
      <tr>
        <td style="padding:16px 20px;border-bottom:1px solid ${BORDER_COLOR};">
          <p style="margin:0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:${MUTED_COLOR};">Dirección</p>
          <p style="margin:4px 0 0;font-size:14px;color:${TEXT_COLOR};">${businessAddress}</p>
        </td>
      </tr>
      ${businessPhone ? `
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:${MUTED_COLOR};">WhatsApp</p>
          <p style="margin:4px 0 0;font-size:14px;color:${TEXT_COLOR};">${businessPhone}</p>
        </td>
      </tr>` : ''}
    </table>

    <p style="margin:0;font-size:14px;color:${MUTED_COLOR};">
      Gracias por contactarnos,<br/>
      <strong style="color:${TEXT_COLOR};">${businessName}</strong>
    </p>
  `
  return emailWrapper(content, businessName, businessAddress)
}

/** Notificación interna al negocio cuando llega un mensaje de contacto */
export function contactNotificationEmail({
  businessName,
  visitorName,
  visitorEmail,
  visitorPhone,
  message,
}: {
  businessName: string
  visitorName: string
  visitorEmail: string
  visitorPhone?: string
  message: string
}): string {
  const content = `
    <p style="margin:0 0 8px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:${BRAND_COLOR};">
      Nuevo mensaje de contacto
    </p>
    <p style="margin:0 0 24px;font-size:22px;font-weight:300;color:${TEXT_COLOR};">
      ${visitorName}
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER_COLOR};border-radius:6px;margin-bottom:24px;">
      <tr>
        <td style="padding:14px 20px;border-bottom:1px solid ${BORDER_COLOR};">
          <p style="margin:0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:${MUTED_COLOR};">Email</p>
          <p style="margin:4px 0 0;font-size:14px;color:${TEXT_COLOR};">
            <a href="mailto:${visitorEmail}" style="color:${BRAND_COLOR};text-decoration:none;">${visitorEmail}</a>
          </p>
        </td>
      </tr>
      ${visitorPhone ? `
      <tr>
        <td style="padding:14px 20px;border-bottom:1px solid ${BORDER_COLOR};">
          <p style="margin:0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:${MUTED_COLOR};">Teléfono</p>
          <p style="margin:4px 0 0;font-size:14px;color:${TEXT_COLOR};">${visitorPhone}</p>
        </td>
      </tr>` : ''}
      <tr>
        <td style="padding:14px 20px;">
          <p style="margin:0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:${MUTED_COLOR};">Mensaje</p>
          <p style="margin:8px 0 0;font-size:14px;color:${TEXT_COLOR};line-height:1.6;white-space:pre-wrap;">${message}</p>
        </td>
      </tr>
    </table>

    <a href="mailto:${visitorEmail}"
       style="display:inline-block;background-color:${BRAND_COLOR};color:#fff;font-size:13px;font-weight:500;letter-spacing:0.08em;text-decoration:none;padding:12px 24px;border-radius:4px;">
      RESPONDER
    </a>
  `
  return emailWrapper(content, businessName)
}

/** Confirmación de pedido al comprador */
export function orderConfirmationEmail({
  businessName,
  businessAddress,
  businessPhone,
  customerName,
  orderRef,
  trackingUrl,
  items,
  shippingLabel,
  shippingCost,
  total,
}: {
  businessName: string
  businessAddress: string
  businessPhone?: string
  customerName: string
  orderRef: string
  trackingUrl: string
  items: { name: string; variantName?: string | null; quantity: number; unitPrice: number }[]
  shippingLabel: string
  shippingCost: number
  total: number
}): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(n)

  const itemRows = items
    .map(
      (i) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${BORDER_COLOR};font-size:14px;color:${TEXT_COLOR};">
        ${i.name}${i.variantName ? ` <span style="color:${MUTED_COLOR};">— ${i.variantName}</span>` : ''} x${i.quantity}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid ${BORDER_COLOR};font-size:14px;color:${TEXT_COLOR};text-align:right;">
        ${fmt(i.unitPrice * i.quantity)}
      </td>
    </tr>`,
    )
    .join('')

  const content = `
    <p style="margin:0 0 20px;font-size:24px;font-weight:300;color:${TEXT_COLOR};line-height:1.3;">
      ¡Gracias, <strong style="font-weight:600;">${customerName}</strong>!
    </p>
    <p style="margin:0 0 28px;font-size:15px;color:${MUTED_COLOR};line-height:1.6;">
      Tu pedido <strong style="color:${TEXT_COLOR};">#${orderRef}</strong> fue confirmado con éxito.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER_COLOR};border-radius:6px;margin-bottom:24px;">
      <tr>
        <td colspan="2" style="padding:14px 20px;border-bottom:1px solid ${BORDER_COLOR};background-color:${BG_COLOR};border-radius:6px 6px 0 0;">
          <p style="margin:0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:${MUTED_COLOR};">Productos</p>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding:0 20px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${itemRows}
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid ${BORDER_COLOR};font-size:14px;color:${MUTED_COLOR};">${shippingLabel}</td>
              <td style="padding:10px 0;border-bottom:1px solid ${BORDER_COLOR};font-size:14px;color:${MUTED_COLOR};text-align:right;">${shippingCost === 0 ? 'Gratis' : fmt(shippingCost)}</td>
            </tr>
            <tr>
              <td style="padding:14px 0 4px;font-size:15px;font-weight:600;color:${TEXT_COLOR};">Total</td>
              <td style="padding:14px 0 4px;font-size:15px;font-weight:600;color:${BRAND_COLOR};text-align:right;">${fmt(total)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <a href="${trackingUrl}"
       style="display:inline-block;background-color:${BRAND_COLOR};color:#fff;font-size:13px;font-weight:500;letter-spacing:0.08em;text-decoration:none;padding:12px 24px;border-radius:4px;margin-bottom:28px;">
      VER MI PEDIDO
    </a>

    ${businessPhone ? `
    <p style="margin:0;font-size:14px;color:${MUTED_COLOR};line-height:1.6;">
      ¿Tenés alguna duda? Escribinos por WhatsApp al <strong style="color:${TEXT_COLOR};">${businessPhone}</strong>
    </p>` : ''}
  `
  return emailWrapper(content, businessName, businessAddress)
}

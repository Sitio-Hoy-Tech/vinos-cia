# Project Context - Vinos & Cia

- Plan: emprendimiento
- Industria: Vinoteca
- Dominio: pending_purchase
- Checkout: si
- MercadoPago: si
- Envia.com: no
- Envios fijos: si
- Resend: si
- Umami: si
- WhatsApp: si

## Cargar siempre

- `sitiohoy.config.json`
- `brief.md`
- pack del modulo actual en `.sitiohoy/context/`

## No cargar salvo duda concreta

- Archivos core completos
- Integraciones no activas
- Modulos de otros planes

## Reglas permanentes

- Usar Server Components por defecto.
- Usar 'use client' solo para estado, efectos o eventos.
- Usar next/image, nunca <img>.
- Usar next/font, nunca links externos de fuentes.
- Usar revalidateTag, nunca revalidatePath global.
- Ejecutar npm run sitiohoy:validate antes de cerrar.
- En modulos visuales, revisar screenshots 375/390/768/1280/1920 y ejecutar sitiohoy:visual-audit con SITE_URL.

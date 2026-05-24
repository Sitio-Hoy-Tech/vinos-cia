# Vinos & Cia — Sitio Web

> Tienda online de vinos y productos gourmet. Plan Emprendimiento con MercadoPago, zonas de envío fijas y emails con Resend.

**Live:** https://vinos-cia.vercel.app · **Repo:** [Sitio-Hoy-Tech/vinos-cia](https://github.com/Sitio-Hoy-Tech/vinos-cia)

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Base de datos | Supabase (PostgreSQL + RLS multitenant) |
| Pagos | MercadoPago Bricks (Payment brick embebido) |
| Envíos | Zonas fijas (tabla `shipping_zones`) |
| Emails | Resend (templates HTML inline) |
| Analytics | Umami (pendiente configurar) |
| Deploy | Vercel — región `gru1` (São Paulo) |

---

## Arquitectura

```
app/
  page.tsx                  → Home (Hero + Categorías + Destacados + Blog)
  layout.tsx                → Layout raíz (header, footer, carrito, WhatsApp)
  productos/
    page.tsx                → Catálogo con filtros y paginación server-side
    [slug]/page.tsx         → Detalle de producto con variantes
  checkout/
    page.tsx                → Checkout con Payment brick de MercadoPago
    success/page.tsx        → Confirmación post-pago
    pending/page.tsx        → Pago pendiente
    failure/page.tsx        → Pago fallido
  pedidos/[token]/page.tsx  → Seguimiento de pedido por tracking token
  eventos/                  → Listado y detalle de eventos (blog)
  contacto/                 → Formulario de contacto (guarda en BD + email)
  nosotros / faq / legal / terminos → Páginas estáticas
  api/
    revalidate/route.ts     → ISR on-demand (triggered por Supabase pg_net)
    webhook/mercadopago/    → Webhook de pagos MP

lib/
  supabase/                 → Clients server/browser/service + getTenantConfig
  data/                     → Queries con unstable_cache (bypass en dev)
  actions/                  → Server Actions: checkout, contact, revalidate
  store/cart.ts             → Carrito Zustand con persist
  email/templates.ts        → Templates HTML inline para Resend
  config/env.ts             → Variables de entorno validadas con Zod

components/
  home/                     → Hero, CategoriesGrid, FeaturedProducts, etc.
  product/                  → ProductClient, ProductGallery, AddToCartButton
  cart/                     → CartDrawer, CartButton, CartItem
  checkout/                 → CheckoutForm con Payment brick
  ui/                       → Componentes compartidos
```

---

## Variables de entorno

Copiar `.env.example` a `.env.local` y completar:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://suvpddgmhyjmixvcbpqc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>   # nunca con prefijo NEXT_PUBLIC_

# Tenant
NEXT_PUBLIC_TENANT_ID=4737ee3f-707b-42bb-adec-7aa9d5ddb173
NEXT_PUBLIC_SITE_NAME=Vinos & Cia
NEXT_PUBLIC_URL=http://localhost:3000           # en prod: https://vinos-cia.vercel.app

# ISR on-demand
REVALIDATION_SECRET=<secreto hex 64 chars>

# MercadoPago (credenciales viven en tabla tenants, no en .env)
# Solo necesario si se quiere override local — en producción leer desde tenants
MP_WEBHOOK_SECRET=<secreto para validar webhooks>
```

> **MP, Resend y Umami** no van en `.env`. Sus credenciales se configuran en la tabla `tenants` desde el panel de administración.

---

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # completar valores
npm run dev                  # http://localhost:3000
npm run build                # verificar build sin errores
npm run sitiohoy:validate    # gates de calidad SitioHoy
```

---

## Integraciones

### MercadoPago
- Usa el **Payment brick embebido** (no redirect). El formulario de pago queda dentro del sitio.
- Credenciales (`mp_access_token`, `mp_public_key`) se guardan en `tenants`, no en `.env`.
- En desarrollo, MP no acepta `localhost` en `back_urls` ni `notification_url` — se omiten automáticamente.
- Para probar pagos en sandbox: crear un usuario comprador de prueba en el panel de developers de MP. El email del pagador no puede ser el mismo que el de la cuenta vendedora.
- Webhook: `POST /api/webhook/mercadopago` — actualiza estado del pedido y dispara email de confirmación.

### Resend
- API key en `tenants.resend_api_key`.
- Remitente: `tenants.contact_email`.
- Templates en `lib/email/templates.ts` (HTML inline, compatible con todos los clientes de email).
- Si `resend_api_key` está vacío, los mensajes se guardan en `contact_messages` pero no se envía email.

### ISR on-demand
- Triggers `pg_net` en Supabase llaman a `POST /api/revalidate` cuando cambian productos, categorías o el tenant.
- Requiere que `tenants.url` esté actualizado con la URL de producción.
- `REVALIDATION_SECRET` debe coincidir con `tenants.revalidation_secret` en la BD.
- En desarrollo, `unstable_cache` se bypasea automáticamente para que los cambios del admin se reflejen de inmediato.

### Supabase
- Instancia compartida multitenant de SitioHoy.
- Todas las queries filtran por `tenant_id`.
- RLS habilitado en todas las tablas. El `service role` solo se usa en server-side.

---

## Deploy

```bash
vercel --prod --yes
```

Checklist pre-go-live:
- [ ] Actualizar credenciales MP a **producción** en tabla `tenants`
- [ ] Confirmar `tenants.url = 'https://vinos-cia.vercel.app'` (o dominio propio)
- [ ] Configurar dominio propio en Vercel y actualizar `NEXT_PUBLIC_URL`
- [ ] Configurar `tenants.resend_api_key` con API key de producción
- [ ] Verificar webhook MP apuntando a `https://vinos-cia.vercel.app/api/webhook/mercadopago`
- [ ] Revisar Lighthouse en producción (Performance, SEO, Accessibility)

---

## Desarrollado por

[SitioHoy](https://sitiohoy.com.ar) — Plan Emprendimiento · 2026

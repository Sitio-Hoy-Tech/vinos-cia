# Orden de Implementación Optimizado

## Principio
Cada módulo se implementa en orden de dependencia. No saltar módulos.
DESIGN.md DEBE estar listo antes de Módulo 1.

## Secuencia

### Pre-implementación
1. ✅ Briefing completado (intake.json, config, brief.md, DESIGN.md)
2. ✅ Context packs generados (.sitiohoy/context/, .sitiohoy/design/)
3. ✅ DESIGN.md generado como dirección creativa
4. ✅ Design tokens generados por el modelo AI → tokens.css

### Módulo 0 — Scaffold & Database
- Next.js base + Supabase schema + QA scripts
- Gate: `npm run build` + `npm run sitiohoy:validate`

### Módulo 1 — Layout Base
- Header, Footer, Nav, Cart Sidebar, Error boundaries
- Dependencia: tokens.css, DESIGN.md dirección creativa
- Gate: validate + visual-audit

### Módulo 2 — Home
- Hero, Trust Signals, Featured Products, Testimonios
- Dependencia: Módulo 1 (layout), assets del cliente
- Gate: validate + visual-audit (5 viewports)

### Módulo 3 — Catálogo
- Grid, Filtros, Product Detail, Variantes, Related
- Dependencia: Módulo 1 + datos en Supabase
- Gate: validate + Lighthouse

### Módulo 4 — Checkout (ACTIVO)
- Cart, Multi-step, MercadoPago, Shipping, Tracking, Emails
- Dependencia: Módulo 3 + credenciales MP
- Gate: validate + e2e + test-mercadopago + pago de prueba

### Módulo 5 — Páginas Complementarias
- About, FAQ, Contact, Legal
- Dependencia: Módulo 1
- Gate: validate

### Módulo 6 — SEO & Performance
- Sitemap, robots.txt, Schema.org, meta tags, Lighthouse
- Dependencia: Todos los módulos anteriores
- Gate: validate + Lighthouse ≥90

### Módulo 7 — Analytics & Deploy (ACTIVO)
- Umami, Vercel deploy, domain, prod credentials, smoke tests
- Dependencia: QA aprobado
- Gate: qa-report + smoke tests + compra real (si checkout)

## Estimación de Complejidad por Plan
- **Esencial**: ~5 módulos, sin checkout ni analytics avanzado
- **Emprendimiento**: ~7 módulos, checkout + envíos fijos
- **Empresa**: ~8 módulos, checkout + envíos dinámicos + analytics

# Module 3 - Catalogo con carrito y variantes

## Objetivo

Catalogo con carrito y variantes para Vinos & Cia, plan emprendimiento.

## Contexto minimo

- `sitiohoy.config.json`
- `brief.md`
- `.sitiohoy/context/project-context.md`
- `.sitiohoy/context/module-3.md`
- `.sitiohoy/design/inspiration-board.md`
- `.sitiohoy/design/design-direction.md`
- `.sitiohoy/design/layout-recipe.md`
- `.sitiohoy/design/anti-slop-checklist.md`

## Leer solo si hace falta

- .sitiohoy/design/inspiration-board.md
- core/07-isr-cache.md si faltan queries
- core/08-seo.md si falta Schema.org

## Construir

- catalogo con agregar al carrito
- detalle producto
- galeria
- variantes
- metadata

## Reglas

- Usar Server Components por defecto.
- Usar 'use client' solo para estado, efectos o eventos.
- Usar next/image, nunca <img>.
- Usar next/font, nunca links externos de fuentes.
- Usar revalidateTag, nunca revalidatePath global.
- Ejecutar npm run sitiohoy:validate antes de cerrar.
- En modulos visuales, revisar screenshots 375/390/768/1280/1920 y ejecutar sitiohoy:visual-audit con SITE_URL.

## Gates

- npm run build
- npm run sitiohoy:validate
- SITE_URL=http://localhost:3000 npm run sitiohoy:visual-audit

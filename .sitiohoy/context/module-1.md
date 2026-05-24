# Module 1 - Layout global con carrito

## Objetivo

Layout global con carrito para Vinos & Cia, plan emprendimiento.

## Contexto minimo

- `sitiohoy.config.json`
- `brief.md`
- `.sitiohoy/context/project-context.md`
- `.sitiohoy/context/module-1.md`
- `.sitiohoy/design/inspiration-board.md`
- `.sitiohoy/design/design-direction.md`
- `.sitiohoy/design/layout-recipe.md`
- `.sitiohoy/design/anti-slop-checklist.md`

## Leer solo si hace falta

- .sitiohoy/design/inspiration-board.md
- .sitiohoy/design/design-direction.md
- core/17-manejo-errores.md si falta template

## Construir

- layout
- header
- footer
- navegacion responsive
- carrito/drawer base

## Reglas

- Usar Server Components por defecto.
- Usar 'use client' solo para estado, efectos o eventos.
- Usar next/image, nunca <img>.
- Usar next/font, nunca links externos de fuentes.
- Usar revalidateTag, nunca revalidatePath global.
- Ejecutar npm run sitiohoy:validate antes de cerrar.
- En modulos visuales, revisar screenshots 375/390/768/1280/1920 y ejecutar sitiohoy:visual-audit con SITE_URL.

## Gates

- npm run sitiohoy:validate
- SITE_URL=http://localhost:3000 npm run sitiohoy:visual-audit

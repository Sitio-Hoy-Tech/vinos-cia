# Module 6 - SEO, Umami y deploy

## Objetivo

SEO, Umami y deploy para Vinos & Cia, plan emprendimiento.

## Contexto minimo

- `sitiohoy.config.json`
- `brief.md`
- `.sitiohoy/context/project-context.md`
- `.sitiohoy/context/module-6.md`


## Leer solo si hace falta

- .sitiohoy/context/deploy-context.md

## Construir

- sitemap
- robots
- Umami
- deploy

## Reglas

- Usar Server Components por defecto.
- Usar 'use client' solo para estado, efectos o eventos.
- Usar next/image, nunca <img>.
- Usar next/font, nunca links externos de fuentes.
- Usar revalidateTag, nunca revalidatePath global.
- Ejecutar npm run sitiohoy:validate antes de cerrar.
- En modulos visuales, revisar screenshots 375/390/768/1280/1920 y ejecutar sitiohoy:visual-audit con SITE_URL.

## Gates

- npm run sitiohoy:qa
- npm run sitiohoy:qa-report

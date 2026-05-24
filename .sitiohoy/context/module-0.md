# Module 0 - Scaffold, base tecnica e identidad visual

## Objetivo

Scaffold, base tecnica e identidad visual para Vinos & Cia, plan emprendimiento.

## Contexto minimo

- `sitiohoy.config.json`
- `brief.md`
- `.sitiohoy/context/project-context.md`
- `.sitiohoy/context/module-0.md`


## Leer solo si hace falta

- sitio-hoy-scaffold
- sitio-hoy-database
- core/04-design-system.md si falta criterio visual

## Construir

- base Next/Supabase
- sitiohoy.config.json validado
- migracion inicial
- tokens css
- DESIGN.md

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

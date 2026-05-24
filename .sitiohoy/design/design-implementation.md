# Instrucciones de Implementación de Diseño

## Flujo de trabajo
1. Leer `.sitiohoy/design/DESIGN.md` como dirección creativa
2. Generar design tokens en `styles/tokens.css`
3. Implementar componentes directamente en código (TSX + Tailwind + tokens CSS)
4. Libertad creativa total: diseños únicos, modernos y hermosos

## Mapeo DESIGN.md → Code
| Especificación DESIGN.md | CSS/Tailwind Equivalent |
|---|---|
| color primario | bg-[color] / background-color |
| color texto | text-[color] / color |
| tipografía | text-[size] / font-size |
| espaciado | p-[n] / padding |
| gap | gap-[n] / gap |
| radios | rounded-[n] / border-radius |
| opacidad | opacity-[n] / opacity |

## Reglas de Diseño
- Colores coherentes con la dirección creativa del DESIGN.md
- Tipografía: font-family, weight y size según la personalidad del negocio
- Espaciado: respetar el sistema de spacing definido
- Si el diseño usa 8px grid, implementar con múltiplos de 8
- Libertad creativa para mejorar o complementar lo especificado

## Verificación
Después de implementar cada página:
1. Comparar con la dirección creativa del DESIGN.md
2. Screenshot del sitio implementado en múltiples viewports
3. Ajustar hasta lograr coherencia visual

## Recuerda
- El DESIGN.md (`.sitiohoy/design/DESIGN.md`) contiene la dirección creativa
- El modelo AI genera diseños directamente en código
- Cada sitio debe tener personalidad única — no copiar templates genéricos

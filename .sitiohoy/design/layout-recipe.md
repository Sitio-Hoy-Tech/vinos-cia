# Layout Recipe - Vinos & Cia

## Mobile first

- Base 375px.
- Touch targets minimo 44px.
- Header compacto y CTA visible.
- Evitar overflow horizontal.
- Ningun texto debe cortarse, pisarse o salirse del contenedor.
- Las cards no deben cambiar de tamaño al hacer hover ni por labels largos.
- El primer viewport debe mostrar marca/producto/rubro y dejar insinuada la siguiente seccion.

## Viewports obligatorios

- 375x812: mobile chico real; prioridad máxima si el brief dice mobile.
- 390x844: iPhone común; revisar header, hero, cards y CTA.
- 768x1024: tablet; evitar layouts desktop apretados.
- 1280x900: desktop estándar; revisar densidad y composición.
- 1920x1080: wide; evitar contenido perdido en el centro o hero demasiado alto.

## Criterio de aceptación visual

- Ejecutar `SITE_URL=http://localhost:3000 npm run sitiohoy:visual-audit`.
- Revisar manualmente screenshots en `.sitiohoy/qa/visual/`.
- Arreglar errores antes de cerrar: overflow horizontal, imágenes rotas, tap targets chicos, textos cortados, console errors.
- Si el diseño se ve genérico, volver a `.sitiohoy/design/inspiration-board.md` y rehacer composición/tokens.

## Hero recomendado

Hero editorial tipografico con color solido y composicion fuerte, sin stock generico.

## Catalogo recomendado

Grid 2 columnas mobile, 3/4 desktop, cards con precio, stock y agregar al carrito.

## Categorias iniciales

Definir desde catalogo.

## Componentes esperados

- Header
- Footer
- CTA principal
- ProductCard
- Empty state
- Loading skeleton
- Error state
- Cart drawer
- Checkout steps
- Payment state

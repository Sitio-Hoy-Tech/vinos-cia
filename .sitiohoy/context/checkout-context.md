# Checkout Context - Vinos & Cia

## Integraciones

- MercadoPago: activo
- Envia.com: inactivo
- Envios fijos: activo
- Resend: activo

## Reglas criticas

- Recalcular subtotal, envio, descuentos y total en server.
- No confiar en precios del carrito cliente.
- Crear pedidos con `tenant_id`.
- Webhook MercadoPago debe filtrar por `id` y `tenant_id`.
- Registrar payload en `payment_events`.
- Tracking de pedido por Server Action/RPC con `tracking_token`.
- Idempotency key estable por pedido/intento, nunca `Date.now()`.

## Leer solo si hace falta

- `integraciones/mercadopago.md`
- `integraciones/envios-fijos.md`
- `integraciones/resend.md`

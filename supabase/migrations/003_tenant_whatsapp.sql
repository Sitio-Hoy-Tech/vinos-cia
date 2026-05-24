-- Agrega campo whatsapp a tenants para centralizar el número de contacto
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS whatsapp text;

-- Seed para Vinos & Cia
UPDATE public.tenants
SET whatsapp = '+543329808080'
WHERE id = '4737ee3f-707b-42bb-adec-7aa9d5ddb173';

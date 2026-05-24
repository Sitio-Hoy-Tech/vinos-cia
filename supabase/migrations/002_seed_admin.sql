-- ============================================================
-- SEED INICIAL — tenant + usuario admin
-- Ejecutar DESPUÉS de crear el usuario en Supabase Auth.
-- Email y password están en credentials.local.json (gitignoreado).
-- ============================================================

DO $$
DECLARE
  v_tenant_id uuid;
  v_user_id   uuid;
BEGIN
  -- 1. Crear tenant si no existe (usando el UUID fijo del sitiohoy.config.json)
  INSERT INTO public.tenants (id, name, slug, plan, status, max_products, url, revalidation_secret, contact_email)
  VALUES (
    '4737ee3f-707b-42bb-adec-7aa9d5ddb173'::uuid,
    'Vinos & Cia',
    'vinos-cia',
    'emprendimiento',
    'active',
    200,
    NULLIF('', ''),
    '03d70e7dc151cd41050b5efcd0ce9ecbffebc4f5b43653dc09b439c458a4f785',
    'contacto@vinosycia.com.ar'
  )
  ON CONFLICT (slug) DO UPDATE SET
    url = COALESCE(EXCLUDED.url, public.tenants.url),
    revalidation_secret = COALESCE(public.tenants.revalidation_secret, EXCLUDED.revalidation_secret),
    contact_email = COALESCE(EXCLUDED.contact_email, public.tenants.contact_email);

  SELECT id INTO v_tenant_id FROM public.tenants WHERE slug = 'vinos-cia';

  -- 2. Buscar usuario admin en auth.users por email
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'adminvinos-cia@sitiohoy.com.ar' LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'Usuario % no encontrado en auth.users. Crealo en Supabase Auth primero.', 'adminvinos-cia@sitiohoy.com.ar';
    RETURN;
  END IF;

  -- 3. Asociar usuario al tenant como owner
  INSERT INTO public.user_tenants (user_id, tenant_id, role)
  VALUES (v_user_id, v_tenant_id, 'owner')
  ON CONFLICT (user_id, tenant_id) DO NOTHING;

  -- 4. Inyectar tenant_id en app_metadata del usuario para que get_tenant_id() funcione
  -- COALESCE es necesario: si raw_app_meta_data es NULL (usuario nuevo), el operador ||
  -- devuelve NULL en lugar del objeto esperado.
  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('tenant_id', v_tenant_id)
  WHERE id = v_user_id;

  RAISE NOTICE 'Seed OK — tenant_id: %, user_id: %', v_tenant_id, v_user_id;
END $$;

-- Correo Argentino:
-- Credenciales de plataforma: cargar correo_argentino_user/password en public.platform_config con service role.
-- Customer ID del negocio: cargar tenants.correo_argentino_customer_id desde el panel admin.
-- Datos origin_* obligatorios en public.tenants para cotizar envíos.

import { unstable_cache } from 'next/cache'
import { TAGS } from '@/lib/cache-tags'
import { env } from '@/lib/config/env'
import { createServiceClient } from './server'

const isDev = process.env.NODE_ENV === 'development'

async function fetchTenantConfig() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('tenants')
    .select(`
      id, name, slug, plan, status, url, revalidation_secret,
      mp_access_token, mp_public_key,
      resend_api_key, contact_email, whatsapp, envia_access_token,
      correo_argentino_customer_id,
      umami_url, umami_website_id,
      origin_name, origin_phone, origin_address,
      origin_city, origin_state, origin_postal_code
    `)
    .eq('id', env.NEXT_PUBLIC_TENANT_ID)
    .single()

  if (error || !data) throw new Error('Tenant no encontrado')
  return data
}

const cachedFetchTenantConfig = unstable_cache(
  fetchTenantConfig,
  ['tenant-config'],
  { tags: [TAGS.TENANT] },
)

export const getTenantConfig = isDev ? fetchTenantConfig : cachedFetchTenantConfig

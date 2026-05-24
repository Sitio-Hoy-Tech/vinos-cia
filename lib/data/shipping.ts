import { createServiceClient } from '@/lib/supabase/server'
import { env } from '@/lib/config/env'

export type ShippingZone = {
  id: string
  name: string
  description: string | null
  price: number
}

export async function getShippingZones(): Promise<ShippingZone[]> {
  const sb = createServiceClient()
  const { data } = await sb
    .from('shipping_zones')
    .select('id, name, description, price')
    .eq('tenant_id', env.NEXT_PUBLIC_TENANT_ID)
    .eq('active', true)
    .order('position')
  return data ?? []
}

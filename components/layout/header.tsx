import { getNavCategories } from '@/lib/data/categories'
import { HeaderClient } from './header-client'

export async function Header() {
  const categories = await getNavCategories()
  return <HeaderClient categories={categories} />
}

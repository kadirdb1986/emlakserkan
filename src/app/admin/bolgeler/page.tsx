import { createClient } from '@/lib/supabase/server'
import RegionsClient from './RegionsClient'

type RegionRow = {
  id: string
  name: string
  type: string
  parent_id: string | null
  show_on_homepage: boolean
  cover_image_url: string | null
  display_order: number
  created_at: string
  parent: { name: string } | null
}

export default async function AdminRegionsPage() {
  const supabase = await createClient()

  const { data: regions } = await supabase
    .from('regions')
    .select('*, parent:regions!parent_id(name)')
    .order('display_order', { ascending: true })

  const rows = (regions ?? []) as unknown as RegionRow[]

  return <RegionsClient regions={rows} />
}

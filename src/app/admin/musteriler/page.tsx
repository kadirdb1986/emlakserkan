import { createClient } from '@/lib/supabase/server'
import CustomerList from './CustomerList'

type CustomerRow = {
  id: string
  full_name: string
  phone: string | null
  email: string | null
  notes: string | null
  listing_id: string | null
  deed_info: string | null
  created_at: string
  listing: { id: string; title: string } | null
}

type ListingOption = {
  id: string
  title: string
}

export default async function AdminCustomersPage() {
  const supabase = await createClient()

  const { data: customers } = await supabase
    .from('customers')
    .select('*, listing:listings(id, title)')
    .order('created_at', { ascending: false })

  const { data: listings } = await supabase
    .from('listings')
    .select('id, title')
    .order('title')

  const rows = (customers ?? []) as unknown as CustomerRow[]
  const listingOptions = (listings ?? []) as ListingOption[]

  return <CustomerList customers={rows} listings={listingOptions} />
}

import { createClient } from '@/lib/supabase/server'
import ListingForm from '@/components/admin/ListingForm'
import { createListing } from '../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function NewListingPage() {
  const supabase = await createClient()

  const { data: regions } = await supabase
    .from('regions')
    .select('*')
    .order('display_order', { ascending: true })

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/ilanlar"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Ilanlara Don
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Yeni Ilan Ekle</h1>
      </div>

      <ListingForm regions={regions ?? []} action={createListing} />
    </div>
  )
}

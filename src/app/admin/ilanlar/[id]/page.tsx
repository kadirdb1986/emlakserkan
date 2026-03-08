import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import ListingForm from '@/components/admin/ListingForm'
import ImageUploader from '@/components/admin/ImageUploader'
import { updateListing } from '../actions'
import type { Listing, ListingImage, Region } from '@/lib/types/database'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditListingPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [listingResult, imagesResult, regionsResult] = await Promise.all([
    supabase.from('listings').select('*').eq('id', id).single(),
    supabase
      .from('listing_images')
      .select('*')
      .eq('listing_id', id)
      .order('display_order', { ascending: true }),
    supabase
      .from('regions')
      .select('*')
      .order('display_order', { ascending: true }),
  ])

  if (!listingResult.data) {
    notFound()
  }

  const listing = listingResult.data as Listing
  const images = (imagesResult.data ?? []) as ListingImage[]
  const regions = (regionsResult.data ?? []) as Region[]

  const updateWithId = updateListing.bind(null, id)

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
        <h1 className="text-2xl font-bold text-gray-900">
          Ilani Duzenle
        </h1>
        <p className="mt-1 text-sm text-gray-500">{listing.title}</p>
      </div>

      <div className="space-y-8">
        <ListingForm
          listing={listing}
          regions={regions}
          action={updateWithId}
        />

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <ImageUploader listingId={id} images={images} />
        </div>
      </div>
    </div>
  )
}

import { SearchX } from 'lucide-react'
import ListingCard from '@/components/ui/ListingCard'
import type { Listing, ListingImage, Region } from '@/lib/types/database'

interface ListingGridProps {
  listings: (Listing & { listing_images: ListingImage[]; region: Region | null })[]
}

export default function ListingGrid({ listings }: ListingGridProps) {
  if (!listings || listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-20 text-center">
        <SearchX className="mb-4 h-12 w-12 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-700">
          İlan bulunamadı
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Arama kriterlerinize uygun ilan bulunmamaktadır. Filtreleri
          değiştirerek tekrar deneyin.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}

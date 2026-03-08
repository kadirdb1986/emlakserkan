import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Maximize } from 'lucide-react'
import type { Listing, ListingImage, Region } from '@/lib/types/database'

interface ListingCardProps {
  listing: Listing & {
    listing_images: ListingImage[]
    region: Region | null
  }
}

const typeLabels: Record<string, string> = {
  arsa: 'Arsa',
  ev: 'Ev',
  villa: 'Villa',
  tarla: 'Tarla',
  diger: 'Diğer',
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

function getCoverImage(images: ListingImage[]): string | null {
  if (!images || images.length === 0) return null
  const cover = images.find((img) => img.is_cover)
  return cover ? cover.image_url : images[0].image_url
}

export default function ListingCard({ listing }: ListingCardProps) {
  const coverImage = getCoverImage(listing.listing_images)
  const typeLabel = typeLabels[listing.type] || listing.type

  return (
    <Link
      href={`/ilan/${listing.id}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-primary-50">
            <div className="text-center text-primary-300">
              <Maximize className="mx-auto h-10 w-10" />
              <span className="mt-1 block text-xs">Görsel yok</span>
            </div>
          </div>
        )}

        {/* Type badge */}
        <span className="absolute top-3 left-3 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
          {typeLabel}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="line-clamp-1 text-lg font-semibold text-gray-900 group-hover:text-primary-700">
          {listing.title}
        </h3>

        {listing.region && (
          <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-3.5 w-3.5" />
            {listing.region.name}
          </p>
        )}

        <div className="mt-3 flex items-end justify-between">
          <div>
            {listing.show_price && listing.price ? (
              <p className="text-lg font-bold text-primary-700">
                {formatPrice(listing.price)}
              </p>
            ) : (
              <p className="text-sm font-medium text-gray-500">
                Fiyat için arayın
              </p>
            )}
          </div>

          {listing.area_sqm && (
            <p className="text-sm text-gray-500">
              {listing.area_sqm.toLocaleString('tr-TR')} m²
            </p>
          )}
        </div>

        <div className="mt-3 border-t border-gray-100 pt-3">
          <span className="text-sm font-medium text-primary-600 transition-colors group-hover:text-primary-700">
            Detay &rarr;
          </span>
        </div>
      </div>
    </Link>
  )
}

import {
  Ruler,
  FileText,
  ScrollText,
  Map,
  MapPin,
} from 'lucide-react'
import type { Listing, Region } from '@/lib/types/database'

interface ListingInfoProps {
  listing: Listing & { region: Region | null }
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

export default function ListingInfo({ listing }: ListingInfoProps) {
  const typeLabel = typeLabels[listing.type] || listing.type

  const infoItems: { icon: React.ReactNode; label: string; value: string }[] = []

  if (listing.area_sqm) {
    infoItems.push({
      icon: <Ruler className="h-5 w-5" />,
      label: 'Alan',
      value: `${listing.area_sqm.toLocaleString('tr-TR')} m²`,
    })
  }

  if (listing.zoning_status) {
    infoItems.push({
      icon: <FileText className="h-5 w-5" />,
      label: 'İmar Durumu',
      value: listing.zoning_status,
    })
  }

  if (listing.deed_type) {
    infoItems.push({
      icon: <ScrollText className="h-5 w-5" />,
      label: 'Tapu Türü',
      value: listing.deed_type,
    })
  }

  if (listing.parcel_info) {
    infoItems.push({
      icon: <Map className="h-5 w-5" />,
      label: 'Ada/Parsel',
      value: listing.parcel_info,
    })
  }

  if (listing.region) {
    infoItems.push({
      icon: <MapPin className="h-5 w-5" />,
      label: 'Konum',
      value: listing.region.name,
    })
  }

  return (
    <div className="space-y-6">
      {/* Type badge */}
      <span className="inline-block rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
        {typeLabel}
      </span>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        {listing.title}
      </h1>

      {/* Price */}
      <div>
        {listing.show_price && listing.price ? (
          <p className="text-2xl font-bold text-primary-700 sm:text-3xl">
            {formatPrice(listing.price)}
          </p>
        ) : (
          <p className="text-lg font-medium text-gray-500">
            Fiyat için arayın
          </p>
        )}
      </div>

      {/* Info grid */}
      {infoItems.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {infoItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-xl bg-gray-50 p-4"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                {item.icon}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address */}
      {listing.address && (
        <div className="rounded-xl border border-gray-100 p-4">
          <p className="mb-1 text-xs font-medium text-gray-500">Adres</p>
          <p className="text-sm text-gray-700">{listing.address}</p>
        </div>
      )}

      {/* Description */}
      {listing.description && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Açıklama
          </h2>
          <div className="prose prose-sm max-w-none text-gray-600">
            <p className="whitespace-pre-line">{listing.description}</p>
          </div>
        </div>
      )}
    </div>
  )
}

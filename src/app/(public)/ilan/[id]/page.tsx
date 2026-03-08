import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import ImageGallery from '@/components/listing-detail/ImageGallery'
import ListingInfo from '@/components/listing-detail/ListingInfo'
import MapEmbed from '@/components/listing-detail/MapEmbed'
import InstagramEmbed from '@/components/listing-detail/InstagramEmbed'
import type { Listing, ListingImage, Region } from '@/lib/types/database'

type ListingWithRelations = Listing & {
  listing_images: ListingImage[]
  region: Region | null
}

interface Props {
  params: Promise<{ id: string }>
}

async function getListing(id: string): Promise<ListingWithRelations | null> {
  const supabase = await createClient()
  const { data: listing } = await supabase
    .from('listings')
    .select('*, listing_images(*), region:regions(*)')
    .eq('id', id)
    .single()

  return listing as ListingWithRelations | null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const listing = await getListing(id)

  if (!listing) {
    return { title: 'İlan Bulunamadı' }
  }

  const title = listing.title
  const description =
    listing.description?.slice(0, 160) ||
    `${listing.title} - Emlak Serkan ile gayrimenkul ilanı detayları.`

  return {
    title,
    description,
    openGraph: {
      title: `${listing.title} | Emlak Serkan`,
      description,
      type: 'article',
      ...(listing.listing_images.length > 0 && {
        images: [
          {
            url:
              listing.listing_images.find((img) => img.is_cover)?.image_url ||
              listing.listing_images[0].image_url,
          },
        ],
      }),
    },
  }
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params
  const listing = await getListing(id)

  if (!listing) {
    notFound()
  }

  const hasSidebar =
    listing.latitude ||
    listing.longitude ||
    listing.instagram_video_url

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Image Gallery - full width */}
      <ImageGallery images={listing.listing_images} />

      {/* Content area */}
      <div
        className={`mt-8 ${
          hasSidebar
            ? 'grid grid-cols-1 gap-8 lg:grid-cols-3'
            : ''
        }`}
      >
        {/* Left column: Listing info */}
        <div className={hasSidebar ? 'lg:col-span-2' : ''}>
          <ListingInfo listing={listing} />
        </div>

        {/* Right column: Sidebar */}
        {hasSidebar && (
          <div className="space-y-6">
            <MapEmbed
              latitude={listing.latitude}
              longitude={listing.longitude}
            />

            <InstagramEmbed url={listing.instagram_video_url} />

            {/* CTA Button */}
            <a
              href="tel:+905397736255"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-primary-700"
            >
              <Phone className="h-5 w-5" />
              Hemen Ara
            </a>
          </div>
        )}
      </div>

      {/* CTA button also shown when no sidebar exists */}
      {!hasSidebar && (
        <div className="mt-8">
          <a
            href="tel:+905397736255"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-primary-700"
          >
            <Phone className="h-5 w-5" />
            Hemen Ara
          </a>
        </div>
      )}
    </section>
  )
}

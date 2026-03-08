import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import ListingGrid from '@/components/listings/ListingGrid'
import type { Listing, ListingImage, Region } from '@/lib/types/database'

type ListingWithRelations = Listing & {
  listing_images: ListingImage[]
  region: Region | null
}

interface Props {
  params: Promise<{ id: string }>
}

const regionTypeLabels: Record<string, string> = {
  il: 'İl',
  ilce: 'İlçe',
  mahalle: 'Mahalle',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: region } = await supabase
    .from('regions')
    .select('name, type')
    .eq('id', id)
    .single()

  if (!region) {
    return { title: 'Bölge Bulunamadı' }
  }

  return {
    title: `${region.name} Satılık Emlak | Emlak Serkan`,
    description: `${region.name} bölgesinde satılık arsa, ev, villa ve tarla ilanları.`,
  }
}

export default async function RegionPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch region
  const { data: region } = await supabase
    .from('regions')
    .select('*')
    .eq('id', id)
    .single()

  if (!region) {
    notFound()
  }

  // Fetch listings in this region
  const { data: listings } = await supabase
    .from('listings')
    .select('*, listing_images(*), region:regions(*)')
    .eq('region_id', id)
    .eq('is_active', true)
    .eq('is_sold', false)
    .order('created_at', { ascending: false })

  const typedListings = (listings as ListingWithRelations[]) ?? []
  const typeLabel = regionTypeLabels[region.type] || region.type

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb / Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Ana Sayfa
      </Link>

      {/* Region heading */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {region.name}
          </h1>
          <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
            {typeLabel}
          </span>
        </div>
        <p className="mt-2 text-gray-600">
          {typedListings.length} ilan bulundu
        </p>
      </div>

      {/* Listings grid */}
      <ListingGrid listings={typedListings} />
    </section>
  )
}

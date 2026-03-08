import type { Metadata } from 'next'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import ListingFilters from '@/components/listings/ListingFilters'
import ListingGrid from '@/components/listings/ListingGrid'
import type { Listing, ListingImage, Region } from '@/lib/types/database'

export const metadata: Metadata = {
  title: 'İlanlar',
  description:
    'Arsa, ev, villa ve tarla ilanlarını inceleyin. Çatalca, Silivri, Kocaeli, Tekirdağ bölgelerinde satılık mülkler.',
}

type ListingWithRelations = Listing & {
  listing_images: ListingImage[]
  region: Region | null
}

interface PageProps {
  searchParams: Promise<{
    type?: string
    region?: string
    minPrice?: string
    maxPrice?: string
  }>
}

export default async function ListingsPage({ searchParams }: PageProps) {
  const { type, region, minPrice, maxPrice } = await searchParams

  const supabase = await createClient()

  // Fetch regions for filter dropdown
  const { data: regions } = await supabase
    .from('regions')
    .select('id, name')
    .order('display_order', { ascending: true })

  // Build filtered listings query
  let query = supabase
    .from('listings')
    .select('*, listing_images(*), region:regions(*)')
    .eq('is_active', true)
    .eq('is_sold', false)
    .order('created_at', { ascending: false })

  if (type) query = query.eq('type', type)
  if (region) query = query.eq('region_id', region)
  if (minPrice) query = query.gte('price', Number(minPrice))
  if (maxPrice) query = query.lte('price', Number(maxPrice))

  const { data: listings } = await query

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">İlanlar</h1>

      <Suspense fallback={null}>
        <ListingFilters regions={regions ?? []} />
      </Suspense>

      <div className="mt-8">
        <ListingGrid listings={(listings as ListingWithRelations[]) ?? []} />
      </div>
    </section>
  )
}

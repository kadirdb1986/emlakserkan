import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import ListingCard from '@/components/ui/ListingCard'

export default async function FeaturedListings() {
  const supabase = await createClient()

  const { data: listings } = await supabase
    .from('listings')
    .select('*, listing_images(*), region:regions(*)')
    .eq('is_active', true)
    .eq('is_sold', false)
    .order('created_at', { ascending: false })
    .limit(6)

  if (!listings || listings.length === 0) {
    return (
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
            Öne Çıkan İlanlar
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-gray-500">
            Henüz aktif ilan bulunmamaktadır. Yeni ilanlar eklendiğinde burada görüntülenecektir.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Öne Çıkan İlanlar
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            En yeni ve seçkin gayrimenkul ilanlarımızı keşfedin.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/ilanlar"
            className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-700"
          >
            Tüm İlanları Gör
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

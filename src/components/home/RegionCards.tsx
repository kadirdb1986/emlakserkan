import { createClient } from '@/lib/supabase/server'
import RegionCard from '@/components/ui/RegionCard'

export default async function RegionCards() {
  const supabase = await createClient()

  const { data: regions } = await supabase
    .from('regions')
    .select('*')
    .eq('show_on_homepage', true)
    .order('display_order', { ascending: true })

  if (!regions || regions.length === 0) {
    return null
  }

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Bölgelerimiz
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Hizmet verdiğimiz bölgeleri keşfedin.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((region) => (
            <RegionCard key={region.id} region={region} />
          ))}
        </div>
      </div>
    </section>
  )
}

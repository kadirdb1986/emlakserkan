import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import HeroSection from '@/components/home/HeroSection'
import FeaturedListings from '@/components/home/FeaturedListings'
import RegionCards from '@/components/home/RegionCards'

export const metadata: Metadata = {
  title: 'Emlak Serkan | Arsa, Ev, Villa Satış',
  description:
    'Çatalca, Silivri, Kocaeli, Tekirdağ ve çevresinde arsa, ev, villa ve tarla satışı. Güvenilir emlak danışmanlığı.',
}

export default async function Home() {
  const supabase = await createClient()

  // Fetch regions for the hero search bar
  const { data: regions } = await supabase
    .from('regions')
    .select('id, name')
    .order('display_order', { ascending: true })

  return (
    <>
      <HeroSection regions={regions ?? []} />
      <FeaturedListings />
      <RegionCards />
    </>
  )
}

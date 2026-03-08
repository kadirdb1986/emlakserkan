'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, TreePine, Leaf } from 'lucide-react'

const listingTypes = [
  { value: '', label: 'Tüm Türler' },
  { value: 'arsa', label: 'Arsa' },
  { value: 'ev', label: 'Ev' },
  { value: 'villa', label: 'Villa' },
  { value: 'tarla', label: 'Tarla' },
  { value: 'diger', label: 'Diğer' },
]

interface HeroRegion {
  id: string
  name: string
}

export default function HeroSection({ regions }: { regions: HeroRegion[] }) {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')

  function handleSearch() {
    const params = new URLSearchParams()
    if (selectedType) params.set('tur', selectedType)
    if (selectedRegion) params.set('bolge', selectedRegion)
    router.push(`/ilanlar${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-900 to-primary-950">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <TreePine className="absolute top-10 left-10 h-24 w-24 text-primary-700/20" />
        <Leaf className="absolute top-20 right-16 h-16 w-16 rotate-45 text-primary-700/15" />
        <TreePine className="absolute right-40 bottom-10 h-20 w-20 text-primary-700/10" />
        <Leaf className="absolute bottom-20 left-32 h-12 w-12 -rotate-12 text-primary-700/15" />
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary-700/10" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary-700/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Hayalinizdeki Mülkü Bulun
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100 sm:text-xl">
            Arsa, ev, villa ve tarla satışında güvenilir adresiniz.
            Çatalca, Silivri, Kocaeli ve Tekirdağ bölgesinde uzman emlak danışmanlığı.
          </p>

          {/* Search bar */}
          <div className="mx-auto mt-10 max-w-3xl">
            <div className="flex flex-col gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:rounded-full sm:p-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="flex-1 rounded-xl border-0 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm outline-none sm:rounded-full"
              >
                {listingTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="flex-1 rounded-xl border-0 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm outline-none sm:rounded-full"
              >
                <option value="">Tüm Bölgeler</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleSearch}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-primary-400 sm:rounded-full"
              >
                <Search className="h-4 w-4" />
                Ara
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

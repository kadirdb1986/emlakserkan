'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Search, X } from 'lucide-react'
import type { Region } from '@/lib/types/database'

const listingTypes = [
  { value: '', label: 'Tümü' },
  { value: 'arsa', label: 'Arsa' },
  { value: 'ev', label: 'Ev' },
  { value: 'villa', label: 'Villa' },
  { value: 'tarla', label: 'Tarla' },
  { value: 'diger', label: 'Diğer' },
]

interface ListingFiltersProps {
  regions: Pick<Region, 'id' | 'name'>[]
}

export default function ListingFilters({ regions }: ListingFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [type, setType] = useState(searchParams.get('type') ?? '')
  const [region, setRegion] = useState(searchParams.get('region') ?? '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '')

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    if (type) params.set('type', type)
    if (region) params.set('region', region)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)

    const qs = params.toString()
    router.push(qs ? `/ilanlar?${qs}` : '/ilanlar')
  }, [type, region, minPrice, maxPrice, router])

  const resetFilters = useCallback(() => {
    setType('')
    setRegion('')
    setMinPrice('')
    setMaxPrice('')
    router.push('/ilanlar')
  }, [router])

  const hasFilters = type || region || minPrice || maxPrice

  return (
    <div className="rounded-2xl border border-primary-100 bg-white p-4 shadow-sm sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Type filter */}
        <div>
          <label
            htmlFor="type-filter"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Emlak Tipi
          </label>
          <select
            id="type-filter"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
          >
            {listingTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Region filter */}
        <div>
          <label
            htmlFor="region-filter"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Bölge
          </label>
          <select
            id="region-filter"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
          >
            <option value="">Tüm Bölgeler</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* Min price */}
        <div>
          <label
            htmlFor="min-price"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Min Fiyat (₺)
          </label>
          <input
            id="min-price"
            type="number"
            min="0"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
          />
        </div>

        {/* Max price */}
        <div>
          <label
            htmlFor="max-price"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Max Fiyat (₺)
          </label>
          <input
            id="max-price"
            type="number"
            min="0"
            placeholder="Limitsiz"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={applyFilters}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:ring-2 focus:ring-primary-300 focus:outline-none"
        >
          <Search className="h-4 w-4" />
          Filtrele
        </button>

        {hasFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-primary-200 focus:outline-none"
          >
            <X className="h-4 w-4" />
            Temizle
          </button>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Save, Loader2 } from 'lucide-react'
import type { Listing, Region } from '@/lib/types/database'
import MapPicker from './MapPicker'

interface ListingFormProps {
  listing?: Listing
  regions: Region[]
  action: (formData: FormData) => Promise<void>
}

const listingTypes = [
  { value: 'arsa', label: 'Arsa' },
  { value: 'ev', label: 'Ev' },
  { value: 'villa', label: 'Villa' },
  { value: 'tarla', label: 'Tarla' },
  { value: 'diger', label: 'Diger' },
]

export default function ListingForm({
  listing,
  regions,
  action,
}: ListingFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [latitude, setLatitude] = useState<number | null>(
    listing?.latitude ?? null
  )
  const [longitude, setLongitude] = useState<number | null>(
    listing?.longitude ?? null
  )

  async function handleSubmit(formData: FormData) {
    setSubmitting(true)
    try {
      // Set lat/lng from state since MapPicker manages them
      if (latitude !== null) {
        formData.set('latitude', String(latitude))
      } else {
        formData.delete('latitude')
      }
      if (longitude !== null) {
        formData.set('longitude', String(longitude))
      } else {
        formData.delete('longitude')
      }
      await action(formData)
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : 'Bir hata olustu. Lutfen tekrar deneyin.'
      )
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Temel Bilgiler
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="title" className={labelClass}>
              Baslik <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={listing?.title ?? ''}
              className={inputClass}
              placeholder="Ilan basligini girin"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className={labelClass}>
              Aciklama
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={listing?.description ?? ''}
              className={inputClass}
              placeholder="Ilan aciklamasini girin"
            />
          </div>

          <div>
            <label htmlFor="type" className={labelClass}>
              Tur <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              name="type"
              required
              defaultValue={listing?.type ?? 'arsa'}
              className={inputClass}
            >
              {listingTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="region_id" className={labelClass}>
              Bolge
            </label>
            <select
              id="region_id"
              name="region_id"
              defaultValue={listing?.region_id ?? ''}
              className={inputClass}
            >
              <option value="">Bolge secin</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Price & Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Fiyat ve Detaylar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className={labelClass}>
              Fiyat (TL)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min={0}
              step="1"
              defaultValue={listing?.price ?? ''}
              className={inputClass}
              placeholder="0"
            />
          </div>

          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="hidden"
                name="show_price"
                value="false"
              />
              <input
                type="checkbox"
                name="show_price"
                value="true"
                defaultChecked={listing?.show_price ?? true}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                onChange={(e) => {
                  const hidden = e.target
                    .previousElementSibling as HTMLInputElement
                  hidden.disabled = e.target.checked
                }}
              />
              <span className="text-sm text-gray-700">
                Fiyati Goster
              </span>
            </label>
          </div>

          <div>
            <label htmlFor="area_sqm" className={labelClass}>
              Alan (m²)
            </label>
            <input
              type="number"
              id="area_sqm"
              name="area_sqm"
              min={0}
              step="1"
              defaultValue={listing?.area_sqm ?? ''}
              className={inputClass}
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="zoning_status" className={labelClass}>
              Imar Durumu
            </label>
            <input
              type="text"
              id="zoning_status"
              name="zoning_status"
              defaultValue={listing?.zoning_status ?? ''}
              className={inputClass}
              placeholder="Ornek: Konut Imari"
            />
          </div>

          <div>
            <label htmlFor="deed_type" className={labelClass}>
              Tapu Turu
            </label>
            <input
              type="text"
              id="deed_type"
              name="deed_type"
              defaultValue={listing?.deed_type ?? ''}
              className={inputClass}
              placeholder="Ornek: Hisseli, Muller"
            />
          </div>

          <div>
            <label htmlFor="parcel_info" className={labelClass}>
              Ada/Parsel
            </label>
            <input
              type="text"
              id="parcel_info"
              name="parcel_info"
              defaultValue={listing?.parcel_info ?? ''}
              className={inputClass}
              placeholder="Ornek: 123/45"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Konum Bilgileri
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="address" className={labelClass}>
              Adres
            </label>
            <input
              type="text"
              id="address"
              name="address"
              defaultValue={listing?.address ?? ''}
              className={inputClass}
              placeholder="Tam adresi girin"
            />
          </div>

          <MapPicker
            latitude={latitude}
            longitude={longitude}
            onChange={(lat, lng) => {
              setLatitude(lat)
              setLongitude(lng)
            }}
          />
        </div>
      </div>

      {/* Media */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Medya
        </h2>
        <div>
          <label htmlFor="instagram_video_url" className={labelClass}>
            Instagram Video URL
          </label>
          <input
            type="url"
            id="instagram_video_url"
            name="instagram_video_url"
            defaultValue={listing?.instagram_video_url ?? ''}
            className={inputClass}
            placeholder="https://www.instagram.com/reel/..."
          />
        </div>
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Durum
        </h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="hidden"
              name="is_active"
              value="false"
            />
            <input
              type="checkbox"
              name="is_active"
              value="true"
              defaultChecked={listing?.is_active ?? true}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              onChange={(e) => {
                const hidden = e.target
                  .previousElementSibling as HTMLInputElement
                hidden.disabled = e.target.checked
              }}
            />
            <span className="text-sm text-gray-700">Aktif</span>
          </label>

          {listing && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="hidden"
                name="is_sold"
                value="false"
              />
              <input
                type="checkbox"
                name="is_sold"
                value="true"
                defaultChecked={listing.is_sold}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                onChange={(e) => {
                  const hidden = e.target
                    .previousElementSibling as HTMLInputElement
                  hidden.disabled = e.target.checked
                }}
              />
              <span className="text-sm text-gray-700">Satildi</span>
            </label>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {listing ? 'Guncelle' : 'Olustur'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}

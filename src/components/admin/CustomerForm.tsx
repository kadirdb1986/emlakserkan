'use client'

import { useState } from 'react'
import { Save, Loader2, X } from 'lucide-react'
import type { Customer, Listing } from '@/lib/types/database'

interface CustomerFormProps {
  customer?: Customer
  listings: Pick<Listing, 'id' | 'title'>[]
  onSubmit: (formData: FormData) => Promise<void>
  onCancel: () => void
}

export default function CustomerForm({
  customer,
  listings,
  onSubmit,
  onCancel,
}: CustomerFormProps) {
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setSubmitting(true)
    try {
      await onSubmit(formData)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {customer ? 'Musteri Duzenle' : 'Yeni Musteri'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form action={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="full_name" className={labelClass}>
              Ad Soyad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              required
              defaultValue={customer?.full_name ?? ''}
              className={inputClass}
              placeholder="Ad soyad girin"
            />
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>
              Telefon
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              defaultValue={customer?.phone ?? ''}
              className={inputClass}
              placeholder="0555 555 55 55"
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              E-posta
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={customer?.email ?? ''}
              className={inputClass}
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label htmlFor="listing_id" className={labelClass}>
              Bagli Ilan
            </label>
            <select
              id="listing_id"
              name="listing_id"
              defaultValue={customer?.listing_id ?? ''}
              className={inputClass}
            >
              <option value="">Ilan secin (opsiyonel)</option>
              {listings.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="notes" className={labelClass}>
              Notlar
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              defaultValue={customer?.notes ?? ''}
              className={inputClass}
              placeholder="Musteri hakkinda notlar"
            />
          </div>

          <div>
            <label htmlFor="deed_info" className={labelClass}>
              Tapu Kayit Bilgileri
            </label>
            <textarea
              id="deed_info"
              name="deed_info"
              rows={3}
              defaultValue={customer?.deed_info ?? ''}
              className={inputClass}
              placeholder="Tapu kayit bilgilerini girin"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              Iptal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {customer ? 'Guncelle' : 'Olustur'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

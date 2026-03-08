'use client'

import { useState } from 'react'
import { Save, Loader2, X } from 'lucide-react'
import type { Prospect, Region } from '@/lib/types/database'

interface ProspectFormProps {
  prospect?: Prospect
  regions: Region[]
  onSubmit: (formData: FormData) => Promise<void>
  onCancel: () => void
}

const desiredTypes = [
  { value: 'arsa', label: 'Arsa' },
  { value: 'ev', label: 'Ev' },
  { value: 'villa', label: 'Villa' },
  { value: 'tarla', label: 'Tarla' },
  { value: 'diger', label: 'Diger' },
]

export default function ProspectForm({
  prospect,
  regions,
  onSubmit,
  onCancel,
}: ProspectFormProps) {
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {prospect ? 'Kaydi Duzenle' : 'Yeni Kayit'}
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
              defaultValue={prospect?.full_name ?? ''}
              className={inputClass}
              placeholder="Ad Soyad"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className={labelClass}>
                Telefon
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                defaultValue={prospect?.phone ?? ''}
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
                defaultValue={prospect?.email ?? ''}
                className={inputClass}
                placeholder="ornek@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="budget_min" className={labelClass}>
                Minimum Butce (TL)
              </label>
              <input
                type="number"
                id="budget_min"
                name="budget_min"
                min={0}
                step="1"
                defaultValue={prospect?.budget_min ?? ''}
                className={inputClass}
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="budget_max" className={labelClass}>
                Maximum Butce (TL)
              </label>
              <input
                type="number"
                id="budget_max"
                name="budget_max"
                min={0}
                step="1"
                defaultValue={prospect?.budget_max ?? ''}
                className={inputClass}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="desired_type" className={labelClass}>
                Ne Ariyor
              </label>
              <select
                id="desired_type"
                name="desired_type"
                defaultValue={prospect?.desired_type ?? ''}
                className={inputClass}
              >
                <option value="">Secin</option>
                {desiredTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="desired_region_id" className={labelClass}>
                Hangi Bolgede Ariyor
              </label>
              <select
                id="desired_region_id"
                name="desired_region_id"
                defaultValue={prospect?.desired_region_id ?? ''}
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

          <div>
            <label htmlFor="notes" className={labelClass}>
              Notlar
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              defaultValue={prospect?.notes ?? ''}
              className={inputClass}
              placeholder="Ek notlar..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
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
                  {prospect ? 'Guncelle' : 'Kaydet'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

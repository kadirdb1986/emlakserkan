'use client'

import { useState } from 'react'
import { Save, Loader2, X } from 'lucide-react'
import type { Region } from '@/lib/types/database'

interface RegionFormProps {
  region?: Region
  regions: Region[]
  onSubmit: (formData: FormData) => Promise<void>
  onCancel: () => void
}

const regionTypes = [
  { value: 'il', label: 'Il' },
  { value: 'ilce', label: 'Ilce' },
  { value: 'mahalle', label: 'Mahalle' },
]

export default function RegionForm({
  region,
  regions,
  onSubmit,
  onCancel,
}: RegionFormProps) {
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

  // Exclude the region being edited from potential parents
  const parentOptions = regions.filter((r) => r.id !== region?.id)

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {region ? 'Bolge Duzenle' : 'Yeni Bolge'}
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
            <label htmlFor="name" className={labelClass}>
              Ad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={region?.name ?? ''}
              className={inputClass}
              placeholder="Bolge adini girin"
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
              defaultValue={region?.type ?? 'il'}
              className={inputClass}
            >
              {regionTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="parent_id" className={labelClass}>
              Ust Bolge
            </label>
            <select
              id="parent_id"
              name="parent_id"
              defaultValue={region?.parent_id ?? ''}
              className={inputClass}
            >
              <option value="">Yok (En ust seviye)</option>
              {parentOptions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({typeLabel(r.type)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="hidden"
                name="show_on_homepage"
                value="false"
              />
              <input
                type="checkbox"
                name="show_on_homepage"
                value="true"
                defaultChecked={region?.show_on_homepage ?? false}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                onChange={(e) => {
                  const hidden = e.target
                    .previousElementSibling as HTMLInputElement
                  hidden.disabled = e.target.checked
                }}
              />
              <span className="text-sm text-gray-700">
                Ana Sayfada Goster
              </span>
            </label>
          </div>

          <div>
            <label htmlFor="cover_image_url" className={labelClass}>
              Kapak Gorseli URL
            </label>
            <input
              type="url"
              id="cover_image_url"
              name="cover_image_url"
              defaultValue={region?.cover_image_url ?? ''}
              className={inputClass}
              placeholder="https://..."
            />
          </div>

          <div>
            <label htmlFor="display_order" className={labelClass}>
              Siralama
            </label>
            <input
              type="number"
              id="display_order"
              name="display_order"
              min={0}
              defaultValue={region?.display_order ?? 0}
              className={inputClass}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
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
                  {region ? 'Guncelle' : 'Olustur'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function typeLabel(type: string): string {
  const labels: Record<string, string> = {
    il: 'Il',
    ilce: 'Ilce',
    mahalle: 'Mahalle',
  }
  return labels[type] ?? type
}

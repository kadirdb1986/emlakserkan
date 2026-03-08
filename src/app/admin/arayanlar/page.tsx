'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Prospect, Region } from '@/lib/types/database'
import ProspectForm from '@/components/admin/ProspectForm'
import { createProspect, updateProspect, deleteProspect } from './actions'

type ProspectRow = Prospect & {
  desired_region: { name: string } | null
}

function formatPrice(price: number | null): string {
  if (price === null) return '-'
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

function formatBudget(min: number | null, max: number | null): string {
  if (min === null && max === null) return '-'
  if (min !== null && max !== null)
    return `${formatPrice(min)} - ${formatPrice(max)}`
  if (min !== null) return `${formatPrice(min)} +`
  return `${formatPrice(max)} max`
}

function typeLabel(type: string | null): string {
  if (!type) return '-'
  const labels: Record<string, string> = {
    arsa: 'Arsa',
    ev: 'Ev',
    villa: 'Villa',
    tarla: 'Tarla',
    diger: 'Diger',
  }
  return labels[type] ?? type
}

export default function AdminProspectsPage() {
  const [prospects, setProspects] = useState<ProspectRow[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProspect, setEditingProspect] = useState<Prospect | undefined>(
    undefined
  )

  const loadData = useCallback(async () => {
    const supabase = createClient()

    const [prospectsResult, regionsResult] = await Promise.all([
      supabase
        .from('prospects')
        .select('*, desired_region:regions(name)')
        .order('created_at', { ascending: false }),
      supabase.from('regions').select('id, name').order('name'),
    ])

    setProspects(
      (prospectsResult.data ?? []) as unknown as ProspectRow[]
    )
    setRegions((regionsResult.data ?? []) as unknown as Region[])
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleCreate(formData: FormData) {
    await createProspect(formData)
    setShowForm(false)
    setEditingProspect(undefined)
    await loadData()
  }

  async function handleUpdate(formData: FormData) {
    if (!editingProspect) return
    await updateProspect(editingProspect.id, formData)
    setShowForm(false)
    setEditingProspect(undefined)
    await loadData()
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu kaydi silmek istediginize emin misiniz?')) return
    await deleteProspect(id)
    await loadData()
  }

  function openCreate() {
    setEditingProspect(undefined)
    setShowForm(true)
  }

  function openEdit(prospect: ProspectRow) {
    setEditingProspect(prospect)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingProspect(undefined)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Emlak Arayanlar</h1>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Yeni Kayit
        </button>
      </div>

      {prospects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Henuz kayit bulunmuyor.</p>
          <button
            onClick={openCreate}
            className="mt-4 inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Ilk kaydi olustur
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Ad Soyad
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Telefon
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Ne Ariyor
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Butce
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Bolge
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    Islemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {prospects.map((prospect) => (
                  <tr
                    key={prospect.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {prospect.full_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {prospect.phone ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {typeLabel(prospect.desired_type)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatBudget(prospect.budget_min, prospect.budget_max)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {prospect.desired_region?.name ?? '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(prospect)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-md transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Duzenle
                        </button>
                        <button
                          onClick={() => handleDelete(prospect.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <ProspectForm
          prospect={editingProspect}
          regions={regions}
          onSubmit={editingProspect ? handleUpdate : handleCreate}
          onCancel={closeForm}
        />
      )}
    </div>
  )
}

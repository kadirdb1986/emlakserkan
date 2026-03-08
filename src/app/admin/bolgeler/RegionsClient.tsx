'use client'

import { useState, useTransition } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import RegionForm from '@/components/admin/RegionForm'
import {
  createRegion,
  updateRegion,
  deleteRegion,
  toggleHomepage,
} from './actions'

type RegionRow = {
  id: string
  name: string
  type: string
  parent_id: string | null
  show_on_homepage: boolean
  cover_image_url: string | null
  display_order: number
  created_at: string
  parent: { name: string } | null
}

function typeLabel(type: string): string {
  const labels: Record<string, string> = {
    il: 'Il',
    ilce: 'Ilce',
    mahalle: 'Mahalle',
  }
  return labels[type] ?? type
}

interface RegionsClientProps {
  regions: RegionRow[]
}

export default function RegionsClient({ regions }: RegionsClientProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingRegion, setEditingRegion] = useState<RegionRow | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleCreate() {
    setEditingRegion(null)
    setShowForm(true)
  }

  function handleEdit(region: RegionRow) {
    setEditingRegion(region)
    setShowForm(true)
  }

  function handleCancel() {
    setShowForm(false)
    setEditingRegion(null)
  }

  async function handleSubmit(formData: FormData) {
    if (editingRegion) {
      await updateRegion(editingRegion.id, formData)
    } else {
      await createRegion(formData)
    }
    setShowForm(false)
    setEditingRegion(null)
  }

  function handleDelete(id: string) {
    if (!confirm('Bu bolgeyi silmek istediginize emin misiniz?')) return
    startTransition(async () => {
      await deleteRegion(id)
    })
  }

  function handleToggleHomepage(id: string, currentValue: boolean) {
    startTransition(async () => {
      await toggleHomepage(id, !currentValue)
    })
  }

  // Build hierarchical list: top-level regions first, then children indented
  const topLevel = regions.filter((r) => !r.parent_id)
  const children = regions.filter((r) => r.parent_id)

  const orderedRows: { region: RegionRow; depth: number }[] = []

  function addWithChildren(region: RegionRow, depth: number) {
    orderedRows.push({ region, depth })
    const kids = children.filter((c) => c.parent_id === region.id)
    for (const kid of kids) {
      addWithChildren(kid, depth + 1)
    }
  }

  for (const region of topLevel) {
    addWithChildren(region, 0)
  }

  // Also add orphan children (parent not in current data) at depth 0
  const placedIds = new Set(orderedRows.map((r) => r.region.id))
  for (const region of regions) {
    if (!placedIds.has(region.id)) {
      orderedRows.push({ region, depth: 0 })
    }
  }

  // Map regions for the form (strip parent join for type compatibility)
  const formRegions = regions.map(({ parent, ...rest }) => ({
    ...rest,
    type: rest.type as 'il' | 'ilce' | 'mahalle',
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bolgeler</h1>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Yeni Bolge
        </button>
      </div>

      {orderedRows.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <p className="text-gray-500">Henuz bolge bulunmuyor.</p>
          <button
            onClick={handleCreate}
            className="mt-4 inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Ilk bolgeyi olustur
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Ad
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Tur
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Ust Bolge
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">
                    Ana Sayfa
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">
                    Sira
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    Islemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orderedRows.map(({ region, depth }) => (
                  <tr
                    key={region.id}
                    className={`hover:bg-gray-50 transition-colors ${isPending ? 'opacity-60' : ''}`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <span style={{ paddingLeft: `${depth * 1.5}rem` }}>
                        {depth > 0 && (
                          <span className="text-gray-400 mr-1">--</span>
                        )}
                        {region.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                        {typeLabel(region.type)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {region.parent?.name ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          handleToggleHomepage(
                            region.id,
                            region.show_on_homepage
                          )
                        }
                        disabled={isPending}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          region.show_on_homepage
                            ? 'bg-primary-600'
                            : 'bg-gray-200'
                        }`}
                        role="switch"
                        aria-checked={region.show_on_homepage}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            region.show_on_homepage
                              ? 'translate-x-4'
                              : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {region.display_order}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(region)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-md transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Duzenle
                        </button>
                        <button
                          onClick={() => handleDelete(region.id)}
                          disabled={isPending}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors cursor-pointer disabled:opacity-50"
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
        <RegionForm
          region={
            editingRegion
              ? {
                  ...editingRegion,
                  type: editingRegion.type as 'il' | 'ilce' | 'mahalle',
                }
              : undefined
          }
          regions={formRegions}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}

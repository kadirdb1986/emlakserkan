import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { deleteListing } from './actions'

type ListingRow = {
  id: string
  title: string
  type: string
  price: number | null
  is_active: boolean
  is_sold: boolean
  created_at: string
  region: { name: string } | null
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

function typeLabel(type: string): string {
  const labels: Record<string, string> = {
    arsa: 'Arsa',
    ev: 'Ev',
    villa: 'Villa',
    tarla: 'Tarla',
    diger: 'Diger',
  }
  return labels[type] ?? type
}

function DeleteButton({ id }: { id: string }) {
  const deleteWithId = deleteListing.bind(null, id)

  return (
    <form
      action={deleteWithId}
      onSubmit={(e) => {
        if (!confirm('Bu ilani silmek istediginize emin misiniz?')) {
          e.preventDefault()
        }
      }}
    >
      <button
        type="submit"
        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Sil
      </button>
    </form>
  )
}

export default async function AdminListingsPage() {
  const supabase = await createClient()

  const { data: listings } = await supabase
    .from('listings')
    .select('id, title, type, price, is_active, is_sold, created_at, region:regions(name)')
    .order('created_at', { ascending: false })

  const rows = (listings ?? []) as unknown as ListingRow[]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ilanlar</h1>
        <Link
          href="/admin/ilanlar/yeni"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Ilan
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <p className="text-gray-500">Henuz ilan bulunmuyor.</p>
          <Link
            href="/admin/ilanlar/yeni"
            className="mt-4 inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            <Plus className="w-4 h-4" />
            Ilk ilani olustur
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Baslik
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Tur
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Bolge
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Fiyat
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Durum
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    Islemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((listing) => (
                  <tr
                    key={listing.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">
                      {listing.title}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {typeLabel(listing.type)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {listing.region?.name ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatPrice(listing.price)}
                    </td>
                    <td className="px-4 py-3">
                      {listing.is_sold ? (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          Satildi
                        </span>
                      ) : listing.is_active ? (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                          Pasif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/ilanlar/${listing.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-md transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Duzenle
                        </Link>
                        <DeleteButton id={listing.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

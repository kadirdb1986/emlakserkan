'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Users } from 'lucide-react'
import CustomerForm from '@/components/admin/CustomerForm'
import { createCustomer, updateCustomer, deleteCustomer } from './actions'
import type { Customer } from '@/lib/types/database'

type CustomerRow = {
  id: string
  full_name: string
  phone: string | null
  email: string | null
  notes: string | null
  listing_id: string | null
  deed_info: string | null
  created_at: string
  listing: { id: string; title: string } | null
}

type ListingOption = {
  id: string
  title: string
}

interface CustomerListProps {
  customers: CustomerRow[]
  listings: ListingOption[]
}

export default function CustomerList({
  customers,
  listings,
}: CustomerListProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<CustomerRow | null>(
    null
  )

  async function handleCreate(formData: FormData) {
    await createCustomer(formData)
    setShowForm(false)
  }

  async function handleUpdate(formData: FormData) {
    if (!editingCustomer) return
    await updateCustomer(editingCustomer.id, formData)
    setEditingCustomer(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu musteriyi silmek istediginize emin misiniz?')) return
    await deleteCustomer(id)
  }

  // Convert CustomerRow to Customer type for the form
  function rowToCustomer(row: CustomerRow): Customer {
    return {
      id: row.id,
      full_name: row.full_name,
      phone: row.phone,
      email: row.email,
      notes: row.notes,
      listing_id: row.listing_id,
      deed_info: row.deed_info,
      created_at: row.created_at,
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Musteriler</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Yeni Musteri
        </button>
      </div>

      {customers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Henuz musteri bulunmuyor.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Ilk musteriyi ekle
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
                    E-posta
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Bagli Ilan
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    Islemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {customer.full_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {customer.phone ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {customer.email ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                      {customer.listing?.title ?? '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingCustomer(customer)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-md transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Duzenle
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
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

      {/* Create modal */}
      {showForm && (
        <CustomerForm
          listings={listings}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Edit modal */}
      {editingCustomer && (
        <CustomerForm
          customer={rowToCustomer(editingCustomer)}
          listings={listings}
          onSubmit={handleUpdate}
          onCancel={() => setEditingCustomer(null)}
        />
      )}
    </div>
  )
}

'use client'

import { Trash2 } from 'lucide-react'
import { deleteListing } from './actions'

export function DeleteListingButton({ id }: { id: string }) {
  return (
    <button
      onClick={async () => {
        if (confirm('Bu ilani silmek istediginize emin misiniz?')) {
          await deleteListing(id)
        }
      }}
      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
    >
      <Trash2 className="w-3.5 h-3.5" />
      Sil
    </button>
  )
}

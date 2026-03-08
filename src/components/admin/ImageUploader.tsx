'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, Trash2, Star, Loader2 } from 'lucide-react'
import type { ListingImage } from '@/lib/types/database'
import {
  uploadListingImage,
  deleteListingImage,
  setCoverImage,
} from '@/app/admin/ilanlar/actions'

interface ImageUploaderProps {
  listingId: string
  images: ListingImage[]
}

export default function ImageUploader({
  listingId,
  images,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [settingCoverId, setSettingCoverId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      await uploadListingImage(listingId, formData)
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : 'Resim yuklenirken bir hata olustu.'
      )
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  async function handleDelete(imageId: string) {
    if (!confirm('Bu resmi silmek istediginize emin misiniz?')) return

    setDeletingId(imageId)
    try {
      await deleteListingImage(imageId, listingId)
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : 'Resim silinirken bir hata olustu.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  async function handleSetCover(imageId: string) {
    setSettingCoverId(imageId)
    try {
      await setCoverImage(imageId, listingId)
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : 'Kapak resmi ayarlanirken bir hata olustu.'
      )
    } finally {
      setSettingCoverId(null)
    }
  }

  const sortedImages = [...images].sort(
    (a, b) => a.display_order - b.display_order
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Resimler ({images.length})
        </h3>
        <label
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors cursor-pointer ${
            uploading
              ? 'bg-gray-400 pointer-events-none'
              : 'bg-primary-600 hover:bg-primary-700'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Yukleniyor...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Resim Yukle
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {sortedImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <Upload className="w-10 h-10 text-gray-400 mb-3" />
          <p className="text-sm text-gray-500">
            Henuz resim eklenmemis.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {sortedImages.map((image) => (
            <div
              key={image.id}
              className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="relative aspect-square">
                <Image
                  src={image.image_url}
                  alt="Listing image"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
                {image.is_cover && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 text-xs font-medium text-amber-800 bg-amber-100 rounded-md">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    Kapak
                  </div>
                )}
              </div>

              <div className="flex gap-1 p-2">
                {!image.is_cover && (
                  <button
                    type="button"
                    onClick={() => handleSetCover(image.id)}
                    disabled={settingCoverId === image.id}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {settingCoverId === image.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Star className="w-3 h-3" />
                    )}
                    Kapak Yap
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(image.id)}
                  disabled={deletingId === image.id}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {deletingId === image.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Trash2 className="w-3 h-3" />
                  )}
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

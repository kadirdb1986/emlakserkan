'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, Maximize } from 'lucide-react'
import type { ListingImage } from '@/lib/types/database'

interface ImageGalleryProps {
  images: ListingImage[]
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const sorted = [...images].sort((a, b) => a.display_order - b.display_order)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const currentImage = sorted[selectedIndex]

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? sorted.length - 1 : prev - 1))
  }, [sorted.length])

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === sorted.length - 1 ? 0 : prev + 1))
  }, [sorted.length])

  // No images placeholder
  if (!sorted.length) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-2xl bg-primary-50">
        <div className="text-center text-primary-300">
          <Maximize className="mx-auto h-16 w-16" />
          <span className="mt-2 block text-sm">Görsel bulunamadı</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <div
          className="group relative aspect-[16/9] w-full cursor-pointer overflow-hidden rounded-2xl bg-gray-100"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={currentImage.image_url}
            alt={`Görsel ${selectedIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
          />

          {/* Navigation arrows for multiple images */}
          {sorted.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevious()
                }}
                className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100"
                aria-label="Önceki görsel"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100"
                aria-label="Sonraki görsel"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Image counter */}
          <span className="absolute right-3 bottom-3 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white">
            {selectedIndex + 1} / {sorted.length}
          </span>
        </div>

        {/* Thumbnail strip */}
        {sorted.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {sorted.map((img, index) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg transition-all sm:h-20 sm:w-28 ${
                  index === selectedIndex
                    ? 'ring-2 ring-primary-600 ring-offset-2'
                    : 'opacity-60 hover:opacity-100'
                }`}
                aria-label={`Görsel ${index + 1}`}
              >
                <Image
                  src={img.image_url}
                  alt={`Küçük görsel ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Kapat"
          >
            <X className="h-6 w-6" />
          </button>

          {sorted.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevious()
                }}
                className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                aria-label="Önceki görsel"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                aria-label="Sonraki görsel"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="relative h-[80vh] w-[90vw] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage.image_url}
              alt={`Görsel ${selectedIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white">
            {selectedIndex + 1} / {sorted.length}
          </span>
        </div>
      )}
    </>
  )
}

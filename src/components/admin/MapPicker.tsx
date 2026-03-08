'use client'

import { MapPin, ExternalLink } from 'lucide-react'

interface MapPickerProps {
  latitude: number | null
  longitude: number | null
  onChange: (lat: number | null, lng: number | null) => void
}

export default function MapPicker({
  latitude,
  longitude,
  onChange,
}: MapPickerProps) {
  const hasCoords =
    latitude !== null &&
    longitude !== null &&
    !isNaN(latitude) &&
    !isNaN(longitude)

  const googleMapsUrl = hasCoords
    ? `https://www.google.com/maps?q=${latitude},${longitude}`
    : 'https://www.google.com/maps?q=41.0,29.0'

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <MapPin className="w-4 h-4" />
        <span>Konum</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="latitude"
            className="block text-sm text-gray-600 mb-1"
          >
            Enlem (Latitude)
          </label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            step="any"
            value={latitude ?? ''}
            onChange={(e) => {
              const val = e.target.value
                ? parseFloat(e.target.value)
                : null
              onChange(val, longitude)
            }}
            placeholder="41.0082"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="longitude"
            className="block text-sm text-gray-600 mb-1"
          >
            Boylam (Longitude)
          </label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            step="any"
            value={longitude ?? ''}
            onChange={(e) => {
              const val = e.target.value
                ? parseFloat(e.target.value)
                : null
              onChange(latitude, val)
            }}
            placeholder="28.9784"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
          />
        </div>
      </div>

      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 transition-colors"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Haritada Gor
      </a>
    </div>
  )
}

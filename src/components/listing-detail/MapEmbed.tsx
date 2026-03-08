interface MapEmbedProps {
  latitude: number | null
  longitude: number | null
}

export default function MapEmbed({ latitude, longitude }: MapEmbedProps) {
  if (!latitude || !longitude) return null

  const embedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&output=embed`

  return (
    <div className="overflow-hidden rounded-xl">
      <h3 className="mb-3 text-lg font-semibold text-gray-900">Konum</h3>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Harita"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  )
}

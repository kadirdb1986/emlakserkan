'use client'

interface InstagramEmbedProps {
  url: string | null
}

export default function InstagramEmbed({ url }: InstagramEmbedProps) {
  if (!url) return null

  // Append /embed if not already present
  const embedUrl = url.endsWith('/embed')
    ? url
    : url.endsWith('/')
      ? `${url}embed`
      : `${url}/embed`

  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold text-gray-900">Video</h3>
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Instagram videosu"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  )
}

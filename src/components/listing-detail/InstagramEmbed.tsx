'use client'

import { useEffect, useRef } from 'react'

interface InstagramEmbedProps {
  url: string | null
}

export default function InstagramEmbed({ url }: InstagramEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!url || !containerRef.current) return

    // Extract the post/reel path from the URL
    const match = url.match(/instagram\.com\/(p|reel|tv)\/([^/?]+)/)
    if (!match) return

    const permalink = `https://www.instagram.com/${match[1]}/${match[2]}/`

    // Create the blockquote embed
    containerRef.current.innerHTML = `
      <blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="${permalink}" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 0; max-width:540px; min-width:326px; padding:0; width:100%;">
      </blockquote>
    `

    // Load or re-process Instagram embed script
    const existingScript = document.querySelector('script[src*="instagram.com/embed.js"]')
    if (existingScript) {
      // Script already loaded, just re-process
      if ((window as unknown as Record<string, unknown>).instgrm) {
        (window as unknown as { instgrm: { Embeds: { process: () => void } } }).instgrm.Embeds.process()
      }
    } else {
      const script = document.createElement('script')
      script.src = 'https://www.instagram.com/embed.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [url])

  if (!url) return null

  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold text-gray-900">Video</h3>
      <div ref={containerRef} className="w-full overflow-hidden rounded-xl" />
    </div>
  )
}

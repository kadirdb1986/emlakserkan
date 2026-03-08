import Image from 'next/image'
import Link from 'next/link'
import type { Region } from '@/lib/types/database'

interface RegionCardProps {
  region: Region
}

export default function RegionCard({ region }: RegionCardProps) {
  return (
    <Link
      href={`/bolge/${region.id}`}
      className="group relative block aspect-[3/2] overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Background */}
      {region.cover_image_url ? (
        <Image
          src={region.cover_image_url}
          alt={region.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-colors group-hover:from-black/70" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end p-5">
        <h3 className="text-xl font-bold text-white drop-shadow-lg sm:text-2xl">
          {region.name}
        </h3>
      </div>
    </Link>
  )
}

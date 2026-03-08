import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: 'https://emlakserkan.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://emlakserkan.com/ilanlar',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://emlakserkan.com/hakkimizda',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://emlakserkan.com/iletisim',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Dynamic listing pages
  const { data: listings } = await supabase
    .from('listings')
    .select('id, updated_at')
    .eq('is_active', true)

  const listingPages: MetadataRoute.Sitemap = (listings || []).map(
    (listing) => ({
      url: `https://emlakserkan.com/ilan/${listing.id}`,
      lastModified: new Date(listing.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })
  )

  // Dynamic region pages
  const { data: regions } = await supabase
    .from('regions')
    .select('id, created_at')

  const regionPages: MetadataRoute.Sitemap = (regions || []).map((region) => ({
    url: `https://emlakserkan.com/bolge/${region.id}`,
    lastModified: new Date(region.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...listingPages, ...regionPages]
}

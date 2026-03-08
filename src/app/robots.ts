import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/giris', '/auth/'],
    },
    sitemap: 'https://emlakserkan.com/sitemap.xml',
  }
}

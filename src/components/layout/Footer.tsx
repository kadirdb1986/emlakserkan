import Link from 'next/link'
import { TreePine, Phone } from 'lucide-react'

const quickLinks = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/ilanlar', label: 'İlanlar' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/iletisim', label: 'İletişim' },
]

export default function Footer() {
  return (
    <footer className="bg-primary-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Branding */}
          <div>
            <div className="flex items-center gap-2">
              <TreePine className="h-6 w-6 text-primary-400" />
              <span className="text-lg font-bold text-white">
                Emlak Serkan
              </span>
            </div>
            <p className="mt-3 text-sm text-primary-200/80">
              Hayalinizdeki evi bulmanıza yardımcı oluyoruz. Güvenilir ve
              profesyonel gayrimenkul danışmanlık hizmeti.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-300">
              Hızlı Bağlantılar
            </h3>
            <ul className="mt-3 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-200/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary-300">
              İletişim
            </h3>
            <div className="mt-3 space-y-2">
              <a
                href="tel:+905397736255"
                className="flex items-center gap-2 text-sm text-primary-200/80 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4" />
                0 539 773 62 55
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-primary-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-primary-300/60">
            &copy; 2024 Emlak Serkan. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}

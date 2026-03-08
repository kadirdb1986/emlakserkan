'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Home,
  MapPin,
  Users,
  Search,
  Shield,
  X,
} from 'lucide-react'

interface AdminSidebarProps {
  userRole: string
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/ilanlar', label: 'Ilanlar', icon: Home },
  { href: '/admin/bolgeler', label: 'Bolgeler', icon: MapPin },
  { href: '/admin/musteriler', label: 'Musteriler', icon: Users },
  { href: '/admin/arayanlar', label: 'Arayanlar', icon: Search },
]

const superAdminItems = [
  { href: '/admin/kullanicilar', label: 'Kullanicilar', icon: Shield },
]

export default function AdminSidebar({
  userRole,
  isOpen,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname()

  const allItems =
    userRole === 'super_admin' ? [...navItems, ...superAdminItems] : navItems

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-primary-950 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-primary-800">
          <div>
            <h1 className="text-xl font-bold text-white">Emlak Serkan</h1>
            <p className="text-sm text-primary-300 mt-0.5">Admin Panel</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-primary-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-primary-300" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1">
          {allItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary-600 text-white'
                    : 'text-primary-200 hover:bg-primary-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

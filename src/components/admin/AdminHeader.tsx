'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Menu, LogOut } from 'lucide-react'

interface AdminHeaderProps {
  userEmail: string
  onToggleSidebar: () => void
}

export default function AdminHeader({
  userEmail,
  onToggleSidebar,
}: AdminHeaderProps) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/giris')
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-gray-200">
      {/* Left: hamburger toggle */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors lg:hidden cursor-pointer"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Spacer for desktop (no hamburger shown) */}
      <div className="hidden lg:block" />

      {/* Right: user info + logout */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 hidden sm:inline">
          {userEmail}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Cikis</span>
        </button>
      </div>
    </header>
  )
}

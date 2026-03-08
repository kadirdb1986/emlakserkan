'use client'

import { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

interface AdminShellProps {
  userEmail: string
  userRole: string
  children: React.ReactNode
}

export default function AdminShell({
  userEmail,
  userRole,
  children,
}: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        userRole={userRole}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area - offset by sidebar width on desktop */}
      <div className="lg:pl-64">
        <AdminHeader
          userEmail={userEmail}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

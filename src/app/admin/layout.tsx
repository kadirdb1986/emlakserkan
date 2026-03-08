import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminShell from '@/components/admin/AdminShell'

export const metadata = {
  title: 'Admin Panel | Emlak Serkan',
  description: 'Emlak Serkan Admin Panel',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/giris')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    redirect('/giris')
  }

  return (
    <AdminShell userEmail={profile.email ?? user.email ?? ''} userRole={profile.role}>
      {children}
    </AdminShell>
  )
}

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import UserManagementClient from './UserManagementClient'
import type { Profile } from '@/lib/types/database'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/giris')
  }

  // Verify current user is super_admin
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (currentProfile?.role !== 'super_admin') {
    redirect('/admin')
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true })

  const rows = (profiles ?? []) as Profile[]

  return <UserManagementClient profiles={rows} currentUserId={user.id} />
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Add a new admin by email - creates/updates profile entry
export async function addAdmin(formData: FormData) {
  const supabase = await createClient()

  // Verify current user is super_admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (currentProfile?.role !== 'super_admin') throw new Error('Only super admin can manage users')

  const email = formData.get('email') as string
  const role = formData.get('role') as string || 'admin'

  // Check if profile with this email already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single()

  if (existingProfile) {
    // Update role
    await supabase.from('profiles').update({ role }).eq('id', existingProfile.id)
  } else {
    // For now, the user must first login with Google to create their auth.users entry
    // Then super admin can change their role
    throw new Error('Bu email ile kayitli kullanici bulunamadi. Kullanicinin once Google ile giris yapmasi gerekiyor.')
  }

  revalidatePath('/admin/kullanicilar')
}

export async function updateUserRole(userId: string, role: string) {
  const supabase = await createClient()

  // Verify current user is super_admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (currentProfile?.role !== 'super_admin') throw new Error('Only super admin')

  // Don't allow changing own role
  if (userId === user.id) throw new Error('Kendi rolunuzu degistiremezsiniz')

  await supabase.from('profiles').update({ role }).eq('id', userId)
  revalidatePath('/admin/kullanicilar')
}

export async function removeAdmin(userId: string) {
  const supabase = await createClient()

  // Verify current user is super_admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (currentProfile?.role !== 'super_admin') throw new Error('Only super admin')
  if (userId === user.id) throw new Error('Kendinizi silemezsiniz')

  // Delete profile (removes admin access, user can still login but won't have admin role)
  await supabase.from('profiles').delete().eq('id', userId)
  revalidatePath('/admin/kullanicilar')
}

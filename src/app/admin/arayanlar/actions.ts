'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProspect(formData: FormData) {
  const supabase = await createClient()

  const data = {
    full_name: formData.get('full_name') as string,
    phone: (formData.get('phone') as string) || null,
    email: (formData.get('email') as string) || null,
    budget_min: formData.get('budget_min') ? Number(formData.get('budget_min')) : null,
    budget_max: formData.get('budget_max') ? Number(formData.get('budget_max')) : null,
    desired_type: (formData.get('desired_type') as string) || null,
    desired_region_id: (formData.get('desired_region_id') as string) || null,
    notes: (formData.get('notes') as string) || null,
  }

  const { error } = await supabase.from('prospects').insert(data)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/arayanlar')
}

export async function updateProspect(id: string, formData: FormData) {
  const supabase = await createClient()

  const data = {
    full_name: formData.get('full_name') as string,
    phone: (formData.get('phone') as string) || null,
    email: (formData.get('email') as string) || null,
    budget_min: formData.get('budget_min') ? Number(formData.get('budget_min')) : null,
    budget_max: formData.get('budget_max') ? Number(formData.get('budget_max')) : null,
    desired_type: (formData.get('desired_type') as string) || null,
    desired_region_id: (formData.get('desired_region_id') as string) || null,
    notes: (formData.get('notes') as string) || null,
  }

  const { error } = await supabase
    .from('prospects')
    .update(data)
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/arayanlar')
}

export async function deleteProspect(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('prospects').delete().eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/arayanlar')
}

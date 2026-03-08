'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCustomer(formData: FormData) {
  const supabase = await createClient()

  const data = {
    full_name: formData.get('full_name') as string,
    phone: (formData.get('phone') as string) || null,
    email: (formData.get('email') as string) || null,
    notes: (formData.get('notes') as string) || null,
    listing_id: (formData.get('listing_id') as string) || null,
    deed_info: (formData.get('deed_info') as string) || null,
  }

  const { error } = await supabase.from('customers').insert(data)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/musteriler')
}

export async function updateCustomer(id: string, formData: FormData) {
  const supabase = await createClient()

  const data = {
    full_name: formData.get('full_name') as string,
    phone: (formData.get('phone') as string) || null,
    email: (formData.get('email') as string) || null,
    notes: (formData.get('notes') as string) || null,
    listing_id: (formData.get('listing_id') as string) || null,
    deed_info: (formData.get('deed_info') as string) || null,
  }

  const { error } = await supabase
    .from('customers')
    .update(data)
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/musteriler')
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('customers').delete().eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/musteriler')
}

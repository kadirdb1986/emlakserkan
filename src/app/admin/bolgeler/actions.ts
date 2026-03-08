'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createRegion(formData: FormData) {
  const supabase = await createClient()

  const data = {
    name: formData.get('name') as string,
    type: formData.get('type') as string,
    parent_id: (formData.get('parent_id') as string) || null,
    show_on_homepage: formData.get('show_on_homepage') === 'true',
    cover_image_url: (formData.get('cover_image_url') as string) || null,
    display_order: Number(formData.get('display_order')) || 0,
  }

  const { error } = await supabase.from('regions').insert(data)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/bolgeler')
  revalidatePath('/')
}

export async function updateRegion(id: string, formData: FormData) {
  const supabase = await createClient()

  const data = {
    name: formData.get('name') as string,
    type: formData.get('type') as string,
    parent_id: (formData.get('parent_id') as string) || null,
    show_on_homepage: formData.get('show_on_homepage') === 'true',
    cover_image_url: (formData.get('cover_image_url') as string) || null,
    display_order: Number(formData.get('display_order')) || 0,
  }

  const { error } = await supabase
    .from('regions')
    .update(data)
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/bolgeler')
  revalidatePath('/')
}

export async function deleteRegion(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('regions').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/bolgeler')
  revalidatePath('/')
}

export async function toggleHomepage(id: string, show: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('regions')
    .update({ show_on_homepage: show })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/bolgeler')
  revalidatePath('/')
}

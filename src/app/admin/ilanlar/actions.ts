'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createListing(formData: FormData) {
  const supabase = await createClient()

  const data = {
    title: formData.get('title') as string,
    description: (formData.get('description') as string) || null,
    type: formData.get('type') as string,
    price: formData.get('price') ? Number(formData.get('price')) : null,
    show_price: formData.get('show_price') === 'true',
    area_sqm: formData.get('area_sqm') ? Number(formData.get('area_sqm')) : null,
    zoning_status: (formData.get('zoning_status') as string) || null,
    deed_type: (formData.get('deed_type') as string) || null,
    parcel_info: (formData.get('parcel_info') as string) || null,
    region_id: (formData.get('region_id') as string) || null,
    address: (formData.get('address') as string) || null,
    latitude: formData.get('latitude') ? Number(formData.get('latitude')) : null,
    longitude: formData.get('longitude')
      ? Number(formData.get('longitude'))
      : null,
    instagram_video_url:
      (formData.get('instagram_video_url') as string) || null,
    is_active: formData.get('is_active') === 'true',
  }

  const { data: listing, error } = await supabase
    .from('listings')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/admin/ilanlar')
  revalidatePath('/')
  redirect(`/admin/ilanlar/${listing.id}`)
}

export async function updateListing(id: string, formData: FormData) {
  const supabase = await createClient()

  const data = {
    title: formData.get('title') as string,
    description: (formData.get('description') as string) || null,
    type: formData.get('type') as string,
    price: formData.get('price') ? Number(formData.get('price')) : null,
    show_price: formData.get('show_price') === 'true',
    area_sqm: formData.get('area_sqm') ? Number(formData.get('area_sqm')) : null,
    zoning_status: (formData.get('zoning_status') as string) || null,
    deed_type: (formData.get('deed_type') as string) || null,
    parcel_info: (formData.get('parcel_info') as string) || null,
    region_id: (formData.get('region_id') as string) || null,
    address: (formData.get('address') as string) || null,
    latitude: formData.get('latitude') ? Number(formData.get('latitude')) : null,
    longitude: formData.get('longitude')
      ? Number(formData.get('longitude'))
      : null,
    instagram_video_url:
      (formData.get('instagram_video_url') as string) || null,
    is_active: formData.get('is_active') === 'true',
    is_sold: formData.get('is_sold') === 'true',
  }

  const { error } = await supabase
    .from('listings')
    .update(data)
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/ilanlar')
  revalidatePath(`/admin/ilanlar/${id}`)
  revalidatePath('/')
  redirect(`/admin/ilanlar/${id}`)
}

export async function deleteListing(id: string) {
  const supabase = await createClient()

  // Delete listing images from storage first
  const { data: images } = await supabase
    .from('listing_images')
    .select('image_url')
    .eq('listing_id', id)

  if (images && images.length > 0) {
    const paths = images
      .map((img) => {
        const parts = img.image_url.split('/listing-images/')
        return parts[1] || null
      })
      .filter(Boolean) as string[]

    if (paths.length > 0) {
      await supabase.storage.from('listing-images').remove(paths)
    }
  }

  await supabase.from('listing_images').delete().eq('listing_id', id)
  await supabase.from('listings').delete().eq('id', id)

  revalidatePath('/admin/ilanlar')
  revalidatePath('/')
  redirect('/admin/ilanlar')
}

export async function uploadListingImage(
  listingId: string,
  formData: FormData
) {
  const supabase = await createClient()
  const file = formData.get('file') as File
  const fileName = `${listingId}/${Date.now()}-${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('listing-images')
    .upload(fileName, file)

  if (uploadError) throw new Error(uploadError.message)

  const {
    data: { publicUrl },
  } = supabase.storage.from('listing-images').getPublicUrl(fileName)

  // Get current max display_order
  const { data: existingImages } = await supabase
    .from('listing_images')
    .select('display_order')
    .eq('listing_id', listingId)
    .order('display_order', { ascending: false })
    .limit(1)

  const nextOrder = (existingImages?.[0]?.display_order ?? -1) + 1

  await supabase.from('listing_images').insert({
    listing_id: listingId,
    image_url: publicUrl,
    display_order: nextOrder,
    is_cover: nextOrder === 0,
  })

  revalidatePath(`/admin/ilanlar/${listingId}`)
}

export async function deleteListingImage(
  imageId: string,
  listingId: string
) {
  const supabase = await createClient()

  // Get image URL to delete from storage
  const { data: image } = await supabase
    .from('listing_images')
    .select('image_url')
    .eq('id', imageId)
    .single()

  if (image) {
    const path = image.image_url.split('/listing-images/')[1]
    if (path) {
      await supabase.storage.from('listing-images').remove([path])
    }
  }

  await supabase.from('listing_images').delete().eq('id', imageId)
  revalidatePath(`/admin/ilanlar/${listingId}`)
}

export async function setCoverImage(imageId: string, listingId: string) {
  const supabase = await createClient()

  // Set all images for this listing to is_cover = false
  await supabase
    .from('listing_images')
    .update({ is_cover: false })
    .eq('listing_id', listingId)

  // Set this image as cover
  await supabase
    .from('listing_images')
    .update({ is_cover: true })
    .eq('id', imageId)

  revalidatePath(`/admin/ilanlar/${listingId}`)
}

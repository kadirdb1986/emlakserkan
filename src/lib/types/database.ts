export type UserRole = 'super_admin' | 'admin'
export type ListingType = 'arsa' | 'ev' | 'villa' | 'tarla' | 'diger'
export type RegionType = 'il' | 'ilce' | 'mahalle'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: string
}

export interface Region {
  id: string
  name: string
  type: RegionType
  parent_id: string | null
  show_on_homepage: boolean
  cover_image_url: string | null
  display_order: number
  created_at: string
}

export interface Listing {
  id: string
  title: string
  description: string | null
  type: ListingType
  price: number | null
  show_price: boolean
  area_sqm: number | null
  zoning_status: string | null
  deed_type: string | null
  parcel_info: string | null
  region_id: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  instagram_video_url: string | null
  is_active: boolean
  is_sold: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface ListingImage {
  id: string
  listing_id: string
  image_url: string
  display_order: number
  is_cover: boolean
  created_at: string
}

export interface Customer {
  id: string
  full_name: string
  phone: string | null
  email: string | null
  notes: string | null
  listing_id: string | null
  deed_info: string | null
  created_at: string
}

export interface Prospect {
  id: string
  full_name: string
  phone: string | null
  email: string | null
  budget_min: number | null
  budget_max: number | null
  desired_type: ListingType | null
  desired_region_id: string | null
  notes: string | null
  created_at: string
}

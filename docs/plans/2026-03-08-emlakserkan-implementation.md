# Emlak Serkan Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a green/nature-themed real estate listing website with admin panel for Emlak Serkan, deployed on Vercel with Supabase backend.

**Architecture:** Next.js 14 App Router with TypeScript. Supabase for auth (Google OAuth), database (PostgreSQL with RLS), and storage (images). Single project with public pages and protected `/admin` routes. Server Components for SEO, Client Components for interactivity.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Supabase (@supabase/supabase-js, @supabase/ssr), Lucide React, Google Maps Embed API

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.js`, `postcss.config.js`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Create: `.env.local`, `.gitignore`

**Step 1: Initialize Next.js project**

Run:
```bash
cd /Users/kadirdogrubakar/Desktop/claude/emlakserkan
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

**Step 2: Install dependencies**

Run:
```bash
npm install @supabase/supabase-js @supabase/ssr lucide-react
```

**Step 3: Create .env.local**

```env
NEXT_PUBLIC_SUPABASE_URL=https://vjdobymdeayhwqorztnq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZG9ieW1kZWF5aHdxb3J6dG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MDgzMzUsImV4cCI6MjA4ODQ4NDMzNX0.Gl9SBf1QR6vo1pjxgQt46uxqHw-TQGMJMizjlmtm0_U
```

**Step 4: Configure Tailwind green/nature theme**

In `tailwind.config.ts`, extend colors:
```ts
theme: {
  extend: {
    colors: {
      primary: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
        950: '#052e16',
      },
    },
  },
}
```

**Step 5: Initialize git and commit**

Run:
```bash
git init
git add .
git commit -m "chore: initialize Next.js project with Tailwind and Supabase deps"
```

---

### Task 2: Supabase Client Setup

**Files:**
- Create: `src/lib/supabase/client.ts` (browser client)
- Create: `src/lib/supabase/server.ts` (server client)
- Create: `src/lib/supabase/middleware.ts` (auth middleware)
- Create: `src/middleware.ts` (Next.js middleware)
- Create: `src/lib/types/database.ts` (DB type definitions)

**Step 1: Create database types**

```ts
// src/lib/types/database.ts
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
```

**Step 2: Create browser Supabase client**

```ts
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Step 3: Create server Supabase client**

```ts
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

**Step 4: Create middleware helper**

```ts
// src/lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/giris'
      return NextResponse.redirect(url)
    }
    // Check if user has admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }
  return supabaseResponse
}
```

**Step 5: Create Next.js middleware**

```ts
// src/middleware.ts
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/admin/:path*', '/giris'],
}
```

**Step 6: Commit**

```bash
git add .
git commit -m "feat: add Supabase client setup, types, and auth middleware"
```

---

### Task 3: Supabase Database Setup

**Files:**
- Create: `supabase/schema.sql` (full schema for reference/manual execution)

**Step 1: Create schema SQL file**

Write complete SQL with all tables, RLS policies, and storage bucket setup. This will be executed manually in Supabase SQL Editor.

Tables: profiles, regions, listings, listing_images, customers, prospects
RLS: Public read for listings/regions, admin-only write, admin-only for customers/prospects
Storage: listing-images bucket with public read, admin-only upload
Trigger: auto-create profile on auth.users insert

**Step 2: Commit**

```bash
git add supabase/
git commit -m "feat: add Supabase database schema SQL"
```

**Step 3: Execute SQL in Supabase Dashboard**

User must go to Supabase Dashboard > SQL Editor and run the schema.sql content.

**Step 4: Enable Google OAuth in Supabase**

User must go to Supabase Dashboard > Authentication > Providers > Google and configure:
- Enable Google provider
- Add Google OAuth Client ID and Secret (from Google Cloud Console)
- Set redirect URL

---

### Task 4: Auth - Login Page

**Files:**
- Create: `src/app/giris/page.tsx`
- Create: `src/app/auth/callback/route.ts`

**Step 1: Create OAuth callback route**

```ts
// src/app/auth/callback/route.ts
// Handles the OAuth redirect from Google, exchanges code for session
```

**Step 2: Create login page**

Green-themed login page with "Google ile Giris Yap" button. Nature background. Only admin users can login - informational text about this.

**Step 3: Commit**

```bash
git add src/app/giris/ src/app/auth/
git commit -m "feat: add Google OAuth login page and callback"
```

---

### Task 5: Public Layout - Header, Footer, Theme

**Files:**
- Create: `src/app/globals.css` (update with nature theme styles)
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/layout/PublicLayout.tsx`
- Update: `src/app/layout.tsx`

**Step 1: Set up global CSS with nature theme**

Green gradient backgrounds, organic shapes, leaf-inspired decorative elements.

**Step 2: Create Header component**

- Text logo "Emlak Serkan" in green
- Navigation: Ana Sayfa | Ilanlar | Hakkimizda | Iletisim
- Mobile hamburger menu
- Sticky header with white background

**Step 3: Create Footer component**

- Contact info: 0 539 773 62 55
- Navigation links
- Copyright text
- Green-themed

**Step 4: Update root layout**

Wrap public pages with Header and Footer.

**Step 5: Commit**

```bash
git add src/components/layout/ src/app/
git commit -m "feat: add public layout with header, footer, and nature theme"
```

---

### Task 6: Home Page

**Files:**
- Update: `src/app/page.tsx`
- Create: `src/components/home/HeroSection.tsx`
- Create: `src/components/home/FeaturedListings.tsx`
- Create: `src/components/home/RegionCards.tsx`
- Create: `src/components/ui/ListingCard.tsx`
- Create: `src/components/ui/RegionCard.tsx`

**Step 1: Create Hero section**

Large nature-themed hero with:
- Background image/gradient (green tones)
- "Emlak Serkan" headline
- Subtitle about finding dream property
- Search/filter bar (type + region dropdown)

**Step 2: Create ListingCard component**

Reusable card: cover image, type badge, title, location, price (or "Fiyat icin arayin"), area.

**Step 3: Create FeaturedListings section**

Grid of latest active listings from Supabase. Server component with data fetch.

**Step 4: Create RegionCard component**

Card with cover image, region name, listing count.

**Step 5: Create RegionCards section**

Grid of regions where show_on_homepage=true, ordered by display_order. Server component.

**Step 6: Assemble home page**

Combine Hero + FeaturedListings + RegionCards.

**Step 7: Commit**

```bash
git add src/app/page.tsx src/components/
git commit -m "feat: add home page with hero, featured listings, and region cards"
```

---

### Task 7: Listings Page with Filters

**Files:**
- Create: `src/app/ilanlar/page.tsx`
- Create: `src/components/listings/ListingFilters.tsx`
- Create: `src/components/listings/ListingGrid.tsx`

**Step 1: Create filter component**

Client component with:
- Type filter (arsa, ev, villa, tarla, diger)
- Region filter (dropdown from regions table)
- Price range (min-max inputs)
- Apply/reset buttons
- URL search params for filters

**Step 2: Create listing grid**

Server component that reads search params and fetches filtered listings from Supabase.

**Step 3: Create listings page**

Combine filters + grid. SEO meta tags.

**Step 4: Commit**

```bash
git add src/app/ilanlar/ src/components/listings/
git commit -m "feat: add listings page with filtering"
```

---

### Task 8: Listing Detail Page

**Files:**
- Create: `src/app/ilan/[id]/page.tsx`
- Create: `src/components/listing-detail/ImageGallery.tsx`
- Create: `src/components/listing-detail/ListingInfo.tsx`
- Create: `src/components/listing-detail/MapEmbed.tsx`
- Create: `src/components/listing-detail/InstagramEmbed.tsx`

**Step 1: Create image gallery**

Client component: thumbnail slider, full-size view, click to expand.

**Step 2: Create listing info component**

Display: title, type badge, price (or hidden), m2, zoning, deed type, parcel, region breadcrumb (il > ilce > mahalle).

**Step 3: Create map embed**

Google Maps iframe embed using lat/lng coordinates.

**Step 4: Create Instagram embed**

Embed Instagram post/reel using the provided URL via Instagram oEmbed.

**Step 5: Create detail page**

Server component: fetch listing + images from Supabase. SEO metadata (generateMetadata). Assemble gallery + info + map + instagram + description. "Hemen Ara" button with phone link.

**Step 6: Commit**

```bash
git add src/app/ilan/ src/components/listing-detail/
git commit -m "feat: add listing detail page with gallery, map, and instagram embed"
```

---

### Task 9: Region Page

**Files:**
- Create: `src/app/bolge/[id]/page.tsx`

**Step 1: Create region page**

Server component: fetch region info + listings in that region. Display region name, description, and listing grid. SEO metadata.

**Step 2: Commit**

```bash
git add src/app/bolge/
git commit -m "feat: add region page showing listings by region"
```

---

### Task 10: About and Contact Pages

**Files:**
- Create: `src/app/hakkimizda/page.tsx`
- Create: `src/app/iletisim/page.tsx`

**Step 1: Create About page**

Serkan Guner bio: lives in Catalca Kestanelik, years of experience in real estate. Green-themed layout with nature imagery.

**Step 2: Create Contact page**

Phone: 0 539 773 62 55 with click-to-call. Simple contact form (name, phone, message) that could save to Supabase or just show info. Green card design.

**Step 3: Commit**

```bash
git add src/app/hakkimizda/ src/app/iletisim/
git commit -m "feat: add about and contact pages"
```

---

### Task 11: Admin Layout and Dashboard

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/components/admin/AdminSidebar.tsx`
- Create: `src/components/admin/AdminHeader.tsx`

**Step 1: Create admin sidebar**

Links: Dashboard, Ilanlar, Bolgeler, Musteriler, Arayanlar, Kullanicilar (super_admin only). Active state highlighting. Green accent theme.

**Step 2: Create admin header**

User info, logout button.

**Step 3: Create admin layout**

Sidebar + header + content area. Auth check (redirect to /giris if not admin).

**Step 4: Create dashboard page**

Stats cards: total listings, active listings, total customers, total prospects. Recent activity.

**Step 5: Commit**

```bash
git add src/app/admin/ src/components/admin/
git commit -m "feat: add admin layout with sidebar and dashboard"
```

---

### Task 12: Admin - Listing Management

**Files:**
- Create: `src/app/admin/ilanlar/page.tsx` (list)
- Create: `src/app/admin/ilanlar/yeni/page.tsx` (create)
- Create: `src/app/admin/ilanlar/[id]/page.tsx` (edit)
- Create: `src/components/admin/ListingForm.tsx`
- Create: `src/components/admin/ImageUploader.tsx`
- Create: `src/components/admin/MapPicker.tsx`
- Create: `src/app/admin/ilanlar/actions.ts` (server actions)

**Step 1: Create listing list page**

Table with: title, type, region, price, status (active/sold), actions (edit/delete). Search and filter.

**Step 2: Create listing form component**

Form fields: title, description, type (select), price, show_price (toggle), area_sqm, zoning_status, deed_type, parcel_info, region_id (select), address, instagram_video_url, is_active, is_sold.

**Step 3: Create image uploader**

Client component: drag & drop or file picker. Upload to Supabase Storage. Reorder images. Set cover image. Delete images.

**Step 4: Create map picker**

Client component: clickable Google Maps. User clicks to set lat/lng. Show marker at selected position.

**Step 5: Create server actions**

Server actions for: createListing, updateListing, deleteListing, uploadImage, deleteImage.

**Step 6: Create new listing page**

ListingForm + ImageUploader + MapPicker.

**Step 7: Create edit listing page**

Same form pre-filled with existing data.

**Step 8: Commit**

```bash
git add src/app/admin/ilanlar/ src/components/admin/
git commit -m "feat: add admin listing management (CRUD, image upload, map picker)"
```

---

### Task 13: Admin - Region Management

**Files:**
- Create: `src/app/admin/bolgeler/page.tsx`
- Create: `src/components/admin/RegionForm.tsx`
- Create: `src/app/admin/bolgeler/actions.ts`

**Step 1: Create region management page**

List of regions with: name, type, parent, show_on_homepage toggle, display_order. Add/edit/delete inline or modal.

**Step 2: Create region form**

Fields: name, type (il/ilce/mahalle), parent_id (select from existing regions), show_on_homepage, cover_image_url, display_order.

**Step 3: Create server actions**

createRegion, updateRegion, deleteRegion, toggleHomepage, updateOrder.

**Step 4: Commit**

```bash
git add src/app/admin/bolgeler/ src/components/admin/RegionForm.tsx
git commit -m "feat: add admin region management"
```

---

### Task 14: Admin - Customer Management

**Files:**
- Create: `src/app/admin/musteriler/page.tsx`
- Create: `src/components/admin/CustomerForm.tsx`
- Create: `src/app/admin/musteriler/actions.ts`

**Step 1: Create customer list page**

Table: full_name, phone, email, linked listing, actions. Add/edit/delete.

**Step 2: Create customer form**

Fields: full_name, phone, email, notes, listing_id (select from listings), deed_info (textarea for tapu kayit bilgileri).

**Step 3: Create server actions**

createCustomer, updateCustomer, deleteCustomer.

**Step 4: Commit**

```bash
git add src/app/admin/musteriler/
git commit -m "feat: add admin customer management"
```

---

### Task 15: Admin - Prospect Management

**Files:**
- Create: `src/app/admin/arayanlar/page.tsx`
- Create: `src/components/admin/ProspectForm.tsx`
- Create: `src/app/admin/arayanlar/actions.ts`

**Step 1: Create prospect list page**

Table: full_name, phone, desired_type, budget range, desired region, actions. Add/edit/delete.

**Step 2: Create prospect form**

Fields: full_name, phone, email, budget_min, budget_max, desired_type (select), desired_region_id (select), notes.

**Step 3: Create server actions**

createProspect, updateProspect, deleteProspect.

**Step 4: Commit**

```bash
git add src/app/admin/arayanlar/
git commit -m "feat: add admin prospect management"
```

---

### Task 16: Admin - User Management

**Files:**
- Create: `src/app/admin/kullanicilar/page.tsx`
- Create: `src/app/admin/kullanicilar/actions.ts`

**Step 1: Create user management page**

Only visible to super_admin. List current admins with roles. Add admin by email. Change role (admin/super_admin). Remove admin access.

**Step 2: Create server actions**

addAdmin (insert profile with role), updateRole, removeAdmin. All require super_admin check.

**Step 3: Commit**

```bash
git add src/app/admin/kullanicilar/
git commit -m "feat: add admin user management (super_admin only)"
```

---

### Task 17: SEO Optimization

**Files:**
- Update: `src/app/layout.tsx` (global metadata)
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Update: all page files (generateMetadata)

**Step 1: Add global metadata**

Default title: "Emlak Serkan | Arsa, Ev, Villa Satis"
Default description with keywords.
Open Graph defaults.

**Step 2: Create dynamic sitemap**

Generate sitemap.xml with all public pages, listing pages, region pages.

**Step 3: Create robots.txt**

Allow all crawlers, reference sitemap, disallow /admin.

**Step 4: Verify all pages have generateMetadata**

Each listing and region page should have dynamic title and description.

**Step 5: Commit**

```bash
git add src/app/
git commit -m "feat: add SEO optimization (metadata, sitemap, robots)"
```

---

### Task 18: Final Polish and Deploy Prep

**Files:**
- Create: `src/app/not-found.tsx` (404 page)
- Create: `src/app/loading.tsx` (loading state)
- Update: `next.config.js` (image domains)
- Create: `vercel.json` (if needed)

**Step 1: Create 404 page**

Green-themed "Sayfa bulunamadi" page.

**Step 2: Create loading states**

Skeleton loaders for listing cards, tables.

**Step 3: Configure next.config.js**

Add Supabase storage domain to images config. Add any redirects needed.

**Step 4: Final commit**

```bash
git add .
git commit -m "feat: add 404 page, loading states, and deploy configuration"
```

**Step 5: Push to GitHub and deploy**

```bash
git remote add origin https://github.com/kadirdb1986/emlakserkan.git
git push -u origin main
```

Then connect repo in Vercel dashboard and deploy. Set environment variables in Vercel.

---

## Execution Order Summary

1. Project Scaffolding (foundation)
2. Supabase Client Setup (data layer)
3. Database Schema (tables + RLS)
4. Auth / Login (security)
5. Public Layout (header/footer)
6. Home Page (main landing)
7. Listings Page (browsing)
8. Listing Detail (individual view)
9. Region Page (filtered view)
10. About + Contact (static pages)
11. Admin Layout + Dashboard (admin foundation)
12. Admin Listings (core CRUD)
13. Admin Regions (region management)
14. Admin Customers (customer tracking)
15. Admin Prospects (prospect tracking)
16. Admin Users (access control)
17. SEO (optimization)
18. Final Polish + Deploy

## Dependencies

- Tasks 2-18 depend on Task 1 (project setup)
- Tasks 4-18 depend on Task 2 (Supabase client)
- Tasks 6-10 depend on Task 3 (database) and Task 5 (layout)
- Tasks 11-16 depend on Task 3 (database) and Task 4 (auth)
- Task 18 depends on all previous tasks

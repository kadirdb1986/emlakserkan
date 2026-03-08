# Emlak Serkan - Tasarim Dokumani

**Tarih:** 2026-03-08
**Proje:** Emlak Serkan - Emlak Ilan Sitesi
**Sahip:** Serkan Guner
**Domain:** emlakserkan.com

## Ozet

Emlak Serkan icin yesil/beyaz doga temali, SEO uyumlu bir emlak ilan sitesi. Admin panelinden ilanlar, bolgeler, musteriler ve emlak arayanlar yonetilebilir. Vercel + Supabase uzerinde calisir.

## Tech Stack

- Next.js 14 (App Router, Server Components, TypeScript)
- Tailwind CSS (yesil/beyaz doga temasi)
- Supabase (Auth, Database, Storage)
- Supabase Auth ile Google OAuth
- Lucide React (ikonlar)
- Vercel (deploy)

## Veritabani Modeli

### profiles
- id (uuid, FK -> auth.users)
- email
- full_name
- role: 'super_admin' | 'admin'
- created_at

### regions (Bolgeler)
- id (uuid)
- name (gosterim adi)
- type: 'il' | 'ilce' | 'mahalle'
- parent_id (FK -> regions, ust bolge)
- show_on_homepage (boolean)
- cover_image_url
- display_order (siralama)
- created_at

### listings (Ilanlar)
- id (uuid)
- title
- description
- type: 'arsa' | 'ev' | 'villa' | 'tarla' | 'diger'
- price (numeric, nullable)
- show_price (boolean)
- area_sqm (m2)
- zoning_status (imar durumu)
- deed_type (tapu turu)
- parcel_info (ada/parsel)
- region_id (FK -> regions)
- address (acik adres)
- latitude, longitude (harita)
- instagram_video_url
- is_active (boolean)
- is_sold (boolean)
- created_by (FK -> profiles)
- created_at, updated_at

### listing_images (Ilan Fotograflari)
- id (uuid)
- listing_id (FK -> listings)
- image_url
- display_order
- is_cover (kapak fotografi mi)
- created_at

### customers (Musteriler - Saticilar)
- id (uuid)
- full_name
- phone
- email
- notes
- listing_id (FK -> listings, nullable)
- deed_info (tapu kayit bilgileri)
- created_at

### prospects (Emlak Arayanlar)
- id (uuid)
- full_name
- phone
- email
- budget_min, budget_max (butce araligi)
- desired_type: 'arsa' | 'ev' | 'villa' | 'tarla' | 'diger'
- desired_region_id (FK -> regions)
- notes
- created_at

## Sayfa Yapisi

### Public Sayfalar
- `/` - Ana Sayfa (hero, one cikan ilanlar, bolge kartlari)
- `/ilanlar` - Tum ilanlar (filtreleme: tur, bolge, fiyat)
- `/ilan/[id]` - Ilan detay (galeri, video, harita, bilgiler)
- `/bolge/[id]` - Bolge sayfasi (bolgedeki ilanlar)
- `/hakkimizda` - Hakkimizda
- `/iletisim` - Iletisim (tel: 0 539 773 62 55)

### Admin Paneli (/admin - Korumali)
- `/admin` - Dashboard (istatistikler)
- `/admin/ilanlar` - Ilan yonetimi (CRUD)
- `/admin/ilanlar/yeni` - Yeni ilan ekle
- `/admin/ilanlar/[id]` - Ilan duzenle
- `/admin/bolgeler` - Bolge yonetimi
- `/admin/musteriler` - Musteriler (saticilar + tapu bilgileri)
- `/admin/arayanlar` - Emlak arayanlar (butce, tur, bolge, iletisim)
- `/admin/kullanicilar` - Admin yonetimi (sadece super admin)

## Auth ve Guvenlik

- Google OAuth ile giris (Supabase Auth)
- Rol bazli erisim: super_admin > admin
- Super admin baska adminler atayabilir
- Supabase RLS:
  - listings, regions: Herkes okur, admin yazar
  - customers, prospects: Sadece admin okur/yazar
  - profiles: Kendi profilini okur, super admin yonetir

## Tasarim

- Yesil (#16a34a, #22c55e) ve beyaz ana renkler
- Doga temasi (yaprak motifleri, organik formlar)
- Text logo: "Emlak Serkan"
- Responsive tasarim (mobil oncelikli)
- SEO uyumlu (SSR, meta tags, Open Graph)

## Ozellikler

- Coklu fotograf yukleme (Supabase Storage)
- Instagram video embed
- Google Maps ile konum secme ve gosterme
- Fiyat goster/gizle secenegi
- Bolge kartlari (admin secimli, il/ilce/mahalle farketmez)
- Filtreleme (tur, bolge, fiyat araligi)

## Deploy

- Vercel uzerinde deploy
- GitHub repo: kadirdb1986 hesabi
- Domain: emlakserkan.com (Vercel'e yonlendirilecek)
- Supabase URL: https://vjdobymdeayhwqorztnq.supabase.co

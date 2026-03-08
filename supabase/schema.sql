-- ============================================================================
-- Emlak Serkan - Supabase Database Schema
-- ============================================================================
-- Bu SQL dosyasi Supabase SQL Editor'de tek seferde calistirilabilir.
-- Tum tablolar, fonksiyonlar, trigger'lar, RLS politikalari ve
-- storage bucket ayarlarini icerir.
-- ============================================================================


-- ============================================================================
-- 1. HELPER FUNCTIONS
-- ============================================================================

-- Admin kontrolu icin yardimci fonksiyon
-- RLS politikalarinda kullanilir
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- updated_at alanini otomatik guncelleyen fonksiyon
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Yeni kullanici kayit oldugunda otomatik profil olusturan fonksiyon
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- profiles: Kullanici profilleri (auth.users ile baglantili)
-- ----------------------------------------------------------------------------
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- regions: Bolgeler (il > ilce > mahalle hiyerarsisi, self-referencing)
-- ----------------------------------------------------------------------------
CREATE TABLE regions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('il', 'ilce', 'mahalle')),
  parent_id UUID REFERENCES regions(id) ON DELETE SET NULL,
  show_on_homepage BOOLEAN DEFAULT FALSE,
  cover_image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- listings: Emlak ilanlari
-- ----------------------------------------------------------------------------
CREATE TABLE listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('arsa', 'ev', 'villa', 'tarla', 'diger')),
  price NUMERIC,
  show_price BOOLEAN DEFAULT TRUE,
  area_sqm NUMERIC,
  zoning_status TEXT,
  deed_type TEXT,
  parcel_info TEXT,
  region_id UUID REFERENCES regions(id) ON DELETE SET NULL,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  instagram_video_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_sold BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- listing_images: Ilan gorselleri
-- ----------------------------------------------------------------------------
CREATE TABLE listing_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- customers: Saticilar (mulk sahipleri)
-- ----------------------------------------------------------------------------
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  notes TEXT,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  deed_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- prospects: Emlak arayanlar
-- ----------------------------------------------------------------------------
CREATE TABLE prospects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  budget_min NUMERIC,
  budget_max NUMERIC,
  desired_type TEXT CHECK (desired_type IN ('arsa', 'ev', 'villa', 'tarla', 'diger')),
  desired_region_id UUID REFERENCES regions(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- 3. TRIGGERS
-- ============================================================================

-- Yeni kullanici kayit oldugunda profil olustur
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Listing guncellendiginde updated_at alanini otomatik guncelle
CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Tum tablolarda RLS'yi aktif et
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- profiles RLS Politikalari
-- ----------------------------------------------------------------------------

-- Kullanicilar kendi profillerini okuyabilir
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Admin panelinde admin listesi icin herkes profilleri okuyabilir
CREATE POLICY "Anyone can read profiles"
ON profiles FOR SELECT
USING (true);

-- Super admin'ler herhangi bir profilin rolunu guncelleyebilir
CREATE POLICY "Super admins can update any profile role"
ON profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'super_admin'
  )
);

-- ----------------------------------------------------------------------------
-- regions RLS Politikalari
-- ----------------------------------------------------------------------------

-- Herkes bolgeleri okuyabilir (public)
CREATE POLICY "Public read regions"
ON regions FOR SELECT
USING (true);

-- Sadece admin/super_admin bolge ekleyebilir
CREATE POLICY "Admin insert regions"
ON regions FOR INSERT
WITH CHECK (public.is_admin());

-- Sadece admin/super_admin bolge guncelleyebilir
CREATE POLICY "Admin update regions"
ON regions FOR UPDATE
USING (public.is_admin());

-- Sadece admin/super_admin bolge silebilir
CREATE POLICY "Admin delete regions"
ON regions FOR DELETE
USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- listings RLS Politikalari
-- ----------------------------------------------------------------------------

-- Herkes aktif ilanlari okuyabilir (public site icin)
CREATE POLICY "Public read active listings"
ON listings FOR SELECT
USING (is_active = true);

-- Admin'ler tum ilanlari okuyabilir (admin panel icin)
CREATE POLICY "Admin read all listings"
ON listings FOR SELECT
USING (public.is_admin());

-- Sadece admin/super_admin ilan ekleyebilir
CREATE POLICY "Admin insert listings"
ON listings FOR INSERT
WITH CHECK (public.is_admin());

-- Sadece admin/super_admin ilan guncelleyebilir
CREATE POLICY "Admin update listings"
ON listings FOR UPDATE
USING (public.is_admin());

-- Sadece admin/super_admin ilan silebilir
CREATE POLICY "Admin delete listings"
ON listings FOR DELETE
USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- listing_images RLS Politikalari
-- ----------------------------------------------------------------------------

-- Herkes ilan gorsellerini okuyabilir (public)
CREATE POLICY "Public read listing images"
ON listing_images FOR SELECT
USING (true);

-- Sadece admin/super_admin gorsel ekleyebilir
CREATE POLICY "Admin insert listing images"
ON listing_images FOR INSERT
WITH CHECK (public.is_admin());

-- Sadece admin/super_admin gorsel guncelleyebilir
CREATE POLICY "Admin update listing images"
ON listing_images FOR UPDATE
USING (public.is_admin());

-- Sadece admin/super_admin gorsel silebilir
CREATE POLICY "Admin delete listing images"
ON listing_images FOR DELETE
USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- customers RLS Politikalari
-- ----------------------------------------------------------------------------

-- Sadece admin/super_admin musteri bilgilerini okuyabilir
CREATE POLICY "Admin read customers"
ON customers FOR SELECT
USING (public.is_admin());

-- Sadece admin/super_admin musteri ekleyebilir
CREATE POLICY "Admin insert customers"
ON customers FOR INSERT
WITH CHECK (public.is_admin());

-- Sadece admin/super_admin musteri guncelleyebilir
CREATE POLICY "Admin update customers"
ON customers FOR UPDATE
USING (public.is_admin());

-- Sadece admin/super_admin musteri silebilir
CREATE POLICY "Admin delete customers"
ON customers FOR DELETE
USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- prospects RLS Politikalari
-- ----------------------------------------------------------------------------

-- Sadece admin/super_admin aday bilgilerini okuyabilir
CREATE POLICY "Admin read prospects"
ON prospects FOR SELECT
USING (public.is_admin());

-- Sadece admin/super_admin aday ekleyebilir
CREATE POLICY "Admin insert prospects"
ON prospects FOR INSERT
WITH CHECK (public.is_admin());

-- Sadece admin/super_admin aday guncelleyebilir
CREATE POLICY "Admin update prospects"
ON prospects FOR UPDATE
USING (public.is_admin());

-- Sadece admin/super_admin aday silebilir
CREATE POLICY "Admin delete prospects"
ON prospects FOR DELETE
USING (public.is_admin());


-- ============================================================================
-- 5. STORAGE BUCKET
-- ============================================================================

-- Ilan gorselleri icin public storage bucket olustur
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true);

-- Herkes ilan gorsellerini okuyabilir (public)
CREATE POLICY "Public read listing images"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing-images');

-- Sadece admin/super_admin gorsel yukleyebilir
CREATE POLICY "Admin upload listing images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'listing-images' AND public.is_admin());

-- Sadece admin/super_admin gorsel silebilir
CREATE POLICY "Admin delete listing images"
ON storage.objects FOR DELETE
USING (bucket_id = 'listing-images' AND public.is_admin());


-- ============================================================================
-- SCHEMA TAMAMLANDI
-- ============================================================================
-- Bu SQL'i Supabase SQL Editor'de calistirdiktan sonra:
-- 1. Authentication > Settings > Site URL'yi ayarlayin
-- 2. Ilk kullaniciyi Authentication > Users'dan olusturun
-- 3. Gerekirse profiles tablosundan ilk kullanicinin rolunu 'super_admin' yapin
-- ============================================================================

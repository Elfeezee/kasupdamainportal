
-- Migration: Create News and Publications Tables
-- Created at: 2026-02-12

-- News Items Table
CREATE TABLE IF NOT EXISTS news_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    date TIMESTAMPTZ DEFAULT now(),
    summary TEXT,
    content TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Publications Table
CREATE TABLE IF NOT EXISTS publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    type TEXT, -- e.g. "Master Plan", "Report", "Handbook"
    summary TEXT,
    download_url TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies (Enable Read for everyone, Write for Admins)
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

-- Public Select
DROP POLICY IF EXISTS "Allow public read news_items" ON news_items;
CREATE POLICY "Allow public read news_items" ON news_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read publications" ON publications;
CREATE POLICY "Allow public read publications" ON publications FOR SELECT USING (true);

-- Admin All
DROP POLICY IF EXISTS "Allow admin all news_items" ON news_items;
CREATE POLICY "Allow admin all news_items" ON news_items 
    FOR ALL 
    USING (auth.uid() IN (SELECT uid FROM users WHERE role IN ('Admin', 'Super Admin')));

DROP POLICY IF EXISTS "Allow admin all publications" ON publications;
CREATE POLICY "Allow admin all publications" ON publications 
    FOR ALL 
    USING (auth.uid() IN (SELECT uid FROM users WHERE role IN ('Admin', 'Super Admin')));

-- Storage Bucket for News and Publications Media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('news_media', 'news_media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for news_media
-- Public Read
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'news_media');

-- Admin Upload
DROP POLICY IF EXISTS "Admin Upload Access" ON storage.objects;
CREATE POLICY "Admin Upload Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'news_media' AND 
    (SELECT role FROM public.users WHERE uid = auth.uid()) IN ('Admin', 'Super Admin')
);

-- Admin Update
DROP POLICY IF EXISTS "Admin Update Access" ON storage.objects;
CREATE POLICY "Admin Update Access"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'news_media' AND 
    (SELECT role FROM public.users WHERE uid = auth.uid()) IN ('Admin', 'Super Admin')
);

-- Admin Delete
DROP POLICY IF EXISTS "Admin Delete Access" ON storage.objects;
CREATE POLICY "Admin Delete Access"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'news_media' AND 
    (SELECT role FROM public.users WHERE uid = auth.uid()) IN ('Admin', 'Super Admin')
);

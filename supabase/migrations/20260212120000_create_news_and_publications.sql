
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
CREATE POLICY "Allow public read news_items" ON news_items FOR SELECT USING (true);
CREATE POLICY "Allow public read publications" ON publications FOR SELECT USING (true);

-- Admin All
CREATE POLICY "Allow admin all news_items" ON news_items 
    FOR ALL 
    USING (auth.uid() IN (SELECT uid FROM users WHERE role IN ('Admin', 'Super Admin')));

CREATE POLICY "Allow admin all publications" ON publications 
    FOR ALL 
    USING (auth.uid() IN (SELECT uid FROM users WHERE role IN ('Admin', 'Super Admin')));

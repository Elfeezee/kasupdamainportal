
-- Migration: Create Carousel Table
-- Created at: 2026-04-02

CREATE TABLE IF NOT EXISTS site_carousel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    alt_text TEXT,
    title TEXT,
    subtitle TEXT,
    button_text TEXT,
    button_link TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE site_carousel ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read site_carousel" ON site_carousel;
CREATE POLICY "Allow public read site_carousel" ON site_carousel FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin all site_carousel" ON site_carousel;
CREATE POLICY "Allow admin all site_carousel" ON site_carousel 
    FOR ALL USING (auth.uid() IN (SELECT uid FROM users WHERE role IN ('Admin', 'Super Admin')));

-- Insert initial data
INSERT INTO site_carousel (image_url, alt_text, title, subtitle, display_order) VALUES
('/image/logo.png', 'KASUPDA Logo', 'Welcome to KASUPDA', 'Building a sustainable Kaduna State through strategic urban planning.', 1),
('/image/logo.png', 'KASUPDA Logo', 'Urban Renewal', 'Transforming our cities for a better future.', 2);

-- Migration: Create MDA Logos Table
-- Created at: 2026-04-09

CREATE TABLE IF NOT EXISTS site_mda_logos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE site_mda_logos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read site_mda_logos" ON site_mda_logos;
CREATE POLICY "Allow public read site_mda_logos" ON site_mda_logos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin all site_mda_logos" ON site_mda_logos;
CREATE POLICY "Allow admin all site_mda_logos" ON site_mda_logos 
    FOR ALL USING (auth.uid() IN (SELECT uid FROM users WHERE role IN ('Admin', 'Super Admin')));

-- Insert initial data
INSERT INTO site_mda_logos (name, logo_url, display_order) VALUES
('KADGIS', '/image/logo.png', 1),
('KIFC', '/image/logo.png', 2);

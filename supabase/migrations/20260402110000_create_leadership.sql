
-- Migration: Create Leadership Table
-- Created at: 2026-04-02

CREATE TABLE IF NOT EXISTS site_leadership (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL, -- e.g. "Governor", "DG", "Management"
    bio TEXT,
    full_bio TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE site_leadership ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read site_leadership" ON site_leadership;
CREATE POLICY "Allow public read site_leadership" ON site_leadership FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin all site_leadership" ON site_leadership;
CREATE POLICY "Allow admin all site_leadership" ON site_leadership 
    FOR ALL USING (auth.uid() IN (SELECT uid FROM users WHERE role IN ('Admin', 'Super Admin')));

-- Insert initial data
INSERT INTO site_leadership (name, role, bio, full_bio, image_url, display_order) VALUES
('Sen. Uba Sani', 'Governor', 
 'His Excellency, Governor Uba Sani, is dedicated to the sustainable development and modernization of Kaduna State. His administration champions strategic initiatives that foster economic growth, improve infrastructure, and enhance the quality of life for all citizens.',
 'Full bio details for Governor...',
 '/image/uba.JPG', 1),
('Bldr. Abdurrahman Yahya Phd.', 'Director General', 
 'Our Director General, Bldr. Abdurrahman Yahya, is a visionary leader, deeply committed to the advancement and modernization of KASUPDA. With a steadfast dedication to progress, he champions innovative strategies and fosters a culture of excellence within the authority.',
 'Full bio details for DG...',
 '/image/dg.jpg', 2);

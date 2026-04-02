
-- Migration: Create Statistics and Events Tables
-- Created at: 2026-04-02

-- Statistics Table (Our Impact In Numbers)
CREATE TABLE IF NOT EXISTS site_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    icon TEXT, -- Lucide icon name
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Events Table (Events & Public Engagement)
CREATE TABLE IF NOT EXISTS site_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    event_date TIMESTAMPTZ NOT NULL,
    date_text TEXT, -- e.g. "March 10, 2026"
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE site_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_events ENABLE ROW LEVEL SECURITY;

-- Public Select
DROP POLICY IF EXISTS "Allow public read site_statistics" ON site_statistics;
CREATE POLICY "Allow public read site_statistics" ON site_statistics FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read site_events" ON site_events;
CREATE POLICY "Allow public read site_events" ON site_events FOR SELECT USING (true);

-- Admin All
DROP POLICY IF EXISTS "Allow admin all site_statistics" ON site_statistics;
CREATE POLICY "Allow admin all site_statistics" ON site_statistics 
    FOR ALL 
    USING (auth.uid() IN (SELECT uid FROM users WHERE role IN ('Admin', 'Super Admin')));

DROP POLICY IF EXISTS "Allow admin all site_events" ON site_events;
CREATE POLICY "Allow admin all site_events" ON site_events 
    FOR ALL 
    USING (auth.uid() IN (SELECT uid FROM users WHERE role IN ('Admin', 'Super Admin')));

-- Insert initial data for statistics
INSERT INTO site_statistics (label, value, icon, display_order) VALUES
('Permits Issued', '5240+', 'FileText', 1),
('Avg. Processing Time', '48hrs', 'Clock', 2),
('Master Plans', '32', 'ClipboardList', 3),
('Community Projects', '12', 'Users', 4);

-- Insert initial data for events
INSERT INTO site_events (title, event_date, date_text) VALUES
('Planning Stakeholders Meeting', '2026-03-25T10:00:00Z', 'March 10, 2026'),
('Public Hearing', '2026-04-27T10:00:00Z', 'April 10, 2026');

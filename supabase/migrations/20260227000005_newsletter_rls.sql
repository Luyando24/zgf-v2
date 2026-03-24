-- RLS policies for newsletter_subscribers
DROP POLICY IF EXISTS "Public can subscribe" ON newsletter_subscribers;
CREATE POLICY "Public can subscribe" ON newsletter_subscribers
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated Manage Newsletter" ON newsletter_subscribers;
CREATE POLICY "Authenticated Manage Newsletter" ON newsletter_subscribers
FOR ALL TO authenticated USING (true);

-- Add source column if it doesn't exist
ALTER TABLE newsletter_subscribers ADD COLUMN IF NOT EXISTS source VARCHAR(255) DEFAULT 'website';

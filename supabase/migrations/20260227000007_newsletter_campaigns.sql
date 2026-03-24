-- Newsletter Campaigns Table
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
    id BIGSERIAL PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, sending, sent, failed
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    total_recipients INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;

-- Policies for Authenticated Admins
DROP POLICY IF EXISTS "Authenticated Manage Newsletter Campaigns" ON newsletter_campaigns;
CREATE POLICY "Authenticated Manage Newsletter Campaigns" ON newsletter_campaigns
FOR ALL TO authenticated USING (true);

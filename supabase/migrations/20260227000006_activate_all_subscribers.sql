-- Set all newsletter subscribers to active status
UPDATE newsletter_subscribers SET status = 'active', updated_at = NOW();

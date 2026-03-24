-- Add RLS policies for community_initiatives table

DROP POLICY IF EXISTS "Public Read Initiatives" ON community_initiatives;
CREATE POLICY "Public Read Initiatives" ON community_initiatives 
FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Authenticated Manage Initiatives" ON community_initiatives;
CREATE POLICY "Authenticated Manage Initiatives" ON community_initiatives 
FOR ALL TO authenticated USING (true);

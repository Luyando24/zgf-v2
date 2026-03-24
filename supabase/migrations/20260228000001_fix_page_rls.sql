-- Migration to fix missing RLS policies for various content tables

-- 1. about_sections
DROP POLICY IF EXISTS "Public Read About Sections" ON about_sections;
CREATE POLICY "Public Read About Sections" ON about_sections FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated Manage About Sections" ON about_sections;
CREATE POLICY "Authenticated Manage About Sections" ON about_sections FOR ALL TO authenticated USING (true);


-- 2. stats
DROP POLICY IF EXISTS "Public Read Stats" ON stats;
CREATE POLICY "Public Read Stats" ON stats FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated Manage Stats" ON stats;
CREATE POLICY "Authenticated Manage Stats" ON stats FOR ALL TO authenticated USING (true);


-- 3. services
DROP POLICY IF EXISTS "Public Read Services" ON services;
CREATE POLICY "Public Read Services" ON services FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated Manage Services" ON services;
CREATE POLICY "Authenticated Manage Services" ON services FOR ALL TO authenticated USING (true);


-- 4. pillars
DROP POLICY IF EXISTS "Public Read Pillars" ON pillars;
CREATE POLICY "Public Read Pillars" ON pillars FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated Manage Pillars" ON pillars;
CREATE POLICY "Authenticated Manage Pillars" ON pillars FOR ALL TO authenticated USING (true);


-- 5. communities
DROP POLICY IF EXISTS "Public Read Communities" ON communities;
CREATE POLICY "Public Read Communities" ON communities FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated Manage Communities" ON communities;
CREATE POLICY "Authenticated Manage Communities" ON communities FOR ALL TO authenticated USING (true);


-- 6. heroes
DROP POLICY IF EXISTS "Public Read Heroes" ON heroes;
CREATE POLICY "Public Read Heroes" ON heroes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated Manage Heroes" ON heroes;
CREATE POLICY "Authenticated Manage Heroes" ON heroes FOR ALL TO authenticated USING (true);


-- 7. settings
DROP POLICY IF EXISTS "Public Read Settings" ON settings;
CREATE POLICY "Public Read Settings" ON settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated Manage Settings" ON settings;
CREATE POLICY "Authenticated Manage Settings" ON settings FOR ALL TO authenticated USING (true);


-- 8. impact_pages & impact_sections
DROP POLICY IF EXISTS "Public Read Impact Pages" ON impact_pages;
CREATE POLICY "Public Read Impact Pages" ON impact_pages FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated Manage Impact Pages" ON impact_pages;
CREATE POLICY "Authenticated Manage Impact Pages" ON impact_pages FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Public Read Impact Sections" ON impact_sections;
CREATE POLICY "Public Read Impact Sections" ON impact_sections FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated Manage Impact Sections" ON impact_sections;
CREATE POLICY "Authenticated Manage Impact Sections" ON impact_sections FOR ALL TO authenticated USING (true);


-- 9. resources (Fixing/Ensuring)
DROP POLICY IF EXISTS "Public Read Resources" ON resources;
CREATE POLICY "Public Read Resources" ON resources FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Authenticated Manage Resources" ON resources;
CREATE POLICY "Authenticated Manage Resources" ON resources FOR ALL TO authenticated USING (true);

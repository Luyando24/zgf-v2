-- Seed script for About and Pillars specific layout mock data

-- ==========================================
-- 1. ABOUT PAGE (ABOUT_SECTIONS)
-- ==========================================
-- Intro
INSERT INTO about_sections (type, title, content, image, "order", is_active)
VALUES 
('about_intro', 'Who We Are', 'The Zambian Governance Foundation (ZGF) is a Zambian non-governmental organisation established in 2009. We are dedicated to strengthening the capacity of Zambian civil society organisations to participate more effectively in governance and development processes.

Our approach focuses on promoting local ownership, sustainability, and accountable governance at all levels of society.', '/images/about.jpg', 1, TRUE)
ON CONFLICT DO NOTHING;

-- Values
INSERT INTO about_sections (type, title, subtitle, content, icon, "order", is_active)
VALUES
('about_value', 'Accountability', 'Taking responsibility for our actions and outcomes.', '', 'Shield', 1, TRUE),
('about_value', 'Collaboration', 'Working together with partners for greater impact.', '', 'Users', 2, TRUE),
('about_value', 'Empowerment', 'Enabling communities to lead their own development.', '', 'Zap', 3, TRUE),
('about_value', 'Integrity', 'Being honest and transparent in everything we do.', '', 'Heart', 4, TRUE)
ON CONFLICT DO NOTHING;

-- History / Journey
INSERT INTO about_sections (type, title, subtitle, content, "order", is_active)
VALUES
('about_journey', 'Foundation Established', '2009', 'ZGF was officially launched as a Zambian NGO.', 1, TRUE),
('about_journey', 'First Major Program', '2012', 'Launched our first nationwide civil society support program.', 2, TRUE),
('about_journey', 'Expansion', '2016', 'Expanded operations to cover all ten provinces of Zambia.', 3, TRUE),
('about_journey', 'Digital Transformation', '2021', 'Introduced digital tools for better partner engagement.', 4, TRUE)
ON CONFLICT DO NOTHING;

-- ==========================================
-- 2. PILLARS PAGE (PILLARS)
-- ==========================================
-- Ensure features are seeded as JSONB
-- Note: the previous migration did this, but let's update with the exact ones from the hardcoded page if missing.
-- Since the previous one had just 3, and the page has 4, we'll clear and insert the 4 from the page.

DELETE FROM pillars;

INSERT INTO pillars (name, description, icon, color, "order", features, is_active)
VALUES
('Accountable Governance', 'Promoting transparency and accountability in the management of public resources and decision-making processes.', 'Shield', '#61A534', 1, '[{"feature": "Budget analysis and tracking"}, {"feature": "Civic education on governance"}, {"feature": "Advocacy for policy reforms"}]'::jsonb, TRUE),
('Civil Society Strengthening', 'Building the capacity of local CSOs and CBOs to effectively advocate for the rights of their communities.', 'Users', '#303030', 2, '[{"feature": "Organizational development support"}, {"feature": "Grant management training"}, {"feature": "Mentorship and coaching"}]'::jsonb, TRUE),
('Community Empowerment', 'Empowering local communities to identify their own development needs and utilize local resources for sustainable change.', 'Target', '#FFDD02', 3, '[{"feature": "Participatory community planning"}, {"feature": "Local resource mobilization"}, {"feature": "Community-led initiatives"}]'::jsonb, TRUE),
('Policy & Research', 'Generating evidence-based research to inform policy advocacy and promote democratic governance in Zambia.', 'BookOpen', '#4A90E2', 4, '[{"feature": "Policy briefs and research reports"}, {"feature": "Data-driven advocacy campaigns"}, {"feature": "Stakeholder engagement forums"}]'::jsonb, TRUE);

-- Pillar Impact Stats (storing in about_sections to avoid altering stats table)
INSERT INTO about_sections (type, title, subtitle, color, "order", is_active)
VALUES
('pillar_stat', '150+', 'Organizations Supported', 'text-primary', 1, TRUE),
('pillar_stat', '50,000+', 'Citizens Reached', 'text-green-600', 2, TRUE),
('pillar_stat', '25', 'Districts Covered', 'text-secondary', 3, TRUE),
('pillar_stat', '10+', 'Years of Impact', 'text-blue-500', 4, TRUE)
ON CONFLICT DO NOTHING;

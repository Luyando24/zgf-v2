-- Seed script for Pages Module (Initial static content extraction)

-- ==========================================
-- 1. HOME PAGE & ABOUT PAGE (ABOUT_SECTIONS)
-- ==========================================
-- Define clear types for the admin dashboard to filter by:
-- 'home_about_snippet'
-- 'about_mission'
-- 'about_vision'
-- 'about_history'
-- 'how_we_do_it_intro'

INSERT INTO about_sections (type, title, subtitle, content, image, is_active)
VALUES 
('home_about_snippet', 'About Us', NULL, 'The Zambian Governance Foundation (ZGF) is a Zambian non-governmental organisation established in 2009. Our primary goal is to strengthen the capacity of Zambian civil society organisations to participate more effectively in governance and development processes.', '/images/about.jpg', TRUE),
('about_mission', 'Mission', NULL, 'To strengthen local communities and civil society capacities to unlock and utilise available and untapped resources for sustainable development.', NULL, TRUE),
('about_vision', 'Vision', NULL, 'A Zambian society, where local communities realize their rights and shape their own development.', NULL, TRUE)
ON CONFLICT DO NOTHING;

-- ==========================================
-- 2. HOME PAGE (STATS)
-- ==========================================
INSERT INTO stats (title, value, description, "order", is_active)
VALUES
('Years', '15+', 'Years of Impact', 1, TRUE),
('Partners', '200+', 'Partners Supported', 2, TRUE),
('Provinces', '10', 'Provinces Covered', 3, TRUE),
('Lives', '50k+', 'Lives Touched', 4, TRUE),
('Solutions', '100%', 'Local Solutions', 5, TRUE)
ON CONFLICT DO NOTHING;

-- ==========================================
-- 3. WHAT WE DO (SERVICES / FOCUS AREAS)
-- ==========================================
INSERT INTO services (name, description, icon, is_active)
VALUES
('Capacity Development', 'Strengthening the institutional and operational capacity of civil society organizations to effectively deliver their mandates and serve their communities.', 'Users', TRUE),
('Grant Making', 'Providing financial support to local organizations and community initiatives that drive positive social change and sustainable development.', 'Award', TRUE),
('Policy Advocacy', 'Facilitating dialogue and engagement between civil society and government to promote policies that benefit marginalized communities.', 'MessageSquare', TRUE),
('Research & Learning', 'Generating evidence-based insights to inform practice, share lessons learned, and improve the effectiveness of development interventions.', 'BookOpen', TRUE)
ON CONFLICT DO NOTHING;

-- ==========================================
-- 4. PILLARS PAGE (PILLARS)
-- ==========================================
INSERT INTO pillars (name, description, image, color, "order", is_active)
VALUES
('Community Philanthropy', 'We promote local giving and resource mobilization to ensure communities can sustain their own development initiatives without relying entirely on external aid.', '/images/feature1.webp', '#0d6efd', 1, TRUE),
('Organizational Capacity', 'We strengthen the systems, structures, and skills of civil society organizations to make them more effective, accountable, and resilient.', '/images/feature2.webp', '#198754', 2, TRUE),
('Policy Engagement', 'We support citizens and organizations to actively participate in governance processes and influence policies that affect their lives.', '/images/feature3.webp', '#ffc107', 3, TRUE)
ON CONFLICT DO NOTHING;

-- ==========================================
-- 5. COMMUNITIES PAGE (COMMUNITIES)
-- ==========================================
INSERT INTO communities (name, description, icon, color, "order", is_active)
VALUES
('Lusaka Province', 'Supporting urban and peri-urban community initiatives focusing on youth empowerment and governance.', 'MapPin', '#0d6efd', 1, TRUE),
('Copperbelt Province', 'Working with mining communities to promote environmental justice and equitable resource distribution.', 'MapPin', '#198754', 2, TRUE),
('Southern Province', 'Partnering with rural communities on climate resilience and sustainable agricultural practices.', 'MapPin', '#ffc107', 3, TRUE)
ON CONFLICT DO NOTHING;

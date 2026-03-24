-- Add missing columns to resources table
ALTER TABLE resources ADD COLUMN IF NOT EXISTS category VARCHAR(255);
ALTER TABLE resources ADD COLUMN IF NOT EXISTS file_url VARCHAR(255);
ALTER TABLE resources ADD COLUMN IF NOT EXISTS cover_image VARCHAR(255);
ALTER TABLE resources ADD COLUMN IF NOT EXISTS tags TEXT;

-- Enable RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Resources" ON resources;
CREATE POLICY "Public Read Resources" ON resources
FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Authenticated Manage Resources" ON resources;
CREATE POLICY "Authenticated Manage Resources" ON resources
FOR ALL TO authenticated USING (true);

-- Seed mock resources
INSERT INTO resources (title, slug, description, type, download_count, is_published, created_at)
VALUES
(
  'Annual Impact Report 2023',
  'annual-impact-report-2023',
  'A comprehensive overview of ZGF''s achievements, financial performance, and community impact throughout 2023.',
  'Report',
  1245,
  true,
  '2024-01-15'
),
(
  'Civil Society Strengthening Guide',
  'civil-society-strengthening-guide',
  'A practical toolkit for local CSOs on organizational development, grant management, and effective advocacy.',
  'Guide',
  856,
  true,
  '2023-11-20'
),
(
  'Zambian Governance Policy Brief',
  'zambian-governance-policy-brief',
  'An evidence-based analysis of current governance trends in Zambia with recommendations for policy reform.',
  'Policy Brief',
  542,
  true,
  '2024-02-05'
),
(
  'Quarterly Newsletter - Q1 2024',
  'quarterly-newsletter-q1-2024',
  'The latest news, success stories, and upcoming opportunities from the Zambia Governance Foundation.',
  'Newsletter',
  320,
  true,
  '2024-02-28'
),
(
  'Community Empowerment Framework',
  'community-empowerment-framework',
  'ZGF''s proprietary model for facilitating participatory community planning and local resource mobilization.',
  'Guide',
  674,
  true,
  '2023-10-12'
),
(
  'Audited Financial Statements 2022',
  'audited-financial-statements-2022',
  'Complete transparency of ZGF''s financial management, audited by independent international standards.',
  'Financial',
  412,
  true,
  '2023-06-30'
);

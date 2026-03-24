-- Seed: Insert mock initiatives from the frontend into the live community_initiatives table

INSERT INTO community_initiatives (title, slug, category, summary, description, location, start_date, end_date, cover_image, status)
VALUES
(
  'Community Seed Bank',
  'community-seed-bank',
  'Agriculture',
  'A local initiative to preserve indigenous seeds and ensure food security for rural farmers.',
  '<p>A local initiative to preserve indigenous seeds and ensure food security for rural farmers.</p>',
  'Chibombo District',
  '2024-01-10',
  '2024-12-20',
  '/images/feature1.webp',
  'published'
),
(
  'Youth Tech Hub',
  'youth-tech-hub',
  'Education',
  'Providing digital literacy and coding skills to underprivileged youth in urban settlements.',
  '<p>Providing digital literacy and coding skills to underprivileged youth in urban settlements.</p>',
  'Lusaka',
  '2024-03-01',
  '2025-02-28',
  '/images/feature2.png',
  'published'
),
(
  'Clean Water Initiative',
  'clean-water-initiative',
  'Health',
  'Implementing solar-powered water pumps and filtration systems in remote villages.',
  '<p>Implementing solar-powered water pumps and filtration systems in remote villages.</p>',
  'Monze District',
  '2023-11-15',
  '2024-11-14',
  '/images/feature3.webp',
  'published'
);

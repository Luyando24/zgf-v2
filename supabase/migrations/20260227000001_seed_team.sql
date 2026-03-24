-- Add email column to team_members
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS category VARCHAR(255);

-- Enable RLS and add policies
DROP POLICY IF EXISTS "Public Read Team" ON team_members;
CREATE POLICY "Public Read Team" ON team_members 
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated Manage Team" ON team_members;
CREATE POLICY "Authenticated Manage Team" ON team_members 
FOR ALL TO authenticated USING (true);

-- Seed mock data
INSERT INTO team_members (name, position, category, image, animal_icon, animal_description, description, email, linkedin, twitter)
VALUES
(
  'Tarun Patel',
  'Chief Executive Officer',
  'Leadership',
  '/images/team/member1.jpg',
  '/images/team/animal1.png',
  'The Lion: Representing leadership and courage in driving ZGF''s mission.',
  'Tarun has over 20 years of experience in the development sector, focusing on governance and civil society strengthening in Southern Africa.',
  'tarun@zgf.org.zm',
  '#',
  '#'
),
(
  'Sarah Mwansa',
  'Programs Director',
  'Leadership',
  '/images/team/member2.jpg',
  '/images/team/animal2.png',
  'The Eagle: Having a clear vision for community-led development and soaring above challenges.',
  'Sarah leads our nationwide program strategy and implementation, ensuring that community voices are at the center of our work.',
  'sarah@zgf.org.zm',
  '#',
  '#'
),
(
  'John Banda',
  'Finance Manager',
  'Finance & Admin',
  '/images/team/member3.jpg',
  '/images/team/animal3.png',
  'The Ant: Meticulous, organized, and hardworking in managing resources for the greater good.',
  'John ensures transparent and efficient financial management, maintaining the highest standards of accountability for our partners.',
  'john@zgf.org.zm',
  '#',
  NULL
),
(
  'Grace Phiri',
  'Communications Officer',
  'Communications',
  '/images/team/member4.jpg',
  '/images/team/animal4.png',
  'The Weaver Bird: Crafting compelling stories and building strong networks of community impact.',
  'Grace manages ZGF''s brand and community engagement platforms, telling the stories of change from across Zambia.',
  'grace@zgf.org.zm',
  NULL,
  '#'
),
(
  'Michael Musonda',
  'M&E Specialist',
  'Programs',
  '/images/team/member5.jpg',
  '/images/team/animal5.png',
  'The Owl: Observant and analytical, providing wisdom through data and impact tracking.',
  'Michael tracks our progress and measures the lasting impact of our initiatives in communities nationwide.',
  'michael@zgf.org.zm',
  '#',
  NULL
),
(
  'Bwalya Chilufya',
  'Grants Officer',
  'Finance & Admin',
  '/images/team/member6.jpg',
  '/images/team/animal6.png',
  'The Honeyguide: Guiding our partners to the resources they need to thrive.',
  'Bwalya supports our grantmaking process, ensuring local CSOs have the support they need to implement their projects.',
  'bwalya@zgf.org.zm',
  '#',
  NULL
);

-- ZGF Supabase Schema Migration Script

-- Users Table (Public profile linked to Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(255),
    avatar_url VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to automatically create a user record in public.users on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
    id BIGSERIAL PRIMARY KEY,
    site_name VARCHAR(255),
    site_description TEXT,
    site_logo VARCHAR(255),
    site_favicon VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(255),
    address TEXT,
    facebook_url VARCHAR(255),
    twitter_url VARCHAR(255),
    instagram_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    youtube_url VARCHAR(255),
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords VARCHAR(255),
    og_image VARCHAR(255),
    google_analytics_id VARCHAR(255),
    header_scripts TEXT,
    footer_scripts TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Heroes Table
CREATE TABLE IF NOT EXISTS heroes (
    id BIGSERIAL PRIMARY KEY,
    hero_title VARCHAR(255) UNIQUE,
    hero_description TEXT,
    hero_image VARCHAR(255),
    hero_link VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    content TEXT,
    featured_image VARCHAR(255),
    author VARCHAR(255),
    category VARCHAR(255),
    is_published BOOLEAN DEFAULT FALSE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords VARCHAR(255),
    enable_schema_markup BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Volunteers Table
CREATE TABLE IF NOT EXISTS volunteers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    address VARCHAR(255),
    skills TEXT,
    availability TEXT,
    motivation TEXT,
    cv VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Donations Table
CREATE TABLE IF NOT EXISTS donations (
    id BIGSERIAL PRIMARY KEY,
    transaction_id VARCHAR(255) UNIQUE,
    amount DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'ZMW',
    payment_method VARCHAR(255),
    status VARCHAR(255),
    donor_email VARCHAR(255),
    donor_name VARCHAR(255),
    metadata TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Initiatives Table
CREATE TABLE IF NOT EXISTS community_initiatives (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    category VARCHAR(255),
    summary TEXT,
    description TEXT,
    video_url VARCHAR(255),
    cover_image VARCHAR(255),
    location VARCHAR(255),
    slug VARCHAR(255),
    start_date DATE,
    end_date DATE,
    created_by TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    position VARCHAR(255),
    description TEXT,
    image VARCHAR(255),
    facebook VARCHAR(255),
    twitter VARCHAR(255),
    linkedin VARCHAR(255),
    animal_icon VARCHAR(255),
    animal_description TEXT,
    career_category VARCHAR(255),
    department_id BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resources Table
CREATE TABLE IF NOT EXISTS resources (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    file_path VARCHAR(255),
    type VARCHAR(255), -- annual_report, impact_report, research_paper
    icon VARCHAR(255) DEFAULT 'bi bi-file-earmark-text',
    download_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Abuse Reports Table
CREATE TABLE IF NOT EXISTS abuse_reports (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    location VARCHAR(255),
    report_type VARCHAR(255),
    subject VARCHAR(255),
    description TEXT,
    evidence_file VARCHAR(255),
    is_anonymous BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'pending',
    action_taken TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partner Requests Table
CREATE TABLE IF NOT EXISTS partner_requests (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    organization VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    partnership_type VARCHAR(255),
    message TEXT,
    document VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Careers Table
CREATE TABLE IF NOT EXISTS careers (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    summary TEXT,
    description TEXT,
    location VARCHAR(255),
    type VARCHAR(50) DEFAULT 'Full-Time',
    application_deadline DATE,
    attachment VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    category VARCHAR(255),
    salary VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Applications Table
CREATE TABLE IF NOT EXISTS job_applications (
    id BIGSERIAL PRIMARY KEY,
    career_id BIGINT REFERENCES careers(id) ON DELETE CASCADE,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    cover_letter TEXT,
    cv VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- About Sections Table
CREATE TABLE IF NOT EXISTS about_sections (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(255), -- hero, mission, vision, values, journey, etc.
    title VARCHAR(255),
    subtitle VARCHAR(255),
    content TEXT,
    image VARCHAR(255),
    icon VARCHAR(255),
    color VARCHAR(255),
    metadata JSONB,
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Impact Pages Table
CREATE TABLE IF NOT EXISTS impact_pages (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    subtitle TEXT,
    hero_image VARCHAR(255),
    sections JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Impact Sections Table
CREATE TABLE IF NOT EXISTS impact_sections (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    content TEXT,
    image VARCHAR(255),
    icon VARCHAR(255),
    color VARCHAR(255) DEFAULT '#0d6efd',
    type VARCHAR(50) DEFAULT 'custom',
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pillars Table
CREATE TABLE IF NOT EXISTS pillars (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    icon VARCHAR(255),
    image VARCHAR(255),
    description TEXT,
    color VARCHAR(255) DEFAULT '#0d6efd',
    features TEXT,
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services Table
CREATE TABLE IF NOT EXISTS services (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    icon VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Capacity Development Areas Table
CREATE TABLE IF NOT EXISTS capacity_development_areas (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    icon VARCHAR(255),
    description TEXT,
    color VARCHAR(255) DEFAULT '#0d6efd',
    features TEXT,
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communities Table
CREATE TABLE IF NOT EXISTS communities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    icon VARCHAR(255),
    description TEXT,
    color VARCHAR(255) DEFAULT '#0d6efd',
    features JSONB,
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grants Table
CREATE TABLE IF NOT EXISTS grants (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    type VARCHAR(255),
    min_amount DECIMAL(10, 2),
    max_amount DECIMAL(10, 2),
    eligibility_criteria JSONB,
    required_documents JSONB,
    application_deadline DATE,
    status VARCHAR(50) DEFAULT 'open',
    featured_image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grants Pages Table
CREATE TABLE IF NOT EXISTS grants_pages (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    subtitle TEXT,
    hero_image VARCHAR(255),
    sections JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stats Table
CREATE TABLE IF NOT EXISTS stats (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    value VARCHAR(255),
    description TEXT,
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    unsubscribed_at TIMESTAMPTZ,
    last_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter Templates Table
CREATE TABLE IF NOT EXISTS newsletter_templates (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    html_content TEXT,
    blocks JSONB,
    category VARCHAR(255) DEFAULT 'general',
    thumbnail VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    variables JSONB,
    created_by BIGINT, -- Simplified for now, can link to users later
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE abuse_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE capacity_development_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE grants_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Simple RLS Policies (Allow public read, authenticated manage)
-- Note: In a production environment, you should refine these policies.

-- Users policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON users;
CREATE POLICY "Admins can view all profiles" ON users FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can update all profiles" ON users;
CREATE POLICY "Admins can update all profiles" ON users FOR UPDATE TO authenticated USING (true);

-- Example for 'posts'
DROP POLICY IF EXISTS "Public Read Posts" ON posts;
CREATE POLICY "Public Read Posts" ON posts FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Authenticated Manage Posts" ON posts;
CREATE POLICY "Authenticated Manage Posts" ON posts FOR ALL TO authenticated USING (true);

-- Example for 'volunteers' (Only authenticated can read, anyone can insert)
DROP POLICY IF EXISTS "Anyone can submit volunteer applications" ON volunteers;
CREATE POLICY "Anyone can submit volunteer applications" ON volunteers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated Manage Volunteers" ON volunteers;
CREATE POLICY "Authenticated Manage Volunteers" ON volunteers FOR ALL TO authenticated USING (true);

-- Repeat similar simple policies for other tables as needed for basic functionality

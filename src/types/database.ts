export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  is_published: boolean;
  user_id: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  enable_schema_markup: boolean;
  schema_markup: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommunityInitiative {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  cover_image: string | null;
  video_url: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  description: string | null;
  bio: string | null;
  image: string | null;
  email: string | null;
  linkedin: string | null;
  twitter: string | null;
  animal_icon: string | null;
  animal_description: string | null;
  career_category: string | null;
  department_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Stat {
  id: string;
  value: string;
  description: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Hero {
  id: string;
  hero_title: string;
  hero_image: string;
  hero_subtitle: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  file_path: string;
  type: string;
  icon: string | null;
  download_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ImpactSection {
  id: string;
  title: string;
  subtitle: string | null;
  content: string | null;
  image: string | null;
  icon: string | null;
  color: string | null;
  type: 'hero' | 'intro' | 'impact_areas' | 'stories' | 'reports' | 'detailed';
  order: number;
  is_active: boolean;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface Career {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  application_deadline: string;
  attachment: string | null;
  is_active: boolean;
  category: string;
  salary: string | null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  icon: string | null;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Pillar {
  id: string;
  name: string;
  icon: string | null;
  image: string | null;
  description: string;
  color: string | null;
  features: Array<{ feature: string }> | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Community {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
  color: string;
  features: Array<{ feature: string }> | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

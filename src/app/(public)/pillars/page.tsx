import CTA from "@/components/CTA";
import { CheckCircle2, Shield, Users, Target, BookOpen } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function PillarsPage() {
  const supabase = await createClient();
  const [pillarsRes, statsRes] = await Promise.all([
    supabase.from('pillars').select('*').eq('is_active', true).order('order', { ascending: true }),
    supabase.from('about_sections').select('*').eq('type', 'pillar_stat').eq('is_active', true).order('order', { ascending: true })
  ]);

  const dbPillars = pillarsRes.data || [];
  const dbStats = statsRes.data || [];

  const IconMap: Record<string, any> = {
    Shield: <Shield size={32} />,
    Users: <Users size={32} />,
    Target: <Target size={32} />,
    BookOpen: <BookOpen size={32} />,
    Book: <BookOpen size={32} />,
    CheckCircle2: <CheckCircle2 size={32} />
  };

  const defaultPillars = [
    { id: 'default-p-1', name: 'Capacity Development', description: 'Strengthening civil society organizations to be more effective, transparent, and sustainable in their operations.', color: '#4F46E5', icon: 'Users', features: [{ feature: 'Technical training' }, { feature: 'Organizational mentorship' }, { feature: 'Resource mobilization' }] },
    { id: 'default-p-2', name: 'Grant Making', description: 'Providing strategic financial support to community-led initiatives that drive local development and social change.', color: '#10B981', icon: 'Shield', features: [{ feature: 'Direct funding' }, { feature: 'Project support' }, { feature: 'Impact monitoring' }] },
    { id: 'default-p-3', name: 'Governance & Accountability', description: 'Promoting transparency, citizen participation, and constructive engagement between the state and its citizens.', color: '#F59E0B', icon: 'Target', features: [{ feature: 'Social accountability' }, { feature: 'Policy advocacy' }, { feature: 'Citizen engagement' }] },
    { id: 'default-p-4', name: 'Knowledge Management', description: 'Facilitating research, documentation, and the sharing of best practices to inform evidence-based programming.', color: '#3B82F6', icon: 'BookOpen', features: [{ feature: 'Research & analysis' }, { feature: 'Best practices documentation' }, { feature: 'Learning networks' }] }
  ];

  const defaultStats = [
    { id: 'default-s-1', title: '500+', subtitle: 'CSOs Supported' },
    { id: 'default-s-2', title: '10M+', subtitle: 'Grants Awarded' },
    { id: 'default-s-3', title: '116', subtitle: 'Districts Reached' },
    { id: 'default-s-4', title: '1M+', subtitle: 'Lives Impacted' }
  ];

  const parseFeatures = (feat: any) => {
    if (Array.isArray(feat)) return feat;
    if (typeof feat === 'string' && feat.trim()) {
      try {
        const parsed = JSON.parse(feat);
        if (Array.isArray(parsed)) return parsed;
        if (parsed && typeof parsed === 'object') return [parsed];
      } catch (e) {
        // If it's a plain string that can't be parsed as JSON, treat it as a single feature or comma-separated
        return feat.split(',').map(f => ({ feature: f.trim() })).filter(f => f.feature);
      }
    }
    // If it's an object, wrap it in an array
    if (feat && typeof feat === 'object' && !Array.isArray(feat)) {
      return [feat];
    }
    return [];
  };

  const pillars = (dbPillars.length > 0 ? dbPillars : defaultPillars).map(p => ({
    ...p,
    features: parseFeatures(p.features)
  }));
  const stats = dbStats.length > 0 ? dbStats : defaultStats;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Pillars</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              The foundational principles that guide our work in strengthening civil society and promoting accountable governance in Zambia.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {pillars.map((pillar: any, index: number) => (
              <div
                key={pillar.id || index}
                className="group p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-center gap-6 mb-8">
                  <div
                    className="w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-black/10 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: pillar.color }}
                  >
                    {pillar.icon && IconMap[pillar.icon] ? IconMap[pillar.icon] : <Shield size={32} />}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-dark group-hover:text-primary transition-colors" style={{ color: pillar.color }}>
                    {pillar.name}
                  </h3>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {pillar.description}
                </p>

                {pillar.features && Array.isArray(pillar.features) && (
                  <ul className="space-y-4">
                    {pillar.features.map((feature: any, fIndex: number) => (
                      <li key={fIndex} className="flex items-center gap-3 text-gray-700 font-medium">
                        <CheckCircle2 className="text-primary shrink-0" size={20} />
                        {feature?.feature || feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Through Pillars Section */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">Our Impact Through These Pillars</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              These four pillars work together to create lasting change in Zambian communities,
              fostering a more democratic, equitable, and prosperous society for all.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat: any, index: number) => (
              <div key={stat.id || index} className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
                <h3 className={`text-4xl md:text-5xl font-bold mb-3 ${stat.color || 'text-primary'}`}>
                  {stat.title}
                </h3>
                <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">
                  {stat.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA
        title="Partner With Us"
        description="Join us in building stronger communities and promoting democratic governance in Zambia"
        primaryBtnText="Get Involved"
        primaryBtnLink="/contact-us"
        secondaryBtnText="Learn More"
        secondaryBtnLink="/about"
      />
    </div>
  );
}

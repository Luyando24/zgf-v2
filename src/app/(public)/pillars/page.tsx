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
    BookOpen: <BookOpen size={32} />
  };

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
            {dbPillars.map((pillar: any, index: number) => (
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

                {pillar.features && (
                  <ul className="space-y-4">
                    {pillar.features.map((feature: any, fIndex: number) => (
                      <li key={fIndex} className="flex items-center gap-3 text-gray-700 font-medium">
                        <CheckCircle2 className="text-primary shrink-0" size={20} />
                        {feature.feature}
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
            {dbStats.map((stat, index) => (
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

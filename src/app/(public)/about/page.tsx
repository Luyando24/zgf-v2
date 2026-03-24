import Image from "next/image";
import CTA from "@/components/CTA";
import { Target, Eye, Shield, Users, Heart, Zap } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function AboutPage() {
  const supabase = await createClient();
  const { data: sections } = await supabase.from('about_sections')
    .select('*')
    .in('type', ['about_intro', 'about_mission', 'about_vision', 'about_value', 'about_journey'])
    .order('order', { ascending: true });

  const safeSections = sections || [];

  const intro = safeSections.find(s => s.type === 'about_intro');
  const mission = safeSections.find(s => s.type === 'about_mission');
  const vision = safeSections.find(s => s.type === 'about_vision');
  const values = safeSections.filter(s => s.type === 'about_value').sort((a, b) => a.order - b.order);
  const milestones = safeSections.filter(s => s.type === 'about_journey').sort((a, b) => a.order - b.order);

  const IconMap: Record<string, any> = {
    Shield: <Shield className="w-8 h-8" />,
    Users: <Users className="w-8 h-8" />,
    Zap: <Zap className="w-8 h-8" />,
    Heart: <Heart className="w-8 h-8" />
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About ZGF</h1>
            <p className="text-xl opacity-90">
              Strengthening civil society and promoting accountable governance through local solutions and partnerships.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src={intro?.image || "/images/about.jpg"}
                  alt={intro?.title || "ZGF Team"}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                {intro?.title || "Who We Are"}
              </h2>
              <div className="text-lg text-gray-700 leading-relaxed space-y-4 whitespace-pre-wrap">
                {intro?.content}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-2xl text-primary mb-6">
                <Target size={40} />
              </div>
              <h3 className="text-2xl font-bold text-dark mb-4 uppercase tracking-wider">{mission?.title || 'Our Mission'}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {mission?.content}
              </p>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-2xl text-primary mb-6">
                <Eye size={40} />
              </div>
              <h3 className="text-2xl font-bold text-dark mb-4 uppercase tracking-wider">{vision?.title || 'Our Vision'}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {vision?.content}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-16">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.id} className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="text-primary mb-6 flex justify-center group-hover:scale-110 transition-transform">
                  {value.icon && IconMap[value.icon] ? IconMap[value.icon] : <Target className="w-8 h-8" />}
                </div>
                <h4 className="text-xl font-bold text-dark mb-3">{value.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{value.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">Our Journey</h2>
            <p className="text-lg text-gray-600">
              Since our inception in 2009, we have been at the forefront of strengthening civil society in Zambia.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <span className="text-primary font-bold text-2xl mb-2 block">{milestone.subtitle}</span>
                <h5 className="font-bold text-dark mb-2">{milestone.title}</h5>
                <p className="text-gray-500 text-sm">{milestone.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </div>
  );
}

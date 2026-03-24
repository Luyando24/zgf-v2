import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Newsflash from "@/components/Newsflash";
import CTA from "@/components/CTA";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const [statsRes, aboutRes] = await Promise.all([
    supabase.from('stats').select('*').eq('is_active', true).order('order', { ascending: true }),
    supabase.from('about_sections').select('*').eq('type', 'home_about_snippet').single()
  ]);

  const stats = statsRes.data || [];
  const aboutSnippet = aboutRes.data || {
    title: 'About Us',
    content: 'The Zambian Governance Foundation (ZGF) is a Zambian non-governmental organisation established in 2009. Our primary goal is to strengthen the capacity of Zambian civil society organisations to participate more effectively in governance and development processes.',
    image: '/images/about.jpg'
  };

  return (
    <div>
      <Hero />
      <Stats statsArray={stats} />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={aboutSnippet.image || "/images/about.jpg"}
                  alt={aboutSnippet.title}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">{aboutSnippet.title}</h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                {aboutSnippet.content}
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">Mission</h3>
                  <p className="text-gray-600">
                    To strengthen local communities and civil society capacities to unlock and utilise available
                    and untapped resources for sustainable development.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">Vision</h3>
                  <p className="text-gray-600">
                    A Zambian society, where local communities realize their rights and shape their own development.
                  </p>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors">
                  Read More
                </button>
                <button className="border-2 border-primary text-primary px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-all">
                  Our Impact
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Newsflash />

      {/* Featured Initiatives Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Featured Initiatives</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore some of the local solutions we are supporting across Zambia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group relative overflow-hidden rounded-3xl aspect-[4/5] shadow-lg">
                <img
                  src={`/images/feature${i}.webp`}
                  alt={`Initiative ${i}`}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">Local Initiative {i}</h3>
                  <p className="text-sm text-gray-300 mb-6 line-clamp-2">
                    Empowering communities through sustainable agriculture and local resource management.
                  </p>
                  <button className="bg-white text-dark px-6 py-2 rounded-full font-bold text-sm w-fit hover:bg-primary hover:text-white transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="bg-primary text-white px-10 py-4 rounded-full font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
              View All Initiatives
            </button>
          </div>
        </div>
      </section>

      <CTA />
    </div>
  );
}

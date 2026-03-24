import React from 'react';
import CTA from "@/components/CTA";
import { 
  CheckCircle2, 
  Users, 
  BarChart3, 
  Settings2, 
  Lightbulb,
  Search,
  Zap,
  Briefcase,
  Heart
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

const IconMap: Record<string, any> = {
  Search: <Search size={24} />,
  Lightbulb: <Lightbulb size={24} />,
  Zap: <Zap size={24} />,
  BarChart3: <BarChart3 size={24} />,
  Users: <Users size={32} />,
  Briefcase: <Briefcase size={32} />,
  Settings2: <Settings2 size={32} />,
  Heart: <Heart size={32} />
};

// Default hardcoded content as fallback
const defaultMethodology = [
  "Community-led initiatives",
  "Sustainable development practices",
  "Inclusive decision-making",
  "Transparent resource allocation",
  "Evidence-based programming"
];

const defaultProcess = [
  {
    title: "Assessment & Engagement",
    description: "We identify community needs and engage local stakeholders to understand priorities.",
    icon: "Search"
  },
  {
    title: "Capacity Building",
    description: "We provide training, resources, and technical support to local organizations.",
    icon: "Lightbulb"
  },
  {
    title: "Implementation & Support",
    description: "We facilitate project implementation with ongoing mentorship and resources.",
    icon: "Zap"
  },
  {
    title: "Monitoring & Sustainability",
    description: "We evaluate impact and develop sustainability plans for long-term success.",
    icon: "BarChart3"
  }
];

const defaultStrategies = [
  {
    title: "Collaborative Partnerships",
    description: "We build strategic alliances between civil society, government, and private sector to maximize impact and resources.",
    icon: "Users"
  },
  {
    title: "Knowledge Management",
    description: "We document best practices, facilitate learning exchanges, and promote evidence-based approaches.",
    icon: "Briefcase"
  },
  {
    title: "Adaptive Management",
    description: "We employ flexible approaches that respond to changing contexts and emerging opportunities.",
    icon: "Settings2"
  }
];

const defaultStories = [
  {
    title: "Community Health Initiative",
    description: "Partnered with local health organizations to improve access to healthcare in rural communities, resulting in a 30% increase in service utilization."
  },
  {
    title: "Youth Leadership Program",
    description: "Trained over 200 young leaders who have gone on to implement community projects reaching more than 5,000 beneficiaries."
  },
  {
    title: "Governance Improvement Project",
    description: "Worked with 15 local organizations to strengthen governance structures, improving transparency and accountability."
  }
];

export default async function HowWeDoItPage() {
  const supabase = await createClient();
  const { data: sections } = await supabase.from('about_sections')
    .select('*')
    .in('type', ['how_we_do_it_methodology', 'how_we_do_it_process', 'how_we_do_it_strategy', 'how_we_do_it_success_story'])
    .order('order', { ascending: true });

  const safeSections = sections || [];

  // Map database sections or use defaults
  const dbMethodology = safeSections.filter(s => s.type === 'how_we_do_it_methodology').map(s => s.content);
  const methodologyPoints = dbMethodology.length > 0 ? dbMethodology : defaultMethodology;

  const dbProcess = safeSections.filter(s => s.type === 'how_we_do_it_process').map(s => ({
    title: s.title,
    description: s.content,
    icon: s.icon
  }));
  const processSteps = dbProcess.length > 0 ? dbProcess : defaultProcess;

  const dbStrategies = safeSections.filter(s => s.type === 'how_we_do_it_strategy').map(s => ({
    title: s.title,
    description: s.content,
    icon: s.icon
  }));
  const strategies = dbStrategies.length > 0 ? dbStrategies : defaultStrategies;

  const dbStories = safeSections.filter(s => s.type === 'how_we_do_it_success_story').map(s => ({
    title: s.title,
    description: s.content
  }));
  const successStories = dbStories.length > 0 ? dbStories : defaultStories;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">How We Do It</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              The Zambian Governance Foundation (ZGF) employs proven methodologies and strategic approaches to drive sustainable community development across Zambia.
            </p>
          </div>
        </div>
      </section>

      {/* Methodology & Process Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Methodology */}
            <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-dark mb-6">Our Methodology</h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                We employ a participatory approach that centers community voices and local expertise. Our work is guided by these core principles:
              </p>
              <ul className="space-y-4">
                {methodologyPoints.map((point, index) => (
                  <li key={index} className="flex items-center gap-4 text-gray-700 font-medium text-lg">
                    <CheckCircle2 className="text-primary shrink-0" size={24} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Process */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-dark mb-10">Our Strategic Process</h2>
              <div className="space-y-8 relative">
                {/* Vertical Line */}
                <div className="absolute left-[27px] top-8 bottom-8 w-[2px] bg-primary/20 hidden sm:block" />
                
                {processSteps.map((step, index) => (
                  <div key={index} className="flex gap-6 relative group">
                    <div className="bg-primary text-white w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform z-10">
                      {step.icon && IconMap[step.icon] ? IconMap[step.icon] : <Search size={24} />}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-dark mb-2">{step.title}</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Strategies Section */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-16">Our Key Strategies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {strategies.map((strategy, index) => (
              <div 
                key={index} 
                className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-300 group"
              >
                <div className="bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {strategy.icon && IconMap[strategy.icon] ? IconMap[strategy.icon] : <Users size={32} />}
                </div>
                <h3 className="text-2xl font-bold text-dark mb-4">{strategy.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {strategy.description}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <Link 
              href="/contact-us" 
              className="bg-primary text-white px-10 py-4 rounded-full font-bold hover:bg-primary-dark transition-all inline-block shadow-lg shadow-primary/20"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-16">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-all"
              >
                <div className="bg-white p-4 rounded-2xl text-primary mb-6 shadow-sm">
                  <Heart size={32} />
                </div>
                <h4 className="text-xl font-bold text-dark mb-4">{story.title}</h4>
                <p className="text-gray-600 leading-relaxed italic">
                  "{story.description}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA 
        title="Be Part of Our Process"
        description="Join us in implementing these strategies to build stronger, more accountable communities across Zambia."
        primaryBtnText="Get Involved"
        primaryBtnLink="/contact-us"
      />
    </div>
  );
}

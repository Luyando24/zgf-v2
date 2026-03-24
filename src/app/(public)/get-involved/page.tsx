import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  Heart, 
  Share2, 
  HandHelping, 
  Lightbulb, 
  Megaphone, 
  ArrowRight 
} from 'lucide-react';
import CTA from "@/components/CTA";

const involvementOptions = [
  {
    title: "Partner With Us",
    description: "Collaborate with us to support community-led development and civil society growth across Zambia.",
    icon: <Users size={32} />,
    link: "/partnership-request",
    color: "bg-primary"
  },
  {
    title: "Make a Donation",
    description: "Support our work by contributing to initiatives that empower local communities and strengthen their capacities.",
    icon: <Heart size={32} />,
    link: "/donate",
    color: "bg-red-500"
  },
  {
    title: "Join Our Network",
    description: "Connect with like-minded organizations and individuals working to build stronger, self-sustaining communities.",
    icon: <Share2 size={32} />,
    link: "/partnership-request",
    color: "bg-blue-500"
  },
  {
    title: "Volunteer",
    description: "Share your skills and time to support our community initiatives and capacity-building efforts.",
    icon: <HandHelping size={32} />,
    link: "/volunteer",
    color: "bg-yellow-500"
  },
  {
    title: "Sponsor an Initiative",
    description: "Directly fund specific projects that uplift rural and peri-urban communities through sustainable solutions.",
    icon: <Lightbulb size={32} />,
    link: "/initiatives",
    color: "bg-green-600"
  },
  {
    title: "Raise Awareness",
    description: "Help shine a light on injustice—submit reports of abuse or collaborate on awareness campaigns.",
    icon: <Megaphone size={32} />,
    link: "/report",
    color: "bg-dark"
  }
];

export default function GetInvolvedPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Get Involved</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Join us in strengthening civil society and promoting good governance across Zambia. There are many ways you can contribute to our mission.
            </p>
          </div>
        </div>
      </section>

      {/* Involvement Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {involvementOptions.map((option, index) => (
              <Link 
                key={index} 
                href={option.link}
                className="group p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:border-primary/20 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className={`${option.color} w-20 h-20 rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  {option.icon}
                </div>
                <h3 className="text-2xl font-bold text-dark mb-4 group-hover:text-primary transition-colors">
                  {option.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8">
                  {option.description}
                </p>
                <div className="mt-auto flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                  <span>Learn More</span>
                  <ArrowRight size={18} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statement */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-8">Why Get Involved?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <h4 className="text-xl font-bold text-primary mb-4">Direct Impact</h4>
                <p className="text-gray-600 text-sm leading-relaxed">Your contribution directly supports community-led initiatives that create real change in rural and urban Zambia.</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <h4 className="text-xl font-bold text-primary mb-4">Stronger Networks</h4>
                <p className="text-gray-600 text-sm leading-relaxed">Join a growing network of individuals and organizations committed to accountability and good governance.</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <h4 className="text-xl font-bold text-primary mb-4">Sustainable Future</h4>
                <p className="text-gray-600 text-sm leading-relaxed">We focus on building long-term capacities, ensuring that communities can lead their own development for years to come.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTA 
        title="Ready to make a difference?"
        description="Whether you're an individual, a CSO, or a donor, your involvement matters. Let's work together for a better Zambia."
        primaryBtnText="Contact Our Team"
        primaryBtnLink="/contact-us"
      />
    </div>
  );
}

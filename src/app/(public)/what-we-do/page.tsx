import CTA from "@/components/CTA";
import MemberOrganizations from "@/components/MemberOrganizations";
import { Handshake, Target, Users, BookOpen, Heart, Globe } from "lucide-react";

const mockServices = [
  {
    name: "Civil Society Support",
    description: "Strengthening the capacity of Zambian CSOs to participate effectively in governance and development.",
    icon: <Users size={32} />
  },
  {
    name: "Grantmaking",
    description: "Providing financial resources to support innovative community-led development initiatives.",
    icon: <Handshake size={32} />
  },
  {
    name: "Capacity Development",
    description: "Tailored training and mentorship to enhance organizational and technical skills.",
    icon: <Target size={32} />
  },
  {
    name: "Research & Advocacy",
    description: "Conducting research and advocating for policies that promote accountable governance.",
    icon: <BookOpen size={32} />
  },
  {
    name: "Community Empowerment",
    description: "Enabling local communities to lead their own development through participatory approaches.",
    icon: <Heart size={32} />
  },
  {
    name: "Partnership Building",
    description: "Facilitating collaborations between CSOs, government, and development partners.",
    icon: <Globe size={32} />
  }
];

export default function WhatWeDoPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">What We Do</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              At the Zambian Governance Foundation (ZGF), we strengthen local civil society by providing resources, partnerships, and capacity-building support to drive positive change.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockServices.map((service, index) => (
              <div 
                key={index} 
                className="group p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:border-primary/20 transition-all duration-300"
              >
                <div className="bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-dark mb-4">{service.name}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MemberOrganizations />

      <CTA 
        title="Ready to Partner With Us?"
        description="Join our network of organizations working together to create a more accountable and inclusive Zambia."
        primaryBtnText="Partner With Us"
        primaryBtnLink="/partnership-request"
      />
    </div>
  );
}

'use client';

import { Briefcase, MapPin, Clock, Calendar, ArrowRight, Search, Filter } from "lucide-react";
import Link from "next/link";
import CTA from "@/components/CTA";
import { useState } from "react";

const mockJobs = [
  {
    id: "1",
    title: "Program Manager - Governance",
    slug: "program-manager-governance",
    summary: "We are looking for an experienced Program Manager to lead our governance and civic engagement initiatives across Zambia.",
    location: "Lusaka, Zambia",
    type: "Full-time",
    category: "Programs",
    application_deadline: "2024-03-15",
    is_active: true
  },
  {
    id: "2",
    title: "Monitoring & Evaluation Officer",
    slug: "me-officer",
    summary: "The M&E Officer will be responsible for tracking the impact of our community-led development projects and reporting outcomes.",
    location: "Copperbelt, Zambia",
    type: "Contract",
    category: "Technical",
    application_deadline: "2024-03-20",
    is_active: true
  },
  {
    id: "3",
    title: "Communications Specialist",
    slug: "communications-specialist",
    summary: "Help us tell the stories of our community partners and manage ZGF's digital presence and publications.",
    location: "Lusaka, Zambia",
    type: "Full-time",
    category: "Communications",
    application_deadline: "2024-03-10",
    is_active: true
  }
];

const categories = ["All", "Programs", "Technical", "Communications", "Finance", "Administration"];

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Join Our Team</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Be part of a dedicated team working to strengthen civil society and promote accountable governance in Zambia.
            </p>
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-8 rounded-3xl bg-gray-50 border border-gray-100">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                <Briefcase size={32} />
              </div>
              <h3 className="text-xl font-bold text-dark mb-4">Meaningful Work</h3>
              <p className="text-gray-600">Contribute to sustainable development and empower local communities across Zambia.</p>
            </div>
            <div className="text-center p-8 rounded-3xl bg-gray-50 border border-gray-100">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold text-dark mb-4">Work-Life Balance</h3>
              <p className="text-gray-600">We value our team's well-being and provide a supportive, flexible working environment.</p>
            </div>
            <div className="text-center p-8 rounded-3xl bg-gray-50 border border-gray-100">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                <Filter size={32} />
              </div>
              <h3 className="text-xl font-bold text-dark mb-4">Growth & Learning</h3>
              <p className="text-gray-600">Access to professional development opportunities and a culture of continuous learning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Listing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <h2 className="text-3xl font-bold text-dark">Open Positions</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search jobs..." 
                  className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-64 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-gray-600"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-6 max-w-5xl mx-auto">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <Link 
                  key={job.id} 
                  href={`/careers/${job.slug}`}
                  className="block bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-grow">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                          {job.category}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                          {job.type}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-dark mb-3 group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 mb-6 line-clamp-2 max-w-3xl">
                        {job.summary}
                      </p>
                      <div className="flex flex-wrap gap-6 text-sm text-gray-500 font-medium">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-primary" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-primary" />
                          Deadline: {new Date(job.application_deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2 text-primary font-bold group-hover:translate-x-1 transition-transform">
                      View Details <ArrowRight size={20} />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
                <p className="text-gray-500">No positions found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <CTA 
        title="Can't find the right role?"
        description="We are always looking for passionate individuals. Send us your CV and we'll keep you in mind for future openings."
        primaryBtnText="Send CV"
        primaryBtnLink="mailto:info@zgf.org.zm"
      />
    </div>
  );
}

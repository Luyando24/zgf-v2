'use client';

import React from 'react';
import { Calendar, User, ArrowRight, Newspaper, Mail, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Newsletter from '@/components/Newsletter';

const mockNewsletters = [
  {
    id: "1",
    subject: "ZGF Newsflash: Q1 2024 Updates & Grant Announcements",
    excerpt: "Welcome to our first newsflash of the year! We have exciting updates on our community programs and new funding rounds for local CSOs.",
    sent_at: "2024-03-01",
    category: "Quarterly Update",
    creator: "Communications Team"
  },
  {
    id: "2",
    subject: "Special Edition: Impact Stories from Northern Province",
    excerpt: "In this special newsflash, we dive deep into the success stories of our partners in the Northern Province and their work in sustainable agriculture.",
    sent_at: "2024-02-15",
    category: "Special Edition",
    creator: "Programs Department"
  },
  {
    id: "3",
    subject: "ZGF Newsflash: 2023 Year in Review",
    excerpt: "Reflecting on a year of impact, collaboration, and strengthening civil society across Zambia. See our top achievements from 2023.",
    sent_at: "2023-12-28",
    category: "Annual Review",
    creator: "CEO's Office"
  },
  {
    id: "4",
    subject: "Policy Alert: New Governance Framework for NGOs",
    excerpt: "An urgent update on the new regulatory framework for NGOs in Zambia and what it means for your organization.",
    sent_at: "2023-11-10",
    category: "Policy Alert",
    creator: "Legal Department"
  }
];

export default function NewsflashPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Newsflash</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Our curated digital newsletters delivering the most important updates directly to your inbox and our archive.
            </p>
          </div>
        </div>
      </section>

      {/* Subscription CTA Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-dark text-white rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-2xl shadow-primary/10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="bg-primary/20 w-24 h-24 rounded-3xl flex items-center justify-center shrink-0">
                  <Mail size={48} className="text-primary" />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-4">Stay Connected!</h2>
                  <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    Subscribe to our newsletter to receive the latest newsflash updates directly in your inbox.
                  </p>
                  <a 
                    href="#newsletter-signup" 
                    className="inline-flex items-center gap-2 bg-white text-dark px-10 py-4 rounded-full font-black hover:bg-primary hover:text-white transition-all shadow-lg"
                  >
                    Subscribe Now
                    <ChevronRight size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Archive Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Newsletter Archive</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Browse through our previous newsflash editions to catch up on ZGF's journey and impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockNewsletters.map((newsletter) => (
              <div key={newsletter.id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full overflow-hidden">
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-primary/10 text-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                      {newsletter.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                      <Calendar size={14} className="text-primary" />
                      {new Date(newsletter.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-dark mb-4 leading-tight group-hover:text-primary transition-colors">
                    {newsletter.subject}
                  </h3>
                  
                  <p className="text-gray-500 text-sm mb-8 line-clamp-4 leading-relaxed">
                    {newsletter.excerpt}
                  </p>

                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <User size={14} className="text-primary" />
                      {newsletter.creator}
                    </span>
                    <Link 
                      href={`/newsflash/${newsletter.id}`}
                      className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all"
                    >
                      Read Edition
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Placeholder */}
          <div className="mt-20 flex justify-center gap-2">
            <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-dark font-bold hover:bg-primary hover:text-white transition-all shadow-sm">1</button>
            <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-dark font-bold hover:bg-primary hover:text-white transition-all shadow-sm">2</button>
            <button className="px-6 h-12 rounded-2xl bg-white border border-gray-100 text-dark font-bold hover:bg-primary hover:text-white transition-all shadow-sm">Next</button>
          </div>
        </div>
      </section>

      {/* Final Signup Section */}
      <div id="newsletter-signup">
        <Newsletter />
      </div>
    </div>
  );
}

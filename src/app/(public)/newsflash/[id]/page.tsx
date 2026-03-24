'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Mail, Download, Share2, Facebook, Twitter, Linkedin, ChevronRight } from 'lucide-react';
import Newsletter from '@/components/Newsletter';

export default function SingleNewsflashPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const { id } = params;
  // In a real app, you would fetch the newsletter data using the id
  const newsletter = {
    subject: "ZGF Newsflash: Q1 2024 Updates & Grant Announcements",
    category: "Quarterly Update",
    creator: "Communications Team",
    sent_at: "2024-03-01",
    content: `
      <div className="space-y-6">
        <p className="text-lg leading-relaxed text-gray-600">
          Welcome to the first ZGF Newsflash of 2024! As we embark on another year of driving sustainable development and strengthening civil society in Zambia, we are excited to share some of our latest achievements and upcoming opportunities.
        </p>
        
        <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10">
          <h2 className="text-2xl font-bold text-primary mb-4">Grant Call: Community Resilience Fund</h2>
          <p className="mb-4 text-gray-700">
            We are pleased to announce a new round of funding specifically targeted at community-based organizations working on climate adaptation and sustainable agriculture.
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600">
            <li><strong>Eligibility:</strong> Registered Zambian CSOs/CBOs</li>
            <li><strong>Focus:</strong> Climate resilience, local food systems</li>
            <li><strong>Deadline:</strong> March 31, 2024</li>
          </ul>
          <Link href="/grants" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
            View Grant Details <ChevronRight size={18} />
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-dark mt-10 mb-4">Highlight: Women's Leadership in Monze</h2>
        <p className="mb-6 leading-relaxed text-gray-600">
          Last month, our team visited the Monze District to witness the incredible progress made by the Women's Cooperative Network. Through ZGF's technical support, these women have successfully established a micro-savings scheme that has already supported 15 new small businesses in the area.
        </p>

        <h2 className="text-2xl font-bold text-dark mt-10 mb-4">Upcoming Events</h2>
        <div className="space-y-4">
          <div className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="bg-gray-50 w-16 h-16 rounded-xl flex flex-col items-center justify-center shrink-0 border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Mar</span>
              <span className="text-2xl font-black text-primary">15</span>
            </div>
            <div>
              <h4 className="font-bold text-dark">Governance Stakeholder Forum</h4>
              <p className="text-xs text-gray-500">Lusaka International Convention Centre</p>
            </div>
          </div>
          <div className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="bg-gray-50 w-16 h-16 rounded-xl flex flex-col items-center justify-center shrink-0 border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Apr</span>
              <span className="text-2xl font-black text-primary">02</span>
            </div>
            <div>
              <h4 className="font-bold text-dark">Digital Skills Workshop for NGOs</h4>
              <p className="text-xs text-gray-500">Online / Virtual Event</p>
            </div>
          </div>
        </div>
      </div>
    `
  };

  return (
    <div className="flex flex-col">
      {/* Newsletter Header */}
      <section className="bg-gray-50 pt-20 pb-20 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2" />
        
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/newsflash" 
              className="inline-flex items-center gap-2 text-primary font-bold mb-10 hover:gap-3 transition-all"
            >
              <ArrowLeft size={20} />
              Back to Archive
            </Link>
            
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="bg-primary/10 text-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                {newsletter.category}
              </span>
              <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-primary" />
                  {new Date(newsletter.sent_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <User size={14} className="text-primary" />
                  {newsletter.creator}
                </span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-dark mb-10 leading-[1.2]">
              {newsletter.subject}
            </h1>

            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all">
                <Download size={18} />
                Download PDF Version
              </button>
              <button className="flex items-center gap-2 bg-white text-dark px-8 py-3.5 rounded-2xl font-bold hover:bg-gray-50 border border-gray-200 transition-all">
                <Share2 size={18} />
                Share Edition
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Newsletter Frame */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-black/[0.02] p-8 md:p-16 relative">
              <div className="absolute top-8 right-8 text-primary/10">
                <Mail size={120} strokeWidth={1} />
              </div>
              
              <div className="relative z-10">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: newsletter.content }}
                />
              </div>

              {/* Newsletter Footer */}
              <div className="mt-20 pt-10 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-400 mb-6 font-medium">
                  This newsflash was sent to all ZGF subscribers on {new Date(newsletter.sent_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
                </p>
                <div className="flex justify-center gap-4">
                  <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all"><Facebook size={18} /></button>
                  <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-sky-500 hover:text-white transition-all"><Twitter size={18} /></button>
                  <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-700 hover:text-white transition-all"><Linkedin size={18} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Edits Section */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12 flex justify-between items-end">
            <h2 className="text-3xl font-black text-dark">Other Editions</h2>
            <Link href="/newsflash" className="text-primary font-black text-sm uppercase tracking-widest hover:underline">Full Archive</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/newsflash/2" className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 block">Special Edition</span>
              <h3 className="text-xl font-bold text-dark group-hover:text-primary transition-colors mb-2">Impact Stories from Northern Province</h3>
              <p className="text-gray-500 text-sm">Feb 15, 2024</p>
            </Link>
            <Link href="/newsflash/3" className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 block">Annual Review</span>
              <h3 className="text-xl font-bold text-dark group-hover:text-primary transition-colors mb-2">ZGF Newsflash: 2023 Year in Review</h3>
              <p className="text-gray-500 text-sm">Dec 28, 2023</p>
            </Link>
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}

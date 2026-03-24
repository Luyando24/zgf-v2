'use client';

import React from 'react';
import Image from 'next/image';
import { Mail, Linkedin, Twitter, Sparkles } from 'lucide-react';
import CTA from "@/components/CTA";
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

const categories = ["Leadership", "Programs", "Finance & Admin", "Communications"];

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from('team_members').select('*').order('id', { ascending: true });
      setTeamMembers(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Team</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Meet the dedicated professionals working together to strengthen civil society and empower Zambian communities.
            </p>
          </div>
        </div>
      </section>

      {/* Team Sections by Category */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="animate-spin text-primary" size={44} />
            </div>
          ) : (
            categories.map((category) => {
              const members = teamMembers.filter(m => m.category === category);
              if (members.length === 0) return null;
              return (
                <div key={category} className="mb-20 last:mb-0">
                  {/* Section Header */}
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-8 bg-primary rounded-full" />
                    <h2 className="text-2xl font-bold text-dark tracking-tight">{category}</h2>
                    <div className="flex-1 h-px bg-gray-200 ml-2" />
                    <span className="text-sm text-gray-400 font-medium">{members.length} member{members.length > 1 ? 's' : ''}</span>
                  </div>

                  {/* Cards Grid — 2 columns on md+, 1 on mobile */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="group relative flex flex-row bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-400 hover:-translate-y-0.5"
                      >
                        {/* Left: Photo + Spirit Animal Hover */}
                        <div className="relative w-36 shrink-0 overflow-hidden cursor-help">
                          {/* Member photo */}
                          {member.image ? (
                            <Image
                              src={member.image}
                              alt={member.name}
                              fill
                              className={`object-cover transition-all duration-700 ${member.animal_icon ? 'group-hover:opacity-0 group-hover:scale-110' : ''}`}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                              <span className="text-4xl font-black text-primary/40">
                                {member.name?.charAt(0)}
                              </span>
                            </div>
                          )}

                          {/* Spirit Animal overlay */}
                          {member.animal_icon && (
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600">
                              <Image
                                src={member.animal_icon}
                                alt="Spirit Animal"
                                fill
                                className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                              />
                              {/* Tooltip badge */}
                              <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-sm rounded-lg p-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 delay-100">
                                <p className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1 mb-0.5">
                                  <Sparkles size={10} /> {member.animal_name || 'Spirit Animal'}
                                </p>
                                <p className="text-[10px] text-gray-700 leading-snug font-medium line-clamp-2">
                                  {member.animal_description}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right: Content — two layers that cross-fade on hover */}
                        <div className="relative flex flex-col flex-1 p-5 min-w-0 overflow-hidden">

                          {/* DEFAULT LAYER: Name, bio, social (fades out on hover if animal exists) */}
                          <div className={`flex flex-col h-full transition-all duration-500 ${member.animal_icon ? 'group-hover:opacity-0 group-hover:-translate-y-2' : ''}`}>
                            {/* Name & Position */}
                            <div className="mb-3">
                              <h3 className="text-base font-bold text-dark leading-tight mb-1">
                                {member.name}
                              </h3>
                              <span className="inline-block text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/8 px-2 py-0.5 rounded-full">
                                {member.position}
                              </span>
                            </div>

                            {/* Bio */}
                            <div
                              className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-4 flex-1 line-clamp-p"
                              dangerouslySetInnerHTML={{ __html: member.description || '' }}
                            />

                            {/* Social Links */}
                            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                              {member.email && (
                                <a
                                  href={`mailto:${member.email}`}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-primary hover:text-white transition-all"
                                  title={member.email}
                                >
                                  <Mail size={13} />
                                </a>
                              )}
                              {member.linkedin && (
                                <a
                                  href={member.linkedin}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-primary hover:text-white transition-all"
                                  title="LinkedIn"
                                >
                                  <Linkedin size={13} />
                                </a>
                              )}
                              {member.twitter && (
                                <a
                                  href={member.twitter}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-primary hover:text-white transition-all"
                                  title="Twitter"
                                >
                                  <Twitter size={13} />
                                </a>
                              )}
                            </div>
                          </div>

                          {/* HOVER LAYER: Spirit Animal info (only if animal data exists) */}
                          {member.animal_icon && (
                            <div className="absolute inset-0 p-5 flex flex-col justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 pointer-events-none">
                              {/* Header badge */}
                              <div className="flex items-center gap-1.5 mb-1">
                                <Sparkles size={12} className="text-primary shrink-0" />
                                <span className="text-[9px] font-black text-primary uppercase tracking-widest">Spirit Animal</span>
                              </div>
                              {/* Animal name — big heading */}
                              {member.animal_name && (
                                <p className="text-base font-black text-dark mb-2 leading-tight">
                                  {member.animal_name}
                                </p>
                              )}
                              {/* Animal description */}
                              <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
                                {member.animal_description}
                              </p>
                              {/* Subtle name reminder at bottom */}
                              <p className="mt-auto pt-3 border-t border-gray-100 text-[10px] text-gray-400 font-medium">
                                {member.name}
                              </p>
                            </div>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <CTA
        title="Want to join our team?"
        description="Check out our open positions and find out how you can contribute to our mission."
        primaryBtnText="View Careers"
        primaryBtnLink="/careers"
      />
    </div>
  );
}



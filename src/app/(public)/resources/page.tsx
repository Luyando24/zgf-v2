'use client';

import React, { useState, useEffect } from 'react';
import CTA from "@/components/CTA";
import {
  Download,
  Eye,
  Search,
  FileText,
  FilePieChart,
  BookOpen,
  Newspaper,
  ArrowRight,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { createClient } from '@/utils/supabase/client';

const types = ["All", "Report", "Guide", "Policy Brief", "Newsletter", "Financial"];

function getIcon(type: string) {
  if (type === 'Report' || type === 'Financial') return FilePieChart;
  if (type === 'Guide') return BookOpen;
  if (type === 'Newsletter') return Newspaper;
  return FileText;
}

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('resources')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      setResources(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = resources.filter(r => {
    const matchesSearch =
      r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || r.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleDownload = async (resource: any) => {
    // Increment download count
    const supabase = createClient();
    await supabase
      .from('resources')
      .update({ download_count: (resource.download_count || 0) + 1 })
      .eq('id', resource.id);

    // Open file if URL exists
    if (resource.file_url) {
      window.open(resource.file_url, '_blank');
    }

    // Update local state
    setResources(prev =>
      prev.map(r => r.id === resource.id ? { ...r, download_count: (r.download_count || 0) + 1 } : r)
    );
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Resource Center</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Explore our collection of reports, guides, and publications designed to empower civil society and promote accountable governance.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-10 bg-white border-b border-gray-100 sticky top-20 z-30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${selectedType === type
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-white text-gray-500 border border-gray-200 hover:border-primary hover:text-primary"
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="animate-spin text-primary" size={44} />
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((resource) => {
                const Icon = getIcon(resource.type);
                return (
                  <div key={resource.id} className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-400 flex flex-col h-full">
                    {/* Icon */}
                    <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Icon size={28} />
                    </div>

                    {/* Type badge */}
                    <div className="mb-3">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest px-3 py-1 bg-primary/5 rounded-full">
                        {resource.type}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-dark mb-3 leading-tight group-hover:text-primary transition-colors">
                      {resource.title}
                    </h3>

                    <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                      {resource.description}
                    </p>

                    {/* Footer */}
                    <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Downloads</span>
                        <span className="text-sm font-black text-dark">{(resource.download_count || 0).toLocaleString()}</span>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/resources/${resource.slug}`}
                          className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 transition-all"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={() => handleDownload(resource)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark shadow-md shadow-primary/10 transition-all"
                        >
                          <Download size={16} />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <Search size={40} />
              </div>
              <h3 className="text-2xl font-bold text-dark mb-2">No resources found</h3>
              <p className="text-gray-500">Try adjusting your search or filters.</p>
              <button
                onClick={() => { setSearchTerm(""); setSelectedType("All"); }}
                className="mt-8 text-primary font-bold hover:underline inline-flex items-center gap-2"
              >
                Clear all filters <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </section>

      <CTA
        title="Can't find a specific document?"
        description="Our team is constantly updating our resource library. Contact us if you need help finding a particular report or publication."
        primaryBtnText="Contact Us"
        primaryBtnLink="/contact-us"
      />
    </div>
  );
}

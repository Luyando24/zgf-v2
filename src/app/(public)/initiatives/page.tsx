'use client';

import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';

const categories = ["All", "Agriculture", "Education", "Health", "Environment", "Governance"];

export default function InitiativesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('community_initiatives')
        .select('*')
        .eq('status', 'published')
        .order('id', { ascending: true }); // Mock IDs sort
      setInitiatives(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const filteredInitiatives = activeCategory === "All"
    ? initiatives
    : initiatives.filter(i => i.category === activeCategory);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-gray-50 py-16 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-dark mb-4">Community Initiatives</h1>
            <p className="text-lg text-gray-600">
              Explore our community-driven projects and discover how you can get involved or support them.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${activeCategory === category
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Initiatives Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredInitiatives.map((initiative) => (
                <Link
                  key={initiative.id}
                  href={`/initiatives/${initiative.slug}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                >
                  <div className="relative h-60">
                    <Image
                      src={initiative.cover_image || "/images/placeholder.png"}
                      alt={initiative.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {initiative.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-dark mb-4 group-hover:text-primary transition-colors">
                      {initiative.title}
                    </h3>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin size={16} className="mr-2 text-primary" />
                        {initiative.location}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar size={16} className="mr-2 text-primary" />
                        {new Date(initiative.start_date || new Date()).toLocaleDateString()} — {new Date(initiative.end_date || new Date()).toLocaleDateString()}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {initiative.summary}
                    </p>

                    <div className="mt-auto pt-6 border-t border-gray-50 flex justify-between items-center">
                      <span className="text-primary font-bold text-sm">Learn More</span>
                      <ChevronRight size={20} className="text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && filteredInitiatives.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">No initiatives found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Want to Start Your Own Initiative?</h2>
          <p className="text-lg mb-10 max-w-2xl mx-auto opacity-90">
            We support community-driven projects that create positive change. Get in touch to discuss your ideas.
          </p>
          <Link
            href="/contact-us"
            className="bg-white text-primary px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors inline-block"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}

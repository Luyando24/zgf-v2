'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Search, Tag, Newspaper } from 'lucide-react';
import Newsletter from '@/components/Newsletter';
import { createClient } from '@/utils/supabase/client';

const categories = ["All", "Capacity Building", "Grants", "Success Stories", "Governance", "Resources", "Reports"];

export default function NewsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function loadPosts() {
      const supabase = createClient();
      const { data } = await supabase
        .from('posts')
        .select('id, title, slug, featured_image, author, category, created_at, meta_description')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      if (data) setPosts(data);
      setLoading(false);
    }
    loadPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.meta_description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Latest News</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Stay informed with the latest updates, stories of change, and insights from our work across Zambia.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-12 bg-white border-b border-gray-100 sticky top-20 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search news articles..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${selectedCategory === cat
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-white text-gray-500 border border-gray-200 hover:border-primary hover:text-primary"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden animate-pulse">
                  <div className="aspect-video bg-gray-100" />
                  <div className="p-8 space-y-4">
                    <div className="h-3 bg-gray-100 rounded-full w-1/3" />
                    <div className="h-5 bg-gray-100 rounded-full" />
                    <div className="h-5 bg-gray-100 rounded-full w-3/4" />
                    <div className="h-3 bg-gray-100 rounded-full w-full" />
                    <div className="h-3 bg-gray-100 rounded-full w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/news/${post.slug}`}
                  className="group flex flex-col h-full bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                  <div className="relative aspect-video overflow-hidden">
                    {post.featured_image ? (
                      <Image
                        src={post.featured_image}
                        alt={post.title}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Newspaper size={40} className="text-gray-300" />
                      </div>
                    )}
                    {post.category && (
                      <div className="absolute top-6 left-6">
                        <span className="bg-white/95 backdrop-blur-sm text-primary text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
                          {post.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-primary" />
                        {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                      {post.author && (
                        <span className="flex items-center gap-1.5">
                          <User size={14} className="text-primary" />
                          {post.author}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-dark mb-4 leading-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>

                    {post.meta_description && (
                      <p className="text-gray-500 text-sm mb-8 line-clamp-3 leading-relaxed">
                        {post.meta_description}
                      </p>
                    )}

                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between text-primary font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                      <span>Read Full Article</span>
                      <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <Newspaper size={40} />
              </div>
              <h3 className="text-2xl font-bold text-dark mb-2">No articles found</h3>
              <p className="text-gray-500">We couldn't find any news articles matching your search criteria.</p>
              <button
                onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                className="mt-8 text-primary font-bold hover:underline inline-flex items-center gap-2"
              >
                Clear all filters <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </section>

      <Newsletter />
    </div>
  );
}

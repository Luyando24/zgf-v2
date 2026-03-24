'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar, User, ArrowLeft, Tag, Clock,
  Facebook, Twitter, Linkedin, Link2, Check, ArrowRight, Newspaper,
} from 'lucide-react';
import Newsletter from '@/components/Newsletter';
import { createClient } from '@/utils/supabase/client';

/* ─────────────────────────────────────────────
   Reading-progress hook
───────────────────────────────────────────── */
function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      setProgress(total > 0 ? Math.round((scrollTop / total) * 100) : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return progress;
}

/* ─────────────────────────────────────────────
   Copy-link hook
───────────────────────────────────────────── */
function useCopyLink() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return { copied, copy };
}

/* ─────────────────────────────────────────────
   Estimate read time from HTML content
───────────────────────────────────────────── */
function estimateReadTime(html: string) {
  const text = html.replace(/<[^>]*>/g, ' ');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/* ═══════════════════════════════════════════
   Page component
═══════════════════════════════════════════ */
export default function SingleNewsPage({ params: rawParams }: { params: Promise<{ slug: string }> }) {
  const params = React.use(rawParams);
  const [post, setPost] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const progress = useReadingProgress();
  const { copied, copy } = useCopyLink();
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      // Fetch the post by slug
      const { data: postData } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', params.slug)
        .eq('is_published', true)
        .single();

      if (postData) {
        setPost(postData);

        // Fetch 3 related posts (same category, excluding current)
        const { data: relatedData } = await supabase
          .from('posts')
          .select('id, title, slug, featured_image, category, created_at')
          .eq('is_published', true)
          .eq('category', postData.category)
          .neq('id', postData.id)
          .order('created_at', { ascending: false })
          .limit(3);

        // If not enough same-category posts, fill with latest posts
        if (!relatedData || relatedData.length < 3) {
          const { data: latestData } = await supabase
            .from('posts')
            .select('id, title, slug, featured_image, category, created_at')
            .eq('is_published', true)
            .neq('id', postData.id)
            .order('created_at', { ascending: false })
            .limit(3);
          setRelated(latestData || []);
        } else {
          setRelated(relatedData);
        }
      }

      setLoading(false);
    }
    load();
  }, [params.slug]);

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="flex flex-col bg-white animate-pulse">
        <div className="min-h-[70vh] bg-gray-200" />
        <div className="py-20 container mx-auto px-4 max-w-3xl space-y-4">
          <div className="h-4 bg-gray-100 rounded-full w-full" />
          <div className="h-4 bg-gray-100 rounded-full w-4/5" />
          <div className="h-4 bg-gray-100 rounded-full w-3/5" />
        </div>
      </div>
    );
  }

  /* ── Not found ── */
  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Newspaper size={64} className="text-gray-200" />
        <h1 className="text-2xl font-bold text-dark">Post not found</h1>
        <p className="text-gray-500">This article may have been removed or is not yet published.</p>
        <Link href="/news" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
          <ArrowLeft size={18} /> Back to News
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
  const readTime = estimateReadTime(post.content || '');

  return (
    <div className="flex flex-col bg-white">

      {/* ── Reading progress bar ── */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-primary z-[100] transition-all duration-100"
        style={{ width: `${progress}%` }}
      />

      {/* ══════════════════════════════════════
          HERO – full-bleed image + overlay
      ══════════════════════════════════════ */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        {post.featured_image ? (
          <Image src={post.featured_image} alt={post.title} fill priority className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gray-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

        <div className="relative z-10 w-full container mx-auto px-4 pb-16 pt-32">
          <div className="max-w-3xl">
            <Link href="/news" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-bold mb-8 transition-colors group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to News
            </Link>

            {post.category && (
              <div className="mb-5">
                <span className="bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                  {post.category}
                </span>
              </div>
            )}

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-8">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/70 text-xs font-bold uppercase tracking-widest">
              {post.author && (
                <span className="flex items-center gap-2">
                  <User size={14} className="text-primary" />
                  {post.author}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={14} className="text-primary" />
                {readTime} min read
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ARTICLE BODY + STICKY SHARE
      ══════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex gap-16 max-w-5xl mx-auto">

            {/* ── Sticky share sidebar (desktop) ── */}
            <aside className="hidden lg:flex flex-col items-center gap-1 pt-2" style={{ minWidth: 52 }}>
              <div className="sticky top-32 flex flex-col gap-3">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center mb-1">Share</p>

                <button
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="w-11 h-11 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                  title="Share on Facebook"
                >
                  <Facebook size={18} />
                </button>

                <button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
                  className="w-11 h-11 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all shadow-sm"
                  title="Share on X / Twitter"
                >
                  <Twitter size={18} />
                </button>

                <button
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="w-11 h-11 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all shadow-sm"
                  title="Share on LinkedIn"
                >
                  <Linkedin size={18} />
                </button>

                <button
                  onClick={copy}
                  className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-all shadow-sm ${copied ? 'bg-primary border-primary text-white' : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-primary hover:text-white hover:border-primary'}`}
                  title="Copy link"
                >
                  {copied ? <Check size={18} /> : <Link2 size={18} />}
                </button>

                <div className="w-px h-16 bg-gray-100 mx-auto mt-2" />
              </div>
            </aside>

            {/* ── Article content ── */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <article
                ref={articleRef}
                className="article-body"
                dangerouslySetInnerHTML={{ __html: post.content || '' }}
              />

              {/* ── Tags ── */}
              {post.meta_keywords && (
                <div className="mt-14 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-3">
                  <Tag size={18} className="text-primary shrink-0" />
                  {post.meta_keywords.split(',').map((tag: string) => (
                    <span key={tag} className="px-4 py-1.5 bg-gray-50 border border-gray-100 text-gray-500 text-xs font-bold rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all cursor-pointer">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* ── Mobile share strip ── */}
              <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between lg:hidden">
                <span className="text-xs font-black text-dark uppercase tracking-widest">Share this article</span>
                <div className="flex gap-2">
                  <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')} className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all"><Facebook size={16} /></button>
                  <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')} className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-sky-500 hover:text-white transition-all"><Twitter size={16} /></button>
                  <button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')} className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-700 hover:text-white transition-all"><Linkedin size={16} /></button>
                  <button onClick={copy} className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${copied ? 'bg-primary border-primary text-white' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>{copied ? <Check size={16} /> : <Link2 size={16} />}</button>
                </div>
              </div>

              {/* ── Author card ── */}
              {post.author && (
                <div className="mt-14 p-8 bg-gray-50 rounded-3xl border border-gray-100 flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <User size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Written by</p>
                    <h4 className="text-lg font-black text-dark mb-1">{post.author}</h4>
                    <p className="text-sm text-gray-500">Zambia Governance Foundation</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          RELATED ARTICLES
      ══════════════════════════════════════ */}
      {related.length > 0 && (
        <section className="py-24 bg-gray-50 border-y border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-14">
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Keep Reading</p>
                <h2 className="text-3xl font-black text-dark">More From ZGF</h2>
              </div>
              <Link href="/news" className="hidden sm:inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:gap-3 transition-all">
                View all updates <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/news/${rp.slug}`}
                  className="group flex flex-col bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl overflow-hidden transition-all duration-500"
                >
                  <div className="relative aspect-video overflow-hidden">
                    {rp.featured_image ? (
                      <Image src={rp.featured_image} alt={rp.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Newspaper size={32} className="text-gray-300" />
                      </div>
                    )}
                    {rp.category && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/95 backdrop-blur-sm text-primary text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                          {rp.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Calendar size={12} className="text-primary" />
                      {new Date(rp.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <h3 className="text-base font-bold text-dark leading-snug group-hover:text-primary transition-colors flex-grow">
                      {rp.title}
                    </h3>
                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-primary font-black text-xs uppercase tracking-widest gap-1.5 group-hover:gap-3 transition-all">
                      Read article <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Newsletter />
    </div>
  );
}

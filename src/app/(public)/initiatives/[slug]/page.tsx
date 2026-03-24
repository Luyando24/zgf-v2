'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Calendar, MapPin, ArrowLeft, Loader2
} from 'lucide-react';
import Newsletter from '@/components/Newsletter';
import { createClient } from '@/utils/supabase/client';

export default function SingleInitiativePage({ params: rawParams }: { params: Promise<{ slug: string }> }) {
    const params = React.use(rawParams);
    const [initiative, setInitiative] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const supabase = createClient();
            const { data } = await supabase
                .from('community_initiatives')
                .select('*')
                .eq('slug', params.slug)
                .eq('status', 'published')
                .single();

            setInitiative(data);
            setLoading(false);
        }
        load();
    }, [params.slug]);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (!initiative) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-4xl font-bold text-dark mb-4">Initiative Not Found</h1>
                <p className="text-gray-600 mb-8 max-w-md">The initiative you are looking for does not exist or has been removed.</p>
                <Link href="/initiatives" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors">
                    Browse Initiatives
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="bg-gray-50 py-12 border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <Link href="/initiatives" className="inline-flex items-center text-primary font-medium hover:text-primary-dark mb-8 transition-colors">
                        <ArrowLeft size={16} className="mr-2" /> Back to Initiatives
                    </Link>

                    <div className="max-w-4xl mx-auto text-center">
                        <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
                            {initiative.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6 leading-tight">
                            {initiative.title}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 font-medium">
                            {initiative.location && (
                                <div className="flex items-center">
                                    <MapPin size={18} className="mr-2 text-primary" />
                                    {initiative.location}
                                </div>
                            )}
                            {initiative.start_date && (
                                <div className="flex items-center">
                                    <Calendar size={18} className="mr-2 text-primary" />
                                    {new Date(initiative.start_date).toLocaleDateString()}
                                    {initiative.end_date && ` - ${new Date(initiative.end_date).toLocaleDateString()}`}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {initiative.cover_image && (
                <div className="container mx-auto px-4 py-8 max-w-5xl">
                    <div className="w-full h-[400px] md:h-[500px] relative rounded-3xl overflow-hidden shadow-xl">
                        <Image
                            src={initiative.cover_image}
                            alt={initiative.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-12 max-w-3xl">
                {initiative.summary && (
                    <div className="text-xl text-gray-600 font-medium leading-relaxed mb-10 pb-10 border-b border-gray-100 italic text-center">
                        "{initiative.summary}"
                    </div>
                )}

                <article
                    className="article-body"
                    dangerouslySetInnerHTML={{ __html: initiative.description || '<p>No detailed description available.</p>' }}
                />
            </div>

            <section className="py-24 bg-primary text-white mt-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Want to Get Involved?</h2>
                    <p className="text-lg max-w-2xl mx-auto mb-10 opacity-90 leading-relaxed">
                        Support the {initiative.title} and help us make a larger impact in our community. Every contribution counts.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/contact-us" className="bg-white text-primary px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                            Contact Us
                        </Link>
                        <Link href="/donate" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-primary transition-colors">
                            Donate Now
                        </Link>
                    </div>
                </div>
            </section>

            <Newsletter />
        </>
    );
}

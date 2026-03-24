'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
    Download,
    ArrowLeft,
    FileText,
    FilePieChart,
    BookOpen,
    Newspaper,
    Calendar,
    Loader2,
    ExternalLink,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';

function getIcon(type: string, size = 32) {
    if (type === 'Report' || type === 'Financial') return <FilePieChart size={size} />;
    if (type === 'Guide') return <BookOpen size={size} />;
    if (type === 'Newsletter') return <Newspaper size={size} />;
    return <FileText size={size} />;
}

export default function ResourceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [resource, setResource] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [pdfError, setPdfError] = useState(false);

    useEffect(() => {
        async function load() {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('resources')
                .select('*')
                .eq('slug', slug)
                .eq('is_published', true)
                .single();

            if (error || !data) {
                setNotFound(true);
            } else {
                setResource(data);
            }
            setLoading(false);
        }
        load();
    }, [slug]);

    const handleDownload = async () => {
        if (!resource) return;
        const supabase = createClient();
        await supabase
            .from('resources')
            .update({ download_count: (resource.download_count || 0) + 1 })
            .eq('id', resource.id);
        setResource((r: any) => ({ ...r, download_count: (r.download_count || 0) + 1 }));
        if (resource.file_url) window.open(resource.file_url, '_blank');
    };

    const isPdf = resource?.file_url?.toLowerCase().endsWith('.pdf') ||
        resource?.file_url?.includes('.pdf');

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={44} />
            </div>
        );
    }

    if (notFound || !resource) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    <AlertCircle size={40} />
                </div>
                <h1 className="text-3xl font-bold text-dark">Resource Not Found</h1>
                <p className="text-gray-500 text-center max-w-md">
                    This resource may have been removed or the link is incorrect.
                </p>
                <Link href="/resources" className="flex items-center gap-2 text-primary font-bold hover:underline">
                    <ArrowLeft size={18} /> Back to Resources
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-[72px] z-20 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
                    <Link
                        href="/resources"
                        className="flex items-center gap-2 text-gray-500 hover:text-primary font-bold text-sm transition-colors shrink-0"
                    >
                        <ArrowLeft size={18} /> Resources
                    </Link>

                    <div className="flex items-center gap-3">
                        {resource.file_url && (
                            <a
                                href={resource.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:border-primary hover:text-primary transition-all"
                            >
                                <ExternalLink size={16} /> Open in new tab
                            </a>
                        )}
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark shadow-md shadow-primary/15 transition-all"
                        >
                            <Download size={16} />
                            Download
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
                {/* Sidebar — resource info */}
                <aside className="lg:w-72 shrink-0 space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center text-primary mb-5">
                            {getIcon(resource.type)}
                        </div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest px-2.5 py-1 bg-primary/5 rounded-full">
                            {resource.type}
                        </span>
                        <h1 className="text-xl font-bold text-dark mt-3 mb-2 leading-snug">
                            {resource.title}
                        </h1>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {resource.description}
                        </p>

                        <div className="mt-5 pt-5 border-t border-gray-100 space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar size={14} className="text-gray-400" />
                                <span>{new Date(resource.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Download size={14} className="text-gray-400" />
                                <span><strong className="text-dark">{(resource.download_count || 0).toLocaleString()}</strong> downloads</span>
                            </div>
                        </div>

                        <button
                            onClick={handleDownload}
                            className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark shadow-lg shadow-primary/15 transition-all"
                        >
                            <Download size={16} /> Download File
                        </button>
                    </div>

                    {resource.tags && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Tags</p>
                            <div className="flex flex-wrap gap-2">
                                {resource.tags.split(',').map((tag: string) => (
                                    <span key={tag.trim()} className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                {/* Main — PDF viewer or fallback */}
                <main className="flex-1 min-h-[600px]">
                    {resource.file_url ? (
                        isPdf && !pdfError ? (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full min-h-[75vh]">
                                <iframe
                                    src={`${resource.file_url}#toolbar=1&view=FitH`}
                                    className="w-full h-full min-h-[75vh]"
                                    title={resource.title}
                                    onError={() => setPdfError(true)}
                                />
                            </div>
                        ) : (
                            /* Fallback: Google Docs viewer for non-PDF or iframe error */
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full min-h-[75vh]">
                                <iframe
                                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(resource.file_url)}&embedded=true`}
                                    className="w-full h-full min-h-[75vh]"
                                    title={resource.title}
                                />
                            </div>
                        )
                    ) : (
                        /* No file uploaded yet */
                        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 h-full min-h-[400px] text-center px-8">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                <FileText size={40} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-dark mb-2">No file attached</h3>
                                <p className="text-gray-400 text-sm max-w-sm">
                                    The document file has not been uploaded yet. Please check back later or contact us directly.
                                </p>
                            </div>
                            <Link href="/contact-us" className="text-primary font-bold text-sm hover:underline">
                                Contact Us
                            </Link>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

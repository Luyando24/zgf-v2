'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Plus, Edit3, Trash2, Send, Clock, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { deleteCampaign, sendCampaignNow } from '@/app/admin/newsletter/campaigns/actions';

type Campaign = {
    id: string;
    subject: string;
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
    scheduled_at: string | null;
    sent_at: string | null;
    total_recipients: number;
    created_at: string;
    updated_at: string;
};

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const loadCampaigns = async () => {
        setLoading(true);
        const supabase = createClient();
        const { data } = await supabase
            .from('newsletter_campaigns')
            .select('*')
            .order('created_at', { ascending: false });

        setCampaigns(data || []);
        setLoading(false);
    };

    useEffect(() => { loadCampaigns(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this campaign?')) return;
        setProcessingId(id);
        await deleteCampaign(id);
        setCampaigns(prev => prev.filter(c => c.id !== id));
        setProcessingId(null);
    };

    const handleSendNow = async (id: string, subject: string) => {
        if (!confirm(`Are you sure you want to send "${subject}" immediately to all active subscribers?`)) return;
        setProcessingId(id);

        // Optimistic UI update to 'sending'
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: 'sending' } : c));

        const res = await sendCampaignNow(id);
        if (res.success) {
            alert(`Campaign sent successfully to ${res.recipients} subscribers!`);
            await loadCampaigns(); // Reload for accurate timestamps/counts
        } else {
            alert(`Failed to send campaign: ${res.error}`);
            await loadCampaigns(); // Revert status
        }
        setProcessingId(null);
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            draft: 'bg-gray-100 text-gray-600 border border-gray-200',
            scheduled: 'bg-blue-50 text-blue-600 border border-blue-200',
            sending: 'bg-yellow-50 text-yellow-600 border border-yellow-200',
            sent: 'bg-green-50 text-green-600 border border-green-200',
            failed: 'bg-red-50 text-red-600 border border-red-200',
        };
        const icons = {
            draft: <FileText size={12} />,
            scheduled: <Clock size={12} />,
            sending: <Loader2 size={12} className="animate-spin" />,
            sent: <CheckCircle2 size={12} />,
            failed: <AlertCircle size={12} />,
        };
        const activeStyle = styles[status as keyof typeof styles] || styles.draft;
        const activeIcon = icons[status as keyof typeof icons] || icons.draft;

        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${activeStyle}`}>
                {activeIcon}
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <Link href="/admin/newsletter" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">Subscribers</Link>
                        <span className="text-gray-300">/</span>
                        <h1 className="text-2xl font-bold text-dark">Campaigns</h1>
                    </div>
                    <p className="text-sm text-gray-400">Manage and send your email newsletters</p>
                </div>
                <Link
                    href="/admin/newsletter/campaigns/new"
                    className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
                >
                    <Plus size={18} /> New Campaign
                </Link>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex-1">Subject</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-32 hidden sm:block">Status</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-40 hidden md:block">Delivery Details</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-28 text-right">Actions</span>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <Send size={24} />
                        </div>
                        <h3 className="text-dark font-bold mb-1">No campaigns yet</h3>
                        <p className="text-sm text-gray-400 mb-6">Create your first newsletter campaign to reach your subscribers.</p>
                        <Link
                            href="/admin/newsletter/campaigns/new"
                            className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition-all"
                        >
                            <Plus size={16} /> Create Campaign
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {campaigns.map(camp => (
                            <div key={camp.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors group">
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-dark truncate">{camp.subject}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Created {new Date(camp.created_at).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="w-32 hidden sm:block">
                                    {getStatusBadge(camp.status)}
                                </div>

                                <div className="w-40 hidden md:block text-xs text-gray-500">
                                    {camp.status === 'sent' ? (
                                        <>
                                            <p><span className="font-medium text-dark">{camp.total_recipients}</span> sent</p>
                                            <p className="text-[10px] mt-0.5">{new Date(camp.sent_at!).toLocaleDateString()}</p>
                                        </>
                                    ) : camp.status === 'scheduled' ? (
                                        <>
                                            <p className="text-blue-600 font-medium">Scheduled for:</p>
                                            <p className="text-[10px] mt-0.5">{new Date(camp.scheduled_at!).toLocaleString()}</p>
                                        </>
                                    ) : (
                                        <p className="text-gray-400 italic">—</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-end gap-2 w-28">
                                    {(camp.status === 'draft' || camp.status === 'scheduled') && (
                                        <>
                                            <button
                                                onClick={() => handleSendNow(camp.id, camp.subject)}
                                                disabled={processingId === camp.id}
                                                className="p-2 rounded-xl text-primary bg-primary/5 hover:bg-primary/10 transition-colors disabled:opacity-50"
                                                title="Send Now"
                                            >
                                                {processingId === camp.id ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                            </button>
                                            <Link
                                                href={`/admin/newsletter/campaigns/${camp.id}`}
                                                className="p-2 rounded-xl text-gray-400 hover:text-dark hover:bg-gray-100 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit3 size={16} />
                                            </Link>
                                        </>
                                    )}
                                    <button
                                        onClick={() => handleDelete(camp.id)}
                                        disabled={processingId === camp.id}
                                        className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

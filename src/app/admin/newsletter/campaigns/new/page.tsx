'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Send, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { saveCampaignDraft, scheduleCampaign, sendCampaignNow } from '@/app/admin/newsletter/campaigns/actions';

export default function CampaignComposer({ params: paramsPromise }: { params: Promise<{ id?: string }> }) {
    const params = React.use(paramsPromise);
    const router = useRouter();
    const isNew = !params.id;

    // Form state
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [scheduledAt, setScheduledAt] = useState('');

    // UI state
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [sending, setSending] = useState(false);
    const [activeTab, setActiveTab] = useState<'compose' | 'schedule'>('compose');

    useEffect(() => {
        if (!isNew) {
            const loadData = async () => {
                const supabase = createClient();
                const { data } = await supabase.from('newsletter_campaigns').select('*').eq('id', params.id).single();
                if (data) {
                    setSubject(data.subject || '');
                    setContent(data.content || '');
                    if (data.scheduled_at) {
                        // Format for datetime-local input
                        const d = new Date(data.scheduled_at);
                        setScheduledAt(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
                    }
                }
                setLoading(false);
            };
            loadData();
        }
    }, [isNew, params.id]);

    const handleSaveDraft = async () => {
        if (!subject.trim()) return alert('Subject is required');

        setSaving(true);
        const res = await saveCampaignDraft(isNew ? null : params.id!, subject, content);
        setSaving(false);

        if (res.success) {
            if (isNew) {
                router.push(`/admin/newsletter/campaigns/${res.id}`);
            } else {
                alert('Draft saved successfully');
            }
        } else {
            alert(`Failed to save draft: ${res.error}`);
        }
    };

    const handleSendNow = async () => {
        if (!subject.trim() || !content.trim()) return alert('Subject and content are required');
        if (!confirm('Are you absolutely sure you want to send this campaign to all active subscribers right now?')) return;

        setSending(true);
        // Save first just in case
        const saveRes = await saveCampaignDraft(isNew ? null : params.id!, subject, content);

        if (saveRes.success) {
            const sendRes = await sendCampaignNow(saveRes.id!);
            if (sendRes.success) {
                alert(`Campaign sent successfully to ${sendRes.recipients} subscribers!`);
                router.push('/admin/newsletter/campaigns');
            } else {
                alert(`Failed to send campaign: ${sendRes.error}`);
            }
        }
        setSending(false);
    };

    const handleSchedule = async () => {
        if (!subject.trim() || !content.trim() || !scheduledAt) return alert('Subject, content, and schedule time are required');
        const selectedDate = new Date(scheduledAt);
        if (selectedDate <= new Date()) return alert('Schedule time must be in the future');

        setSaving(true);
        const saveRes = await saveCampaignDraft(isNew ? null : params.id!, subject, content);

        if (saveRes.success) {
            const scheduleRes = await scheduleCampaign(saveRes.id!, selectedDate.toISOString());
            if (scheduleRes.success) {
                alert(`Campaign scheduled for ${selectedDate.toLocaleString()}`);
                router.push('/admin/newsletter/campaigns');
            } else {
                alert(`Failed to schedule campaign: ${scheduleRes.error}`);
            }
        }
        setSaving(false);
    };

    if (loading) return (
        <div className="flex justify-center items-center py-40">
            <Loader2 className="animate-spin text-primary" size={40} />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/newsletter/campaigns" className="p-2 -ml-2 text-gray-400 hover:text-dark hover:bg-gray-100 rounded-xl transition-all">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-dark">{isNew ? 'New Campaign' : 'Edit Campaign'}</h1>
                        <p className="text-sm text-gray-400 mt-0.5">Draft and send your newsletter</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSaveDraft}
                        disabled={saving || sending}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Draft
                    </button>
                    <button
                        onClick={handleSendNow}
                        disabled={saving || sending}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                    >
                        {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        Send Now
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-50 bg-gray-50/50 px-2 pt-2">
                    <button
                        onClick={() => setActiveTab('compose')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'compose' ? 'border-primary text-primary bg-white rounded-t-xl shadow-[0_-4px_10px_rgba(0,0,0,0.02)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Compose Email
                    </button>
                    <button
                        onClick={() => setActiveTab('schedule')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'schedule' ? 'border-primary text-primary bg-white rounded-t-xl shadow-[0_-4px_10px_rgba(0,0,0,0.02)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <Clock size={16} /> Schedule Send
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Subject Line (always visible) */}
                    <div>
                        <label className="block text-sm font-bold text-dark mb-2">Subject Line</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Enter a captivating subject line..."
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-lg placeholder:font-normal placeholder:text-gray-400"
                        />
                    </div>

                    {activeTab === 'compose' ? (
                        <div>
                            <label className="block text-sm font-bold text-dark mb-2">Email Content</label>
                            <RichTextEditor
                                value={content}
                                onChange={setContent}
                                placeholder="Write your newsletter content here... (Tip: You can use standard merge tags like {{name}} if you configure them later)."
                            />
                        </div>
                    ) : (
                        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 max-w-lg">
                            <h3 className="text-lg font-bold text-dark mb-2 flex items-center gap-2">
                                <Clock size={20} className="text-blue-500" />
                                Schedule Delivery
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Choose a future date and time for this campaign to automatically send. It will be sent to all subscribers who are "Active" at that exact time.
                            </p>

                            <label className="block text-sm font-bold text-dark mb-2">Delivery Date & Time</label>
                            <input
                                type="datetime-local"
                                value={scheduledAt}
                                onChange={(e) => setScheduledAt(e.target.value)}
                                min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 mb-6"
                            />

                            <button
                                onClick={handleSchedule}
                                disabled={saving}
                                className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50"
                            >
                                Schedule Campaign
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

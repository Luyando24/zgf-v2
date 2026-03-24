'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
    Mail,
    Search,
    Trash2,
    Download,
    CheckSquare,
    Square,
    Loader2,
    UserCheck,
    UserX,
    Users,
    TrendingUp,
    RefreshCw,
    ChevronRight,
    ChevronLeft,
    Upload,
} from 'lucide-react';
import Link from 'next/link';
import { read, utils } from 'xlsx';
import { bulkImportSubscribers } from '@/app/newsletter/actions';

type Subscriber = {
    id: string | number;
    email: string;
    name?: string;
    status: string;
    source?: string;
    created_at: string;
    updated_at?: string;
};

type FilterStatus = 'all' | 'active' | 'unsubscribed';

export default function NewsletterAdmin() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<FilterStatus>('all');
    const [selected, setSelected] = useState<Set<string | number>>(new Set());
    const [processing, setProcessing] = useState<Set<string | number>>(new Set());

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [importing, setImporting] = useState(false);

    const loadSubscribers = useCallback(async () => {
        setLoading(true);
        const supabase = createClient();
        const { data } = await supabase
            .from('newsletter_subscribers')
            .select('*')
            .order('created_at', { ascending: false });
        setSubscribers(data || []);
        setLoading(false);
    }, []);

    useEffect(() => { loadSubscribers(); }, [loadSubscribers]);

    // Derived stats
    const total = subscribers.length;
    const active = subscribers.filter(s => s.status === 'active').length;
    const unsubscribed = subscribers.filter(s => s.status === 'unsubscribed').length;
    const thisMonth = subscribers.filter(s => {
        const d = new Date(s.created_at);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    // Reset page when search or filter changes
    useEffect(() => { setCurrentPage(1); }, [search, filter]);

    // Filtered list
    const filtered = subscribers.filter(s => {
        const matchSearch = s.email.toLowerCase().includes(search.toLowerCase()) ||
            (s.name || '').toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'all' || s.status === filter;
        return matchSearch && matchFilter;
    });

    // Pagination logic
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedSubscribers = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const allSelected = paginatedSubscribers.length > 0 && paginatedSubscribers.every(s => selected.has(s.id));

    const toggleSelect = (id: string | number) => {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleStatus = async (sub: Subscriber) => {
        setProcessing(prev => new Set(prev).add(sub.id));
        const supabase = createClient();
        const newStatus = sub.status === 'active' ? 'unsubscribed' : 'active';
        await supabase.from('newsletter_subscribers').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', sub.id);
        setSubscribers(prev => prev.map(s => s.id === sub.id ? { ...s, status: newStatus } : s));
        setProcessing(prev => { const next = new Set(prev); next.delete(sub.id); return next; });
    };

    const deleteSelected = async () => {
        if (!confirm(`Delete ${selected.size} subscriber${selected.size > 1 ? 's' : ''}? This cannot be undone.`)) return;
        const supabase = createClient();
        const ids = Array.from(selected);
        await supabase.from('newsletter_subscribers').delete().in('id', ids);
        setSubscribers(prev => prev.filter(s => !selected.has(s.id)));
        setSelected(new Set());
    };

    const exportCSV = () => {
        const rows = [
            ['Email', 'Name', 'Status', 'Source', 'Subscribed'],
            ...filtered.map(s => [
                s.email,
                s.name || '',
                s.status,
                s.source || '',
                new Date(s.created_at).toLocaleDateString()
            ])
        ];
        const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImporting(true);
        try {
            const data = await file.arrayBuffer();
            const workbook = read(data);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json: any[] = utils.sheet_to_json(worksheet, { defval: '' });

            const newSubs: { email: string, name?: string }[] = [];
            json.forEach(row => {
                // Try to find email and name columns regardless of case
                const keys = Object.keys(row);
                const emailKey = keys.find(k => k.toLowerCase().includes('email'));
                const nameKey = keys.find(k => k.toLowerCase().includes('name') || k.toLowerCase().includes('first'));

                if (emailKey && row[emailKey]) {
                    const email = String(row[emailKey]).trim().toLowerCase();
                    if (email.includes('@')) {
                        newSubs.push({
                            email,
                            name: nameKey ? String(row[nameKey]).trim() : undefined
                        });
                    }
                }
            });

            if (newSubs.length === 0) {
                alert('No valid email addresses found in the file. Make sure your file has an "Email" column.');
                setImporting(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }

            const res = await bulkImportSubscribers(newSubs);
            alert(`Import complete! Successfully imported/updated ${res.imported} subscribers.`);
            await loadSubscribers();
            setCurrentPage(1);

        } catch (error) {
            console.error(error);
            alert('Failed to parse file. Please ensure it is a valid CSV or Excel file.');
        } finally {
            setImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-dark">Newsletter Subscribers</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage your mailing list</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        href="/admin/newsletter/campaigns"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all order-first sm:order-none w-full sm:w-auto justify-center"
                    >
                        <Mail size={16} /> Campaigns
                    </Link>
                    <button
                        onClick={loadSubscribers}
                        className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-primary hover:border-primary transition-all"
                        title="Refresh"
                    >
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={exportCSV}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all"
                    >
                        <Download size={16} /> Export
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={importing}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary-dark shadow-md shadow-primary/20 transition-all disabled:opacity-60"
                    >
                        {importing ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        {importing ? 'Importing...' : 'Import'}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        onChange={handleImport}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Subscribers', value: total, icon: <Users size={20} />, color: 'text-blue-500 bg-blue-50' },
                    { label: 'Active', value: active, icon: <UserCheck size={20} />, color: 'text-green-500 bg-green-50' },
                    { label: 'Unsubscribed', value: unsubscribed, icon: <UserX size={20} />, color: 'text-red-500 bg-red-50' },
                    { label: 'New This Month', value: thisMonth, icon: <TrendingUp size={20} />, color: 'text-primary bg-primary/10' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                        {loading ? (
                            <div className="h-7 w-12 bg-gray-100 animate-pulse rounded-lg mt-1" />
                        ) : (
                            <p className="text-2xl font-bold text-dark mt-1">{stat.value.toLocaleString()}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative flex-1 w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by email or name..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
                <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 shrink-0">
                    {(['all', 'active', 'unsubscribed'] as FilterStatus[]).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filter === f ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bulk bar */}
            {selected.size > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-2xl px-5 py-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">{selected.size} selected</span>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSelected(new Set())} className="text-xs font-bold text-gray-500 hover:text-gray-700">Clear</button>
                        <button
                            onClick={deleteSelected}
                            className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all"
                        >
                            <Trash2 size={14} /> Delete Selected
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Table header */}
                <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50/50">
                    <button onClick={() => {
                        if (allSelected) {
                            const next = new Set(selected);
                            paginatedSubscribers.forEach(s => next.delete(s.id));
                            setSelected(next);
                        }
                        else setSelected(prev => new Set([...Array.from(prev), ...paginatedSubscribers.map(s => s.id)]));
                    }} className="text-gray-400 hover:text-primary transition-colors shrink-0">
                        {allSelected ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} />}
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex-1">Email</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-24 hidden sm:block">Status</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-24 hidden md:block">Source</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-28 hidden lg:block">Subscribed</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-24 text-right">Actions</span>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-primary" size={36} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 text-sm">
                        <Mail size={32} className="mx-auto mb-3 opacity-30" />
                        {search || filter !== 'all' ? 'No subscribers match your filters.' : 'No subscribers yet.'}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {paginatedSubscribers.map(sub => {
                            const isProcessing = processing.has(sub.id);
                            const isSelected = selected.has(sub.id);
                            return (
                                <div
                                    key={sub.id}
                                    className={`flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-gray-50/50 ${isSelected ? 'bg-primary/5' : ''}`}
                                >
                                    <button onClick={() => toggleSelect(sub.id)} className="text-gray-300 hover:text-primary transition-colors shrink-0">
                                        {isSelected ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} />}
                                    </button>

                                    {/* Avatar */}
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                        {sub.email.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Email + name */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-dark truncate">{sub.email}</p>
                                        {sub.name && <p className="text-xs text-gray-400 truncate">{sub.name}</p>}
                                    </div>

                                    {/* Status */}
                                    <div className="w-24 hidden sm:block">
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${sub.status === 'active'
                                            ? 'bg-green-50 text-green-600'
                                            : 'bg-red-50 text-red-500'
                                            }`}>
                                            {sub.status === 'active' ? <UserCheck size={10} /> : <UserX size={10} />}
                                            {sub.status}
                                        </span>
                                    </div>

                                    {/* Source */}
                                    <span className="text-xs text-gray-400 w-24 hidden md:block truncate">{sub.source || '—'}</span>

                                    {/* Date */}
                                    <span className="text-xs text-gray-400 w-28 hidden lg:block">
                                        {new Date(sub.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 w-24 justify-end shrink-0">
                                        <button
                                            onClick={() => toggleStatus(sub)}
                                            disabled={isProcessing}
                                            className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50 ${sub.status === 'active'
                                                ? 'text-red-500 bg-red-50 hover:bg-red-100'
                                                : 'text-green-600 bg-green-50 hover:bg-green-100'
                                                }`}
                                            title={sub.status === 'active' ? 'Unsubscribe' : 'Re-subscribe'}
                                        >
                                            {isProcessing ? <Loader2 size={12} className="animate-spin" /> : sub.status === 'active' ? 'Unsub' : 'Resub'}
                                        </button>
                                        <button
                                            onClick={async () => {
                                                if (!confirm(`Delete ${sub.email}?`)) return;
                                                const supabase = createClient();
                                                await supabase.from('newsletter_subscribers').delete().eq('id', sub.id);
                                                setSubscribers(prev => prev.filter(s => s.id !== sub.id));
                                                setSelected(prev => { const next = new Set(prev); next.delete(sub.id); return next; });
                                            }}
                                            className="p-1.5 rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Footer info & Pagination */}
                {!loading && filtered.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-gray-400">
                            Showing <strong className="text-gray-600">{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong className="text-gray-600">{Math.min(currentPage * itemsPerPage, filtered.length)}</strong> of <strong className="text-gray-600">{filtered.length}</strong> entries
                        </p>

                        {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-all"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                                        // Show pages around current page
                                        let pageNum = i + 1;
                                        if (totalPages > 5) {
                                            if (currentPage > 3 && currentPage < totalPages - 1) {
                                                pageNum = currentPage - 2 + i;
                                            } else if (currentPage >= totalPages - 1) {
                                                pageNum = totalPages - 4 + i;
                                            }
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === pageNum
                                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                    : 'text-gray-500 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-all"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

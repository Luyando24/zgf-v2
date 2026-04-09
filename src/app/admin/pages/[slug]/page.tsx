/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import {
    getHomePageContent,
    saveHomeStats,
    saveHomeAboutSnippet,
    getAboutPageContent,
    saveAboutPageContent,
    getPillarsContent,
    savePillars,
    deletePillar,
    deletePillarStat,
    getServicesContent,
    saveServices,
    getHowWeDoItContent,
    saveHowWeDoItContent,
    getCommunitiesContent,
    saveCommunities,
    deleteCommunity,
    deleteAboutSection
} from '../actions';

// Individual Editor Components for different slugs

const HomeEditor = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [aboutSnippet, setAboutSnippet] = useState<any>(null);
    const [stats, setStats] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const { about, stats } = await getHomePageContent();
            setAboutSnippet(about.find((s: any) => s.type === 'home_about_snippet') || null);
            setStats(stats);
            setLoading(false);
        }
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            if (aboutSnippet) {
                await saveHomeAboutSnippet(aboutSnippet.id, aboutSnippet.title, aboutSnippet.content, aboutSnippet.image);
            }
            await saveHomeStats(stats);
            alert('Home page content saved successfully!');
        } catch (error) {
            alert('Error saving content.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;

    return (
        <div className="space-y-8 pb-12">

            {/* Action Bar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm sticky top-24 z-10">
                <span className="font-bold text-gray-500 text-sm">You have unsaved changes</span>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
                </button>
            </div>

            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <h3 className="font-bold text-dark text-lg mb-4">&quot;About Us&quot; Snippet</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-bold text-gray-700">Section Title</label>
                        <input
                            type="text"
                            value={aboutSnippet?.title || ''}
                            onChange={(e) => setAboutSnippet({ ...aboutSnippet, title: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-700">Content Description</label>
                        <textarea
                            rows={4}
                            value={aboutSnippet?.content || ''}
                            onChange={(e) => setAboutSnippet({ ...aboutSnippet, content: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                        />
                    </div>
                    {/* Note: In a full production version, an ImageUploader component to Supabase would be added here for `aboutSnippet.image` */}
                </div>
            </section>

            {/* Statistics Section */}
            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <h3 className="font-bold text-dark text-lg mb-4">Key Impact Statistics</h3>
                <p className="text-sm text-gray-500 mb-6">These numbers appear in the blue grid directly below the hero section.</p>

                <div className="space-y-4">
                    {stats.map((stat, index) => (
                        <div key={stat.id || index} className="grid grid-cols-[100px_1fr_40px] gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div>
                                <label className="text-xs font-bold text-gray-500">Value</label>
                                <input
                                    type="text"
                                    value={stat.value}
                                    onChange={(e) => {
                                        const newStats = [...stats];
                                        newStats[index] = { ...newStats[index], value: e.target.value };
                                        setStats(newStats);
                                    }}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg font-bold text-primary text-center"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Label/Description</label>
                                <input
                                    type="text"
                                    value={stat.description}
                                    onChange={(e) => {
                                        const newStats = [...stats];
                                        newStats[index] = { ...newStats[index], description: e.target.value };
                                        setStats(newStats);
                                    }}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                                />
                            </div>
                            <div className="flex justify-end pt-5">
                                <button className="text-red-500 hover:text-red-700 font-bold px-2">&times;</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

// ==========================================
// ABOUT EDITOR
// ==========================================
const AboutEditor = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sections, setSections] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const aboutSections = await getAboutPageContent();
            setSections(aboutSections);
            setLoading(false);
        }
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveAboutPageContent(sections);
            alert('About page content saved successfully!');
        } catch (error) {
            alert('Error saving content.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;

    const intro = sections.find(s => s.type === 'about_intro');
    const values = sections.filter(s => s.type === 'about_value').sort((a, b) => a.order - b.order);
    const journey = sections.filter(s => s.type === 'about_journey').sort((a, b) => a.order - b.order);

    const updateSection = (id: string, field: string, value: any) => {
        setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm sticky top-24 z-10">
                <span className="font-bold text-gray-500 text-sm">Save your changes</span>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
                </button>
            </div>

            {intro && (
                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                    <h3 className="font-bold text-dark text-lg mb-4">&quot;Who We Are&quot; Intro</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-gray-700">Intro Title</label>
                            <input
                                type="text"
                                value={intro.title || ''}
                                onChange={(e) => updateSection(intro.id, 'title', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-700">Intro Content</label>
                            <textarea
                                rows={6}
                                value={intro.content || ''}
                                onChange={(e) => updateSection(intro.id, 'content', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                        </div>
                    </div>
                </section>
            )}

            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <h3 className="font-bold text-dark text-lg mb-4">Core Values</h3>
                <div className="space-y-4">
                    {values.map((val) => (
                        <div key={val.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div>
                                <label className="text-xs font-bold text-gray-500">Value Name (e.g., Accountability)</label>
                                <input
                                    type="text"
                                    value={val.title || ''}
                                    onChange={(e) => updateSection(val.id, 'title', e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg font-bold"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Short Description</label>
                                <input
                                    type="text"
                                    value={val.subtitle || ''}
                                    onChange={(e) => updateSection(val.id, 'subtitle', e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <h3 className="font-bold text-dark text-lg mb-4">Our Journey (Milestones)</h3>
                <div className="space-y-4">
                    {journey.map((item) => (
                        <div key={item.id} className="grid grid-cols-[100px_1fr] md:grid-cols-[100px_1fr_2fr] gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div>
                                <label className="text-xs font-bold text-gray-500">Year</label>
                                <input
                                    type="text"
                                    value={item.subtitle || ''}
                                    onChange={(e) => updateSection(item.id, 'subtitle', e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-primary font-bold text-center"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Title</label>
                                <input
                                    type="text"
                                    value={item.title || ''}
                                    onChange={(e) => updateSection(item.id, 'title', e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg font-bold"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="text-xs font-bold text-gray-500">Description</label>
                                <input
                                    type="text"
                                    value={item.content || ''}
                                    onChange={(e) => updateSection(item.id, 'content', e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

/// ==========================================
// PILLARS EDITOR
// ==========================================
const PillarsEditor = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pillars, setPillars] = useState<any[]>([]);
    const [stats, setStats] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const { pillars: dp, stats: ds } = await getPillarsContent();
            
            const parseFeatures = (feat: any) => {
                if (Array.isArray(feat)) return feat;
                if (typeof feat === 'string' && feat.trim()) {
                    try {
                        const parsed = JSON.parse(feat);
                        return Array.isArray(parsed) ? parsed : [];
                    } catch (e) { return []; }
                }
                return [];
            };

            if (dp.length === 0 && ds.length === 0) {
                // ... defaults ...
                const defaultPillars = [
                    { id: 'default-p-1', name: 'Capacity Development', description: 'Strengthening civil society organizations to be more effective, transparent, and sustainable in their operations.', color: '#4F46E5', icon: 'Users', features: [{ feature: 'Technical training' }, { feature: 'Organizational mentorship' }, { feature: 'Resource mobilization' }], order: 1 },
                    { id: 'default-p-2', name: 'Grant Making', description: 'Providing strategic financial support to community-led initiatives that drive local development and social change.', color: '#10B981', icon: 'Shield', features: [{ feature: 'Direct funding' }, { feature: 'Project support' }, { feature: 'Impact monitoring' }], order: 2 },
                    { id: 'default-p-3', name: 'Governance & Accountability', description: 'Promoting transparency, citizen participation, and constructive engagement between the state and its citizens.', color: '#F59E0B', icon: 'Target', features: [{ feature: 'Social accountability' }, { feature: 'Policy advocacy' }, { feature: 'Citizen engagement' }], order: 3 },
                    { id: 'default-p-4', name: 'Knowledge Management', description: 'Facilitating research, documentation, and the sharing of best practices to inform evidence-based programming.', color: '#3B82F6', icon: 'BookOpen', features: [{ feature: 'Research & analysis' }, { feature: 'Best practices documentation' }, { feature: 'Learning networks' }], order: 4 }
                ];
                const defaultStats = [
                    { id: 'default-s-1', title: '500+', subtitle: 'CSOs Supported', order: 1 },
                    { id: 'default-s-2', title: '10M+', subtitle: 'Grants Awarded', order: 2 },
                    { id: 'default-s-3', title: '116', subtitle: 'Districts Reached', order: 3 },
                    { id: 'default-s-4', title: '1M+', subtitle: 'Lives Impacted', order: 4 }
                ];
                setPillars(defaultPillars);
                setStats(defaultStats);
            } else {
                setPillars(dp.map(p => ({ ...p, features: parseFeatures(p.features) })));
                setStats(ds);
            }
            setLoading(false);
        }
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await savePillars(pillars, stats);
            // Reload to get real IDs
            const { pillars: dp, stats: ds } = await getPillarsContent();
            setPillars(dp);
            setStats(ds);
            alert('Pillars content saved successfully!');
        } catch (error) {
            alert('Error saving content.');
        } finally {
            setSaving(false);
        }
    };

    const addPillar = () => {
        const newPillar = {
            id: `temp-${Date.now()}`,
            name: 'New Pillar',
            description: '',
            color: '#3B82F6',
            icon: 'Shield',
            features: [{ feature: '' }],
            order: pillars.length + 1
        };
        setPillars([...pillars, newPillar]);
    };

    const removePillar = async (id: string, index: number) => {
        if (!confirm('Are you sure you want to delete this pillar?')) return;
        if (!id.startsWith('temp-') && !id.startsWith('default-')) {
            await deletePillar(id);
        }
        setPillars(pillars.filter((_, i) => i !== index));
    };

    const addStat = () => {
        const newStat = {
            id: `temp-s-${Date.now()}`,
            title: 'Value',
            subtitle: 'Label',
            order: stats.length + 1
        };
        setStats([...stats, newStat]);
    };

    const removeStat = async (id: string, index: number) => {
        if (!confirm('Are you sure you want to delete this stat?')) return;
        if (!id.startsWith('temp-') && !id.startsWith('default-')) {
            await deletePillarStat(id);
        }
        setStats(stats.filter((_, i) => i !== index));
    };

    const addFeature = (pIndex: number) => {
        const newP = [...pillars];
        newP[pIndex].features = [...(newP[pIndex].features || []), { feature: '' }];
        setPillars(newP);
    };

    const removeFeature = (pIndex: number, fIndex: number) => {
        const newP = [...pillars];
        newP[pIndex].features = newP[pIndex].features.filter((_: any, i: number) => i !== fIndex);
        setPillars(newP);
    };

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm sticky top-24 z-10">
                <span className="font-bold text-gray-500 text-sm">Update core pillars & impact stats</span>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
                </button>
            </div>

            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-dark text-lg">Core Pillars</h3>
                    <button onClick={addPillar} className="text-primary text-sm font-bold hover:underline">+ Add Pillar</button>
                </div>
                <div className="space-y-8">
                    {pillars.map((pillar, index) => (
                        <div key={pillar.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4 relative">
                            <button onClick={() => removePillar(pillar.id, index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-bold">&times;</button>
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_200px] gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Pillar Name</label>
                                    <input
                                        type="text"
                                        value={pillar.name || ''}
                                        onChange={(e) => {
                                            const newP = [...pillars];
                                            newP[index] = { ...newP[index], name: e.target.value };
                                            setPillars(newP);
                                        }}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-lg"
                                        style={{ color: pillar.color }}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Color Hex</label>
                                    <input
                                        type="text"
                                        value={pillar.color || ''}
                                        onChange={(e) => {
                                            const newP = [...pillars];
                                            newP[index] = { ...newP[index], color: e.target.value };
                                            setPillars(newP);
                                        }}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl font-mono text-sm"
                                        placeholder="#4F46E5"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Icon (Lucide)</label>
                                    <input
                                        type="text"
                                        value={pillar.icon || ''}
                                        onChange={(e) => {
                                            const newP = [...pillars];
                                            newP[index] = { ...newP[index], icon: e.target.value };
                                            setPillars(newP);
                                        }}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl"
                                        placeholder="e.g. Shield, Users"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">Main Description</label>
                                <textarea
                                    rows={2}
                                    value={pillar.description || ''}
                                    onChange={(e) => {
                                        const newP = [...pillars];
                                        newP[index] = { ...newP[index], description: e.target.value };
                                        setPillars(newP);
                                    }}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-gray-500 block">Bullet Points (Features)</label>
                                    <button onClick={() => addFeature(index)} className="text-primary text-xs font-bold">+ Add Feature</button>
                                </div>
                                <div className="space-y-2">
                                    {(pillar.features || []).map((feature: any, fIndex: number) => (
                                        <div key={fIndex} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={feature.feature || ''}
                                                onChange={(e) => {
                                                    const newP = [...pillars];
                                                    const newFeatures = [...newP[index].features];
                                                    newFeatures[fIndex] = { feature: e.target.value };
                                                    newP[index].features = newFeatures;
                                                    setPillars(newP);
                                                }}
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                                                placeholder={`Bullet point ${fIndex + 1}`}
                                            />
                                            <button onClick={() => removeFeature(index, fIndex)} className="text-gray-400 hover:text-red-500 font-bold">&times;</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-dark text-lg">Impact Through Pillars Stats</h3>
                    <button onClick={addStat} className="text-primary text-sm font-bold hover:underline">+ Add Stat</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div key={stat.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative">
                            <button onClick={() => removeStat(stat.id, index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 font-bold">&times;</button>
                            <label className="text-xs font-bold text-gray-500">Value</label>
                            <input
                                type="text"
                                value={stat.title || ''}
                                onChange={(e) => {
                                    const newStats = [...stats];
                                    newStats[index] = { ...newStats[index], title: e.target.value };
                                    setStats(newStats);
                                }}
                                className="w-full px-3 py-2 mb-3 bg-white border border-gray-200 rounded-lg font-bold text-xl"
                            />

                            <label className="text-xs font-bold text-gray-500">Label</label>
                            <input
                                type="text"
                                value={stat.subtitle || ''}
                                onChange={(e) => {
                                    const newStats = [...stats];
                                    newStats[index] = { ...newStats[index], subtitle: e.target.value };
                                    setStats(newStats);
                                }}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm uppercase"
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};


// ==========================================
// SERVICES EDITOR (WHAT WE DO)
// ==========================================
const ServicesEditor = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [services, setServices] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const data = await getServicesContent();
            setServices(data);
            setLoading(false);
        }
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveServices(services);
            alert('Services content saved successfully!');
        } catch (error) {
            alert('Error saving content.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;

    const updateService = (id: string, field: string, value: any) => {
        setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm sticky top-24 z-10">
                <span className="font-bold text-gray-500 text-sm">Update focus areas</span>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
                </button>
            </div>

            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <h3 className="font-bold text-dark text-lg mb-4">Core Services</h3>
                <div className="space-y-6">
                    {services.map((service) => (
                        <div key={service.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Service Title</label>
                                    <input
                                        type="text"
                                        value={service.name || ''}
                                        onChange={(e) => updateService(service.id, 'name', e.target.value)}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Icon Name (Lucide)</label>
                                    <input
                                        type="text"
                                        value={service.icon || ''}
                                        onChange={(e) => updateService(service.id, 'icon', e.target.value)}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl"
                                        placeholder="e.g. Users, Shield, Target"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">Description</label>
                                <textarea
                                    rows={3}
                                    value={service.description || ''}
                                    onChange={(e) => updateService(service.id, 'description', e.target.value)}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

const HowWeDoItEditor = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sections, setSections] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const data = await getHowWeDoItContent();
            
            if (data.length === 0) {
                // Initialize with defaults if database is empty
                const defaults = [
                    ...['Community-led initiatives', 'Sustainable development practices', 'Inclusive decision-making', 'Transparent resource allocation', 'Evidence-based programming'].map((p, i) => ({
                        id: `default-m-${i}`, type: 'how_we_do_it_methodology', content: p, order: i + 1
                    })),
                    { id: 'default-p-1', type: 'how_we_do_it_process', title: 'Assessment & Engagement', content: 'We identify community needs and engage local stakeholders to understand priorities.', icon: 'Search', order: 1 },
                    { id: 'default-p-2', type: 'how_we_do_it_process', title: 'Capacity Building', content: 'We provide training, resources, and technical support to local organizations.', icon: 'Lightbulb', order: 2 },
                    { id: 'default-p-3', type: 'how_we_do_it_process', title: 'Implementation & Support', content: 'We facilitate project implementation with ongoing mentorship and resources.', icon: 'Zap', order: 3 },
                    { id: 'default-p-4', type: 'how_we_do_it_process', title: 'Monitoring & Sustainability', content: 'We evaluate impact and develop sustainability plans for long-term success.', icon: 'BarChart3', order: 4 },
                    { id: 'default-s-1', type: 'how_we_do_it_strategy', title: 'Collaborative Partnerships', content: 'We build strategic alliances between civil society, government, and private sector to maximize impact and resources.', icon: 'Users', order: 1 },
                    { id: 'default-s-2', type: 'how_we_do_it_strategy', title: 'Knowledge Management', content: 'We document best practices, facilitate learning exchanges, and promote evidence-based approaches.', icon: 'Briefcase', order: 2 },
                    { id: 'default-s-3', type: 'how_we_do_it_strategy', title: 'Adaptive Management', content: 'We employ flexible approaches that respond to changing contexts and emerging opportunities.', icon: 'Settings2', order: 3 },
                    { id: 'default-st-1', type: 'how_we_do_it_success_story', title: 'Community Health Initiative', content: 'Partnered with local health organizations to improve access to healthcare in rural communities, resulting in a 30% increase in service utilization.', order: 1 },
                    { id: 'default-st-2', type: 'how_we_do_it_success_story', title: 'Youth Leadership Program', content: 'Trained over 200 young leaders who have gone on to implement community projects reaching more than 5,000 beneficiaries.', order: 2 },
                    { id: 'default-st-3', type: 'how_we_do_it_success_story', title: 'Governance Improvement Project', content: 'Worked with 15 local organizations to strengthen governance structures, improving transparency and accountability.', order: 3 }
                ];
                setSections(defaults);
            } else {
                setSections(data);
            }
            setLoading(false);
        }
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Remove the temporary 'default-' or 'temp-' IDs before saving so Postgres can generate real ones
            const toSave = sections.map(s => {
                const { id, ...rest } = s;
                return typeof id === 'string' && (id.startsWith('default-') || id.startsWith('temp-')) ? rest : s;
            });
            await saveHowWeDoItContent(toSave);
            // Reload to get real IDs
            const updatedData = await getHowWeDoItContent();
            setSections(updatedData);
            alert('How We Do It content saved successfully!');
        } catch (error) {
            alert('Error saving content.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;

    const methodology = sections.filter(s => s.type === 'how_we_do_it_methodology').sort((a, b) => a.order - b.order);
    const process = sections.filter(s => s.type === 'how_we_do_it_process').sort((a, b) => a.order - b.order);
    const strategies = sections.filter(s => s.type === 'how_we_do_it_strategy').sort((a, b) => a.order - b.order);
    const stories = sections.filter(s => s.type === 'how_we_do_it_success_story').sort((a, b) => a.order - b.order);

    const updateSection = (id: string, field: string, value: any) => {
        setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const addSection = (type: string) => {
        const newSection = {
            id: `temp-${Date.now()}`,
            type,
            title: '',
            content: '',
            icon: type === 'how_we_do_it_methodology' ? null : 'Search',
            order: sections.filter(s => s.type === type).length + 1
        };
        setSections([...sections, newSection]);
    };

    const removeSection = (id: string) => {
        setSections(sections.filter(s => s.id !== id));
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm sticky top-24 z-10">
                <span className="font-bold text-gray-500 text-sm">Update methodology & approach</span>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
                </button>
            </div>

            {/* Methodology Section */}
            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-dark text-lg">Our Methodology (Points)</h3>
                    <button onClick={() => addSection('how_we_do_it_methodology')} className="text-primary text-sm font-bold hover:underline">+ Add Point</button>
                </div>
                <div className="space-y-3">
                    {methodology.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
                            <input
                                type="text"
                                value={item.content || ''}
                                onChange={(e) => updateSection(item.id, 'content', e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                                placeholder="Methodology point text..."
                            />
                            <button onClick={() => removeSection(item.id)} className="text-red-500 hover:text-red-700 font-bold px-2">&times;</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Strategic Process Section */}
            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-dark text-lg">Strategic Process Steps</h3>
                    <button onClick={() => addSection('how_we_do_it_process')} className="text-primary text-sm font-bold hover:underline">+ Add Step</button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {process.map((step) => (
                        <div key={step.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_40px] gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Step Title</label>
                                    <input
                                        type="text"
                                        value={step.title || ''}
                                        onChange={(e) => updateSection(step.id, 'title', e.target.value)}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Icon (Lucide)</label>
                                    <input
                                        type="text"
                                        value={step.icon || ''}
                                        onChange={(e) => updateSection(step.id, 'icon', e.target.value)}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl"
                                        placeholder="e.g. Search, Zap"
                                    />
                                </div>
                                <div className="flex justify-end pt-6">
                                    <button onClick={() => removeSection(step.id)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
                                </div>
                            </div>
                            <textarea
                                rows={2}
                                value={step.content || ''}
                                onChange={(e) => updateSection(step.id, 'content', e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                                placeholder="Step description..."
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Key Strategies Section */}
            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-dark text-lg">Key Strategies</h3>
                    <button onClick={() => addSection('how_we_do_it_strategy')} className="text-primary text-sm font-bold hover:underline">+ Add Strategy</button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {strategies.map((strategy) => (
                        <div key={strategy.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_40px] gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Strategy Title</label>
                                    <input
                                        type="text"
                                        value={strategy.title || ''}
                                        onChange={(e) => updateSection(strategy.id, 'title', e.target.value)}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Icon (Lucide)</label>
                                    <input
                                        type="text"
                                        value={strategy.icon || ''}
                                        onChange={(e) => updateSection(strategy.id, 'icon', e.target.value)}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl"
                                    />
                                </div>
                                <div className="flex justify-end pt-6">
                                    <button onClick={() => removeSection(strategy.id)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
                                </div>
                            </div>
                            <textarea
                                rows={2}
                                value={strategy.content || ''}
                                onChange={(e) => updateSection(strategy.id, 'content', e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                                placeholder="Strategy description..."
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Success Stories Section */}
            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-dark text-lg">Success Stories</h3>
                    <button onClick={() => addSection('how_we_do_it_success_story')} className="text-primary text-sm font-bold hover:underline">+ Add Story</button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {stories.map((story) => (
                        <div key={story.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
                            <div className="flex justify-between gap-4">
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Story Title</label>
                                    <input
                                        type="text"
                                        value={story.title || ''}
                                        onChange={(e) => updateSection(story.id, 'title', e.target.value)}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold"
                                    />
                                </div>
                                <div className="flex justify-end pt-6">
                                    <button onClick={() => removeSection(story.id)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
                                </div>
                            </div>
                            <textarea
                                rows={3}
                                value={story.content || ''}
                                onChange={(e) => updateSection(story.id, 'content', e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm"
                                placeholder="Story description..."
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

// ==========================================
// COMMUNITIES EDITOR
// ==========================================
const CommunitiesEditor = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [communities, setCommunities] = useState<any[]>([]);
    const [partnerships, setPartnerships] = useState<any[]>([]);
    const [stats, setStats] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const { communities: dbC, partnerships: dbP, stats: dbS } = await getCommunitiesContent();
            
            if (dbC.length === 0 && dbP.length === 0 && dbS.length === 0) {
                // Initialize with defaults
                const defaultCommunities = [
                    { id: 'def-c-1', name: 'Urban Communities', description: "Working with residents in Lusaka's townships to improve local governance and service delivery.", color: '#61A534', icon: 'Building2', features: [{ feature: 'Township governance support' }, { feature: 'Civic education programs' }, { feature: 'Service delivery monitoring' }] },
                    { id: 'def-c-2', name: 'Rural Villages', description: 'Supporting traditional communities in Northern Province with agricultural training and projects.', color: '#303030', icon: 'MapPin', features: [{ feature: 'Agricultural skills training' }, { feature: 'Water & sanitation projects' }, { feature: 'Traditional governance support' }] },
                    { id: 'def-c-3', name: "Women's Groups", description: "Empowering women's cooperatives across Zambia through business and leadership training.", color: '#FFDD02', icon: 'Users', features: [{ feature: 'Business management skills' }, { feature: 'Microfinance mentorship' }, { feature: 'Leadership development' }] },
                    { id: 'def-c-4', name: 'Youth Networks', description: 'Building capacity among young leaders through skills training and civic participation.', color: '#4A90E2', icon: 'UserCircle2', features: [{ feature: 'Vocational skills training' }, { feature: 'Youth governance platforms' }, { feature: 'Digital literacy programs' }] }
                ];
                const defaultPartnerships = [
                    { id: 'def-p-1', title: 'Lusaka Urban Communities', description: "Working with residents in Lusaka's townships to improve local governance, enhance service delivery, and strengthen community participation.", image: '/images/communities/lusaka.jpg', metadata: { tags: ['Urban', 'Governance', 'Civic Education'] }, color: 'bg-primary' },
                    { id: 'def-p-2', title: 'Northern Province Villages', description: 'Supporting traditional communities in Northern Province with agricultural training, water projects, and strengthening traditional structures.', image: '/images/communities/rural.jpg', metadata: { tags: ['Rural', 'Agriculture', 'Traditional'] }, color: 'bg-green-600' }
                ];
                const defaultStats = [
                    { id: 'def-s-1', title: '250+', subtitle: 'Communities Reached', content: 'Across all 10 provinces', color: 'text-primary' },
                    { id: 'def-s-2', title: '75,000+', subtitle: 'People Impacted', content: 'Direct and indirect', color: 'text-green-600' }
                ];
                setCommunities(defaultCommunities);
                setPartnerships(defaultPartnerships);
                setStats(defaultStats);
            } else {
                setCommunities(dbC.map((c: any) => ({ ...c, features: Array.isArray(c.features) ? c.features : [] })));
                setPartnerships(dbP.map((p: any) => ({ ...p, metadata: p.metadata || { tags: [] } })));
                setStats(dbS);
            }
            setLoading(false);
        }
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveCommunities(communities, partnerships, stats);
            const { communities: dbC, partnerships: dbP, stats: dbS } = await getCommunitiesContent();
            setCommunities(dbC.map((c: any) => ({ ...c, features: Array.isArray(c.features) ? c.features : [] })));
            setPartnerships(dbP.map((p: any) => ({ ...p, metadata: p.metadata || { tags: [] } })));
            setStats(dbS);
            alert('Communities content saved successfully!');
        } catch (error) {
            alert('Error saving content.');
        } finally {
            setSaving(false);
        }
    };

    // Helper functions for CRUD
    const addCommunity = () => {
        setCommunities([...communities, { id: `temp-c-${Date.now()}`, name: 'New Community', description: '', color: '#3B82F6', icon: 'Users', features: [{ feature: '' }] }]);
    };
    const removeCommunity = async (id: string, index: number) => {
        if (!confirm('Are you sure?')) return;
        if (!id.startsWith('temp-') && !id.startsWith('def-')) await deleteCommunity(id);
        setCommunities(communities.filter((_, i) => i !== index));
    };
    const addFeature = (cIndex: number) => {
        const newC = [...communities];
        newC[cIndex].features = [...(newC[cIndex].features || []), { feature: '' }];
        setCommunities(newC);
    };
    const removeFeature = (cIndex: number, fIndex: number) => {
        const newC = [...communities];
        newC[cIndex].features = newC[cIndex].features.filter((_: any, i: number) => i !== fIndex);
        setCommunities(newC);
    };

    const addPartnership = () => {
        setPartnerships([...partnerships, { id: `temp-p-${Date.now()}`, title: 'New Partnership', description: '', image: '', metadata: { tags: [] }, color: 'bg-primary' }]);
    };
    const removePartnership = async (id: string, index: number) => {
        if (!confirm('Are you sure?')) return;
        if (!id.startsWith('temp-') && !id.startsWith('def-')) await deleteAboutSection(id);
        setPartnerships(partnerships.filter((_, i) => i !== index));
    };

    const addStat = () => {
        setStats([...stats, { id: `temp-s-${Date.now()}`, title: 'Value', subtitle: 'Label', content: 'Subtext', color: 'text-primary' }]);
    };
    const removeStat = async (id: string, index: number) => {
        if (!confirm('Are you sure?')) return;
        if (!id.startsWith('temp-') && !id.startsWith('def-')) await deleteAboutSection(id);
        setStats(stats.filter((_, i) => i !== index));
    };

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm sticky top-24 z-10">
                <span className="font-bold text-gray-500 text-sm">Update communities & partnerships</span>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
                </button>
            </div>

            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-dark text-lg">Core Communities</h3>
                    <button onClick={addCommunity} className="text-primary text-sm font-bold hover:underline">+ Add Community</button>
                </div>
                <div className="space-y-6">
                    {communities.map((comm, index) => (
                        <div key={comm.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 relative">
                            <button onClick={() => removeCommunity(comm.id, index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-bold">&times;</button>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Name</label>
                                    <input
                                        type="text"
                                        value={comm.name || ''}
                                        onChange={(e) => {
                                            const newC = [...communities];
                                            newC[index].name = e.target.value;
                                            setCommunities(newC);
                                        }}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Color</label>
                                    <input
                                        type="text"
                                        value={comm.color || ''}
                                        onChange={(e) => {
                                            const newC = [...communities];
                                            newC[index].color = e.target.value;
                                            setCommunities(newC);
                                        }}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Icon</label>
                                    <input
                                        type="text"
                                        value={comm.icon || ''}
                                        onChange={(e) => {
                                            const newC = [...communities];
                                            newC[index].icon = e.target.value;
                                            setCommunities(newC);
                                        }}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 mb-1 block">Description</label>
                                <textarea
                                    rows={2}
                                    value={comm.description || ''}
                                    onChange={(e) => {
                                        const newC = [...communities];
                                        newC[index].description = e.target.value;
                                        setCommunities(newC);
                                    }}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-gray-500 block">Bullet Points</label>
                                    <button onClick={() => addFeature(index)} className="text-primary text-xs font-bold">+ Add Feature</button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {(comm.features || []).map((feat: any, fIndex: number) => (
                                        <div key={fIndex} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={feat.feature || ''}
                                                onChange={(e) => {
                                                    const newC = [...communities];
                                                    const newFeat = [...newC[index].features];
                                                    newFeat[fIndex] = { feature: e.target.value };
                                                    newC[index].features = newFeat;
                                                    setCommunities(newC);
                                                }}
                                                className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                                            />
                                            <button onClick={() => removeFeature(index, fIndex)} className="text-gray-400 hover:text-red-500 font-bold">&times;</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-dark text-lg">Featured Partnerships</h3>
                    <button onClick={addPartnership} className="text-primary text-sm font-bold hover:underline">+ Add Partnership</button>
                </div>
                <div className="space-y-6">
                    {partnerships.map((part, index) => (
                        <div key={part.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 relative">
                            <button onClick={() => removePartnership(part.id, index)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-bold">&times;</button>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Title</label>
                                    <input
                                        type="text"
                                        value={part.title || ''}
                                        onChange={(e) => {
                                            const newP = [...partnerships];
                                            newP[index].title = e.target.value;
                                            setPartnerships(newP);
                                        }}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        value={part.metadata?.tags?.join(', ') || ''}
                                        onChange={(e) => {
                                            const newP = [...partnerships];
                                            newP[index].metadata = { ...newP[index].metadata, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) };
                                            setPartnerships(newP);
                                        }}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl"
                                        placeholder="Urban, Governance, Civic Education"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="text-xs font-bold text-gray-500 mb-1 block">Description</label>
                                <textarea
                                    rows={2}
                                    value={part.description || ''}
                                    onChange={(e) => {
                                        const newP = [...partnerships];
                                        newP[index].description = e.target.value;
                                        setPartnerships(newP);
                                    }}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Image URL</label>
                                    <input
                                        type="text"
                                        value={part.image || ''}
                                        onChange={(e) => {
                                            const newP = [...partnerships];
                                            newP[index].image = e.target.value;
                                            setPartnerships(newP);
                                        }}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Bg Color Class</label>
                                    <input
                                        type="text"
                                        value={part.color || ''}
                                        onChange={(e) => {
                                            const newP = [...partnerships];
                                            newP[index].color = e.target.value;
                                            setPartnerships(newP);
                                        }}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl"
                                        placeholder="bg-primary, bg-green-600, etc."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-dark text-lg">Community Impact Stats</h3>
                    <button onClick={addStat} className="text-primary text-sm font-bold hover:underline">+ Add Stat</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div key={stat.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative">
                            <button onClick={() => removeStat(stat.id, index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 font-bold">&times;</button>
                            <label className="text-xs font-bold text-gray-500">Value</label>
                            <input
                                type="text"
                                value={stat.title || ''}
                                onChange={(e) => {
                                    const newS = [...stats];
                                    newS[index].title = e.target.value;
                                    setStats(newS);
                                }}
                                className="w-full px-3 py-1 bg-white border border-gray-200 rounded-lg font-bold mb-2"
                            />
                            <label className="text-xs font-bold text-gray-500">Label</label>
                            <input
                                type="text"
                                value={stat.subtitle || ''}
                                onChange={(e) => {
                                    const newS = [...stats];
                                    newS[index].subtitle = e.target.value;
                                    setStats(newS);
                                }}
                                className="w-full px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm mb-2 font-bold"
                            />
                            <label className="text-xs font-bold text-gray-500">Subtext</label>
                            <input
                                type="text"
                                value={stat.content || ''}
                                onChange={(e) => {
                                    const newS = [...stats];
                                    newS[index].content = e.target.value;
                                    setStats(newS);
                                }}
                                className="w-full px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px]"
                            />
                            <label className="text-xs font-bold text-gray-500 mt-2 block">Color Class</label>
                            <input
                                type="text"
                                value={stat.color || ''}
                                onChange={(e) => {
                                    const newS = [...stats];
                                    newS[index].color = e.target.value;
                                    setStats(newS);
                                }}
                                className="w-full px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs"
                                placeholder="text-primary, text-green-600, etc."
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
// Main Wrapper

export default function PageEditor({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
    const params = React.use(paramsPromise);
    const { slug } = params;
    
    const validSlugs = ['home', 'impact', 'about', 'contact-us', 'how-we-do-it', 'what-we-do', 'pillars', 'communities'];

    if (!validSlugs.includes(slug)) {
        notFound();
    }

    const titles: Record<string, string> = {
        'home': 'Home Page',
        'impact': 'Our Impact',
        'about': 'About Us',
        'contact-us': 'Contact Us',
        'how-we-do-it': 'How We Do It',
        'what-we-do': 'What We Do',
        'pillars': 'Pillars',
        'communities': 'Communities',
    };

    return (
        <div className="max-w-4xl space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/admin/pages" className="p-2 -ml-2 text-gray-400 hover:text-dark hover:bg-gray-100 rounded-xl transition-all">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-dark">Edit: {titles[slug]}</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Customize the exact content shown on this public page.</p>
                </div>
            </div>

            {slug === 'home' && <HomeEditor />}
            {slug === 'about' && <AboutEditor />}
            {slug === 'pillars' && <PillarsEditor />}
            {slug === 'what-we-do' && <ServicesEditor />}
            {slug === 'how-we-do-it' && <HowWeDoItEditor />}
            {slug === 'communities' && <CommunitiesEditor />}

            {/* Placeholders for others - we will build them out iteratively */}
            {!['home', 'about', 'pillars', 'what-we-do', 'how-we-do-it', 'communities'].includes(slug) && (
                <div className="bg-yellow-50 text-yellow-700 p-6 rounded-2xl border border-yellow-200">
                    <h3 className="font-bold mb-2">Editor under construction</h3>
                    <p className="text-sm">The specific editor for {titles[slug]} is currently being built. Mapping to the matching database schema.</p>
                </div>
            )}
        </div>
    );
}

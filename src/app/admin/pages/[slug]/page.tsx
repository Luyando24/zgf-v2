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
    getServicesContent,
    saveServices,
    getHowWeDoItContent,
    saveHowWeDoItContent
} from '@/app/admin/pages/actions';

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

// ==========================================
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
            const { pillars, stats } = await getPillarsContent();
            setPillars(pillars);
            setStats(stats);
            setLoading(false);
        }
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await savePillars(pillars, stats);
            alert('Pillars content saved successfully!');
        } catch (error) {
            alert('Error saving content.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>;

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

            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <h3 className="font-bold text-dark text-lg mb-4">Core Pillars</h3>
                <div className="space-y-8">
                    {pillars.map((pillar, index) => (
                        <div key={pillar.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: pillar.color }}>
                                    <span className="text-white font-bold">{index + 1}</span>
                                </div>
                                <div className="flex-1">
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
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">Main Description</label>
                                <textarea
                                    rows={3}
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
                                <label className="text-xs font-bold text-gray-500 mb-2 block">Bullet Points (Features)</label>
                                <div className="space-y-2">
                                    {(pillar.features || []).map((feature: any, fIndex: number) => (
                                        <div key={fIndex} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={feature.feature || ''}
                                                onChange={(e) => {
                                                    const newP = [...pillars];
                                                    newP[index].features[fIndex] = { feature: e.target.value };
                                                    setPillars(newP);
                                                }}
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                                                placeholder={`Bullet point ${fIndex + 1}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <h3 className="font-bold text-dark text-lg mb-4">Impact Through Pillars Stats</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                        <div key={stat.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
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
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

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

            {/* Placeholders for others - we will build them out iteratively */}
            {!['home', 'about', 'pillars', 'what-we-do', 'how-we-do-it'].includes(slug) && (
                <div className="bg-yellow-50 text-yellow-700 p-6 rounded-2xl border border-yellow-200">
                    <h3 className="font-bold mb-2">Editor under construction</h3>
                    <p className="text-sm">The specific editor for {titles[slug]} is currently being built. Mapping to the matching database schema.</p>
                </div>
            )}
        </div>
    );
}

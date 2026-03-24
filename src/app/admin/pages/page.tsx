'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Home, Info, Phone, Activity, Search, Target, Users, Layout } from 'lucide-react';

const PAGES = [
    { slug: 'home', title: 'Home Page', description: 'Hero section, key statistics, and about snippet.', icon: Home, color: 'text-blue-500', bg: 'bg-blue-50' },
    { slug: 'about', title: 'About Us', description: 'Mission, vision, history, and core narrative.', icon: Info, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { slug: 'impact', title: 'Our Impact', description: 'Impact metrics, success stories, and reports.', icon: Activity, color: 'text-green-500', bg: 'bg-green-50' },
    { slug: 'what-we-do', title: 'What We Do', description: 'Core thematic areas and services overview.', icon: Search, color: 'text-purple-500', bg: 'bg-purple-50' },
    { slug: 'how-we-do-it', title: 'How We Do It', description: 'Methodology and operational approach.', icon: Target, color: 'text-orange-500', bg: 'bg-orange-50' },
    { slug: 'pillars', title: 'Pillars', description: 'Strategic pillars and specialized strategies.', icon: Layout, color: 'text-red-500', bg: 'bg-red-50' },
    { slug: 'communities', title: 'Communities', description: 'Geographic focus areas and targeted regions.', icon: Users, color: 'text-teal-500', bg: 'bg-teal-50' },
    { slug: 'contact-us', title: 'Contact Us', description: 'Address, maps, and social integrations.', icon: Phone, color: 'text-blue-500', bg: 'bg-blue-50' },
];

export default function PagesDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-dark flex items-center gap-2">
                        <FileText size={24} className="text-primary" />
                        Pages
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Manage static content and images across your website</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {PAGES.map((page) => (
                    <Link
                        key={page.slug}
                        href={`/admin/pages/${page.slug}`}
                        className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
                    >
                        <div className={`w-12 h-12 rounded-2xl ${page.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                            <page.icon size={24} className={page.color} />
                        </div>

                        <h3 className="text-lg font-bold text-dark mb-2 group-hover:text-primary transition-colors">
                            {page.title}
                        </h3>

                        <p className="text-sm text-gray-500 flex-1 leading-relaxed">
                            {page.description}
                        </p>

                        <div className="mt-6 flex items-center text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">
                            Edit Page &rarr;
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

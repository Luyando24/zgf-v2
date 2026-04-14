'use client';

import React, { useState, useEffect } from 'react';
import { Save, Globe, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube, Shield } from "lucide-react";
import { saveSettings } from "@/app/admin/actions";
import { createClient } from "@/utils/supabase/client";

export default function SiteSettings() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function loadSettings() {
      const supabase = createClient();
      const { data } = await supabase.from('settings').select('*').single();
      if (data) setSettings(data);
    }
    loadSettings();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await saveSettings(formData);
    setLoading(false);
    if (result.success) {
      alert('Settings saved successfully!');
    } else {
      alert('Error saving settings: ' + result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-dark">Site Settings</h1>
        <p className="text-gray-500 text-sm">Configure your website's global information and SEO settings.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* General Settings */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center gap-2">
            <Globe size={20} className="text-primary" />
            <h3 className="font-bold text-dark">General Information</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Site Name</label>
                <input
                  type="text"
                  name="site_name"
                  defaultValue={settings?.site_name || "Zambian Governance Foundation"}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Contact Email</label>
                <input
                  type="email"
                  name="contact_email"
                  defaultValue={settings?.contact_email || "info@zgf.org.zm"}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Online Donation Link</label>
                <input
                  type="url"
                  name="donation_link"
                  defaultValue={settings?.donation_link || ""}
                  placeholder="https://zgfdonations.zgf.org.zm/"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Site Description</label>
              <textarea
                rows={3}
                name="site_description"
                defaultValue={settings?.site_description || "Empowering civil society and community-led development in Zambia."}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
            </div>
          </div>
        </section>

        {/* Contact & Social */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center gap-2">
            <Phone size={20} className="text-primary" />
            <h3 className="font-bold text-dark">Contact & Social Media</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Facebook size={16} className="text-blue-600" /> Facebook URL
                </label>
                <input
                  type="text"
                  name="facebook_url"
                  defaultValue={settings?.facebook_url || ""}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Twitter size={16} className="text-blue-400" /> Twitter URL
                </label>
                <input
                  type="text"
                  name="twitter_url"
                  defaultValue={settings?.twitter_url || ""}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Linkedin size={16} className="text-blue-700" /> LinkedIn URL
                </label>
                <input
                  type="text"
                  name="linkedin_url"
                  defaultValue={settings?.linkedin_url || ""}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Youtube size={16} className="text-red-600" /> YouTube URL
                </label>
                <input
                  type="text"
                  name="youtube_url"
                  defaultValue={settings?.youtube_url || ""}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SEO Settings */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center gap-2">
            <Shield size={20} className="text-primary" />
            <h3 className="font-bold text-dark">SEO & Metadata</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Meta Keywords</label>
              <input
                type="text"
                name="meta_keywords"
                defaultValue={settings?.meta_keywords || ""}
                placeholder="zambia, governance, foundation, ngos..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Google Analytics ID</label>
              <input
                type="text"
                name="google_analytics_id"
                defaultValue={settings?.google_analytics_id || ""}
                placeholder="UA-XXXXXXX-X or G-XXXXXXX"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>
        </section>
        {/* SMTP Email Settings */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center gap-2">
            <Mail size={20} className="text-primary" />
            <h3 className="font-bold text-dark">Email & SMTP Delivery</h3>
          </div>
          <div className="p-6 space-y-6">
            <p className="text-sm text-gray-500 mb-2">Configure these settings to allow the platform to send real newsletter campaigns to your subscribers.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">SMTP Host</label>
                <input
                  type="text"
                  name="smtp_host"
                  defaultValue={settings?.smtp_host || ""}
                  placeholder="smtp.example.com"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">SMTP Port</label>
                <input
                  type="number"
                  name="smtp_port"
                  defaultValue={settings?.smtp_port || "587"}
                  placeholder="587 or 465"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">SMTP Username</label>
                <input
                  type="text"
                  name="smtp_user"
                  defaultValue={settings?.smtp_user || ""}
                  placeholder="apikey or email@domain.com"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">SMTP Password</label>
                <input
                  type="password"
                  name="smtp_pass"
                  defaultValue={settings?.smtp_pass || ""}
                  placeholder="••••••••••••••••"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">From Name</label>
                <input
                  type="text"
                  name="smtp_from_name"
                  defaultValue={settings?.smtp_from_name || "Zambian Governance Foundation"}
                  placeholder="The name recipients see"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">From Email</label>
                <input
                  type="email"
                  name="smtp_from_email"
                  defaultValue={settings?.smtp_from_email || "newsletter@zgf.org.zm"}
                  placeholder="newsletter@domain.com"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Action Bar */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-3xl font-bold text-base hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  );
}

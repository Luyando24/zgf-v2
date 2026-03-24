'use client';

import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  UserCheck, 
  Handshake, 
  Clock, 
  ArrowLeft,
  Search,
  Filter,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

interface ActivityItem {
  id: string;
  type: 'post' | 'volunteer' | 'partner';
  title: string;
  user: string;
  timestamp: string;
  date: Date;
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      const supabase = createClient();
      
      try {
        // Fetch latest items from various tables to simulate an activity feed
        const [
          { data: latestPosts },
          { data: latestVolunteers },
          { data: latestPartners }
        ] = await Promise.all([
          supabase.from('posts').select('id, title, created_at').order('created_at', { ascending: false }).limit(10),
          supabase.from('volunteers').select('id, name, created_at').order('created_at', { ascending: false }).limit(10),
          supabase.from('partner_requests').select('id, organization_name, created_at').order('created_at', { ascending: false }).limit(10)
        ]);

        const combined: ActivityItem[] = [
          ...(latestPosts || []).map(p => ({
            id: `p-${p.id}`,
            type: 'post' as const,
            title: `New Post: ${p.title}`,
            user: 'Admin',
            timestamp: new Date(p.created_at).toLocaleString(),
            date: new Date(p.created_at)
          })),
          ...(latestVolunteers || []).map(v => ({
            id: `v-${v.id}`,
            type: 'volunteer' as const,
            title: `New Volunteer: ${v.name}`,
            user: 'System',
            timestamp: new Date(v.created_at).toLocaleString(),
            date: new Date(v.created_at)
          })),
          ...(latestPartners || []).map(p => ({
            id: `par-${p.id}`,
            type: 'partner' as const,
            title: `New Partner Request: ${p.organization_name}`,
            user: 'System',
            timestamp: new Date(p.created_at).toLocaleString(),
            date: new Date(p.created_at)
          }))
        ].sort((a, b) => b.date.getTime() - a.date.getTime());

        setActivities(combined);
      } catch (error) {
        console.error("Error fetching activity data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'post': return <FileText size={18} className="text-blue-500" />;
      case 'volunteer': return <UserCheck size={18} className="text-green-500" />;
      case 'partner': return <Handshake size={18} className="text-purple-500" />;
      default: return <Clock size={18} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin"
            className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-dark">Recent Activity</h1>
            <p className="text-gray-500 text-sm">A complete log of recent changes and submissions.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search activity log..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100">
              <Filter size={16} />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100">
              <Calendar size={16} />
              Date Range
            </button>
          </div>
        </div>

        {/* Activity List */}
        <div className="divide-y divide-gray-50">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-6 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-64 bg-gray-100 rounded"></div>
                    <div className="h-3 w-32 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
            ))
          ) : activities.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <Clock size={32} />
              </div>
              <p className="text-gray-500 font-medium">No activity records found.</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                    {getIcon(activity.type)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-dark mb-1">{activity.title}</p>
                    <p className="text-xs text-gray-500">
                      Performed by <span className="font-semibold text-gray-700">{activity.user}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-dark mb-1">{activity.timestamp.split(',')[0]}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{activity.timestamp.split(',')[1]}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {!loading && activities.length > 0 && (
          <div className="p-6 bg-gray-50/50 border-t border-gray-50 text-center">
            <button className="text-sm font-bold text-primary hover:underline">
              Load More Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

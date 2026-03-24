'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  FileText, 
  Briefcase, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  ExternalLink,
  FilePieChart,
  UserCheck,
  Handshake
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: "Total Posts", value: "0", change: "0%", trend: "neutral", icon: <FileText size={20} />, href: "/admin/posts" },
    { label: "Initiatives", value: "0", change: "0%", trend: "neutral", icon: <Briefcase size={20} />, href: "/admin/initiatives" },
    { label: "Volunteers", value: "0", change: "0%", trend: "neutral", icon: <UserCheck size={20} />, href: "/admin/volunteers" },
    { label: "Partner Requests", value: "0", change: "0%", trend: "neutral", icon: <Handshake size={20} />, href: "/admin/partners" },
  ]);

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      const supabase = createClient();
      
      try {
        // 1. Fetch Counts
        const [
          { count: postsCount },
          { count: initiativesCount },
          { count: volunteersCount },
          { count: partnersCount }
        ] = await Promise.all([
          supabase.from('posts').select('*', { count: 'exact', head: true }),
          supabase.from('community_initiatives').select('*', { count: 'exact', head: true }),
          supabase.from('volunteers').select('*', { count: 'exact', head: true }),
          supabase.from('partner_requests').select('*', { count: 'exact', head: true })
        ]);

        setStats([
          { label: "Total Posts", value: (postsCount || 0).toString(), change: "+0%", trend: "neutral", icon: <FileText size={20} />, href: "/admin/posts" },
          { label: "Initiatives", value: (initiativesCount || 0).toString(), change: "+0%", trend: "neutral", icon: <Briefcase size={20} />, href: "/admin/initiatives" },
          { label: "Volunteers", value: (volunteersCount || 0).toString(), change: "+0%", trend: "neutral", icon: <UserCheck size={20} />, href: "/admin/volunteers" },
          { label: "Partner Requests", value: (partnersCount || 0).toString(), change: "+0%", trend: "neutral", icon: <Handshake size={20} />, href: "/admin/partners" },
        ]);

        // 2. Fetch Recent Activity (Mix of latest items)
        const [
          { data: latestPosts },
          { data: latestVolunteers }
        ] = await Promise.all([
          supabase.from('posts').select('id, title, created_at').order('created_at', { ascending: false }).limit(2),
          supabase.from('volunteers').select('id, name, created_at').order('created_at', { ascending: false }).limit(2)
        ]);

        const activities = [
          ...(latestPosts || []).map(p => ({
            id: `p-${p.id}`,
            type: 'post',
            title: p.title,
            user: 'Admin',
            time: new Date(p.created_at).toLocaleDateString()
          })),
          ...(latestVolunteers || []).map(v => ({
            id: `v-${v.id}`,
            type: 'user',
            title: `New volunteer: ${v.name}`,
            user: 'System',
            time: new Date(v.created_at).toLocaleDateString()
          }))
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

        setRecentActivity(activities);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-dark">Welcome back, Admin!</h1>
        <p className="text-gray-500 text-sm">Here's what's happening with ZGF today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link 
            key={index} 
            href={stat.href}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-primary/10 p-2.5 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
                stat.trend === 'up' ? 'text-green-600 bg-green-50' : 
                stat.trend === 'down' ? 'text-red-600 bg-red-50' : 
                'text-gray-600 bg-gray-50'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : 
                 stat.trend === 'down' ? <ArrowDownRight size={14} /> : null}
                {stat.change}
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
            {loading ? (
              <div className="h-8 w-12 bg-gray-100 animate-pulse rounded-lg"></div>
            ) : (
              <p className="text-2xl font-bold text-dark">{stat.value}</p>
            )}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-dark">Recent Activity</h3>
            <Link href="/admin/activity" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              View All <ExternalLink size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-6 flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-48 bg-gray-100 rounded"></div>
                      <div className="h-3 w-24 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : recentActivity.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-sm">No recent activity found.</div>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                      {activity.type === 'post' ? <FileText size={18} /> : 
                       activity.type === 'initiative' ? <Briefcase size={18} /> : 
                       <Users size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-dark leading-none mb-1">{activity.title}</p>
                      <p className="text-xs text-gray-500">By <span className="font-medium text-gray-700">{activity.user}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Clock size={14} />
                    {activity.time}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-dark mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            <Link 
              href="/admin/posts/new"
              className="flex items-center gap-3 w-full p-4 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
            >
              <FileText size={18} />
              Create New Post
            </Link>
            <Link 
              href="/admin/initiatives/new"
              className="flex items-center gap-3 w-full p-4 rounded-2xl bg-white border border-gray-100 text-dark font-bold text-sm hover:bg-gray-50 transition-all"
            >
              <Briefcase size={18} />
              Add Initiative
            </Link>
            <Link 
              href="/admin/team/new"
              className="flex items-center gap-3 w-full p-4 rounded-2xl bg-white border border-gray-100 text-dark font-bold text-sm hover:bg-gray-50 transition-all"
            >
              <Users size={18} />
              Add Team Member
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

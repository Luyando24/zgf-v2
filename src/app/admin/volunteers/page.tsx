'use client';

import React, { useState, useEffect } from 'react';
import EntityTable from '@/components/admin/EntityTable';
import { createClient } from '@/utils/supabase/client';
import { deleteEntity } from '@/app/admin/actions';
import { User, Mail, Phone, Calendar } from 'lucide-react';

export default function VolunteersAdmin() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVolunteers() {
      const supabase = createClient();
      const { data } = await supabase
        .from('volunteers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setVolunteers(data);
      setLoading(false);
    }
    loadVolunteers();
  }, []);

  const handleDelete = async (item: any) => {
    if (confirm(`Are you sure you want to delete application from "${item.name}"?`)) {
      const result = await deleteEntity('volunteers', item.id);
      if (result.success) {
        setVolunteers(volunteers.filter(v => v.id !== item.id));
      } else {
        alert('Error deleting volunteer: ' + result.error);
      }
    }
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Volunteer',
      render: (value: string, item: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User size={20} />
          </div>
          <div>
            <p className="font-bold text-dark leading-tight">{value}</p>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{item.skills?.split(',')[0] || 'General'}</p>
          </div>
        </div>
      )
    },
    { 
      key: 'email', 
      label: 'Contact Info',
      render: (value: string, item: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Mail size={12} className="text-gray-400" />
            {value}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Phone size={12} className="text-gray-400" />
            {item.phone || 'N/A'}
          </div>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
          value === 'approved' ? 'bg-green-50 text-green-600' : 
          value === 'rejected' ? 'bg-red-50 text-red-600' : 
          'bg-orange-50 text-orange-600'
        }`}>
          {value || 'pending'}
        </span>
      )
    },
    { 
      key: 'created_at', 
      label: 'Applied On',
      render: (value: string) => (
        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
          <Calendar size={14} className="text-gray-400" />
          {new Date(value).toLocaleDateString()}
        </div>
      )
    }
  ];

  return (
    <EntityTable
      title="Volunteer Applications"
      description="Review and manage applications from individuals wanting to support ZGF."
      columns={columns}
      data={volunteers}
      loading={loading}
      addLink="/admin/volunteers/new"
      editLinkPrefix="/admin/volunteers"
      onDelete={handleDelete}
    />
  );
}

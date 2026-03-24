'use client';

import React, { useState, useEffect } from 'react';
import EntityTable from '@/components/admin/EntityTable';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { deleteEntity } from '@/app/admin/actions';

export default function InitiativesAdmin() {
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitiatives() {
      const supabase = createClient();
      const { data } = await supabase.from('community_initiatives').select('*').order('created_at', { ascending: false });
      if (data) setInitiatives(data);
      setLoading(false);
    }
    loadInitiatives();
  }, []);

  const handleDelete = async (item: any) => {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      const result = await deleteEntity('community_initiatives', item.id);
      if (result.success) {
        setInitiatives(initiatives.filter(i => i.id !== item.id));
      } else {
        alert('Error deleting initiative: ' + result.error);
      }
    }
  };

  const columns = [
    { 
      key: 'title', 
      label: 'Initiative',
      render: (value: string, item: any) => (
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
            {item.cover_image && <Image src={item.cover_image} alt={value} fill className="object-cover" />}
          </div>
          <div>
            <p className="font-bold text-dark leading-tight">{value}</p>
            <p className="text-[10px] text-gray-400 mt-1 font-mono">{item.slug}</p>
          </div>
        </div>
      )
    },
    { 
      key: 'category', 
      label: 'Category',
      render: (value: string) => (
        <span className="px-2.5 py-1 bg-primary/5 text-primary rounded-lg text-xs font-medium">
          {value}
        </span>
      )
    },
    { 
      key: 'location', 
      label: 'Location',
      render: (value: string) => (
        <div className="flex items-center gap-1 text-gray-500">
          <MapPin size={14} />
          <span className="text-xs">{value}</span>
        </div>
      )
    },
    { 
      key: 'start_date', 
      label: 'Start Date',
      render: (value: string) => value ? new Date(value).toLocaleDateString() : 'N/A'
    }
  ];

  return (
    <EntityTable
      title="Initiatives"
      description="Manage community-driven projects and initiatives."
      columns={columns}
      data={initiatives}
      loading={loading}
      addLink="/admin/initiatives/new"
      editLinkPrefix="/admin/initiatives"
      onDelete={handleDelete}
    />
  );
}

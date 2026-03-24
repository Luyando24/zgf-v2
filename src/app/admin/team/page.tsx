'use client';

import React, { useState, useEffect } from 'react';
import EntityTable from '@/components/admin/EntityTable';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { deleteEntity } from '@/app/admin/actions';

export default function TeamAdmin() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      const supabase = createClient();
      const { data } = await supabase.from('team_members').select('*').order('name', { ascending: true });
      if (data) setMembers(data);
      setLoading(false);
    }
    loadMembers();
  }, []);

  const handleDelete = async (item: any) => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      const result = await deleteEntity('team_members', item.id);
      if (result.success) {
        setMembers(members.filter(m => m.id !== item.id));
      } else {
        alert('Error deleting team member: ' + result.error);
      }
    }
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Member',
      render: (value: string, item: any) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
            {item.image && <Image src={item.image} alt={value} fill className="object-cover" />}
          </div>
          <div>
            <p className="font-bold text-dark leading-tight">{value}</p>
            <p className="text-[10px] text-gray-400 mt-1">{item.email}</p>
          </div>
        </div>
      )
    },
    { key: 'position', label: 'Position' },
    { 
      key: 'category', 
      label: 'Department',
      render: (value: string) => (
        <span className="text-xs font-medium text-gray-600 px-2 py-1 bg-gray-100 rounded-lg">
          {value}
        </span>
      )
    }
  ];

  return (
    <EntityTable
      title="Team Members"
      description="Manage ZGF staff and leadership profiles."
      columns={columns}
      data={members}
      loading={loading}
      addLink="/admin/team/new"
      editLinkPrefix="/admin/team"
      onDelete={handleDelete}
    />
  );
}

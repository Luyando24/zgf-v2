'use client';

import React, { useState, useEffect } from 'react';
import EntityTable from '@/components/admin/EntityTable';
import { Download, FileText, FilePieChart, BookOpen, Newspaper } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { deleteEntity } from '@/app/admin/actions';

export default function ResourcesAdmin() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResources() {
      const supabase = createClient();
      const { data } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
      if (data) setResources(data);
      setLoading(false);
    }
    loadResources();
  }, []);

  const handleDelete = async (item: any) => {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      const result = await deleteEntity('resources', item.id);
      if (result.success) {
        setResources(resources.filter(r => r.id !== item.id));
      } else {
        alert('Error deleting resource: ' + result.error);
      }
    }
  };

  const columns = [
    { 
      key: 'title', 
      label: 'Resource Name',
      render: (value: string, item: any) => {
        let Icon = FileText;
        if (item.type === 'Report') Icon = FilePieChart;
        if (item.type === 'Guide') Icon = BookOpen;
        if (item.type === 'Newsletter') Icon = Newspaper;

        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary">
              <Icon size={20} />
            </div>
            <span className="font-bold text-dark">{value}</span>
          </div>
        );
      }
    },
    { 
      key: 'type', 
      label: 'Type',
      render: (value: string) => (
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{value}</span>
      )
    },
    { 
      key: 'download_count', 
      label: 'Downloads',
      render: (value: number) => (
        <div className="flex items-center gap-1.5 text-gray-600 font-medium">
          <Download size={14} className="text-gray-400" />
          {(value || 0).toLocaleString()}
        </div>
      )
    },
    { 
      key: 'created_at', 
      label: 'Uploaded On',
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  return (
    <EntityTable
      title="Resources"
      description="Manage documents, reports, and downloadable guides."
      columns={columns}
      data={resources}
      loading={loading}
      addLink="/admin/resources/new"
      editLinkPrefix="/admin/resources"
      onDelete={handleDelete}
    />
  );
}

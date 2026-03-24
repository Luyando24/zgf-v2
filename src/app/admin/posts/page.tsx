'use client';

import React, { useState, useEffect } from 'react';
import EntityTable from '@/components/admin/EntityTable';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { deleteEntity } from '@/app/admin/actions';

export default function PostsAdmin() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      const supabase = createClient();
      const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      if (data) setPosts(data);
      setLoading(false);
    }
    loadPosts();
  }, []);

  const handleDelete = async (item: any) => {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      const result = await deleteEntity('posts', item.id);
      if (result.success) {
        setPosts(posts.filter(p => p.id !== item.id));
      } else {
        alert('Error deleting post: ' + result.error);
      }
    }
  };

  const columns = [
    { 
      key: 'title', 
      label: 'Post Details',
      render: (value: string, item: any) => (
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
            {item.featured_image && <Image src={item.featured_image} alt={value} fill className="object-cover" />}
          </div>
          <div>
            <p className="font-bold text-dark leading-tight">{value}</p>
            <p className="text-[10px] text-gray-400 mt-1 font-mono">{item.slug}</p>
          </div>
        </div>
      )
    },
    { key: 'author', label: 'Author' },
    { 
      key: 'created_at', 
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'is_published', 
      label: 'Status',
      render: (value: boolean) => (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
          value ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
        }`}>
          {value ? 'Published' : 'Draft'}
        </span>
      )
    }
  ];

  return (
    <EntityTable
      title="Blog Posts"
      description="Manage your website news and blog content."
      columns={columns}
      data={posts}
      loading={loading}
      addLink="/admin/posts/new"
      editLinkPrefix="/admin/posts"
      onDelete={handleDelete}
    />
  );
}

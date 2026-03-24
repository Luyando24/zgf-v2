'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import EntityForm from '@/components/admin/EntityForm';
import { saveEntity } from '@/app/admin/actions';
import { createClient } from '@/utils/supabase/client';

export default function PostFormPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    if (!isNew) {
      async function loadData() {
        const supabase = createClient();
        const { data } = await supabase.from('posts').select('*').eq('id', id).single();
        if (data) setInitialData(data);
      }
      loadData();
    }
  }, [id, isNew]);

  const sections = [
    {
      title: "Basic Information",
      fields: [
        { name: "title", label: "Post Title", type: "text" as const, placeholder: "Enter post title...", defaultValue: initialData?.title },
        { name: "slug", label: "Slug", type: "text" as const, placeholder: "url-slug-here", defaultValue: initialData?.slug, autoGenFrom: "title", autoGenType: "slug" as const },
        {
          name: "is_published",
          label: "Status",
          type: "select" as const,
          options: [
            { label: "Draft", value: "false" },
            { label: "Published", value: "true" }
          ],
          defaultValue: initialData?.is_published?.toString() || "false"
        },
        {
          name: "category",
          label: "Category",
          type: "select" as const,
          options: [
            { label: "Capacity Building", value: "Capacity Building" },
            { label: "Grants", value: "Grants" },
            { label: "Success Stories", value: "Success Stories" },
            { label: "Governance", value: "Governance" },
            { label: "Resources", value: "Resources" },
            { label: "Reports", value: "Reports" }
          ],
          defaultValue: initialData?.category || "Capacity Building"
        },
        { name: "author", label: "Author", type: "text" as const, defaultValue: initialData?.author || "Admin" }
      ]
    },
    {
      title: "Content",
      fields: [
        { name: "featured_image", label: "Featured Image", type: "image" as const, defaultValue: initialData?.featured_image },
        { name: "content", label: "Body Content", type: "richtext" as const, placeholder: "Write your post content here...", defaultValue: initialData?.content }
      ]
    },
    {
      title: "SEO Settings",
      fields: [
        { name: "meta_title", label: "Meta Title", type: "text" as const, defaultValue: initialData?.meta_title, autoGenFrom: "title", autoGenType: "meta_title" as const },
        { name: "meta_description", label: "Meta Description", type: "textarea" as const, defaultValue: initialData?.meta_description, autoGenFrom: "content", autoGenType: "meta_description" as const }
      ]
    }
  ];

  const handleSubmit = async (data: any) => {
    setLoading(true);
    const result = await saveEntity('posts', data, id);
    setLoading(false);

    if (result.success) {
      router.push('/admin/posts');
    } else {
      alert('Error saving post: ' + result.error);
    }
  };

  if (!isNew && !initialData) return <div className="p-8">Loading...</div>;

  return (
    <EntityForm
      title={isNew ? "Create New Post" : "Edit Post"}
      backLink="/admin/posts"
      sections={sections}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}

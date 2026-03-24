'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import EntityForm from '@/components/admin/EntityForm';
import { saveEntity } from '@/app/admin/actions';

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const sections = [
    {
      title: "Basic Information",
      fields: [
        { name: "title", label: "Post Title", type: "text" as const, placeholder: "Enter post title..." },
        { name: "slug", label: "Slug", type: "text" as const, placeholder: "url-slug-here", autoGenFrom: "title", autoGenType: "slug" as const },
        {
          name: "is_published",
          label: "Status",
          type: "select" as const,
          options: [
            { label: "Draft", value: "false" },
            { label: "Published", value: "true" }
          ],
          defaultValue: "false"
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
          defaultValue: "Capacity Building"
        },
        { name: "author", label: "Author", type: "text" as const, defaultValue: "Admin" }
      ]
    },
    {
      title: "Content",
      fields: [
        { name: "featured_image", label: "Featured Image", type: "image" as const },
        { name: "content", label: "Body Content", type: "richtext" as const, placeholder: "Write your post content here..." }
      ]
    },
    {
      title: "SEO Settings",
      fields: [
        { name: "meta_title", label: "Meta Title", type: "text" as const, autoGenFrom: "title", autoGenType: "meta_title" as const },
        { name: "meta_description", label: "Meta Description", type: "textarea" as const, autoGenFrom: "content", autoGenType: "meta_description" as const }
      ]
    }
  ];

  const handleSubmit = async (data: any) => {
    setLoading(true);
    const result = await saveEntity('posts', data, 'new');
    setLoading(false);

    if (result.success) {
      router.push('/admin/posts');
    } else {
      alert('Error creating post: ' + result.error);
    }
  };

  return (
    <EntityForm
      title="Create New Post"
      backLink="/admin/posts"
      sections={sections}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}

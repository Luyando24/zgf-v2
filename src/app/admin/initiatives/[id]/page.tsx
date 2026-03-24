'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import EntityForm from '@/components/admin/EntityForm';
import { saveEntity } from '@/app/admin/actions';
import { createClient } from '@/utils/supabase/client';

export default function InitiativeFormPage() {
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
        const { data } = await supabase.from('community_initiatives').select('*').eq('id', id).single();
        if (data) setInitialData(data);
      }
      loadData();
    }
  }, [id, isNew]);

  const sections = [
    {
      title: "Initiative Details",
      fields: [
        { name: "title", label: "Title", type: "text" as const, placeholder: "e.g. Community Seed Bank", defaultValue: initialData?.title },
        { name: "slug", label: "Slug", type: "text" as const, placeholder: "community-seed-bank", defaultValue: initialData?.slug, autoGenFrom: "title", autoGenType: "slug" as const },
        {
          name: "category",
          label: "Category",
          type: "select" as const,
          options: [
            { label: "Agriculture", value: "Agriculture" },
            { label: "Education", value: "Education" },
            { label: "Health", value: "Health" },
            { label: "Environment", value: "Environment" },
            { label: "Governance", value: "Governance" }
          ],
          defaultValue: initialData?.category || "Agriculture"
        },
        {
          name: "status",
          label: "Status",
          type: "select" as const,
          options: [
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" }
          ],
          defaultValue: initialData?.status || "published"
        },
        { name: "location", label: "Location", type: "text" as const, placeholder: "e.g. Lusaka, Zambia", defaultValue: initialData?.location }
      ]
    },
    {
      title: "Dates & Timeline",
      fields: [
        { name: "start_date", label: "Start Date", type: "date" as const, defaultValue: initialData?.start_date },
        { name: "end_date", label: "End Date", type: "date" as const, defaultValue: initialData?.end_date }
      ]
    },
    {
      title: "Media & Description",
      fields: [
        { name: "cover_image", label: "Cover Image", type: "image" as const, defaultValue: initialData?.cover_image },
        { name: "summary", label: "Brief Summary", type: "textarea" as const, placeholder: "Short description for the grid view...", defaultValue: initialData?.summary },
        { name: "description", label: "Full Description", type: "richtext" as const, placeholder: "Detailed information about the initiative...", defaultValue: initialData?.description }
      ]
    }
  ];

  const handleSubmit = async (data: any) => {
    setLoading(true);
    const result = await saveEntity('community_initiatives', data, id);
    setLoading(false);

    if (result.success) {
      router.push('/admin/initiatives');
    } else {
      alert('Error saving initiative: ' + result.error);
    }
  };

  if (!isNew && !initialData) return <div className="p-8">Loading...</div>;

  return (
    <EntityForm
      title={isNew ? "Add New Initiative" : "Edit Initiative"}
      backLink="/admin/initiatives"
      sections={sections}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}

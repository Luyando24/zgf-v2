'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import EntityForm from '@/components/admin/EntityForm';
import { saveEntity } from '@/app/admin/actions';
import { createClient } from '@/utils/supabase/client';

export default function ResourceFormPage() {
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
        const { data } = await supabase.from('resources').select('*').eq('id', id).single();
        if (data) setInitialData(data);
      }
      loadData();
    }
  }, [id, isNew]);

  const sections = [
    {
      title: "Document Details",
      fields: [
        { name: "title", label: "Resource Title", type: "text" as const, placeholder: "e.g. Annual Report 2024", defaultValue: initialData?.title },
        { name: "slug", label: "Slug", type: "text" as const, placeholder: "annual-report-2024", defaultValue: initialData?.slug, autoGenFrom: "title", autoGenType: "slug" as const },
        {
          name: "type",
          label: "Resource Type",
          type: "select" as const,
          defaultValue: initialData?.type || "Report",
          options: [
            { label: "Report", value: "Report" },
            { label: "Guide", value: "Guide" },
            { label: "Policy Brief", value: "Policy Brief" },
            { label: "Newsletter", value: "Newsletter" },
            { label: "Financial", value: "Financial" }
          ]
        },
        {
          name: "is_published",
          label: "Status",
          type: "select" as const,
          defaultValue: initialData?.is_published === false ? "false" : "true",
          options: [
            { label: "Published", value: "true" },
            { label: "Draft", value: "false" }
          ]
        },
        { name: "description", label: "Description", type: "textarea" as const, placeholder: "Summary of what this document contains...", defaultValue: initialData?.description },
        { name: "tags", label: "Tags", type: "text" as const, placeholder: "e.g. governance, 2024 (comma-separated)", defaultValue: initialData?.tags }
      ]
    },
    {
      title: "File & Media",
      fields: [
        { name: "cover_image", label: "Cover Image", type: "image" as const, defaultValue: initialData?.cover_image },
        { name: "file_url", label: "Upload Document (PDF / Word)", type: "file" as const, defaultValue: initialData?.file_url },
        { name: "download_count", label: "Download Count", type: "text" as const, defaultValue: initialData?.download_count?.toString() || "0" }
      ]
    }
  ];

  const handleSubmit = async (data: any) => {
    setLoading(true);
    const payload = { ...data, is_published: data.is_published === 'true' || data.is_published === true };
    const result = await saveEntity('resources', payload, id);
    setLoading(false);

    if (result.success) {
      router.push('/admin/resources');
    } else {
      alert('Error saving resource: ' + result.error);
    }
  };

  if (!isNew && !initialData) return <div className="p-8">Loading...</div>;

  return (
    <EntityForm
      title={isNew ? "Upload Resource" : "Edit Resource"}
      backLink="/admin/resources"
      sections={sections}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}

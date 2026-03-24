'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import EntityForm from '@/components/admin/EntityForm';
import { saveEntity } from '@/app/admin/actions';

export default function NewResourcePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const sections = [
    {
      title: "Document Details",
      fields: [
        { name: "title", label: "Resource Title", type: "text" as const, placeholder: "e.g. Annual Report 2024" },
        { name: "slug", label: "Slug", type: "text" as const, placeholder: "annual-report-2024", autoGenFrom: "title", autoGenType: "slug" as const },
        {
          name: "type",
          label: "Resource Type",
          type: "select" as const,
          defaultValue: "Report",
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
          defaultValue: "true",
          options: [
            { label: "Published", value: "true" },
            { label: "Draft", value: "false" }
          ]
        },
        { name: "description", label: "Description", type: "textarea" as const, placeholder: "Summary of what this document contains..." },
        { name: "tags", label: "Tags", type: "text" as const, placeholder: "e.g. governance, 2024, civil society (comma-separated)" }
      ]
    },
    {
      title: "File & Media",
      fields: [
        { name: "cover_image", label: "Cover Image", type: "image" as const },
        { name: "file_url", label: "Upload Document (PDF / Word)", type: "file" as const },
        { name: "download_count", label: "Initial Download Count", type: "text" as const, defaultValue: "0" }
      ]
    }
  ];

  const handleSubmit = async (data: any) => {
    setLoading(true);
    // Convert is_published string to boolean
    const payload = { ...data, is_published: data.is_published === 'true' || data.is_published === true };
    const result = await saveEntity('resources', payload, 'new');
    setLoading(false);

    if (result.success) {
      router.push('/admin/resources');
    } else {
      alert('Error creating resource: ' + result.error);
    }
  };

  return (
    <EntityForm
      title="Upload Resource"
      backLink="/admin/resources"
      sections={sections}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}

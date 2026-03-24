'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import EntityForm from '@/components/admin/EntityForm';
import { saveEntity } from '@/app/admin/actions';

export default function NewInitiativePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const sections = [
    {
      title: "Initiative Details",
      fields: [
        { name: "title", label: "Title", type: "text" as const, placeholder: "e.g. Community Seed Bank" },
        { name: "slug", label: "Slug", type: "text" as const, placeholder: "community-seed-bank", autoGenFrom: "title", autoGenType: "slug" as const },
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
          defaultValue: "Agriculture"
        },
        {
          name: "status",
          label: "Status",
          type: "select" as const,
          options: [
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" }
          ],
          defaultValue: "published"
        },
        { name: "location", label: "Location", type: "text" as const, placeholder: "e.g. Lusaka, Zambia" }
      ]
    },
    {
      title: "Dates & Timeline",
      fields: [
        { name: "start_date", label: "Start Date", type: "date" as const },
        { name: "end_date", label: "End Date", type: "date" as const }
      ]
    },
    {
      title: "Media & Description",
      fields: [
        { name: "cover_image", label: "Cover Image", type: "image" as const },
        { name: "summary", label: "Brief Summary", type: "textarea" as const, placeholder: "Short description for the grid view..." },
        { name: "description", label: "Full Description", type: "richtext" as const, placeholder: "Detailed information about the initiative..." }
      ]
    }
  ];

  const handleSubmit = async (data: any) => {
    setLoading(true);
    const result = await saveEntity('community_initiatives', data, 'new');
    setLoading(false);

    if (result.success) {
      router.push('/admin/initiatives');
    } else {
      alert('Error creating initiative: ' + result.error);
    }
  };

  return (
    <EntityForm
      title="Add New Initiative"
      backLink="/admin/initiatives"
      sections={sections}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}

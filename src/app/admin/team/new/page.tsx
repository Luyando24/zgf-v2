'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import EntityForm from '@/components/admin/EntityForm';
import { saveEntity } from '@/app/admin/actions';

export default function NewTeamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const sections = [
    {
      title: "Profile Information",
      fields: [
        { name: "name", label: "Full Name", type: "text" as const, placeholder: "e.g. John Doe" },
        { name: "position", label: "Job Title", type: "text" as const, placeholder: "e.g. Programs Director" },
        {
          name: "category",
          label: "Department",
          type: "select" as const,
          options: [
            { label: "Leadership", value: "Leadership" },
            { label: "Programs", value: "Programs" },
            { label: "Finance & Admin", value: "Finance & Admin" },
            { label: "Communications", value: "Communications" }
          ],
          defaultValue: "Leadership"
        },
        { name: "email", label: "Work Email", type: "text" as const, placeholder: "name@zgf.org.zm" }
      ]
    },
    {
      title: "Bio & Spirit Animal",
      fields: [
        { name: "image", label: "Profile Picture", type: "image" as const },
        { name: "description", label: "Short Bio", type: "richtext" as const, placeholder: "Professional background..." },
        { name: "animal_icon", label: "Spirit Animal Icon", type: "image" as const },
        { name: "animal_name", label: "Spirit Animal Name", type: "text" as const, placeholder: "e.g. The Lion" },
        { name: "animal_description", label: "Animal Meaning", type: "textarea" as const, placeholder: "Why this animal represents the member..." }
      ]
    },
    {
      title: "Social Media",
      fields: [
        { name: "linkedin", label: "LinkedIn URL", type: "text" as const },
        { name: "twitter", label: "Twitter URL", type: "text" as const }
      ]
    }
  ];

  const handleSubmit = async (data: any) => {
    setLoading(true);
    const result = await saveEntity('team_members', data, 'new');
    setLoading(false);

    if (result.success) {
      router.push('/admin/team');
    } else {
      alert('Error creating team member: ' + result.error);
    }
  };

  return (
    <EntityForm
      title="Add Team Member"
      backLink="/admin/team"
      sections={sections}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}

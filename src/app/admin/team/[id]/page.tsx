'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import EntityForm from '@/components/admin/EntityForm';
import { saveEntity } from '@/app/admin/actions';
import { createClient } from '@/utils/supabase/client';

export default function TeamMemberFormPage() {
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
        const { data } = await supabase.from('team_members').select('*').eq('id', id).single();
        if (data) setInitialData(data);
      }
      loadData();
    }
  }, [id, isNew]);

  const sections = [
    {
      title: "Profile Information",
      fields: [
        { name: "name", label: "Full Name", type: "text" as const, placeholder: "e.g. John Doe", defaultValue: initialData?.name },
        { name: "position", label: "Job Title", type: "text" as const, placeholder: "e.g. Programs Director", defaultValue: initialData?.position },
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
          defaultValue: initialData?.category || "Leadership"
        },
        { name: "email", label: "Work Email", type: "text" as const, placeholder: "name@zgf.org.zm", defaultValue: initialData?.email }
      ]
    },
    {
      title: "Bio & Spirit Animal",
      fields: [
        { name: "image", label: "Profile Picture", type: "image" as const, defaultValue: initialData?.image },
        { name: "description", label: "Short Bio", type: "richtext" as const, placeholder: "Professional background...", defaultValue: initialData?.description },
        { name: "animal_icon", label: "Spirit Animal Icon", type: "image" as const, defaultValue: initialData?.animal_icon },
        { name: "animal_name", label: "Spirit Animal Name", type: "text" as const, placeholder: "e.g. The Lion", defaultValue: initialData?.animal_name },
        { name: "animal_description", label: "Animal Meaning", type: "textarea" as const, placeholder: "Why this animal represents the member...", defaultValue: initialData?.animal_description }
      ]
    },
    {
      title: "Social Media",
      fields: [
        { name: "linkedin", label: "LinkedIn URL", type: "text" as const, defaultValue: initialData?.linkedin },
        { name: "twitter", label: "Twitter URL", type: "text" as const, defaultValue: initialData?.twitter }
      ]
    }
  ];

  const handleSubmit = async (data: any) => {
    setLoading(true);
    const result = await saveEntity('team_members', data, id);
    setLoading(false);

    if (result.success) {
      router.push('/admin/team');
    } else {
      alert('Error saving team member: ' + result.error);
    }
  };

  if (!isNew && !initialData) return <div className="p-8">Loading...</div>;

  return (
    <EntityForm
      title={isNew ? "Add Team Member" : "Edit Team Member"}
      backLink="/admin/team"
      sections={sections}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}

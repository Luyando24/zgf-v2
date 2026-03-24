'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import EntityForm from '@/components/admin/EntityForm';
import { saveEntity } from '@/app/admin/actions';
import { createClient } from '@/utils/supabase/client';

export default function VolunteerFormPage() {
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
        const { data } = await supabase.from('volunteers').select('*').eq('id', id).single();
        if (data) setInitialData(data);
      }
      loadData();
    }
  }, [id, isNew]);

  const sections = [
    {
      title: "Applicant Information",
      fields: [
        { name: "name", label: "Full Name", type: "text" as const, placeholder: "e.g. John Doe", defaultValue: initialData?.name },
        { name: "email", label: "Email Address", type: "text" as const, placeholder: "john@example.com", defaultValue: initialData?.email },
        { name: "phone", label: "Phone Number", type: "text" as const, placeholder: "+260...", defaultValue: initialData?.phone },
        { name: "address", label: "Residential Address", type: "text" as const, placeholder: "City, Area...", defaultValue: initialData?.address },
      ]
    },
    {
      title: "Application Details",
      fields: [
        { 
          name: "status", 
          label: "Application Status", 
          type: "select" as const, 
          options: [
            { label: "Pending Review", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Rejected", value: "rejected" }
          ],
          defaultValue: initialData?.status || "pending"
        },
        { name: "skills", label: "Skills & Expertise", type: "textarea" as const, placeholder: "e.g. Graphic Design, Project Management...", defaultValue: initialData?.skills },
        { name: "availability", label: "Availability", type: "text" as const, placeholder: "e.g. Weekends only, 10 hours/week...", defaultValue: initialData?.availability },
        { name: "motivation", label: "Motivation Statement", type: "textarea" as const, placeholder: "Why does this person want to volunteer?", defaultValue: initialData?.motivation },
      ]
    },
    {
      title: "Documents",
      fields: [
        { name: "cv", label: "CV/Resume URL", type: "text" as const, placeholder: "Link to uploaded CV...", defaultValue: initialData?.cv }
      ]
    }
  ];

  const handleSubmit = async (data: any) => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    
    const result = await saveEntity('volunteers', formData, id);
    setLoading(false);
    
    if (result.success) {
      router.push('/admin/volunteers');
    } else {
      alert('Error saving volunteer record: ' + result.error);
    }
  };

  if (!isNew && !initialData) return <div className="p-8">Loading applicant data...</div>;

  return (
    <EntityForm
      title={isNew ? "Add New Volunteer" : "Review Volunteer Application"}
      backLink="/admin/volunteers"
      sections={sections}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}

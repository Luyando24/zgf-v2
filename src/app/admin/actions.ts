'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Generic Action to Save Entity (Create or Update)
export async function saveEntity(table: string, data: any, id?: string | number) {
  const supabase = await createClient();

  // Strip auto-managed columns that should never be sent by the client
  const { id: _id, created_at, updated_at, ...cleanData } = data as any;

  let result;
  if (id && id !== 'new') {
    result = await supabase
      .from(table)
      .update(cleanData)
      .eq('id', id);
  } else {
    result = await supabase
      .from(table)
      .insert([cleanData]);
  }

  if (result.error) {
    console.error(`Error saving to ${table}:`, result.error);
    return { error: result.error.message };
  }

  revalidatePath(`/admin/${table}`);
  revalidatePath(`/(public)/${table === 'posts' ? 'news' : table}`);

  return { success: true };
}

// Upload Image to Supabase Storage
export async function uploadImage(file: File, bucket: string = 'uploads') {
  const supabase = await createClient();

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading image:', error);
    return { error: error.message };
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return { url: publicUrl };
}

// Generic Action to Delete Entity
export async function deleteEntity(table: string, id: string | number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting from ${table}:`, error);
    return { error: error.message };
  }

  revalidatePath(`/admin/${table}`);
  return { success: true };
}

// Settings Specific Action
export async function saveSettings(formData: FormData) {
  const supabase = await createClient();
  const data = Object.fromEntries(formData.entries());

  // Settings usually has only one row (id: 1)
  const { error } = await supabase
    .from('settings')
    .upsert({ id: 1, ...data });

  if (error) {
    console.error('Error saving settings:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/settings');
  revalidatePath('/(public)');
  return { success: true };
}

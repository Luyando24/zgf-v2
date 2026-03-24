'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  X,
  ArrowLeft,
  Image as ImageIcon,
  ChevronRight,
  Upload,
  Loader2,
  FileText,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import RichTextEditor from "./RichTextEditor";

// Upload directly from the browser to Supabase Storage — bypasses Server Action body limits
async function uploadImageClient(file: File): Promise<{ url?: string; error?: string }> {
  const supabase = createClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('uploads')
    .upload(fileName, file, { upsert: false });

  if (error) return { error: error.message };

  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(fileName);

  return { url: publicUrl };
}

// Upload any file (PDF, Word, etc.) to Supabase Storage
async function uploadFileClient(file: File): Promise<{ url?: string; name?: string; error?: string }> {
  const supabase = createClient();
  const fileExt = file.name.split('.').pop();
  const safeBase = file.name.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/\.[^.]+$/, '');
  const fileName = `${safeBase}_${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('uploads')
    .upload(fileName, file, { upsert: false });

  if (error) return { error: error.message };

  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(fileName);

  return { url: publicUrl, name: file.name };
}

interface EntityFormProps {
  title: string;
  backLink: string;
  sections: {
    title: string;
    fields: {
      name: string;
      label: string;
      type: 'text' | 'textarea' | 'select' | 'image' | 'file' | 'date' | 'checkbox' | 'richtext';
      placeholder?: string;
      options?: { label: string; value: string }[];
      defaultValue?: any;
      autoGenFrom?: string; // Field to watch for auto-generation
      autoGenType?: 'slug' | 'meta_title' | 'meta_description';
    }[];
  }[];
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export default function EntityForm({
  title,
  backLink,
  sections,
  onSubmit,
  loading = false
}: EntityFormProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [loadingImage, setLoadingImage] = useState<string | null>(null);
  const [loadingFile, setLoadingFile] = useState<string | null>(null);
  const [uploadedFileNames, setUploadedFileNames] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const initialValues: Record<string, any> = {};
    sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          initialValues[field.name] = field.defaultValue;
        }
      });
    });
    setFormValues(initialValues);
  }, [sections]);

  const handleInputChange = (name: string, value: any) => {
    setFormValues(prev => {
      const next = { ...prev, [name]: value };

      // Handle auto-generation logic
      sections.forEach(section => {
        section.fields.forEach(field => {
          if (field.autoGenFrom === name) {
            if (field.autoGenType === 'slug') {
              next[field.name] = value.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            } else if (field.autoGenType === 'meta_title') {
              next[field.name] = value.substring(0, 60);
            } else if (field.autoGenType === 'meta_description') {
              // Strip HTML and take first 160 chars
              next[field.name] = value.replace(/<[^>]*>?/gm, '').substring(0, 160);
            }
          }
        });
      });

      return next;
    });
  };

  const handleImageUpload = async (name: string, file: File) => {
    setLoadingImage(name);
    const result = await uploadImageClient(file);
    setLoadingImage(null);

    if (result.url) {
      handleInputChange(name, result.url);
    } else {
      alert('Upload failed: ' + result.error);
    }
  };

  const handleFileUpload = async (name: string, file: File) => {
    setLoadingFile(name);
    const result = await uploadFileClient(file);
    setLoadingFile(null);

    if (result.url) {
      handleInputChange(name, result.url);
      setUploadedFileNames(prev => ({ ...prev, [name]: result.name! }));
    } else {
      alert('Upload failed: ' + result.error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-8 pb-20 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-30 bg-gray-50/95 backdrop-blur pt-4 pb-4 -mt-4 mb-8 -mx-8 px-8 border-b border-gray-100 shadow-sm transition-all">
        <div className="flex items-center gap-4">
          <Link
            href={backLink}
            className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all shadow-sm shrink-0"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-dark">{title}</h1>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
              <Link href="/admin" className="hover:text-primary">Dashboard</Link>
              <span className="opacity-50">/</span>
              <Link href={backLink} className="hover:text-primary">List</Link>
              <span className="opacity-50">/</span>
              <span className="text-gray-600">Form</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={backLink}
            className="px-6 py-2.5 rounded-2xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-white px-8 py-2.5 rounded-2xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30">
              <h3 className="font-bold text-dark">{section.title}</h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.map((field, fIdx) => (
                <div key={fIdx} className={`space-y-2 ${field.type === 'textarea' || field.type === 'image' || field.type === 'file' || field.type === 'richtext' ? 'md:col-span-2' : ''}`}>
                  <label className="text-sm font-bold text-gray-700 block">
                    {field.label}
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formValues[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none shadow-sm"
                    />
                  ) : field.type === 'richtext' ? (
                    <RichTextEditor
                      value={formValues[field.name] || ''}
                      onChange={(value) => handleInputChange(field.name, value)}
                      placeholder={field.placeholder}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      name={field.name}
                      value={formValues[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer shadow-sm"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : field.type === 'image' ? (
                    <div className="relative group">
                      <div
                        onClick={() => fileInputRefs.current[field.name]?.click()}
                        className="w-full h-48 bg-white border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer overflow-hidden shadow-sm"
                      >
                        {formValues[field.name] ? (
                          <img src={formValues[field.name]} alt="Preview" className="w-full h-full object-cover" />
                        ) : loadingImage === field.name ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="animate-spin text-primary" size={32} />
                            <p className="text-xs font-bold text-gray-500">Uploading...</p>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl shadow-sm flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                              <Upload size={24} />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-bold text-dark">Click to upload image</p>
                              <p className="text-[10px] text-gray-400 font-medium mt-1">PNG, JPG or WEBP up to 2MB</p>
                            </div>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={el => { fileInputRefs.current[field.name] = el; }}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(field.name, file);
                        }}
                      />
                      {formValues[field.name] && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInputChange(field.name, '');
                          }}
                          className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ) : field.type === 'file' ? (
                    <div className="relative">
                      <div
                        onClick={() => fileInputRefs.current[field.name]?.click()}
                        className={`w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all shadow-sm p-8 ${formValues[field.name]
                            ? 'border-primary/40 bg-primary/5'
                            : 'border-gray-200 bg-white hover:border-primary hover:bg-primary/5'
                          }`}
                      >
                        {loadingFile === field.name ? (
                          <>
                            <Loader2 className="animate-spin text-primary" size={32} />
                            <p className="text-xs font-bold text-gray-500">Uploading file...</p>
                          </>
                        ) : formValues[field.name] ? (
                          <>
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                              <CheckCircle2 size={28} />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-bold text-dark truncate max-w-xs">
                                {uploadedFileNames[field.name] || 'File uploaded'}
                              </p>
                              <a
                                href={formValues[field.name]}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1 mt-1"
                              >
                                <ExternalLink size={11} /> View file
                              </a>
                              <p className="text-[10px] text-gray-400 mt-1">Click to replace</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                              <FileText size={28} />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-bold text-dark">Click to upload document</p>
                              <p className="text-[10px] text-gray-400 font-medium mt-1">PDF or Word (.pdf, .doc, .docx) up to 20MB</p>
                            </div>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={el => { fileInputRefs.current[field.name] = el; }}
                        className="hidden"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(field.name, file);
                        }}
                      />
                      {formValues[field.name] && (
                        <button
                          type="button"
                          onClick={() => {
                            handleInputChange(field.name, '');
                            setUploadedFileNames(prev => { const n = { ...prev }; delete n[field.name]; return n; });
                          }}
                          className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formValues[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}

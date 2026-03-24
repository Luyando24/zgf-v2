'use client';
import React, { useRef, useEffect } from 'react';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Type,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Minus,
  Code
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

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

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadImageClient(file);
      if (result.url) {
        editor.chain().focus().setImage({ src: result.url }).run();
      } else {
        alert('Upload failed: ' + result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('An error occurred during upload');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const buttons = [
    { icon: <Heading1 size={18} />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
    { icon: <Heading2 size={18} />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
    { icon: <div className="w-px h-6 bg-gray-200 mx-1 self-center" />, isDivider: true },
    { icon: <Bold size={18} />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    { icon: <Italic size={18} />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
    { icon: <UnderlineIcon size={18} />, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') },
    { icon: <div className="w-px h-6 bg-gray-200 mx-1 self-center" />, isDivider: true },
    { icon: <AlignLeft size={18} />, action: () => editor.chain().focus().setTextAlign('left').run(), active: editor.isActive({ textAlign: 'left' }) },
    { icon: <AlignCenter size={18} />, action: () => editor.chain().focus().setTextAlign('center').run(), active: editor.isActive({ textAlign: 'center' }) },
    { icon: <AlignRight size={18} />, action: () => editor.chain().focus().setTextAlign('right').run(), active: editor.isActive({ textAlign: 'right' }) },
    { icon: <div className="w-px h-6 bg-gray-200 mx-1 self-center" />, isDivider: true },
    { icon: <List size={18} />, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
    { icon: <ListOrdered size={18} />, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
    { icon: <Quote size={18} />, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
    { icon: <Code size={18} />, action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive('codeBlock') },
    { icon: <Minus size={18} />, action: () => editor.chain().focus().setHorizontalRule().run(), active: false },
    { icon: <div className="w-px h-6 bg-gray-200 mx-1 self-center" />, isDivider: true },
    { icon: <LinkIcon size={18} />, action: addLink, active: editor.isActive('link') },
    { icon: <ImageIcon size={18} />, action: () => fileInputRef.current?.click(), active: false },
  ];

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      {buttons.map((btn, i) => (
        btn.isDivider ? (
          <React.Fragment key={i}>{btn.icon}</React.Fragment>
        ) : (
          <button
            key={i}
            type="button"
            onClick={btn.action}
            className={`p-2 rounded-xl transition-all ${btn.active ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-500 hover:bg-white hover:text-primary hover:shadow-sm'}`}
          >
            {btn.icon}
          </button>
        )
      ))}
      <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 text-gray-500 hover:bg-white hover:text-primary rounded-xl transition-all"
      >
        <Undo size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 text-gray-500 hover:bg-white hover:text-primary rounded-xl transition-all"
      >
        <Redo size={18} />
      </button>
    </div>
  );
};

export default function RichTextEditor({ value, onChange, placeholder = 'Write something...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline font-medium',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-2xl shadow-lg max-w-full h-auto my-8 mx-auto block border-4 border-white',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    immediatelyRender: false,
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-6 text-dark',
      },
    },
  });

  useEffect(() => {
    if (editor && value && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
    Upload,
    Search,
    Grid3X3,
    List,
    Image as ImageIcon,
    FileText,
    Film,
    Trash2,
    Copy,
    Check,
    Loader2,
    X,
    AlertCircle,
    CheckSquare,
    Square,
} from 'lucide-react';

type FileItem = {
    name: string;
    id: string;
    updated_at: string;
    created_at: string;
    last_accessed_at: string;
    metadata: Record<string, any>;
    url: string;
    size: number;
    mimeType: string;
};

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'images' | 'documents' | 'videos';

function getFileType(mimeType: string, name: string): FilterType {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    if (mimeType?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(ext)) return 'images';
    if (mimeType?.startsWith('video/') || ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'videos';
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'].includes(ext)) return 'documents';
    return 'documents';
}

function formatBytes(bytes: number): string {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function MediaLibraryPage() {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [deleting, setDeleting] = useState<Set<string>>(new Set());
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadFiles = useCallback(async () => {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase.storage.from('uploads').list('', {
            limit: 200,
            sortBy: { column: 'created_at', order: 'desc' },
        });

        if (error) {
            console.error('Error loading media:', error);
            setLoading(false);
            return;
        }

        const items = (data || [])
            .filter(f => f.name !== '.emptyFolderPlaceholder')
            .map(f => {
                const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(f.name);
                return {
                    ...f,
                    url: publicUrl,
                    size: f.metadata?.size || 0,
                    mimeType: f.metadata?.mimetype || '',
                } as FileItem;
            });

        setFiles(items);
        setLoading(false);
    }, []);

    useEffect(() => { loadFiles(); }, [loadFiles]);

    const handleUpload = async (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;
        setUploading(true);
        const supabase = createClient();

        for (const file of Array.from(fileList)) {
            const safeBase = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            const fileName = `${Date.now()}_${safeBase}`;
            await supabase.storage.from('uploads').upload(fileName, file, { upsert: false });
        }

        setUploading(false);
        await loadFiles();
    };

    const handleDelete = async (names: string[]) => {
        if (!confirm(`Delete ${names.length} file${names.length > 1 ? 's' : ''}? This cannot be undone.`)) return;
        const supabase = createClient();
        setDeleting(new Set(names));
        await supabase.storage.from('uploads').remove(names);
        setDeleting(new Set());
        setSelected(new Set());
        await loadFiles();
    };

    const copyUrl = async (file: FileItem) => {
        await navigator.clipboard.writeText(file.url);
        setCopiedId(file.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const toggleSelect = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const filteredFiles = files.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || getFileType(f.mimeType, f.name) === filter;
        return matchesSearch && matchesFilter;
    });

    const selectedNames = files.filter(f => selected.has(f.id)).map(f => f.name);
    const allSelected = filteredFiles.length > 0 && filteredFiles.every(f => selected.has(f.id));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-dark">Media Library</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{files.length} file{files.length !== 1 ? 's' : ''} in storage</p>
                </div>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-2xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-60 shrink-0"
                >
                    {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                    {uploading ? 'Uploading...' : 'Upload Files'}
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.mp4,.mov,.webm"
                    onChange={e => handleUpload(e.target.files)}
                />
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Search */}
                <div className="relative flex-1 min-w-0 w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search files..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>

                {/* Filter tabs */}
                <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 shrink-0">
                    {(['all', 'images', 'documents', 'videos'] as FilterType[]).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filter === f ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* View toggle */}
                <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 shrink-0">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}
                    >
                        <Grid3X3 size={16} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}
                    >
                        <List size={16} />
                    </button>
                </div>
            </div>

            {/* Bulk action bar */}
            {selected.size > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-2xl px-5 py-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">{selected.size} file{selected.size > 1 ? 's' : ''} selected</span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSelected(new Set())}
                            className="text-xs font-bold text-gray-500 hover:text-gray-700"
                        >
                            Clear
                        </button>
                        <button
                            onClick={() => handleDelete(selectedNames)}
                            className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all"
                        >
                            <Trash2 size={14} /> Delete Selected
                        </button>
                    </div>
                </div>
            )}

            {/* Drop zone overlay on drag */}
            <div
                onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={e => { e.preventDefault(); setIsDragOver(false); handleUpload(e.dataTransfer.files); }}
                className={`relative transition-all ${isDragOver ? 'ring-4 ring-primary ring-offset-2 rounded-3xl' : ''}`}
            >
                {isDragOver && (
                    <div className="absolute inset-0 z-20 bg-primary/10 rounded-3xl flex items-center justify-center border-4 border-dashed border-primary pointer-events-none">
                        <div className="text-center">
                            <Upload size={40} className="text-primary mx-auto mb-2" />
                            <p className="font-bold text-primary text-lg">Drop files to upload</p>
                        </div>
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center py-32 bg-white rounded-3xl border border-gray-100">
                        <Loader2 className="animate-spin text-primary" size={40} />
                    </div>
                ) : filteredFiles.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <ImageIcon size={32} />
                        </div>
                        <h3 className="font-bold text-dark mb-1">
                            {search || filter !== 'all' ? 'No files match your filters' : 'No files yet'}
                        </h3>
                        <p className="text-sm text-gray-400 mb-5">
                            {search || filter !== 'all' ? 'Try a different search or filter.' : 'Upload files using the button above or drag and drop here.'}
                        </p>
                        {!search && filter === 'all' && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark shadow-md shadow-primary/15 transition-all"
                            >
                                <Upload size={16} /> Upload your first file
                            </button>
                        )}
                    </div>
                ) : viewMode === 'grid' ? (
                    <GridView
                        files={filteredFiles}
                        selected={selected}
                        deleting={deleting}
                        copiedId={copiedId}
                        onSelect={toggleSelect}
                        onCopy={copyUrl}
                        onDelete={(f: FileItem) => handleDelete([f.name])}
                        allSelected={allSelected}
                        onSelectAll={() => {
                            if (allSelected) setSelected(new Set());
                            else setSelected(new Set(filteredFiles.map(f => f.id)));
                        }}
                    />
                ) : (
                    <ListView
                        files={filteredFiles}
                        selected={selected}
                        deleting={deleting}
                        copiedId={copiedId}
                        onSelect={toggleSelect}
                        onCopy={copyUrl}
                        onDelete={(f: FileItem) => handleDelete([f.name])}
                        allSelected={allSelected}
                        onSelectAll={() => {
                            if (allSelected) setSelected(new Set());
                            else setSelected(new Set(filteredFiles.map(f => f.id)));
                        }}
                    />
                )}
            </div>
        </div>
    );
}

/* ─── Grid View ────────────────────────────────────────── */
function GridView({ files, selected, deleting, copiedId, onSelect, onCopy, onDelete, allSelected, onSelectAll }: any) {
    return (
        <div>
            <div className="flex items-center justify-between mb-3 px-1">
                <button onClick={onSelectAll} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary font-bold transition-colors">
                    {allSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                    {allSelected ? 'Deselect all' : 'Select all'}
                </button>
                <span className="text-xs text-gray-400">{files.length} file{files.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {files.map((file: FileItem) => {
                    const isImage = getFileType(file.mimeType, file.name) === 'images';
                    const isSelected = selected.has(file.id);
                    const isDeleting = deleting.has(file.name);
                    return (
                        <div
                            key={file.id}
                            className={`group relative bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${isSelected ? 'border-primary shadow-md shadow-primary/10' : 'border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'
                                } ${isDeleting ? 'opacity-40 pointer-events-none' : ''}`}
                        >
                            {/* Thumbnail */}
                            <div
                                className="aspect-square bg-gray-50 relative cursor-pointer"
                                onClick={() => onSelect(file.id)}
                            >
                                {isImage ? (
                                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
                                        <FileIcon name={file.name} size={40} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                            {file.name.split('.').pop()}
                                        </span>
                                    </div>
                                )}

                                {/* Select overlay */}
                                <div className={`absolute top-2 left-2 transition-all ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'bg-white border-gray-300'
                                        }`}>
                                        {isSelected && <Check size={12} className="text-white" />}
                                    </div>
                                </div>

                                {isDeleting && (
                                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                        <Loader2 size={24} className="animate-spin text-red-500" />
                                    </div>
                                )}
                            </div>

                            {/* Info + actions */}
                            <div className="p-3">
                                <p className="text-xs font-bold text-dark truncate" title={file.name}>{file.name}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{formatBytes(file.size)}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <button
                                        onClick={() => onCopy(file)}
                                        className={`flex-1 flex items-center justify-center gap-1 text-[10px] font-bold py-1.5 rounded-lg transition-all ${copiedId === file.id
                                            ? 'bg-green-50 text-green-600'
                                            : 'bg-gray-50 text-gray-500 hover:bg-primary/5 hover:text-primary'
                                            }`}
                                        title="Copy URL"
                                    >
                                        {copiedId === file.id ? <Check size={11} /> : <Copy size={11} />}
                                        {copiedId === file.id ? 'Copied!' : 'Copy URL'}
                                    </button>
                                    <button
                                        onClick={() => onDelete(file)}
                                        className="p-1.5 rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─── List View ────────────────────────────────────────── */
function ListView({ files, selected, deleting, copiedId, onSelect, onCopy, onDelete, allSelected, onSelectAll }: any) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header row */}
            <div className="flex items-center gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                <button onClick={onSelectAll} className="text-gray-400 hover:text-primary transition-colors">
                    {allSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                </button>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex-1">File</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-24 hidden sm:block">Type</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-20 hidden md:block">Size</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-24 hidden lg:block">Uploaded</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 w-28 text-right">Actions</span>
            </div>

            <div className="divide-y divide-gray-50">
                {files.map((file: FileItem) => {
                    const isImage = getFileType(file.mimeType, file.name) === 'images';
                    const isSelected = selected.has(file.id);
                    const isDeleting = deleting.has(file.name);
                    const ext = file.name.split('.').pop()?.toUpperCase() || '—';
                    return (
                        <div
                            key={file.id}
                            className={`flex items-center gap-4 px-5 py-3 transition-colors hover:bg-gray-50/50 ${isSelected ? 'bg-primary/5' : ''
                                } ${isDeleting ? 'opacity-40 pointer-events-none' : ''}`}
                        >
                            <button onClick={() => onSelect(file.id)} className="text-gray-300 hover:text-primary transition-colors shrink-0">
                                {isSelected ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} />}
                            </button>

                            {/* Preview */}
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                                {isImage ? (
                                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                                ) : (
                                    <FileIcon name={file.name} size={20} />
                                )}
                            </div>

                            {/* Name */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-dark truncate">{file.name}</p>
                            </div>

                            {/* Type */}
                            <span className="text-xs text-gray-400 font-medium w-24 hidden sm:block">{ext}</span>

                            {/* Size */}
                            <span className="text-xs text-gray-400 w-20 hidden md:block">{formatBytes(file.size)}</span>

                            {/* Date */}
                            <span className="text-xs text-gray-400 w-24 hidden lg:block">
                                {file.created_at ? new Date(file.created_at).toLocaleDateString() : '—'}
                            </span>

                            {/* Actions */}
                            <div className="flex items-center gap-2 w-28 justify-end shrink-0">
                                <button
                                    onClick={() => onCopy(file)}
                                    className={`p-1.5 rounded-lg transition-all ${copiedId === file.id
                                        ? 'bg-green-50 text-green-600'
                                        : 'text-gray-400 hover:bg-primary/5 hover:text-primary'
                                        }`}
                                    title="Copy URL"
                                >
                                    {copiedId === file.id ? <Check size={15} /> : <Copy size={15} />}
                                </button>
                                <a href={file.url} target="_blank" rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-dark transition-all"
                                    title="Open"
                                >
                                    <ImageIcon size={15} />
                                </a>
                                <button
                                    onClick={() => onDelete(file)}
                                    className="p-1.5 rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all"
                                    title="Delete"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─── File Type Icon ───────────────────────────────────── */
function FileIcon({ name, size = 24 }: { name: string; size?: number }) {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    if (['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(ext)) return <Film size={size} className="text-purple-400" />;
    if (['pdf'].includes(ext)) return <FileText size={size} className="text-red-400" />;
    if (['doc', 'docx'].includes(ext)) return <FileText size={size} className="text-blue-400" />;
    return <FileText size={size} className="text-gray-400" />;
}

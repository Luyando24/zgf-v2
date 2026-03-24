'use client';

import React from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

interface EntityTableProps {
  title: string;
  description: string;
  columns: {
    key: string;
    label: string;
    render?: (value: any, item: any) => React.ReactNode;
  }[];
  data: any[];
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  addLink: string;
  editLinkPrefix: string;
  loading?: boolean;
}

export default function EntityTable({
  title,
  description,
  columns,
  data,
  onEdit,
  onDelete,
  addLink,
  editLinkPrefix,
  loading = false
}: EntityTableProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">{title}</h1>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
        <Link 
          href={addLink}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 w-fit"
        >
          <Plus size={18} />
          Add New
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={`Search ${title.toLowerCase()}...`}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
              Filter
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
              Export
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                {columns.map((col) => (
                  <th key={col.key} className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4">
                        <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      <div className="h-4 bg-gray-100 rounded w-8 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50/50 transition-colors group">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 text-sm text-gray-600">
                        {col.render ? col.render(item[col.key], item) : item[col.key]}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`${editLinkPrefix}/${item.id}`}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => onDelete?.(item)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-500 font-medium">
            Showing <span className="text-dark">1</span> to <span className="text-dark">{data.length}</span> of <span className="text-dark">{data.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-primary disabled:opacity-30" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-primary text-white text-xs font-bold">1</button>
            <button className="p-2 text-gray-400 hover:text-primary disabled:opacity-30" disabled>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

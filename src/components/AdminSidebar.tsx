'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Globe,
  Image as ImageIcon,
  Briefcase,
  MessageSquare,
  HelpCircle,
  LogOut,
  ChevronRight,
  Database,
  User,
  Mail
} from "lucide-react";
import { signOut } from "@/app/(public)/login/actions";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
  { name: "Content", href: "#", icon: <Globe size={20} />, isHeader: true },
  { name: "Pages", href: "/admin/pages", icon: <FileText size={20} /> },
  { name: "Blog Posts", href: "/admin/posts", icon: <FileText size={20} /> },
  { name: "Initiatives", href: "/admin/initiatives", icon: <Briefcase size={20} /> },
  { name: "Team Members", href: "/admin/team", icon: <Users size={20} /> },
  { name: "Resources", href: "/admin/resources", icon: <Database size={20} /> },
  { name: "Media Library", href: "/admin/media", icon: <ImageIcon size={20} /> },
  { name: "Interaction", href: "#", icon: <MessageSquare size={20} />, isHeader: true },
  { name: "Volunteers", href: "/admin/volunteers", icon: <User size={20} /> },
  { name: "Newsletter", href: "/admin/newsletter", icon: <Mail size={20} /> },
  { name: "Contact Inquiries", href: "/admin/contacts", icon: <MessageSquare size={20} /> },
  { name: "Partner Requests", href: "/admin/partners", icon: <Users size={20} /> },
  { name: "System", href: "#", icon: <Settings size={20} />, isHeader: true },
  { name: "Site Settings", href: "/admin/settings", icon: <Settings size={20} /> },
  { name: "Help & Support", href: "/admin/support", icon: <HelpCircle size={20} /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="bg-primary p-2 rounded-xl text-white">
          <Globe size={24} />
        </div>
        <div>
          <h1 className="font-bold text-dark leading-none">ZGF Admin</h1>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Management</span>
        </div>
      </div>

      <nav className="flex-grow overflow-y-auto py-6 px-4 space-y-1">
        {menuItems.map((item, index) => {
          if (item.isHeader) {
            return (
              <div key={index} className="px-3 pt-4 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {item.name}
              </div>
            );
          }

          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group ${isActive
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? "text-white" : "text-gray-400 group-hover:text-primary"}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              {isActive && <ChevronRight size={14} className="text-white" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-medium text-sm"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}

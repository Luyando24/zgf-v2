import AdminSidebar from "@/components/AdminSidebar";
import { Bell, Search, User, LogOut } from "lucide-react";
import { signOut } from "@/app/(public)/login/actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-grow flex flex-col min-w-0">
        {/* Admin Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="relative w-96 max-w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-primary transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-dark leading-none">{user.email?.split('@')[0] || 'Admin User'}</p>
                <p className="text-[10px] text-gray-500 font-medium">Administrator</p>
              </div>
              <form action={signOut}>
                <button 
                  type="submit"
                  className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all group"
                  title="Sign Out"
                >
                  <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* Admin Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

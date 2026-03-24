'use client';

import Link from "next/link";
import { Home, Info, Grid, Mail } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: <Home size={20} /> },
    { name: "About", href: "/about", icon: <Info size={20} /> },
    { name: "Get Involved", href: "/get-involved", icon: <Grid size={20} /> },
    { name: "Contact", href: "/contact-us", icon: <Mail size={20} /> },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive ? "text-primary" : "text-gray-500 hover:text-primary"
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-bold uppercase tracking-tight">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const navItems = [
    { name: "HOME", href: "/" },
    {
      name: "WHAT WE DO",
      href: "#",
      dropdown: [
        { name: "Overview", href: "/what-we-do" },
        { name: "Our Initiatives", href: "/initiatives" },
        { name: "Our Pillars", href: "/pillars" },
        { name: "Communities We Work With", href: "/communities" },
      ],
    },
    {
      name: "HOW WE DO IT",
      href: "#",
      dropdown: [
        { name: "Our Approach", href: "/how-we-do-it" },
        { name: "Our Team", href: "/team" },
        { name: "Research & Publications", href: "/resources" },
      ],
    },
    { name: "OUR IMPACT", href: "/impact" },
    { name: "BLOG", href: "/news" },
    { name: "NEWSFLASH", href: "/newsflash" },
    { name: "ABOUT", href: "/about" },
    { name: "CONTACT US", href: "/contact-us" },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/logo.png" 
              alt="ZGF Logo" 
              width={150} 
              height={50} 
              className="h-[50px] w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={`px-3 py-2 text-sm font-bold flex items-center transition-colors hover:text-primary ${
                        pathname.startsWith(item.href) && item.href !== "#" ? "text-primary" : "text-dark"
                      }`}
                    >
                      {item.name} <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    <div className="absolute left-0 mt-2 w-48 bg-white border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-dark hover:bg-gray-100 hover:text-primary transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-3 py-2 text-sm font-bold transition-colors hover:text-primary ${
                      pathname === item.href ? "text-primary" : "text-dark"
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Get Involved Button (Desktop) */}
          <div className="hidden lg:block">
            <Link 
              href="/get-involved" 
              className="bg-primary text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-primary-dark transition-colors"
            >
              GET INVOLVED
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-dark"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-6">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className="w-full text-left px-4 py-2 text-sm font-bold flex justify-between items-center"
                    >
                      {item.name} <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === item.name && (
                      <div className="bg-gray-50 py-2">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-8 py-2 text-sm text-dark hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-4 py-2 text-sm font-bold text-dark hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="mt-4 px-4">
              <Link 
                href="/get-involved" 
                className="block w-full text-center bg-primary text-white px-6 py-3 rounded-full font-bold text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                GET INVOLVED
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

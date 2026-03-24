import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Linkedin, Instagram, Youtube, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-12 pb-8 bg-[#d1d8cc]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About ZGF */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image 
                src="/images/logo.png" 
                alt="ZGF Logo" 
                width={120} 
                height={60} 
                className="h-[60px] w-auto"
              />
            </Link>
            <p className="text-dark mb-4 text-sm leading-relaxed">
              The Zambian Governance Foundation strengthens civil society and promotes accountable governance through local solutions and partnerships.
            </p>
            {/* Social Media Icons */}
            <div className="flex gap-3 mb-4">
              {[
                { icon: <Facebook size={20} />, href: "https://web.facebook.com/ZGFZambia", label: "Facebook" },
                { icon: <Twitter size={20} />, href: "https://x.com/ZGFZambia", label: "Twitter" },
                { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/company/zambian-governance-foundation/", label: "LinkedIn" },
                { icon: <Instagram size={20} />, href: "https://www.instagram.com/zgfzambia/", label: "Instagram" },
                { icon: <Youtube size={20} />, href: "https://www.youtube.com/channel/UCL4EWwD1miaPsSjRUQ-aM-g", label: "YouTube" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-2 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h6 className="font-bold mb-4 text-dark uppercase tracking-wider">Quick Links</h6>
            <ul className="space-y-2">
              <li><Link href="/" className="text-dark hover:text-primary transition-colors text-sm">Home</Link></li>
              <li><Link href="/about" className="text-dark hover:text-primary transition-colors text-sm">About</Link></li>
              <li><Link href="/contact-us" className="text-dark hover:text-primary transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h6 className="font-bold mb-4 text-dark uppercase tracking-wider">Our Work</h6>
            <ul className="space-y-2">
              <li><Link href="/civil-society-support" className="text-dark hover:text-primary transition-colors text-sm">Civil Society Support</Link></li>
              <li><Link href="/capacity-development" className="text-dark hover:text-primary transition-colors text-sm">Capacity Development</Link></li>
              <li><Link href="/grants" className="text-dark hover:text-primary transition-colors text-sm">Grants</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h6 className="font-bold mb-4 text-dark uppercase tracking-wider">Contact Us</h6>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-dark">
                <MapPin size={20} className="shrink-0 mt-1 text-primary" />
                <span>9 Mansasa close, off Bwinjimfumu road, Rhodespark, Lusaka, Zambia <br />P.O BOX 32615</span>
              </li>
              <li className="flex gap-3 text-sm text-dark">
                <Mail size={20} className="shrink-0 text-primary" />
                <a href="mailto:info@zgf.org.zm" className="hover:text-primary transition-colors">info@zgf.org.zm</a>
              </li>
              <li className="flex gap-3 text-sm text-dark">
                <Phone size={20} className="shrink-0 text-primary" />
                <a href="tel:+260211259784" className="hover:text-primary transition-colors">+260 211 259784</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h6 className="font-bold text-dark">Subscribe to our newsletter</h6>
              <p className="text-sm text-gray-600">Stay updated with our latest news and updates</p>
            </div>
            <form className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64"
                required
              />
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-dark transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-gray-300">
          <p className="text-sm text-dark">
            &copy; {currentYear} Zambian Governance Foundation. All rights reserved.
            <span className="block md:inline mt-2 md:mt-0 md:ml-2">
              Web design by <a href="https://spaceminds.agency/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Spaceminds</a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

export default function TopBar() {
  return (
    <div className="bg-dark text-white py-2">
      <div className="container mx-auto px-4 flex flex-wrap md:flex-nowrap justify-between align-items-center">
        <div className="flex flex-wrap md:flex-nowrap gap-6 items-center">
          <Link href="/impact" className="text-white no-underline text-sm hover:text-secondary transition-colors">
            Our impact
          </Link>
          <Link href="/careers" className="text-white no-underline font-semibold text-sm hover:text-secondary transition-colors">
            Careers
          </Link>
        </div>

        <div className="flex items-center gap-6 text-right mt-2 md:mt-0 ml-auto">
          <a href="mailto:info@zgf.org.zm" className="text-white no-underline text-sm hover:text-secondary transition-colors">
            info@zgf.org.zm
          </a>
        </div>
      </div>
    </div>
  );
}

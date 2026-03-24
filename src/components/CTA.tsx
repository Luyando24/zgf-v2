import Link from "next/link";

interface CTAProps {
  title?: string;
  description?: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  bgColor?: string;
}

export default function CTA({
  title = "Ready to Make a Difference?",
  description = "Join us in our mission to strengthen civil society and promote good governance across Zambia.",
  primaryBtnText = "Partner With Us",
  primaryBtnLink = "/partnership-request",
  secondaryBtnText = "Volunteer",
  secondaryBtnLink = "/volunteer",
  bgColor = "bg-primary"
}: CTAProps) {
  return (
    <section className={`py-20 ${bgColor} text-white`}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
        <p className="text-lg mb-10 max-w-2xl mx-auto opacity-90">
          {description}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={primaryBtnLink}
            className="bg-white text-primary px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
          >
            {primaryBtnText}
          </Link>
          <Link
            href={secondaryBtnLink}
            className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-primary transition-all"
          >
            {secondaryBtnText}
          </Link>
          <Link
            href="/contact-us"
            className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-primary transition-all"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}

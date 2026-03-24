import Image from "next/image";
import CTA from "@/components/CTA";
import { CheckCircle2, Users, MapPin, Building2, UserCircle2 } from "lucide-react";

const mockCommunities = [
  {
    name: "Urban Communities",
    description: "Working with residents in Lusaka's townships to improve local governance and service delivery.",
    color: "#61A534",
    icon: <Building2 size={32} />,
    features: [
      { feature: "Township governance support" },
      { feature: "Civic education programs" },
      { feature: "Service delivery monitoring" }
    ]
  },
  {
    name: "Rural Villages",
    description: "Supporting traditional communities in Northern Province with agricultural training and projects.",
    color: "#303030",
    icon: <MapPin size={32} />,
    features: [
      { feature: "Agricultural skills training" },
      { feature: "Water & sanitation projects" },
      { feature: "Traditional governance support" }
    ]
  },
  {
    name: "Women's Groups",
    description: "Empowering women's cooperatives across Zambia through business and leadership training.",
    color: "#FFDD02",
    icon: <Users size={32} />,
    features: [
      { feature: "Business management skills" },
      { feature: "Microfinance mentorship" },
      { feature: "Leadership development" }
    ]
  },
  {
    name: "Youth Networks",
    description: "Building capacity among young leaders through skills training and civic participation.",
    color: "#4A90E2",
    icon: <UserCircle2 size={32} />,
    features: [
      { feature: "Vocational skills training" },
      { feature: "Youth governance platforms" },
      { feature: "Digital literacy programs" }
    ]
  }
];

const featuredPartnerships = [
  {
    title: "Lusaka Urban Communities",
    description: "Working with residents in Lusaka's townships to improve local governance, enhance service delivery, and strengthen community participation.",
    image: "/images/communities/lusaka.jpg",
    tags: ["Urban", "Governance", "Civic Education"],
    color: "bg-primary"
  },
  {
    title: "Northern Province Villages",
    description: "Supporting traditional communities in Northern Province with agricultural training, water projects, and strengthening traditional structures.",
    image: "/images/communities/rural.jpg",
    tags: ["Rural", "Agriculture", "Traditional"],
    color: "bg-green-600"
  },
  {
    title: "Women's Cooperatives",
    description: "Empowering women's groups across multiple provinces through business training, microfinance support, and leadership development.",
    image: "/images/communities/women.jpg",
    tags: ["Women", "Business", "Leadership"],
    color: "bg-secondary"
  },
  {
    title: "Youth Networks",
    description: "Building capacity among young leaders through skills training, civic education, and platforms for youth participation.",
    image: "/images/communities/youth.jpg",
    tags: ["Youth", "Skills", "Leadership"],
    color: "bg-blue-500"
  }
];

const impactStats = [
  { value: "250+", label: "Communities Reached", sub: "Across all 10 provinces", color: "text-primary" },
  { value: "75,000+", label: "People Impacted", sub: "Direct and indirect", color: "text-green-600" },
  { value: "500+", label: "Local Leaders Trained", sub: "Community & Traditional", color: "text-secondary" },
  { value: "150+", label: "Projects Completed", sub: "Community-driven", color: "text-blue-500" }
];

export default function CommunitiesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Communities We Work With</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Empowering communities across Zambia through collaborative partnerships and sustainable development initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Main Communities Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-16">Empowering Local Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mockCommunities.map((community, index) => (
              <div key={index} className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-300">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white mb-6 shadow-lg"
                  style={{ backgroundColor: community.color }}
                >
                  {community.icon}
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: community.color }}>{community.name}</h3>
                <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                  {community.description}
                </p>
                <ul className="space-y-3 text-left w-full mt-auto">
                  {community.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2 text-gray-700 text-xs font-medium">
                      <CheckCircle2 size={16} className="text-primary shrink-0" />
                      {feature.feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Partnerships */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-16">Featured Partnerships</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPartnerships.map((partnership, index) => (
              <div key={index} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row border border-gray-100">
                <div className="relative w-full sm:w-2/5 min-h-[250px]">
                  <Image
                    src={partnership.image}
                    alt={partnership.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 w-full sm:w-3/5 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-dark mb-4">{partnership.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {partnership.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {partnership.tags.map((tag) => (
                      <span key={tag} className={`px-3 py-1 rounded-full text-[10px] font-bold text-white ${partnership.color}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-16">Our Community Impact</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100">
                <h3 className={`text-4xl md:text-5xl font-bold mb-3 ${stat.color}`}>
                  {stat.value}
                </h3>
                <p className="text-dark font-bold text-sm mb-1">{stat.label}</p>
                <p className="text-gray-500 text-xs">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA 
        title="Want to Partner With Us?"
        description="We are committed to working with communities across Zambia. Get in touch to explore how we can collaborate."
        primaryBtnText="Get in Touch"
        primaryBtnLink="/contact-us"
      />
    </div>
  );
}

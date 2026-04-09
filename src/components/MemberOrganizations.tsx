import Image from "next/image";

const memberOrgs = [
  { name: "ALLIANCE FOR FOOD SOVEREIGNTY IN AFRICA", logo: "/images/AFSA.jpg" },
  { name: "COMIC RELIEF", logo: "/images/Comic Relief_Logo_Red_CMYK.png" },
  { name: "MOTT FOUNDATION", logo: "/images/Mott Foundation.png" },
  { name: "HIVOS", logo: "/images/hivos-logo.png" },
  { name: "UK INTERNATIONAL", logo: "/images/uki.jpg" },
];

export default function MemberOrganizations() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Member Organizations</h2>
          <p className="text-gray-600">ZGF is proud to be a member of these esteemed organizations</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
          {memberOrgs.map((org) => (
            <div key={org.name} className="group transition-all duration-300">
              <div className="relative h-24 w-32 md:h-32 md:w-40">
                <Image
                  src={org.logo}
                  alt={org.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

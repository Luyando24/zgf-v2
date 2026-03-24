export default function Stats({ statsArray }: { statsArray: { value: string, description: string }[] }) {
  if (!statsArray || statsArray.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="bg-[#f8f9fa] px-8 py-12 rounded-3xl shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center">
            {statsArray.map((stat, index) => (
              <div key={index} className="flex flex-col gap-2">
                <h2 className="text-4xl md:text-5xl font-bold text-primary">{stat.value}</h2>
                <p className="text-gray-600 font-medium uppercase text-xs tracking-wider">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ValueProps() {
  const values = [
    {
      icon: "eco",
      title: "Sustainable",
      description: "Eco-friendly fabrics. Better for the planet."
    },
    {
      icon: "all_inclusive",
      title: "Timeless Design",
      description: "Minimal. Elegant. Made to last."
    },
    {
      icon: "handyman",
      title: "Crafted With Care",
      description: "Thoughtful details in every piece."
    },
    {
      icon: "local_shipping",
      title: "Worldwide Shipping",
      description: "Delivering elegance to your door."
    }
  ];

  return (
    <section className="py-24 bg-yugen-background border-b border-black/5">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 divide-y md:divide-y-0 md:divide-x divide-black/10">
          {values.map((value, idx) => (
            <div key={idx} className="flex flex-col items-center text-center pt-8 md:pt-0 md:px-8 first:pt-0">
              <span className="material-symbols-outlined text-3xl mb-6 opacity-80">
                {value.icon}
              </span>
              <h3 className="text-[10px] md:text-[12px] uppercase tracking-[0.15em] font-medium mb-3 text-[#2d2a26]">
                {value.title}
              </h3>
              <p className="text-[13px] md:text-[14px] leading-[1.6] text-[#6b6762] max-w-[200px]">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

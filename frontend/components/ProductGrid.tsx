import Image from "next/image";
import Link from "next/link";

export default function ProductGrid() {
  const products = [
    {
      id: 1,
      name: "Relaxed Linen Shirt",
      price: "$120.00",
      image: "/images/product_linen_shirt.jpg",
      colors: ["#7D8469", "#1c1c1a"],
    },
    {
      id: 2,
      name: "Light Cotton Jacket",
      price: "$180.00",
      image: "/images/product_cotton_jacket.jpg",
      colors: ["#1c1c1a", "#D1C9B9"],
    },
    {
      id: 3,
      name: "Soft Tailored Blazer",
      price: "$220.00",
      image: "/images/product_tailored_blazer.jpg",
      colors: ["#D1C9B9", "#7D8469", "#f0edea"],
    },
    {
      id: 4,
      name: "Premium Cotton Tee",
      price: "$70.00",
      image: "/images/product_cotton_tee.jpg",
      colors: ["#7D8469", "#D1C9B9"],
    }
  ];

  return (
    <section className="py-24 bg-yugen-background">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div className="flex items-center space-x-4">
            <h2 className="text-[10px] md:text-[12px] uppercase tracking-[0.15em] font-medium">New In</h2>
            <div className="w-12 h-[1px] bg-yugen-text opacity-30"></div>
          </div>
          <Link href="#" className="text-[10px] md:text-[12px] uppercase tracking-[0.14em] font-medium flex items-center space-x-2 hover:opacity-60 transition-opacity">
            <span>View All</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative aspect-[3/4] mb-4 bg-yugen-surface overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-yugen-background text-yugen-text px-6 py-3 text-[10px] md:text-[12px] uppercase tracking-[0.14em] font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Quick View
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-[20px] lg:text-[24px] font-normal leading-tight text-[#2d2a26]">{product.name}</h3>
                <p className="text-[12px] md:text-[14px] font-medium opacity-80 text-[#6b6762]">{product.price}</p>
                <div className="flex space-x-2 pt-2">
                  {product.colors.map((color, idx) => (
                    <div 
                      key={idx} 
                      className="w-3 h-3 rounded-full border border-black/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

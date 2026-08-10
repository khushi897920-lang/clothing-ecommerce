import Image from "next/image";
import Link from "next/link";

export default function SplitBanner() {
  return (
    <section className="w-full bg-[#fcf9f6]">
      {/* Row 1: Women */}
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_2fr] lg:h-[450px]">
        {/* Image - First on mobile, second on desktop */}
        <div className="relative h-[60vh] lg:h-full w-full lg:order-2 overflow-hidden group">
          <Image
            src="/images/grace in every thread.png"
            alt="Women Collection"
            fill
            className="object-cover object-[center_25%] transition-transform duration-700 ease-in-out group-hover:scale-[1.03]"
          />
        </div>
        
        {/* Text Panel */}
        <div className="flex flex-col justify-center p-10 md:p-14 lg:p-16 lg:order-1 bg-[#fcf9f6]">
          <p className="text-[10px] lg:text-[11px] uppercase tracking-[0.15em] font-medium text-[#6b6762] mb-5">
            Women Collection
          </p>
          <h2 className="text-[40px] lg:text-[48px] font-serif mb-10 leading-[1.05] font-normal tracking-[-0.02em] text-[#2d2a26]">
            Grace in<br />Every Thread
          </h2>
          <Link href="#" className="group/btn inline-flex items-center text-[10px] lg:text-[11px] uppercase tracking-[0.14em] font-medium self-start relative text-[#2d2a26]">
            <span className="mr-3">Explore Women</span>
            <span className="material-symbols-outlined text-[16px] transition-transform duration-500 ease-in-out group-hover/btn:translate-x-1">arrow_forward</span>
            <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-black/20 transition-all duration-500 group-hover/btn:bg-black"></span>
          </Link>
        </div>
      </div>

      {/* Row 2: Men */}
      <div className="flex flex-col lg:grid lg:grid-cols-[2fr_1fr] lg:h-[450px]">
        {/* Image - First on mobile, first on desktop */}
        <div className="relative h-[60vh] lg:h-full w-full overflow-hidden group">
          <Image
            src="/images/explore men collection.png"
            alt="Men Collection"
            fill
            className="object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-[1.03]"
          />
        </div>

        {/* Text Panel */}
        <div className="flex flex-col justify-center p-10 md:p-14 lg:p-16 bg-[#fcf9f6]">
          <p className="text-[10px] lg:text-[11px] uppercase tracking-[0.15em] font-medium text-[#6b6762] mb-5">
            Men Collection
          </p>
          <h2 className="text-[40px] lg:text-[48px] font-serif mb-10 leading-[1.05] font-normal tracking-[-0.02em] text-[#2d2a26]">
            Effortless Style,<br />Every Day
          </h2>
          <Link href="#" className="group/btn inline-flex items-center text-[10px] lg:text-[11px] uppercase tracking-[0.14em] font-medium self-start relative text-[#2d2a26]">
            <span className="mr-3">Explore Men</span>
            <span className="material-symbols-outlined text-[16px] transition-transform duration-500 ease-in-out group-hover/btn:translate-x-1">arrow_forward</span>
            <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-black/20 transition-all duration-500 group-hover/btn:bg-black"></span>
          </Link>
        </div>
      </div>
    </section>
  );
}

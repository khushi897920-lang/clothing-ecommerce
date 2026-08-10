import Image from "next/image";
import Link from "next/link";

export default function Lookbook() {
  return (
    <section className="py-24 bg-yugen-surface">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 flex flex-col justify-center max-w-lg lg:ml-auto lg:pr-24">
            <p className="text-[10px] md:text-[12px] uppercase tracking-[0.15em] font-medium mb-6 opacity-70">
              Lookbook
            </p>
            <h2 className="text-[40px] md:text-[52px] font-serif font-normal leading-[1.05] tracking-[-0.02em] mb-6">
              Quiet Moments,<br />Timeless Style
            </h2>
            <p className="text-[14px] md:text-[16px] leading-[1.6] opacity-80 mb-10">
              Discover pieces that move with you, through every season of life. Crafted with intention, designed for the mindful everyday.
            </p>
            <Link href="#" className="inline-flex items-center space-x-2 text-[10px] md:text-[12px] uppercase tracking-[0.14em] font-medium border-b border-yugen-text pb-1 hover:opacity-60 transition-opacity self-start">
              <span>Explore Lookbook</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <div className="order-1 lg:order-2 relative aspect-square w-full">
            <Image
              src="/images/explore lookbook.png"
              alt="Quiet Moments, Timeless Style"
              fill
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

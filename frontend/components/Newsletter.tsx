import Image from "next/image";

export default function Newsletter() {
  return (
    <section className="relative w-full py-20 md:py-24 bg-[#fcf9f6] overflow-hidden">
      
      {/* Subtle Botanical Shadow Background */}
      <div className="absolute top-0 right-0 w-[120%] md:w-[60%] h-full opacity-[0.04] pointer-events-none z-0">
        <Image 
          src="/images/botanical_illustration.jpg" 
          alt="" 
          fill 
          className="object-cover object-left-top mix-blend-multiply scale-[1.2] md:scale-[1.8] translate-x-[10%] md:translate-x-[20%] -translate-y-[10%] blur-[3px]"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        
        {/* Botanical Emblem */}
        <div 
          className="relative w-14 h-20 md:w-16 md:h-24 mb-6 flex items-center justify-center border border-[#b09b85]/40"
          style={{ borderRadius: "50%" }}
        >
          <div className="relative w-8 h-12 md:w-10 md:h-14">
            <Image
              src="/images/botanical_illustration.jpg"
              alt="Botanical emblem"
              fill
              className="object-contain mix-blend-multiply opacity-70"
            />
          </div>
        </div>
        
        {/* Eyebrow */}
        <p className="text-[10px] md:text-[11px] uppercase tracking-[0.18em] font-medium text-[#6b6762] mb-5">
          Stay Inspired
        </p>

        {/* Heading */}
        <h2 className="text-4xl md:text-[52px] lg:text-[58px] font-serif font-normal text-[#2d2a26] leading-tight mb-4 md:mb-5">
          Join the YUGEN Circle
        </h2>

        {/* Description */}
        <p className="text-[14px] md:text-[15px] text-[#6b6762] mb-10 md:mb-12 max-w-md mx-auto">
          Receive early access to new collections, exclusive offers, and more.
        </p>
        
        {/* Email Form */}
        <form className="w-full max-w-[720px] mx-auto flex flex-col md:flex-row gap-4 md:gap-3">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="w-full md:flex-[3] h-14 md:h-16 px-6 bg-white/70 border border-[#d6cfc5] rounded-md outline-none focus:border-[#b09b85] focus:bg-white transition-colors text-[14px] placeholder:text-[#a39e99] text-[#2d2a26]"
            required
          />
          <button 
            type="submit" 
            className="w-full md:flex-[1] h-14 md:h-16 bg-[#b09b85] hover:bg-[#a08a73] text-[#fcf9f6] rounded-md uppercase tracking-[0.1em] text-[11px] md:text-[12px] font-medium transition-colors flex items-center justify-center space-x-2 group"
          >
            <span>Subscribe</span>
            <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
          </button>
        </form>

        {/* Privacy Policy text */}
        <p className="text-[10px] md:text-[11px] text-[#6b6762] mt-5 md:mt-6">
          By subscribing, you agree to our <a href="#" className="underline underline-offset-2 hover:text-[#2d2a26] transition-colors">Privacy Policy</a>.
        </p>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";

export default function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="relative w-full h-screen overflow-hidden flex flex-col justify-center animate-fade-in">
      {/* Background image layer */}
      <div 
        className="absolute inset-0 w-full h-full -z-20 bg-cover bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/images/home background.png")',
          backgroundPosition: 'center 20%'
        }}
      ></div>

      
      {/* Content layer */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 w-full mt-20 pointer-events-none">
        <p className="text-[10px] md:text-[11px] lg:text-[12px] uppercase tracking-[0.15em] font-medium mb-6 opacity-70 animate-fade-in-up pointer-events-auto" style={{ animationDelay: '0.2s' }}>
          New Collection
        </p>
        <h1 className="text-[34px] md:text-[44px] lg:text-[64px] font-serif font-normal leading-[1.0] tracking-[-0.02em] mb-8 animate-fade-in-up pointer-events-auto" style={{ animationDelay: '0.4s' }}>
          ESSENCE OF<br />SIMPLICITY
        </h1>
        <p className="max-w-md text-[14px] md:text-[16px] font-normal leading-[1.6] opacity-80 mb-10 animate-fade-in-up pointer-events-auto" style={{ animationDelay: '0.6s' }}>
          Timeless pieces crafted for everyday elegance. Natural fabrics. Minimal designs. Maximum comfort.
        </p>
        <button className="border border-yugen-text px-8 py-4 uppercase tracking-[0.14em] text-[10px] md:text-[12px] font-medium hover:bg-yugen-text hover:text-yugen-background transition-colors flex items-center space-x-4 animate-fade-in-up pointer-events-auto" style={{ animationDelay: '0.8s' }}>
          <span>Explore Collection</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-10 left-0 w-full px-6 z-10 animate-fade-in-up pointer-events-none" style={{ animationDelay: '1s' }}>
        <div className="max-w-[1600px] mx-auto flex justify-between items-end pointer-events-auto">
          <div className="flex items-center space-x-4 text-[10px] md:text-[12px] tracking-[0.14em]">
            <span className="font-medium">01</span>
            <div className="w-12 h-[1px] bg-yugen-text opacity-30"></div>
            <span className="opacity-50">02</span>
          </div>
          
          <button 
            onClick={() => setIsVideoOpen(true)}
            className="flex items-center space-x-4 uppercase tracking-[0.14em] text-[10px] md:text-[12px] font-medium group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full border border-yugen-text flex items-center justify-center group-hover:bg-yugen-text group-hover:text-yugen-background transition-colors">
              <span className="material-symbols-outlined text-[16px] ml-1">play_arrow</span>
            </div>
            <span className="hidden sm:inline">Play Campaign Film</span>
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <button 
            onClick={() => setIsVideoOpen(false)}
            className="absolute top-8 right-8 text-white hover:opacity-60 transition-opacity"
          >
            <span className="material-symbols-outlined text-4xl">close</span>
          </button>
          <div className="w-full max-w-5xl aspect-video bg-black relative">
            <iframe 
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
              title="Campaign Film"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
}

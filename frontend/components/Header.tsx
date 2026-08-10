"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${isScrolled ? "bg-[#fcf9f6] text-yugen-text border-b border-black/[0.05]" : "bg-gradient-to-b from-black/20 to-transparent text-white"}`}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 h-[72px] flex items-center justify-between">
        
        {/* Left Side: Logo + Nav */}
        <div className="flex items-center space-x-12">
          <Link href="#" className="text-2xl lg:text-3xl font-serif tracking-widest font-normal">
            YUGEN
          </Link>
          
          <div className="hidden lg:flex space-x-8 text-[11px] lg:text-[13px] uppercase tracking-[0.10em] font-medium">
            <Link href="#" className="group relative py-2">
              <span className="hover:opacity-70 transition-opacity duration-300">New In</span>
              <span className={`absolute bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full ${isScrolled ? "bg-yugen-text" : "bg-white"}`}></span>
            </Link>
            <Link href="#" className="group relative py-2">
              <span className="hover:opacity-70 transition-opacity duration-300">Women</span>
              <span className={`absolute bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full ${isScrolled ? "bg-yugen-text" : "bg-white"}`}></span>
            </Link>
            <Link href="#" className="group relative py-2">
              <span className="hover:opacity-70 transition-opacity duration-300">Men</span>
              <span className={`absolute bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full ${isScrolled ? "bg-yugen-text" : "bg-white"}`}></span>
            </Link>
            <Link href="#" className="group relative py-2">
              <span className="hover:opacity-70 transition-opacity duration-300">Collections</span>
              <span className={`absolute bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full ${isScrolled ? "bg-yugen-text" : "bg-white"}`}></span>
            </Link>
            <Link href="#" className="group relative py-2">
              <span className="hover:opacity-70 transition-opacity duration-300">Lookbook</span>
              <span className={`absolute bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full ${isScrolled ? "bg-yugen-text" : "bg-white"}`}></span>
            </Link>
            <Link href="#" className="group relative py-2">
              <span className="hover:opacity-70 transition-opacity duration-300">About</span>
              <span className={`absolute bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full ${isScrolled ? "bg-yugen-text" : "bg-white"}`}></span>
            </Link>
          </div>
        </div>

        {/* Right Side: Utilities */}
        <div className="flex items-center space-x-6 text-[11px] lg:text-[13px] uppercase tracking-[0.10em] font-medium">
          <button className="hidden lg:flex items-center space-x-2 group relative py-2">
            <span className="material-symbols-outlined text-[18px] font-light group-hover:opacity-70 transition-opacity duration-300">search</span>
            <span className="hidden sm:inline group-hover:opacity-70 transition-opacity duration-300">Search</span>
            <span className={`absolute bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full ${isScrolled ? "bg-yugen-text" : "bg-white"}`}></span>
          </button>
          <Link href="#" className="hidden lg:flex items-center space-x-2 group relative py-2">
            <span className="material-symbols-outlined text-[18px] font-light group-hover:opacity-70 transition-opacity duration-300">person</span>
            <span className="hidden sm:inline group-hover:opacity-70 transition-opacity duration-300">Account</span>
            <span className={`absolute bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full ${isScrolled ? "bg-yugen-text" : "bg-white"}`}></span>
          </Link>
          <Link href="#" className="flex items-center space-x-2 group relative py-2">
            <span className="material-symbols-outlined text-[18px] font-light group-hover:opacity-70 transition-opacity duration-300">shopping_bag</span>
            <span className="group-hover:opacity-70 transition-opacity duration-300">Cart (0)</span>
            <span className={`absolute bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full ${isScrolled ? "bg-yugen-text" : "bg-white"}`}></span>
          </Link>
          
          {/* Mobile Menu Icon */}
          <button className="lg:hidden flex items-center group relative py-2">
            <span className="material-symbols-outlined text-[24px] font-light group-hover:opacity-70 transition-opacity duration-300">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}

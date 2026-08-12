"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/yugen/Header";
import { Footer } from "@/components/yugen/Footer";

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F3EE] text-[#111111] font-sans antialiased flex flex-col selection:bg-[#111111] selection:text-white">
      {/* 00. REUSED HEADER */}
      <Header />

      <main className="flex-1 w-full">
        {/* =========================================================
            SECTION 01 — HERO SECTION
           ========================================================= */}
        <section className="relative w-full bg-[#F6F3EE] border-b border-[#D9D5CE]/60 pt-12 pb-16 md:pt-16 md:pb-20 overflow-hidden group">
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/about-hero.png"
              alt="YUGEN About Hero Background"
              fill
              priority
              sizes="100vw"
              className="object-cover object-right md:object-center opacity-90 transition-opacity duration-700"
            />
            {/* Soft Warm Gradient Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F6F3EE]/95 via-[#F6F3EE]/80 to-[#F6F3EE]/40 pointer-events-none" />
          </div>

          <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10 flex items-center justify-between min-h-[340px] md:min-h-[400px]">
            {/* Left Content Column */}
            <div
              className={`max-w-2xl transition-all duration-700 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <p className="text-[11px] font-bold tracking-[0.25em] text-[#8A867F] uppercase mb-4">
                ABOUT YUGEN
              </p>
              <h1
                className="text-4xl sm:text-5xl lg:text-[64px] font-light text-[#111111] leading-[1.08] tracking-tight mb-6"
                style={{ fontFamily: '"Poiret One", "Playfair Display", serif' }}
              >
                Clothing that speaks
                <br />
                without saying too much.
              </h1>
              <p className="text-sm sm:text-base text-[#555555] leading-relaxed max-w-lg mb-8 font-normal">
                YUGEN is a contemporary clothing label built around quiet confidence,
                effortless silhouettes and the beauty of everyday expression.
              </p>
              <div>
                <Link
                  href="/products"
                  className="group/btn inline-flex items-center gap-3 bg-[#111111] text-white text-xs font-semibold tracking-[0.15em] uppercase px-7 py-4 rounded-none transition-all duration-300 hover:bg-[#333333] shadow-sm"
                >
                  <span>EXPLORE THE COLLECTION</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover/btn:translate-x-1"
                  />
                </Link>
              </div>
            </div>

            {/* Right Vertical Branding Line (Exact reference design) */}
            <div className="hidden lg:flex items-center space-x-6 pr-4">
              <div className="h-44 w-[1px] bg-[#111111]" />
              <div className="writing-mode-vertical text-[11px] tracking-[0.4em] uppercase text-[#111111] font-bold rotate-180 select-none">
                Y U G E N
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 02 — OUR STORY (50/50 Split)
           ========================================================= */}
        <section className="w-full bg-[#FFFFFF] py-16 md:py-24 lg:py-32 border-b border-[#D9D5CE]/60">
          <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column (50% Image Container) */}
              <div className="lg:col-span-6 relative aspect-[4/3] sm:aspect-[16/11] rounded-none overflow-hidden group bg-[#F6F3EE]">
                <Image
                  src="/assets/about-story.png"
                  alt="YUGEN clothing rack hanging neutral garments in minimalist room"
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-[#F6F3EE]/0 group-hover:bg-[#F6F3EE]/10 transition-colors duration-500 pointer-events-none" />
              </div>

              {/* Right Column (50% Editorial Copy) */}
              <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
                <p className="text-[11px] font-bold tracking-[0.25em] text-[#8A867F] uppercase">
                  01 — OUR STORY
                </p>
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#111111] tracking-tight leading-tight"
                  style={{ fontFamily: '"Poiret One", "Playfair Display", serif' }}
                >
                  The idea behind YUGEN
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-[#555555] leading-relaxed font-normal pt-2">
                  <p>
                    YUGEN was created for those who believe style doesn&apos;t need to
                    shout.
                  </p>
                  <p>
                    Inspired by the beauty of simplicity, we create clothing that feels
                    considered, versatile and deeply personal. Every silhouette, fabric
                    and detail is chosen to make everyday dressing feel effortless.
                  </p>
                  <p className="text-[#111111] font-medium pt-2">
                    We believe fashion should become a part of you — not define you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 03 — PHILOSOPHY (3-Column Layout)
           ========================================================= */}
        <section className="w-full bg-[#F6F3EE] py-20 md:py-28 lg:py-32 border-b border-[#D9D5CE]/60">
          <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-16 text-center">
            {/* Header */}
            <div className="max-w-2xl mx-auto mb-16 md:mb-24 space-y-4">
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#111111] tracking-tight"
                style={{ fontFamily: '"Poiret One", "Playfair Display", serif' }}
              >
                Less noise. More meaning.
              </h2>
              <p className="text-sm sm:text-base text-[#555555] leading-relaxed font-normal pt-2">
                Our philosophy is simple — create pieces that stay relevant beyond a season.
                Thoughtful design, refined silhouettes and quality materials come together to create clothing made for real life.
              </p>
            </div>

            {/* 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#D9D5CE]">
              {/* Item 01 */}
              <div className="group px-6 py-6 md:py-4 transition-all duration-300 hover:-translate-y-1">
                <div className="w-9 h-9 rounded-full border border-transparent group-hover:border-[#111111]/30 flex items-center justify-center mx-auto mb-5 transition-all duration-300">
                  <span className="text-[11px] font-bold text-[#8A867F] group-hover:text-[#111111] transition-colors">
                    (01)
                  </span>
                </div>
                <h3 className="text-xs font-bold tracking-[0.2em] text-[#111111] uppercase mb-3">
                  INTENTION
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed max-w-xs mx-auto font-normal">
                  Every detail has a reason.
                </p>
              </div>

              {/* Item 02 */}
              <div className="group px-6 py-6 md:py-4 transition-all duration-300 hover:-translate-y-1">
                <div className="w-9 h-9 rounded-full border border-transparent group-hover:border-[#111111]/30 flex items-center justify-center mx-auto mb-5 transition-all duration-300">
                  <span className="text-[11px] font-bold text-[#8A867F] group-hover:text-[#111111] transition-colors">
                    (02)
                  </span>
                </div>
                <h3 className="text-xs font-bold tracking-[0.2em] text-[#111111] uppercase mb-3">
                  SIMPLICITY
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed max-w-xs mx-auto font-normal">
                  We believe less can say more.
                </p>
              </div>

              {/* Item 03 */}
              <div className="group px-6 py-6 md:py-4 transition-all duration-300 hover:-translate-y-1">
                <div className="w-9 h-9 rounded-full border border-transparent group-hover:border-[#111111]/30 flex items-center justify-center mx-auto mb-5 transition-all duration-300">
                  <span className="text-[11px] font-bold text-[#8A867F] group-hover:text-[#111111] transition-colors">
                    (03)
                  </span>
                </div>
                <h3 className="text-xs font-bold tracking-[0.2em] text-[#111111] uppercase mb-3">
                  TIMELESSNESS
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed max-w-xs mx-auto font-normal">
                  Designed beyond fleeting trends.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 04 — WHAT MATTERS TO US (Editorial Rows)
           ========================================================= */}
        <section className="w-full bg-[#FFFFFF] py-20 md:py-28 lg:py-32 border-b border-[#D9D5CE]/60">
          <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-16">
            <p className="text-[11px] font-bold tracking-[0.25em] text-[#8A867F] uppercase mb-12">
              03 — WHAT MATTERS TO US
            </p>

            <div className="border-t border-[#D9D5CE] divide-y divide-[#D9D5CE]">
              {/* Row 01 */}
              <div className="group py-8 md:py-10 px-4 md:px-8 transition-all duration-300 hover:bg-[#F6F3EE] flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer">
                <div className="flex items-start md:items-center space-x-6 md:space-x-12">
                  <span className="text-2xl sm:text-3xl font-light text-[#111111] tracking-tight group-hover:opacity-70 transition-opacity">
                    01
                  </span>
                  <div className="space-y-1 transform group-hover:translate-x-1 transition-transform duration-300">
                    <h3 className="text-xs font-bold tracking-[0.18em] text-[#111111] uppercase">
                      CRAFTED WITH INTENTION
                    </h3>
                    <p className="text-xs sm:text-sm text-[#555555] leading-relaxed font-normal max-w-xl">
                      We focus on thoughtful silhouettes, balanced proportions and details that make a difference.
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={20}
                  className="text-[#111111] transition-transform duration-300 group-hover:translate-x-2 self-end md:self-auto"
                />
              </div>

              {/* Row 02 */}
              <div className="group py-8 md:py-10 px-4 md:px-8 transition-all duration-300 hover:bg-[#F6F3EE] flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer">
                <div className="flex items-start md:items-center space-x-6 md:space-x-12">
                  <span className="text-2xl sm:text-3xl font-light text-[#111111] tracking-tight group-hover:opacity-70 transition-opacity">
                    02
                  </span>
                  <div className="space-y-1 transform group-hover:translate-x-1 transition-transform duration-300">
                    <h3 className="text-xs font-bold tracking-[0.18em] text-[#111111] uppercase">
                      MADE FOR EVERYDAY EXPRESSION
                    </h3>
                    <p className="text-xs sm:text-sm text-[#555555] leading-relaxed font-normal max-w-xl">
                      YUGEN isn&apos;t about dressing for a moment. It&apos;s about creating a wardrobe that moves with you.
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={20}
                  className="text-[#111111] transition-transform duration-300 group-hover:translate-x-2 self-end md:self-auto"
                />
              </div>

              {/* Row 03 */}
              <div className="group py-8 md:py-10 px-4 md:px-8 transition-all duration-300 hover:bg-[#F6F3EE] flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer">
                <div className="flex items-start md:items-center space-x-6 md:space-x-12">
                  <span className="text-2xl sm:text-3xl font-light text-[#111111] tracking-tight group-hover:opacity-70 transition-opacity">
                    03
                  </span>
                  <div className="space-y-1 transform group-hover:translate-x-1 transition-transform duration-300">
                    <h3 className="text-xs font-bold tracking-[0.18em] text-[#111111] uppercase">
                      BEYOND THE TREND
                    </h3>
                    <p className="text-xs sm:text-sm text-[#555555] leading-relaxed font-normal max-w-xl">
                      We design with longevity in mind — pieces you can return to season after season.
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={20}
                  className="text-[#111111] transition-transform duration-300 group-hover:translate-x-2 self-end md:self-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 05 — FABRIC / BRAND STATEMENT BANNER
           ========================================================= */}
        <section className="relative w-full h-[300px] sm:h-[340px] md:h-[380px] overflow-hidden group">
          {/* Background Fabric Texture Image */}
          <Image
            src="/assets/about-fabric.png"
            alt="YUGEN beige fabric texture"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
          />
          {/* Subtle Overlay for Readability */}
          <div className="absolute inset-0 bg-black/40 backdrop-brightness-95" />

          {/* Banner Content */}
          <div className="relative z-10 h-full max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col items-center justify-center text-center text-white space-y-4">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-white"
              style={{ fontFamily: '"Poiret One", "Playfair Display", serif' }}
            >
              Wear your perspective.
            </h2>
            <div className="w-12 h-[1px] bg-white/40 my-2" />
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-light max-w-md">
              Clothing is more than what you wear.
              <br />
              It&apos;s how you move, how you feel,
              <br />
              and how you choose to be seen.
            </p>
            <div className="pt-3">
              <Link
                href="/products"
                className="group inline-flex items-center gap-3 bg-white text-[#111111] text-xs font-bold tracking-[0.18em] uppercase px-7 py-3.5 rounded-none transition-all duration-300 hover:bg-[#F6F3EE] shadow-md"
              >
                <span>DISCOVER YUGEN</span>
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 06 — FINAL BRAND STATEMENT & CTAs
           ========================================================= */}
        <section className="w-full bg-[#F6F3EE] py-20 md:py-28 text-center">
          <div className="max-w-2xl mx-auto px-6 space-y-6">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#111111] tracking-tight"
              style={{ fontFamily: '"Poiret One", "Playfair Display", serif' }}
            >
              This is YUGEN.
            </h2>
            <p className="text-sm sm:text-base text-[#555555] font-normal leading-relaxed">
              Quietly expressive.
              <br />
              Thoughtfully designed.
              <br />
              Made for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/women"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#111111] text-white text-xs font-semibold tracking-[0.15em] uppercase px-8 py-4 transition-all duration-300 hover:bg-[#333333]"
              >
                <span>EXPLORE WOMEN</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/men"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-transparent text-[#111111] border border-[#111111] text-xs font-semibold tracking-[0.15em] uppercase px-8 py-4 transition-all duration-300 hover:bg-[#111111] hover:text-white"
              >
                <span>EXPLORE MEN</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 00. REUSED FOOTER */}
      <Footer />
    </div>
  );
}

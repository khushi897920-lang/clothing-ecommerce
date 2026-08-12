"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Heart,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Banknote,
} from "lucide-react";
import { catalogProducts, CatalogProduct } from "@/data/catalogProducts";
import { Header } from "@/components/yugen/Header";
import { Footer } from "@/components/yugen/Footer";

const SIZES = ["All Sizes", "XS", "S", "M", "L", "XL", "XXL"];
const COLORS = [
  "All Colors",
  "Black",
  "White",
  "Beige",
  "Brown",
  "Green",
  "Blue",
  "Pink",
];

export default function NewArrivalsPage() {
  // Filter & Sort States
  const [selectedSize, setSelectedSize] = useState<string>("All Sizes");
  const [selectedColor, setSelectedColor] = useState<string>("All Colors");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [bestSellersOnly, setBestSellersOnly] = useState<boolean>(false);

  // Pagination / Load More state (Initial 12, adds 6 on click)
  const [displayCount, setDisplayCount] = useState<number>(12);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Load wishlist from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("yugen_wishlist");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setWishlist(parsed);
        } catch (e) {}
      }
    }
  }, []);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      if (typeof window !== "undefined") {
        localStorage.setItem("yugen_wishlist", JSON.stringify(next));
        window.dispatchEvent(new Event("yugen-state-updated"));
      }
      return next;
    });
  };

  // Official YUGEN Dataset Source with balanced Women & Men items
  const allProductsList = useMemo(() => {
    const menProducts = catalogProducts.filter((p) => p.gender === "Men");
    const womenProducts = catalogProducts.filter((p) => p.gender === "Women");
    const interleaved: CatalogProduct[] = [];
    const maxLen = Math.max(menProducts.length, womenProducts.length);

    for (let i = 0; i < maxLen; i++) {
      if (i < womenProducts.length) interleaved.push(womenProducts[i]);
      if (i < menProducts.length) interleaved.push(menProducts[i]);
    }

    return interleaved;
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return allProductsList.filter((product) => {
      // Size Filter
      if (
        selectedSize !== "All Sizes" &&
        !product.sizes.includes(selectedSize)
      ) {
        return false;
      }
      // Color Filter
      if (
        selectedColor !== "All Colors" &&
        !product.color.toLowerCase().includes(selectedColor.toLowerCase())
      ) {
        return false;
      }
      // Best Sellers Filter
      if (bestSellersOnly && product.price < 50) {
        return false;
      }
      return true;
    });
  }, [allProductsList, selectedSize, selectedColor, bestSellersOnly]);

  // Sorted Products
  const sortedProducts = useMemo(() => {
    const listCopy = [...filteredProducts];
    if (sortBy === "price-low") {
      return listCopy.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-high") {
      return listCopy.sort((a, b) => b.price - a.price);
    }
    if (sortBy === "best-sellers") {
      return listCopy.sort((a, b) => b.price - a.price);
    }
    // Default: Newest First
    return listCopy;
  }, [filteredProducts, sortBy]);

  // Displayed batch
  const visibleProducts = useMemo(() => {
    return sortedProducts.slice(0, displayCount);
  }, [sortedProducts, displayCount]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 6);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#171512] font-sans antialiased flex flex-col selection:bg-[#171512] selection:text-white">
      {/* 1. REUSED HEADER */}
      <Header />

      <main className="flex-1 w-full max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12 py-6 sm:py-8">
        {/* 2. BREADCRUMB */}
        <nav
          className="text-xs text-[#68635B] mb-6 flex items-center space-x-2 font-normal"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-[#171512] transition-colors">
            Home
          </Link>
          <span className="text-[#DDD8CF]">&gt;</span>
          <span className="text-[#171512] font-medium">New Arrivals</span>
        </nav>

        {/* 3. PAGE HEADING */}
        <h1
          className="text-3xl sm:text-4xl lg:text-[42px] font-light text-[#171512] tracking-tight mb-6"
          style={{ fontFamily: '"Cormorant Garamond", "Playfair Display", "Poiret One", serif' }}
        >
          New Arrivals
        </h1>

        {/* 4. EDITORIAL HERO BANNER (Clean hero image containing embedded text) */}
        <section className="relative w-full aspect-[16/5] min-h-[220px] sm:min-h-[280px] lg:min-h-[340px] rounded-lg overflow-hidden mb-8 border border-[#DDD8CF]/60 shadow-xs">
          <Image
            src="/assets/new-arrivals-hero.jpg"
            alt="YUGEN Fresh Drops for the Season - New Arrivals Hero"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </section>

        {/* 5. FILTER + SORT TOOLBAR (6-col grid layout matching reference) */}
        <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          {/* Left Side: Size & Color Filters */}
          <div className="flex items-center space-x-3">
            {/* Size Dropdown */}
            <div className="relative">
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="appearance-none bg-[#FBFAF6] border border-[#DDD8CF] hover:border-[#171512] text-[#171512] text-xs font-medium py-2.5 pl-4 pr-9 rounded-md cursor-pointer transition-colors focus:outline-none min-w-[110px]"
              >
                {SIZES.map((sz) => (
                  <option key={sz} value={sz}>
                    {sz === "All Sizes" ? "Size" : sz}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#68635B] pointer-events-none"
              />
            </div>

            {/* Color Dropdown */}
            <div className="relative">
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="appearance-none bg-[#FBFAF6] border border-[#DDD8CF] hover:border-[#171512] text-[#171512] text-xs font-medium py-2.5 pl-4 pr-9 rounded-md cursor-pointer transition-colors focus:outline-none min-w-[110px]"
              >
                {COLORS.map((c) => (
                  <option key={c} value={c}>
                    {c === "All Colors" ? "Color" : c}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#68635B] pointer-events-none"
              />
            </div>
          </div>

          {/* Right Side: Best Sellers & Newest First Sorting */}
          <div className="flex items-center space-x-3">
            {/* Best Sellers Filter Button */}
            <button
              onClick={() => setBestSellersOnly((prev) => !prev)}
              className={`flex items-center gap-2 border text-xs font-medium py-2.5 px-4 rounded-md transition-colors ${
                bestSellersOnly
                  ? "bg-[#171512] text-white border-[#171512]"
                  : "bg-[#FBFAF6] text-[#171512] border-[#DDD8CF] hover:border-[#171512]"
              }`}
            >
              <span>Best Sellers</span>
              <ChevronDown size={14} className={bestSellersOnly ? "rotate-180" : ""} />
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-[#FBFAF6] border border-[#DDD8CF] hover:border-[#171512] text-[#171512] text-xs font-medium py-2.5 pl-4 pr-9 rounded-md cursor-pointer transition-colors focus:outline-none min-w-[130px]"
              >
                <option value="newest">Newest First</option>
                <option value="best-sellers">Best Sellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#68635B] pointer-events-none"
              />
            </div>
          </div>
        </section>

        {/* 6. PRODUCT GRID (EXACT 6 COLUMNS ON DESKTOP) */}
        <section className="mb-12">
          {visibleProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
              {visibleProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group flex flex-col bg-[#F0ECE5]/50 rounded-lg overflow-hidden border border-[#DDD8CF]/40 hover:border-[#171512]/30 transition-all duration-300"
                >
                  {/* Aspect 4/5 Image Card */}
                  <div className="relative aspect-[4/5] w-full bg-[#F0ECE5] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      priority={false}
                      sizes="(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 50vw"
                      className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                    />

                    {/* Wishlist Heart Button */}
                    <button
                      onClick={(e) => toggleWishlist(product.id, e)}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#171512] hover:bg-white transition-all shadow-xs z-10"
                      aria-label="Add to Wishlist"
                    >
                      <Heart
                        size={13}
                        className={
                          wishlist.includes(product.id)
                            ? "fill-red-500 text-red-500"
                            : ""
                        }
                      />
                    </button>
                  </div>

                  {/* Card Info */}
                  <div className="p-3 flex flex-col flex-1 justify-between space-y-1.5 bg-[#FBFAF6]">
                    <div>
                      <h3 className="text-xs font-medium text-[#171512] truncate group-hover:text-[#8C6D53] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs font-bold text-[#171512] mt-0.5">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center space-x-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          className="fill-[#D4A359] text-[#D4A359]"
                        />
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#FBFAF6] rounded-lg border border-[#DDD8CF]">
              <p className="text-sm text-[#68635B]">
                No products match the selected filters.
              </p>
              <button
                onClick={() => {
                  setSelectedSize("All Sizes");
                  setSelectedColor("All Colors");
                  setBestSellersOnly(false);
                }}
                className="mt-3 text-xs font-semibold text-[#171512] underline"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* 7. LOAD MORE BUTTON */}
          {visibleProducts.length < sortedProducts.length && (
            <div className="flex justify-center mt-12">
              <button
                onClick={handleLoadMore}
                className="bg-[#171512] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-wider px-8 py-3.5 rounded-md transition-all duration-300 shadow-xs"
              >
                Load More
              </button>
            </div>
          )}
        </section>

        {/* 8. TRUST / SERVICE FEATURE BAR (4 Columns with thin dividers) */}
        <section className="w-full bg-[#F3EFEA] border border-[#DDD8CF] rounded-lg p-6 sm:p-8 my-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#DDD8CF]">
            {/* Feature 1 */}
            <div className="flex items-center space-x-4 px-2 md:px-6 py-2 md:py-0">
              <Truck size={24} strokeWidth={1.3} className="text-[#171512] flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#171512]">Free Shipping</h4>
                <p className="text-[11px] text-[#68635B]">On orders above $70</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center space-x-4 px-2 md:px-6 py-2 md:py-0">
              <RotateCcw size={24} strokeWidth={1.3} className="text-[#171512] flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#171512]">Easy Returns</h4>
                <p className="text-[11px] text-[#68635B]">14 days return policy</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center space-x-4 px-2 md:px-6 py-2 md:py-0">
              <ShieldCheck size={24} strokeWidth={1.3} className="text-[#171512] flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#171512]">Secure Payment</h4>
                <p className="text-[11px] text-[#68635B]">100% secure checkout</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center space-x-4 px-2 md:px-6 py-2 md:py-0">
              <Banknote size={24} strokeWidth={1.3} className="text-[#171512] flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#171512]">Cash on Delivery</h4>
                <p className="text-[11px] text-[#68635B]">Available on orders above $50</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 9. REUSED FOOTER */}
      <Footer />
    </div>
  );
}

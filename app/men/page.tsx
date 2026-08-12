"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingBag,
  UserRound,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  Star,
  ChevronRight,
} from "lucide-react";
import { catalogProducts, CatalogProduct } from "@/data/catalogProducts";
import { Header } from "@/components/yugen/Header";
import { BrandValues } from "@/components/yugen/BrandValues";
import { Footer } from "@/components/yugen/Footer";

const CATEGORIES = [
  "All Men",
  "T-Shirts",
  "Shirts",
  "Hoodies",
  "Jeans",
  "Joggers",
  "Jackets",
  "Shorts",
  "Accessories",
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const COLORS = [
  { name: "Beige", hex: "#D6C7B2" },
  { name: "Black", hex: "#191816" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Brown", hex: "#4B3325" },
  { name: "Blue", hex: "#3B5998" },
  { name: "Grey", hex: "#888888" },
  { name: "Red", hex: "#C0392B" },
  { name: "Green", hex: "#7B8660" },
];

export default function MenCollectionPage() {
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>("All Men");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState<number>(250);
  const [inStock, setInStock] = useState<boolean>(false);
  const [outOfStock, setOutOfStock] = useState<boolean>(false);

  // UI States
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Accordion Expand/Collapse States
  const [openAccordion, setOpenAccordion] = useState({
    category: true,
    size: true,
    price: true,
    availability: true,
    color: true,
  });

  // Read initial wishlist state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("yugen_wishlist");
      if (stored) {
        try {
          const ids = JSON.parse(stored);
          if (Array.isArray(ids)) setWishlist(ids);
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

  const clearFilters = () => {
    setSelectedCategory("All Men");
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceMax(250);
    setInStock(false);
    setOutOfStock(false);
  };

  // Filter Men Dataset Products
  const menDatasetProducts = useMemo(() => {
    return catalogProducts.filter((product) => {
      // Must be Men's collection
      if (product.gender !== "Men") return false;

      // Category filter
      if (selectedCategory !== "All Men") {
        const cat = selectedCategory.toLowerCase();
        const pCat = product.category.toLowerCase();
        const pName = product.name.toLowerCase();
        if (!pCat.includes(cat) && !pName.includes(cat)) {
          return false;
        }
      }

      // Price filter
      if (product.price > priceMax) return false;

      // Size filter
      if (
        selectedSizes.length > 0 &&
        !product.sizes.some((sz) => selectedSizes.includes(sz))
      ) {
        return false;
      }

      // Availability filter
      if (inStock && !product.inStock) return false;
      if (outOfStock && product.inStock) return false;

      return true;
    });
  }, [selectedCategory, priceMax, selectedSizes, inStock, outOfStock]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const productsCopy = [...menDatasetProducts];
    if (sortBy === "price-low") {
      return productsCopy.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-high") {
      return productsCopy.sort((a, b) => b.price - a.price);
    }
    if (sortBy === "name") {
      return productsCopy.sort((a, b) => a.name.localeCompare(b.name));
    }
    return productsCopy;
  }, [menDatasetProducts, sortBy]);

  // Pagination (12 per page)
  const itemsPerPage = 12;
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage]);

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#25211D] font-sans antialiased flex flex-col">
      {/* Unified Header */}
      <Header />

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="text-[11px] text-[#756A5E] mb-6 flex items-center space-x-2">
          <Link href="/" className="hover:text-[#25211D] transition-colors">
            Home
          </Link>
          <span>&gt;</span>
          <Link href="/products" className="hover:text-[#25211D] transition-colors">
            Categories
          </Link>
          <span>&gt;</span>
          <span className="text-[#25211D] font-semibold">Men</span>
        </nav>

        {/* HERO BANNER SECTION (Exact design from men.jpeg) */}
        <section className="relative w-full rounded-2xl overflow-hidden mb-12 shadow-sm border border-[#463627]/10 bg-[#E8E3DA]">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[380px] lg:min-h-[440px]">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-start z-10">
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#25211D] uppercase tracking-normal leading-[1.08] mb-4"
                style={{ fontFamily: '"Poiret One", "Playfair Display", serif' }}
              >
                MEN
                <br />
                COLLECTION
              </h1>
              <p className="text-sm sm:text-base text-[#494139] font-normal leading-relaxed mb-8 max-w-md">
                Timeless style, crafted for comfort.
                <br />
                Discover pieces that define you.
              </p>
              <a
                href="#products-section"
                className="inline-block bg-[#B08968] hover:bg-[#967152] text-white text-xs font-bold py-3.5 px-8 rounded-md tracking-wider uppercase transition-colors shadow-md"
              >
                SHOP MEN&apos;S COLLECTION
              </a>
            </div>

            {/* Right Hero Image (Exact image from men.jpeg) */}
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-[440px] bg-[#D8D0C5]">
              <Image
                src="/assets/yugen-men-hero.jpg"
                alt="YUGEN Men Collection Hero"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-top rounded-r-2xl"
              />
            </div>
          </div>
        </section>

        {/* MAIN PRODUCTS & FILTERS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="products-section">
          {/* FILTERS SIDEBAR */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between border-b border-[#463627]/15 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#25211D]">
                FILTERS
              </h2>
              <button
                onClick={clearFilters}
                className="text-[11px] text-[#756A5E] hover:text-[#25211D] underline"
              >
                Clear All
              </button>
            </div>

            {/* CATEGORY ACCORDION */}
            <div className="border-b border-[#463627]/15 pb-4">
              <button
                onClick={() =>
                  setOpenAccordion((p) => ({ ...p, category: !p.category }))
                }
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#25211D] mb-3"
              >
                <span>CATEGORY</span>
                {openAccordion.category ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openAccordion.category && (
                <div className="space-y-2 text-xs text-[#494139]">
                  {CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="accent-[#B08968] rounded"
                      />
                      <span className={selectedCategory === cat ? "font-bold text-[#25211D]" : ""}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* SIZE ACCORDION */}
            <div className="border-b border-[#463627]/15 pb-4">
              <button
                onClick={() =>
                  setOpenAccordion((p) => ({ ...p, size: !p.size }))
                }
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#25211D] mb-3"
              >
                <span>SIZE</span>
                {openAccordion.size ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openAccordion.size && (
                <div className="space-y-2 text-xs text-[#494139]">
                  {SIZES.map((sz) => (
                    <label key={sz} className="flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(sz)}
                        onChange={() =>
                          setSelectedSizes((prev) =>
                            prev.includes(sz)
                              ? prev.filter((item) => item !== sz)
                              : [...prev, sz]
                          )
                        }
                        className="accent-[#B08968] rounded"
                      />
                      <span>{sz}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* PRICE RANGE ACCORDION */}
            <div className="border-b border-[#463627]/15 pb-4">
              <button
                onClick={() =>
                  setOpenAccordion((p) => ({ ...p, price: !p.price }))
                }
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#25211D] mb-3"
              >
                <span>PRICE</span>
                {openAccordion.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openAccordion.price && (
                <div className="space-y-3">
                  <input
                    type="range"
                    min="20"
                    max="250"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full accent-[#B08968]"
                  />
                  <div className="flex items-center justify-between text-[11px] text-[#756A5E] font-medium">
                    <span>$20</span>
                    <span className="text-[#25211D] font-bold">${priceMax}</span>
                  </div>
                </div>
              )}
            </div>

            {/* AVAILABILITY */}
            <div className="border-b border-[#463627]/15 pb-4">
              <button
                onClick={() =>
                  setOpenAccordion((p) => ({ ...p, availability: !p.availability }))
                }
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#25211D] mb-3"
              >
                <span>AVAILABILITY</span>
                {openAccordion.availability ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openAccordion.availability && (
                <div className="space-y-2 text-xs text-[#494139]">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="accent-[#B08968] rounded"
                    />
                    <span>In Stock</span>
                  </label>
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={outOfStock}
                      onChange={(e) => setOutOfStock(e.target.checked)}
                      className="accent-[#B08968] rounded"
                    />
                    <span>Out of Stock</span>
                  </label>
                </div>
              )}
            </div>

            {/* COLOR SWATCHES */}
            <div className="border-b border-[#463627]/15 pb-4">
              <button
                onClick={() =>
                  setOpenAccordion((p) => ({ ...p, color: !p.color }))
                }
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#25211D] mb-3"
              >
                <span>COLOR</span>
                {openAccordion.color ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openAccordion.color && (
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {COLORS.map((c) => (
                      <button
                        key={c.name}
                        onClick={() =>
                          setSelectedColors((prev) =>
                            prev.includes(c.name)
                              ? prev.filter((item) => item !== c.name)
                              : [...prev, c.name]
                          )
                        }
                        className={`w-6 h-6 rounded-full border border-black/20 transition-transform ${
                          selectedColors.includes(c.name)
                            ? "ring-2 ring-[#B08968] scale-110"
                            : ""
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedColors([])}
                    className="w-full py-2 bg-[#EAE6DD] hover:bg-[#25211D] hover:text-white text-[#25211D] text-xs font-medium rounded transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* PRODUCTS CATALOG GRID FROM DATASET */}
          <div className="lg:col-span-9">
            {/* TOP BAR: COUNT, SORT, VIEW TOGGLE */}
            <div className="flex items-center justify-between mb-6 border-b border-[#463627]/15 pb-4">
              <p className="text-xs text-[#25211D] font-bold">
                Showing <span className="text-[#B08968]">{sortedProducts.length}</span> Products
              </p>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-[#756A5E]">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#FBFAF6] border border-[#463627]/20 rounded px-3 py-1.5 text-xs text-[#25211D] focus:outline-none"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>

                <div className="flex items-center space-x-1 border border-[#463627]/20 rounded p-0.5 bg-[#FBFAF6]">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded ${
                      viewMode === "grid" ? "bg-[#25211D] text-white" : "text-[#756A5E]"
                    }`}
                  >
                    <Grid size={14} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded ${
                      viewMode === "list" ? "bg-[#25211D] text-white" : "text-[#756A5E]"
                    }`}
                  >
                    <List size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* DATASET PRODUCT CARDS GRID */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {paginatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group bg-[#FBFAF6] rounded-xl overflow-hidden border border-[#463627]/10 shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  {/* Image container with warm background and dataset image */}
                  <div className="relative aspect-[4/5] min-h-[260px] bg-[#EAE6DD] overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      priority
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={(e) => toggleWishlist(p.id, e)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#25211D] hover:bg-white transition-all shadow-sm z-10"
                    >
                      <Heart
                        size={15}
                        className={wishlist.includes(p.id) ? "fill-red-500 text-red-500" : ""}
                      />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex flex-col flex-1 justify-between space-y-2">
                    <div>
                      <h3 className="text-xs font-semibold text-[#25211D] truncate group-hover:text-[#B08968] transition-colors">
                        {p.name}
                      </h3>

                      {/* Ratings */}
                      <div className="flex items-center space-x-1 my-1">
                        <div className="flex text-[#E5B842]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={11} className="fill-[#E5B842]" />
                          ))}
                        </div>
                        <span className="text-[10px] text-[#756A5E]">(124)</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs font-bold text-[#25211D]">
                          ${p.price.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-[#756A5E]">
                          • {p.category}
                        </span>
                      </div>
                    </div>

                    {/* Color Swatches */}
                    <div className="flex items-center space-x-1.5 pt-1">
                      {p.swatches.map((hex, i) => (
                        <span
                          key={i}
                          className="w-3 h-3 rounded-full border border-black/20"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* PAGINATION BAR MATCHING SCREENSHOT */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-12 pt-6 border-t border-[#463627]/15">
                {[...Array(Math.min(totalPages, 4))].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-8 h-8 rounded text-xs font-bold flex items-center justify-center transition-colors ${
                      currentPage === idx + 1
                        ? "bg-[#B08968] text-white shadow-sm"
                        : "bg-[#FBFAF6] hover:bg-[#25211D] hover:text-white text-[#25211D] border border-[#463627]/20"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                {totalPages > 4 && (
                  <>
                    <span className="text-xs text-[#756A5E] px-1">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`w-8 h-8 rounded text-xs font-bold flex items-center justify-center transition-colors ${
                        currentPage === totalPages
                          ? "bg-[#B08968] text-white shadow-sm"
                          : "bg-[#FBFAF6] hover:bg-[#25211D] hover:text-white text-[#25211D] border border-[#463627]/20"
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded text-xs font-bold flex items-center justify-center bg-[#FBFAF6] hover:bg-[#25211D] hover:text-white text-[#25211D] border border-[#463627]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <BrandValues />
      <Footer />
    </div>
  );
}

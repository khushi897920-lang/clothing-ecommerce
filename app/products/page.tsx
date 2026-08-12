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
  RefreshCw,
  SlidersHorizontal,
  X,
  ShieldCheck,
} from "lucide-react";
import { catalogProducts, CatalogProduct } from "@/data/catalogProducts";
import { Header } from "@/components/yugen/Header";
import { BrandValues } from "@/components/yugen/BrandValues";
import { Footer } from "@/components/yugen/Footer";

const CATEGORIES = [
  "Activewear",
  "Outerwear",
  "Oversized Tshirts",
  "Pants",
  "Shirts",
  "Bottomwear",
  "Co-ord",
  "Dresses",
  "Jacket",
];

const GENDERS = ["Men", "Women"];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const COLORS = [
  { name: "Black", hex: "#191816" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Beige", hex: "#B9A58D" },
  { name: "Brown", hex: "#4B3325" },
  { name: "Blue", hex: "#3B5998" },
  { name: "Grey", hex: "#888888" },
  { name: "Red", hex: "#C0392B" },
  { name: "Pink", hex: "#E8A7B8" },
  { name: "Purple", hex: "#8E44AD" },
  { name: "Green", hex: "#7B8660" },
];

export default function ProductsPage() {
  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [outOfStockOnly, setOutOfStockOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // UI States
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Sync URL search parameters on client mount safely without hydration mismatch
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const genderParam = params.get("gender");
      const sortParam = params.get("sort");

      if (genderParam) {
        setSelectedGenders([genderParam]);
      }
      if (sortParam) {
        setSortBy(sortParam);
      }
    }
  }, []);

  // Accordion Expand/Collapse States
  const [openSections, setOpenSections] = useState({
    categories: true,
    gender: true,
    size: true,
    color: true,
    price: true,
    availability: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Clear all filters
  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedGenders([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setMaxPrice(200);
    setInStockOnly(false);
    setOutOfStockOnly(false);
    setSearchQuery("");
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIES.forEach((cat) => {
      counts[cat] = catalogProducts.filter((p) => p.category === cat).length;
    });
    return counts;
  }, []);

  // Gender counts
  const genderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    GENDERS.forEach((g) => {
      counts[g] = catalogProducts.filter((p) => p.gender === g).length;
    });
    return counts;
  }, []);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return catalogProducts.filter((product) => {
      // Search
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.category.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // Category
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(product.category)
      ) {
        return false;
      }
      // Gender
      if (
        selectedGenders.length > 0 &&
        !selectedGenders.includes(product.gender)
      ) {
        return false;
      }
      // Size
      if (
        selectedSizes.length > 0 &&
        !product.sizes.some((size) => selectedSizes.includes(size))
      ) {
        return false;
      }
      // Color
      if (
        selectedColors.length > 0 &&
        !selectedColors.includes(product.color)
      ) {
        return false;
      }
      // Price
      if (product.price > maxPrice) {
        return false;
      }
      // Availability
      if (inStockOnly && !product.inStock) {
        return false;
      }
      if (outOfStockOnly && product.inStock) {
        return false;
      }
      return true;
    });
  }, [
    searchQuery,
    selectedCategories,
    selectedGenders,
    selectedSizes,
    selectedColors,
    maxPrice,
    inStockOnly,
    outOfStockOnly,
  ]);

  const sortedProducts = useMemo(() => {
    const productsCopy = [...filteredProducts];
    if (sortBy === "price-low") {
      return productsCopy.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-high") {
      return productsCopy.sort((a, b) => b.price - a.price);
    }
    if (sortBy === "newest") {
      return productsCopy.reverse();
    }
    if (sortBy === "name") {
      return productsCopy.sort((a, b) => a.name.localeCompare(b.name));
    }
    return productsCopy; // Default: Featured
  }, [filteredProducts, sortBy]);

  // Pagination (12 items per page)
  const itemsPerPage = 12;
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, sortedProducts.length);

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#25211D] font-sans antialiased">
      <Header />

      {/* Main Container */}
      <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
        {/* Breadcrumb */}
        <nav className="text-[11px] text-[#756A5E] mb-6 flex items-center space-x-2">
          <Link href="/" className="hover:text-[#25211D] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#25211D] font-medium">All Products</span>
        </nav>

        {/* Page Title & Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b border-[#463627]/15 pb-6">
          <div>
            {/* Landing page header typography with Poiret One font */}
            <h1
              className="text-[40px] sm:text-[54px] font-normal text-[#25211D] uppercase leading-tight tracking-normal mb-1"
              style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
            >
              All Products
            </h1>
            <p className="eyebrow text-[#756A5E]">
              Showing {sortedProducts.length > 0 ? startIndex : 0}–
              {endIndex} of {sortedProducts.length} products
            </p>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center space-x-2 bg-[#EAE6DD] px-4 py-2 rounded-md text-[11px] font-medium uppercase text-[#25211D]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 text-[12px]">
              <span className="text-[#756A5E] hidden sm:inline">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#F7F5F0] border border-[#463627]/20 rounded-md px-3.5 py-1.5 text-[12px] text-[#25211D] font-medium focus:outline-none focus:border-[#25211D] appearance-none pr-8 cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="name">Name (A-Z)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#756A5E] absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* View Layout Toggle */}
            <div className="hidden sm:flex items-center border border-[#463627]/20 rounded-md p-0.5 space-x-1">
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid View"
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#25211D] text-white"
                    : "text-[#756A5E] hover:text-[#25211D]"
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="List View"
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-[#25211D] text-white"
                    : "text-[#756A5E] hover:text-[#25211D]"
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Layout (Sidebar + Product Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* 2. Left Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6 pr-4 border-r border-[#463627]/12">
            <div className="flex items-center justify-between pb-3 border-b border-[#463627]/12">
              <h2 className="eyebrow dark">Filters</h2>
              <button
                onClick={handleClearAll}
                className="text-[11px] text-[#756A5E] hover:text-[#25211D] underline transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Categories Section */}
            <div className="border-b border-[#463627]/12 pb-6">
              <button
                onClick={() => toggleSection("categories")}
                className="w-full flex items-center justify-between eyebrow dark mb-4"
              >
                <span>Categories</span>
                {openSections.categories ? (
                  <ChevronUp className="w-3.5 h-3.5 text-[#756A5E]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-[#756A5E]" />
                )}
              </button>
              {openSections.categories && (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-2">
                  {CATEGORIES.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center justify-between text-[12px] text-[#494139] hover:text-[#25211D] cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2.5">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => {
                            setSelectedCategories((prev) =>
                              prev.includes(cat)
                                ? prev.filter((c) => c !== cat)
                                : [...prev, cat]
                            );
                          }}
                          className="w-3.5 h-3.5 rounded border-[#463627]/30 text-[#25211D] focus:ring-[#25211D] cursor-pointer"
                        />
                        <span className="group-hover:translate-x-0.5 transition-transform">
                          {cat}
                        </span>
                      </div>
                      <span className="text-[#8A847C] text-[10px]">
                        ({categoryCounts[cat] || 0})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Gender Section */}
            <div className="border-b border-[#463627]/12 pb-6">
              <button
                onClick={() => toggleSection("gender")}
                className="w-full flex items-center justify-between eyebrow dark mb-4"
              >
                <span>Gender</span>
                {openSections.gender ? (
                  <ChevronUp className="w-3.5 h-3.5 text-[#756A5E]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-[#756A5E]" />
                )}
              </button>
              {openSections.gender && (
                <div className="space-y-2.5">
                  {GENDERS.map((g) => (
                    <label
                      key={g}
                      className="flex items-center justify-between text-[12px] text-[#494139] hover:text-[#25211D] cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5">
                        <input
                          type="checkbox"
                          checked={selectedGenders.includes(g)}
                          onChange={() => {
                            setSelectedGenders((prev) =>
                              prev.includes(g)
                                ? prev.filter((item) => item !== g)
                                : [...prev, g]
                            );
                          }}
                          className="w-3.5 h-3.5 rounded border-[#463627]/30 text-[#25211D] focus:ring-[#25211D] cursor-pointer"
                        />
                        <span>{g}</span>
                      </div>
                      <span className="text-[#8A847C] text-[10px]">
                        ({genderCounts[g] || 0})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Size Section */}
            <div className="border-b border-[#463627]/12 pb-6">
              <button
                onClick={() => toggleSection("size")}
                className="w-full flex items-center justify-between eyebrow dark mb-4"
              >
                <span>Size</span>
                {openSections.size ? (
                  <ChevronUp className="w-3.5 h-3.5 text-[#756A5E]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-[#756A5E]" />
                )}
              </button>
              {openSections.size && (
                <div className="grid grid-cols-3 gap-2">
                  {SIZES.map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSizes((prev) =>
                            prev.includes(size)
                              ? prev.filter((s) => s !== size)
                              : [...prev, size]
                          );
                        }}
                        className={`py-1.5 text-[11px] font-medium border rounded transition-colors ${
                          isSelected
                            ? "bg-[#25211D] text-white border-[#25211D]"
                            : "bg-[#F7F5F0] text-[#494139] border-[#463627]/20 hover:border-[#25211D]"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Color Section */}
            <div className="border-b border-[#463627]/12 pb-6">
              <button
                onClick={() => toggleSection("color")}
                className="w-full flex items-center justify-between eyebrow dark mb-4"
              >
                <span>Color</span>
                {openSections.color ? (
                  <ChevronUp className="w-3.5 h-3.5 text-[#756A5E]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-[#756A5E]" />
                )}
              </button>
              {openSections.color && (
                <div className="flex flex-wrap gap-2.5">
                  {COLORS.map((c) => {
                    const isSelected = selectedColors.includes(c.name);
                    return (
                      <button
                        key={c.name}
                        title={c.name}
                        onClick={() => {
                          setSelectedColors((prev) =>
                            prev.includes(c.name)
                              ? prev.filter((col) => col !== c.name)
                              : [...prev, c.name]
                          );
                        }}
                        className={`w-6 h-6 rounded-full border border-black/15 transition-transform ${
                          isSelected ? "ring-2 ring-offset-2 ring-[#25211D] scale-110" : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Price Range Section */}
            <div className="border-b border-[#463627]/12 pb-6">
              <button
                onClick={() => toggleSection("price")}
                className="w-full flex items-center justify-between eyebrow dark mb-4"
              >
                <span>Price Range</span>
                {openSections.price ? (
                  <ChevronUp className="w-3.5 h-3.5 text-[#756A5E]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-[#756A5E]" />
                )}
              </button>
              {openSections.price && (
                <div className="space-y-4">
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#6B4A37] cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[11px] font-medium text-[#494139]">
                    <span>$10</span>
                    <span className="font-bold text-[#25211D]">Max: ${maxPrice}</span>
                    <span>$200</span>
                  </div>
                </div>
              )}
            </div>

            {/* Availability Section */}
            <div className="pb-6">
              <button
                onClick={() => toggleSection("availability")}
                className="w-full flex items-center justify-between eyebrow dark mb-4"
              >
                <span>Availability</span>
                {openSections.availability ? (
                  <ChevronUp className="w-3.5 h-3.5 text-[#756A5E]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-[#756A5E]" />
                )}
              </button>
              {openSections.availability && (
                <div className="space-y-2.5">
                  <label className="flex items-center justify-between text-[12px] text-[#494139] cursor-pointer">
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-[#463627]/30 text-[#25211D] focus:ring-[#25211D]"
                      />
                      <span>In Stock</span>
                    </div>
                    <span className="text-[#8A847C] text-[10px]">(48)</span>
                  </label>
                  <label className="flex items-center justify-between text-[12px] text-[#494139] cursor-pointer">
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={outOfStockOnly}
                        onChange={(e) => setOutOfStockOnly(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-[#463627]/30 text-[#25211D] focus:ring-[#25211D]"
                      />
                      <span>Out of Stock</span>
                    </div>
                    <span className="text-[#8A847C] text-[10px]">(2)</span>
                  </label>
                </div>
              )}
            </div>

            <button
              onClick={() => setCurrentPage(1)}
              className="w-full bg-[#25211D] hover:bg-[#38342F] text-white text-[11px] font-medium py-3 rounded-md uppercase tracking-wider transition-colors shadow-sm"
            >
              Apply Filters
            </button>
          </aside>

          {/* 3. Product Cards Grid */}
          <div className="lg:col-span-3">
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-20 bg-[#FBFAF6] rounded-xl border border-[#463627]/12 p-8">
                <p
                  className="text-2xl font-normal text-[#25211D] mb-2 uppercase"
                  style={{ fontFamily: '"Poiret One", sans-serif' }}
                >
                  No products matched your filters.
                </p>
                <p className="text-[12px] text-[#756A5E] mb-6">
                  Try adjusting your category, price range, or color filters.
                </p>
                <button
                  onClick={handleClearAll}
                  className="bg-[#25211D] text-white text-[11px] px-6 py-2.5 rounded-full font-medium uppercase tracking-wider"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {paginatedProducts.map((product) => {
                  const isWishlisted = wishlist.includes(product.id);
                  return (
                    <article
                      key={product.id}
                      className={`group product-card ${
                        viewMode === "list" ? "flex flex-col sm:flex-row items-center p-4 gap-6 bg-[#FBFAF6] rounded-lg border border-[#463627]/12" : ""
                      }`}
                    >
                      {/* Media container */}
                      <Link
                        href={`/products/${product.slug}`}
                        className={`block relative overflow-hidden bg-[#EAE6DD] ${
                          viewMode === "list"
                            ? "w-full sm:w-48 h-60 min-h-[240px] rounded-md flex-shrink-0 !mb-0"
                            : "w-full aspect-[4/5] min-h-[260px] rounded-md mb-3"
                        }`}
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          priority={true}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />

                        {/* Wishlist heart button */}
                        <button
                          onClick={(e) => toggleWishlist(product.id, e)}
                          aria-label="Add to Wishlist"
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
                            isWishlisted
                              ? "bg-red-500 text-white"
                              : "bg-[#F7F5F0]/80 text-[#25211D] hover:bg-[#F7F5F0] hover:scale-110"
                          }`}
                        >
                          <Heart
                            className="w-3.5 h-3.5"
                            fill={isWishlisted ? "currentColor" : "none"}
                          />
                        </button>
                      </Link>

                      {/* Details container matching Landing Page typography */}
                      <div className={viewMode === "list" ? "flex-1" : ""}>
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="!text-[11px] !font-medium !uppercase !tracking-normal !text-[#25211D] mb-1 line-clamp-1 hover:underline">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="!text-[11px] !text-[#25211D] mb-3">
                          {product.formattedPrice}
                        </p>

                        {/* Color swatches matching Landing Page design */}
                        <div className="swatches">
                          {product.swatches.map((hex, idx) => (
                            <span
                              key={idx}
                              style={{ backgroundColor: hex }}
                              className={idx === 0 ? "selected" : ""}
                            />
                          ))}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* 4. Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-14 flex flex-col items-center space-y-6">
                <div className="flex items-center space-x-2 text-[12px] font-medium">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                          currentPage === page
                            ? "bg-[#25211D] text-white font-bold"
                            : "bg-[#FBFAF6] border border-[#463627]/20 text-[#25211D] hover:bg-[#EAE6DD]"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  {totalPages > 5 && (
                    <>
                      <span className="px-1 text-[#756A5E]">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-8 h-8 rounded-md bg-[#FBFAF6] border border-[#463627]/20 text-[#25211D] hover:bg-[#EAE6DD]"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                {/* Load More Button */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage >= totalPages}
                  className="flex items-center space-x-2 bg-[#FBFAF6] border border-[#463627]/20 hover:bg-[#EAE6DD] text-[#25211D] text-[11px] font-medium uppercase tracking-wider px-8 py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Load More Products</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 5. Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-[#F7F5F0] h-full p-6 overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-[#463627]/15 mb-4">
              <h2 className="eyebrow dark">Filters</h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-[#756A5E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="mb-6">
              <p className="eyebrow dark mb-3">Categories</p>
              <div className="space-y-2.5">
                {CATEGORIES.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center justify-between text-[12px]"
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => {
                          setSelectedCategories((prev) =>
                            prev.includes(cat)
                              ? prev.filter((c) => c !== cat)
                              : [...prev, cat]
                          );
                        }}
                      />
                      <span>{cat}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="mt-auto bg-[#25211D] text-white py-3 rounded-md text-[11px] font-medium uppercase tracking-wider"
            >
              Show Results
            </button>
          </div>
        </div>
      )}

      {/* 6. Exact YUGEN Brand Values Strip */}
      <BrandValues />

      {/* 7. Exact YUGEN Landing Page Footer */}
      <Footer />
    </div>
  );
}

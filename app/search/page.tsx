"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search as SearchIcon,
  Heart,
  ShoppingBag,
  UserRound,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  X,
  ShieldCheck,
  SearchX,
} from "lucide-react";
import { catalogProducts, CatalogProduct } from "@/data/catalogProducts";
import { Header } from "@/components/yugen/Header";
import { BrandValues } from "@/components/yugen/BrandValues";
import { Footer } from "@/components/yugen/Footer";

const CATEGORIES = [
  "Shirts",
  "T-Shirts",
  "Co-ord Sets",
  "Dresses",
  "Tops",
  "Jackets",
  "Bottoms",
  "Activewear",
  "Outerwear",
];

const GENDERS = ["Men", "Women", "Unisex"];

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

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search Query State (default to "linen shirt" if empty for preview, or from URL)
  const initialQuery = searchParams.get("q") || "linen shirt";
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [activeQuery, setActiveQuery] = useState<string>(initialQuery);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setSearchQuery(q);
      setActiveQuery(q);
    }
  }, [searchParams]);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(10);
  const [maxPrice, setMaxPrice] = useState<number>(200);

  // UI States
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Accordion Expand/Collapse States
  const [openSections, setOpenSections] = useState({
    categories: true,
    gender: true,
    size: true,
    color: true,
    price: true,
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(searchQuery);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveQuery("");
    router.push("/search");
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedGenders([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinPrice(10);
    setMaxPrice(200);
  };

  // Search Results Matching Algorithm against dataset
  const searchResults = useMemo(() => {
    if (!activeQuery.trim()) {
      return catalogProducts;
    }
    const q = activeQuery.toLowerCase().trim();
    const queryTerms = q.split(/\s+/);

    return catalogProducts.filter((product) => {
      const name = product.name.toLowerCase();
      const cat = product.category.toLowerCase();
      const sub = product.subType.toLowerCase();
      const color = product.color.toLowerCase();
      const gender = product.gender.toLowerCase();
      const pattern = product.pattern.toLowerCase();
      const fit = product.fit.toLowerCase();

      const fullString = `${name} ${cat} ${sub} ${color} ${gender} ${pattern} ${fit}`;

      // Check if all query terms match or close match
      return queryTerms.every((term) => fullString.includes(term)) ||
        fullString.includes(q) ||
        (q.includes("linen") && (name.includes("shirt") || name.includes("tshirt") || cat.includes("shirt")));
    });
  }, [activeQuery]);

  // Apply Sidebar Filters
  const filteredProducts = useMemo(() => {
    return searchResults.filter((product) => {
      // Category
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.some(
          (c) =>
            product.category.toLowerCase().includes(c.toLowerCase()) ||
            c.toLowerCase().includes(product.category.toLowerCase())
        )
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
        !product.sizes.some((s) => selectedSizes.includes(s))
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
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }
      return true;
    });
  }, [searchResults, selectedCategories, selectedGenders, selectedSizes, selectedColors, minPrice, maxPrice]);

  // Sort Products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "price-low") return list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") return list.sort((a, b) => b.price - a.price);
    if (sortBy === "newest") return list.reverse();
    if (sortBy === "name") return list.sort((a, b) => a.name.localeCompare(b.name));
    return list; // Default: Relevance
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
      <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
        {/* Breadcrumb */}
        <nav className="text-[11px] text-[#756A5E] mb-6 flex items-center space-x-2">
          <Link href="/" className="hover:text-[#25211D] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#25211D] font-medium">Search</span>
        </nav>

        {/* Page Title & Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#463627]/15 pb-6">
          <div>
            <h1
              className="text-[36px] sm:text-[48px] font-normal text-[#25211D] leading-tight tracking-normal mb-1"
              style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
            >
              Search results for &ldquo;{activeQuery || "All"}&rdquo;
            </h1>
            <p className="eyebrow text-[#756A5E]">
              Showing {sortedProducts.length > 0 ? startIndex : 0}–{endIndex} of {sortedProducts.length} results
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
                  <option value="relevance">Relevance</option>
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

        {/* 2. Content Layout (Sidebar + Results Grid / Empty State) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Left Sidebar Filters */}
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
                <div className="space-y-2.5">
                  {CATEGORIES.map((cat) => {
                    const count = searchResults.filter((p) =>
                      p.category.toLowerCase().includes(cat.toLowerCase())
                    ).length;
                    return (
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
                          ({count})
                        </span>
                      </label>
                    );
                  })}
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
                  {GENDERS.map((g) => {
                    const count = searchResults.filter((p) => p.gender === g).length;
                    return (
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
                          ({count})
                        </span>
                      </label>
                    );
                  })}
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
            <div className="pb-6">
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
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="w-full bg-[#FBFAF6] border border-[#463627]/20 rounded p-1.5 text-center text-[11px]"
                      placeholder="$ Min"
                    />
                    <span className="text-[#756A5E]">-</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full bg-[#FBFAF6] border border-[#463627]/20 rounded p-1.5 text-center text-[11px]"
                      placeholder="$ Max"
                    />
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#6B4A37] cursor-pointer"
                  />
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

          {/* Right Product Grid OR Empty State */}
          <div className="lg:col-span-3">
            {paginatedProducts.length === 0 ? (
              /* 3. Exact "No results found for xyz" Empty State Card */
              <div className="bg-[#FBFAF6] rounded-2xl border border-[#463627]/12 p-8 lg:p-14 flex flex-col md:flex-row items-center gap-8 shadow-xs">
                {/* Search Illustration Box */}
                <div className="w-48 h-48 sm:w-56 sm:h-56 bg-[#EAE6DD] rounded-xl flex items-center justify-center relative overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center opacity-40">
                    <div className="w-24 h-28 border-2 border-[#463627] rounded-md mb-2 flex items-center justify-center">
                      <div className="w-12 h-16 border-t-2 border-[#463627] rounded-t-full" />
                    </div>
                  </div>
                  <SearchX className="w-20 h-20 text-[#6B4A37] relative z-10 animate-bounce" />
                </div>

                {/* Empty State Copy & CTA */}
                <div className="text-center md:text-left space-y-3">
                  <h3
                    className="text-2xl sm:text-3xl font-normal text-[#25211D] uppercase tracking-normal"
                    style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
                  >
                    No results found for &ldquo;{activeQuery}&rdquo;
                  </h3>
                  <p className="text-xs text-[#756A5E] max-w-md leading-relaxed">
                    We couldn&apos;t find any products matching your search. Try different keywords or check our bestsellers.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/products"
                      className="inline-block bg-[#25211D] hover:bg-[#38342F] text-white text-xs font-semibold px-6 py-3 rounded-md uppercase tracking-wider transition-colors shadow-md"
                    >
                      Explore All Products
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* Product Grid */
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
                        viewMode === "list"
                          ? "flex flex-col sm:flex-row items-center p-4 gap-6 bg-[#FBFAF6] rounded-lg border border-[#463627]/12"
                          : ""
                      }`}
                    >
                      {/* Media container linking to /products/[slug] */}
                      <Link
                        href={`/products/${product.slug}`}
                        className={`product-image block relative ${
                          viewMode === "list"
                            ? "w-full sm:w-48 h-60 rounded-md flex-shrink-0 !mb-0"
                            : "w-full aspect-[4/5] rounded-md"
                        }`}
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover group-hover:scale-[1.015] transition-transform duration-500"
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
                        <p className="text-[10px] text-[#756A5E] mb-1">
                          {product.gender}
                        </p>
                        <p className="!text-[11px] !text-[#25211D] mb-3">
                          {product.formattedPrice}
                        </p>

                        {/* Color swatches */}
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

            {/* Pagination Controls */}
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
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 4. Brand Values Banner */}
      <BrandValues />

      {/* 5. YUGEN Landing Page Footer */}
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F5F0]" />}>
      <SearchContent />
    </Suspense>
  );
}

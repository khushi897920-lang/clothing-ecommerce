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
  ShieldCheck,
  Star,
  RefreshCw,
} from "lucide-react";
import { CatalogProduct } from "@/data/catalogProducts";
import { productApi, userApi, mapBackendProduct } from "@/lib/apiClient";
import { Header } from "@/components/yugen/Header";
import { BrandValues } from "@/components/yugen/BrandValues";
import { Footer } from "@/components/yugen/Footer";

const CATEGORIES = [
  "All Women",
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

export default function WomenCollectionPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>("All Women");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState<number>(5000);
  const [inStock, setInStock] = useState<boolean>(false);
  const [outOfStock, setOutOfStock] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // UI States
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Load wishlist on mount
  useEffect(() => {
    userApi.getWishlist().then(({ data }) => {
      const list = data?.wishlist || data?.items;
      if (list && Array.isArray(list)) {
        setWishlist(list.map((w: any) => w.productId || w.product?.id));
      } else {
        setWishlist([]);
      }
    });
  }, []);

  // Fetch real products from API Gateway on filter changes
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    const params: Record<string, string | number> = {
      audience: "WOMEN"
    };

    if (selectedCategory && selectedCategory !== "All Women") {
      params.category = selectedCategory;
    }
    if (selectedSizes.length > 0) {
      params.size = selectedSizes[0];
    }
    if (selectedColors.length > 0) {
      params.color = selectedColors[0];
    }
    if (priceMax && priceMax < 5000) {
      params.maxPrice = priceMax;
    }
    if (searchQuery.trim()) {
      params.q = searchQuery.trim();
    }
    if (sortBy) {
      if (sortBy === "price-low-high" || sortBy === "low-high") params.sort = "price_asc";
      else if (sortBy === "price-high-low" || sortBy === "high-low") params.sort = "price_desc";
      else if (sortBy === "newest") params.sort = "createdAt_desc";
      else params.sort = sortBy;
    }

    productApi.getCatalog(params).then(({ data, error: apiError }) => {
      if (!active) return;
      if (apiError) {
        setError(apiError);
        setProducts([]);
      } else if (data?.products) {
        setProducts(data.products.map(mapBackendProduct));
      } else {
        setProducts([]);
      }
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [selectedCategory, selectedSizes, selectedColors, priceMax, searchQuery, sortBy]);

  // Accordion Expand/Collapse States
  const [openAccordion, setOpenAccordion] = useState({
    category: true,
    size: true,
    price: true,
    availability: true,
    color: true,
  });

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlist.includes(id)) {
      setWishlist((prev) => prev.filter((item) => item !== id));
      userApi.removeFromWishlist(id).then(() => {
        window.dispatchEvent(new Event("yugen-state-updated"));
      });
    } else {
      setWishlist((prev) => [...prev, id]);
      userApi.addToWishlist(id).then(() => {
        window.dispatchEvent(new Event("yugen-state-updated"));
      });
    }
  };

  const clearFilters = () => {
    setSelectedCategory("All Women");
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceMax(200);
    setInStock(false);
    setOutOfStock(false);
    setSearchQuery("");
  };

  // Filter Women Dataset Products
  const womenDatasetProducts = useMemo(() => {
    return products.filter((product) => {
      // Must be Women's collection
      if (product.gender !== "Women") return false;

      // Search Query
      if (
        searchQuery &&
        !(product.name || "").toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(product.category || "").toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Category
      if (
        selectedCategory !== "All Women" &&
        product.category !== selectedCategory
      ) {
        return false;
      }

      // Price
      if (priceMax < 5000 && product.price > priceMax) return false;

      // Size
      if (
        selectedSizes.length > 0 &&
        !product.sizes.some((sz) => selectedSizes.includes(sz))
      ) {
        return false;
      }

      // Availability
      if (inStock && !product.inStock) return false;
      if (outOfStock && product.inStock) return false;

      return true;
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    priceMax,
    selectedSizes,
    inStock,
    outOfStock,
  ]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const productsCopy = [...womenDatasetProducts];
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
  }, [womenDatasetProducts, sortBy]);

  // Pagination (12 per page)
  const itemsPerPage = 12;
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage]);

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#25211D] font-sans antialiased">
      <Header />

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
        {/* Breadcrumb */}
        <nav className="text-[11px] text-[#756A5E] mb-6 flex items-center space-x-2">
          <Link href="/" className="hover:text-[#25211D] transition-colors">
            Home
          </Link>
          <span>&gt;</span>
          <Link href="/products" className="hover:text-[#25211D] transition-colors">
            Categories
          </Link>
          <span>&gt;</span>
          <span className="text-[#25211D] font-semibold">Women</span>
        </nav>

        {/* HERO BANNER SECTION (Women Collection Image & CTA) */}
        <section className="relative w-full rounded-2xl overflow-hidden mb-12 shadow-sm border border-[#463627]/10 bg-[#E8E3DA]">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[380px] lg:min-h-[440px]">
            {/* Left Content */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-start z-10">
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#25211D] uppercase tracking-normal leading-[1.08] mb-4"
                style={{ fontFamily: '"Poiret One", "Playfair Display", serif' }}
              >
                WOMEN
                <br />
                COLLECTION
              </h1>
              <p className="text-sm sm:text-base text-[#494139] font-normal leading-relaxed mb-8 max-w-md">
                Timeless pieces, thoughtfully designed for every moment of your life.
              </p>
              <a
                href="#products-section"
                className="inline-block bg-[#B08968] hover:bg-[#967152] text-white text-xs font-bold py-3.5 px-8 rounded-md tracking-wider uppercase transition-colors shadow-md"
              >
                SHOP WOMEN&apos;S COLLECTION
              </a>
            </div>

            {/* Right Hero Image (yugen women hero image) */}
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-[440px] bg-[#D8D0C5]">
              <Image
                src="/assets/yugen-women-hero.jpg"
                alt="YUGEN Women Collection Hero"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-top"
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
                    min="500"
                    max="5000"
                    step="50"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full accent-[#B08968]"
                  />
                  <div className="flex items-center justify-between text-[11px] text-[#756A5E] font-medium">
                    <span>₹500</span>
                    <span className="text-[#25211D] font-bold">₹{priceMax}</span>
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
            {loading ? (
              <div className="text-center py-20 bg-[#FBFAF6] rounded-xl border border-[#463627]/12 p-8 flex flex-col items-center justify-center">
                <RefreshCw className="w-8 h-8 text-[#B08968] animate-spin mb-4" />
                <p className="text-sm font-medium text-[#756A5E]">Loading products catalog...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-[#FBFAF6] rounded-xl border border-[#463627]/12 p-8">
                <p className="text-2xl font-normal text-red-700 mb-2 uppercase" style={{ fontFamily: '"Poiret One", sans-serif' }}>
                  Error loading catalog
                </p>
                <p className="text-[12px] text-[#756A5E] mb-6">{error}</p>
                <button
                  onClick={() => {
                    setPriceMax((p) => p + 0.001);
                  }}
                  className="bg-[#25211D] text-white text-[11px] px-6 py-2.5 rounded-full font-medium uppercase tracking-wider"
                >
                  Retry Fetch
                </button>
              </div>
            ) : paginatedProducts.length === 0 ? (
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
                  onClick={() => {
                    setSelectedCategory("All Women");
                    setSelectedSizes([]);
                    setSelectedColors([]);
                  }}
                  className="bg-[#25211D] text-white text-[11px] px-6 py-2.5 rounded-full font-medium uppercase tracking-wider"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
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
                          className={wishlist.includes(p.id) ? "fill-[#C0392B] text-[#C0392B]" : "text-[#25211D]"}
                        />
                      </button>
                    </div>

                    {/* Meta info matching browser design aesthetics */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="eyebrow dark mb-1.5">{p.category}</p>
                        <h3 className="text-xs font-bold text-[#25211D] tracking-wide uppercase line-clamp-1">
                          {p.name}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#463627]/10 mt-3">
                        <p className="text-xs font-black text-[#25211D]">{p.price}</p>

                        {/* Color Swatches — derived from real variant colors */}
                        <div className="flex items-center space-x-1.5 pt-1">
                          {(p.swatches || []).map((hex, i) => (
                            <span
                              key={i}
                              className="w-3 h-3 rounded-full border border-black/20"
                              style={{ backgroundColor: hex }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* PAGINATION BAR */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-12 pt-6 border-t border-[#463627]/15">
                {[...Array(totalPages)].map((_, idx) => (
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

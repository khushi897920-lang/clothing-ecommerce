"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  Star,
  Heart,
  SlidersHorizontal,
  RefreshCw,
  AlertCircle,
  PackageOpen,
} from "lucide-react";
import { CatalogProduct } from "@/data/catalogProducts";
import { productApi, userApi, mapBackendProduct } from "@/lib/apiClient";
import { Header } from "@/components/yugen/Header";
import { BrandValues } from "@/components/yugen/BrandValues";
import { Footer } from "@/components/yugen/Footer";

// Category slug mapping configuration
const CATEGORY_MAP: Record<
  string,
  { title: string; description: string; matches: string[] }
> = {
  "t-shirts": {
    title: "T-Shirts",
    description: "Premium oversized, graphic, and minimal daily cotton tees.",
    matches: ["oversized tshirts", "t-shirts", "tshirts", "tshirt", "activewear"],
  },
  shirts: {
    title: "Shirts",
    description: "Breathable linen, crisp cotton, and relaxed casual shirts.",
    matches: ["shirts", "shirt"],
  },
  hoodies: {
    title: "Hoodies",
    description: "Heavyweight fleece hoodies and effortless outerwear layers.",
    matches: ["hoodies", "hoodie", "outerwear"],
  },
  jeans: {
    title: "Jeans",
    description: "Tailored slim, straight-leg, and relaxed denim trousers.",
    matches: ["jeans", "pants", "bottomwear"],
  },
  joggers: {
    title: "Joggers",
    description: "Comfort-first lounge pants, sweatpants, and everyday joggers.",
    matches: ["joggers", "pants", "activewear"],
  },
  jackets: {
    title: "Jackets",
    description: "Structured blazers, utility jackets, and outerwear pieces.",
    matches: ["jackets", "jacket", "outerwear"],
  },
  accessories: {
    title: "Accessories",
    description: "Curated daily carry, caps, scarves, and understated accents.",
    matches: ["accessories", "accessory", "bags", "caps"],
  },
};

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const GENDERS = ["Men", "Women"];
const COLORS = [
  { name: "Black", hex: "#191816" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Beige", hex: "#B9A58D" },
  { name: "Brown", hex: "#4B3325" },
  { name: "Blue", hex: "#3B5998" },
  { name: "Grey", hex: "#888888" },
  { name: "Green", hex: "#7B8660" },
];

export default function CategoryPage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || "";
  const slugKey = rawSlug.toLowerCase();

  const [products, setProducts] = useState<CatalogProduct[]>([]);

  // Category Information
  const categoryInfo = useMemo(() => {
    if (CATEGORY_MAP[slugKey]) {
      return CATEGORY_MAP[slugKey];
    }
    // Dynamic formatting for custom category slugs
    const formattedTitle = rawSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      title: formattedTitle || "Category Products",
      description: `Explore our curated selection of ${formattedTitle || "products"}.`,
      matches: [rawSlug.replace(/-/g, " ")],
    };
  }, [rawSlug, slugKey]);

  // Loading & Error States
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // UI States
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Accordion Expand States
  const [accordions, setAccordions] = useState({
    gender: true,
    size: true,
    price: true,
    availability: true,
    color: true,
  });

  // Fetch wishlist on mount
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

  // Fetch real category products from Product Service on filter changes
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    // Map legacy or header category slugs to PostgreSQL database slugs
    const slugAliasMap: Record<string, string> = {
      "t-shirts": "oversized-tshirts",
      "hoodies": "outerwear",
      "jackets": "jacket",
      "jeans": "pants",
      "joggers": "bottomwear",
      "accessories": "activewear",
    };
    const targetCategorySlug = slugAliasMap[rawSlug.toLowerCase()] || rawSlug;

    const params: Record<string, string | number> = {
      category: targetCategorySlug
    };

    if (selectedGenders.length > 0) {
      params.audience = selectedGenders[0].toUpperCase();
    }
    if (selectedSizes.length > 0) {
      params.size = selectedSizes[0];
    }
    if (selectedColors.length > 0) {
      params.color = selectedColors[0];
    }
    if (maxPrice && maxPrice < 5000) {
      params.maxPrice = maxPrice;
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
  }, [rawSlug, selectedGenders, selectedSizes, selectedColors, maxPrice, sortBy]);

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
    setSelectedGenders([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setMaxPrice(250);
    setInStockOnly(false);
  };

  // Filter Products for Current Category
  const categoryProducts = useMemo(() => {
    return products.filter((product) => {
      const pCat = (product.category || "").toLowerCase();
      const pName = (product.name || "").toLowerCase();

      // Check category match criteria
      const matchesCategory = categoryInfo.matches.some(
        (m) => pCat.includes(m) || pName.includes(m)
      );

      if (!matchesCategory) return false;

      // Filter: Gender
      if (
        selectedGenders.length > 0 &&
        !selectedGenders.includes(product.gender)
      ) {
        return false;
      }

      // Filter: Price
      if (product.price > maxPrice) return false;

      // Filter: Size
      if (
        selectedSizes.length > 0 &&
        !product.sizes.some((sz) => selectedSizes.includes(sz))
      ) {
        return false;
      }

      // Filter: Availability
      if (inStockOnly && !product.inStock) return false;

      return true;
    });
  }, [products, categoryInfo, selectedGenders, maxPrice, selectedSizes, inStockOnly]);

  // Sorting Logic
  const sortedProducts = useMemo(() => {
    const copy = [...categoryProducts];
    if (sortBy === "price-low") return copy.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") return copy.sort((a, b) => b.price - a.price);
    if (sortBy === "name") return copy.sort((a, b) => a.name.localeCompare(b.name));
    return copy;
  }, [categoryProducts, sortBy]);

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#25211D] font-sans antialiased flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-8">
        {/* Breadcrumb */}
        <nav className="text-[11px] text-[#756A5E] mb-6 flex items-center space-x-2">
          <Link href="/" className="hover:text-[#25211D] transition-colors">
            Home
          </Link>
          <span>&gt;</span>
          <span className="hover:text-[#25211D] transition-colors">Categories</span>
          <span>&gt;</span>
          <span className="text-[#25211D] font-semibold">{categoryInfo.title}</span>
        </nav>

        {/* Category Header Banner */}
        <section className="bg-[#EAE6DD] border border-[#463627]/10 rounded-2xl p-8 sm:p-12 mb-10 text-left">
          <h1
            className="text-3xl sm:text-5xl font-light text-[#25211D] uppercase tracking-normal mb-3"
            style={{ fontFamily: '"Poiret One", "Playfair Display", serif' }}
          >
            {categoryInfo.title}
          </h1>
          <p className="text-sm text-[#494139] max-w-xl mb-4 font-normal">
            {categoryInfo.description}
          </p>
          <div className="inline-block text-xs font-semibold text-[#6B4A37] bg-[#FBFAF6] px-3 py-1 rounded-full border border-[#463627]/15">
            {sortedProducts.length} {sortedProducts.length === 1 ? "Product" : "Products"} Available
          </div>
        </section>

        {/* Main Category Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between border-b border-[#463627]/15 pb-3">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal size={14} className="text-[#6B4A37]" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#25211D]">
                  FILTERS
                </h2>
              </div>
              <button
                onClick={clearFilters}
                className="text-[11px] text-[#756A5E] hover:text-[#25211D] underline"
              >
                Clear All
              </button>
            </div>

            {/* GENDER ACCORDION */}
            <div className="border-b border-[#463627]/15 pb-4">
              <button
                onClick={() =>
                  setAccordions((p) => ({ ...p, gender: !p.gender }))
                }
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#25211D] mb-3"
              >
                <span>GENDER</span>
                {accordions.gender ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {accordions.gender && (
                <div className="space-y-2 text-xs text-[#494139]">
                  {GENDERS.map((g) => (
                    <label key={g} className="flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedGenders.includes(g)}
                        onChange={() =>
                          setSelectedGenders((prev) =>
                            prev.includes(g)
                              ? prev.filter((item) => item !== g)
                              : [...prev, g]
                          )
                        }
                        className="accent-[#6B4A37] rounded"
                      />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* SIZE ACCORDION */}
            <div className="border-b border-[#463627]/15 pb-4">
              <button
                onClick={() =>
                  setAccordions((p) => ({ ...p, size: !p.size }))
                }
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#25211D] mb-3"
              >
                <span>SIZE</span>
                {accordions.size ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {accordions.size && (
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
                        className="accent-[#6B4A37] rounded"
                      />
                      <span>{sz}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* PRICE MAX SLIDER */}
            <div className="border-b border-[#463627]/15 pb-4">
              <button
                onClick={() =>
                  setAccordions((p) => ({ ...p, price: !p.price }))
                }
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#25211D] mb-3"
              >
                <span>PRICE</span>
                {accordions.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {accordions.price && (
                <div className="space-y-3">
                  <input
                    type="range"
                    min="20"
                    max="250"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#6B4A37]"
                  />
                  <div className="flex items-center justify-between text-[11px] text-[#756A5E] font-medium">
                    <span>$20</span>
                    <span className="text-[#25211D] font-bold">${maxPrice}</span>
                  </div>
                </div>
              )}
            </div>

            {/* AVAILABILITY */}
            <div className="border-b border-[#463627]/15 pb-4">
              <button
                onClick={() =>
                  setAccordions((p) => ({ ...p, availability: !p.availability }))
                }
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#25211D] mb-3"
              >
                <span>AVAILABILITY</span>
                {accordions.availability ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {accordions.availability && (
                <div className="space-y-2 text-xs text-[#494139]">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="accent-[#6B4A37] rounded"
                    />
                    <span>In Stock Only</span>
                  </label>
                </div>
              )}
            </div>
          </aside>

          {/* Product Listing Area */}
          <div className="lg:col-span-9">
            {/* Top Toolbar: Count, Sort, Grid/List view */}
            <div className="flex items-center justify-between mb-6 border-b border-[#463627]/15 pb-4">
              <p className="text-xs text-[#25211D] font-bold">
                Showing <span className="text-[#6B4A37]">{sortedProducts.length}</span> Results
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
                    aria-label="Grid view"
                  >
                    <Grid size={14} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded ${
                      viewMode === "list" ? "bg-[#25211D] text-white" : "text-[#756A5E]"
                    }`}
                    aria-label="List view"
                  >
                    <List size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* 1. LOADING STATE */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#EAE6DD] rounded-xl aspect-[4/5] min-h-[260px]"
                  />
                ))}
              </div>
            ) : error ? (
              /* 2. ERROR STATE */
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-8 text-center my-8">
                <AlertCircle className="mx-auto w-8 h-8 mb-2 text-red-500" />
                <h3 className="text-sm font-bold mb-1">Failed to load category products</h3>
                <p className="text-xs text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center space-x-2 text-xs bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  <RefreshCw size={13} />
                  <span>Retry</span>
                </button>
              </div>
            ) : sortedProducts.length === 0 ? (
              /* 3. EMPTY STATE */
              <div className="bg-[#FBFAF6] border border-[#463627]/10 rounded-2xl p-12 text-center my-6">
                <PackageOpen className="mx-auto w-12 h-12 mb-3 text-[#756A5E]" />
                <h3 className="text-base font-semibold text-[#25211D] mb-1">
                  No products found in {categoryInfo.title}
                </h3>
                <p className="text-xs text-[#756A5E] max-w-sm mx-auto mb-6">
                  Try adjusting or clearing your active filters to see available catalog items.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-[#6B4A37] hover:bg-[#54392a] text-white text-xs font-bold px-6 py-2.5 rounded-md uppercase tracking-wider transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              /* 4. SUCCESS STATE: PRODUCT GRID */
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {sortedProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    className="group bg-[#FBFAF6] rounded-xl overflow-hidden border border-[#463627]/10 shadow-sm hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="relative aspect-[4/5] min-h-[260px] bg-[#EAE6DD] overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(min-width: 1024px) 30vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        onClick={(e) => toggleWishlist(p.id, e)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#25211D] hover:bg-white transition-all shadow-sm z-10"
                        aria-label="Add to wishlist"
                      >
                        <Heart
                          size={15}
                          className={wishlist.includes(p.id) ? "fill-[#C0392B] text-[#C0392B]" : "text-[#25211D]"}
                        />
                      </button>
                    </div>

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
          </div>
        </div>
      </main>

      <BrandValues />
      <Footer />
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  UserRound,
  Heart,
  X,
  Menu,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { catalogProducts, CatalogProduct } from "@/data/catalogProducts";

export const CATEGORY_NAV_ITEMS = [
  { label: "T-Shirts", href: "/category/t-shirts", description: "Oversized & essential tees" },
  { label: "Shirts", href: "/category/shirts", description: "Linen & casual shirts" },
  { label: "Hoodies", href: "/category/hoodies", description: "Cozy fleece & oversized hoodies" },
  { label: "Jeans", href: "/category/jeans", description: "Slim & straight denim" },
  { label: "Joggers", href: "/category/joggers", description: "Relaxed sweatpants & joggers" },
  { label: "Jackets", href: "/category/jackets", description: "Outerwear & blazers" },
  { label: "Accessories", href: "/category/accessories", description: "Caps & everyday essentials" },
];

const POPULAR_SEARCHES = [
  "Linen Shirt",
  "Oversized Tshirt",
  "Outerwear",
  "Dresses",
  "Pants",
];

export function Header() {
  const router = useRouter();

  // Search & Navigation States
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Client App States
  const [cartCount, setCartCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [user, setUser] = useState<{ name?: string } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close desktop dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle ESC key press & body scroll locking for Mobile Drawer
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setSearchOpen(false);
        setCategoriesOpen(false);
      }
    }
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Sync Cart, Wishlist, and User authentication state dynamically
  useEffect(() => {
    const syncState = () => {
      if (typeof window !== "undefined") {
        // Auth User check
        const token = localStorage.getItem("yugen_token");
        const storedUser = localStorage.getItem("yugen_user");
        if (token && storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            setUser({ name: "Account" });
          }
        } else if (token) {
          setUser({ name: "Account" });
        } else {
          setUser(null);
        }

        // Cart Count check
        const storedCart = localStorage.getItem("yugen_cart");
        if (storedCart) {
          try {
            const items = JSON.parse(storedCart);
            if (Array.isArray(items)) {
              const total = items.reduce(
                (sum: number, i: any) => sum + (i.quantity || 1),
                0
              );
              setCartCount(total);
            }
          } catch (e) {
            setCartCount(0);
          }
        } else {
          setCartCount(0);
        }

        // Wishlist Count check
        const storedWishlist = localStorage.getItem("yugen_wishlist");
        if (storedWishlist) {
          try {
            const items = JSON.parse(storedWishlist);
            if (Array.isArray(items)) {
              setWishlistCount(items.length);
            }
          } catch (e) {
            setWishlistCount(0);
          }
        } else {
          setWishlistCount(0);
        }
      }
    };

    syncState();
    window.addEventListener("storage", syncState);
    window.addEventListener("yugen-state-updated", syncState);
    return () => {
      window.removeEventListener("storage", syncState);
      window.removeEventListener("yugen-state-updated", syncState);
    };
  }, []);

  // Live Predictive Search Matches (max 4 suggestions)
  const matches: CatalogProduct[] = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return catalogProducts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q) ||
          p.gender.toLowerCase().includes(q)
      )
      .slice(0, 4);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchOpen(false);
    setMobileMenuOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    setSearchOpen(false);
    setMobileMenuOpen(false);
    router.push(`/search?q=${encodeURIComponent(tag)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F7F5F0]/95 backdrop-blur-md border-b border-[#463627]/15 transition-all">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between gap-6 relative">
        {/* 1. LOGO */}
        <Link
          href="/"
          className="wordmark !text-[#191816] !text-[36px] sm:!text-[42px] font-medium hover:opacity-90 transition-opacity flex-shrink-0"
          aria-label="YUGEN home"
        >
          YUGEN
        </Link>

        {/* 2. DESKTOP PRIMARY NAVIGATION */}
        <nav className="hidden lg:flex items-center space-x-7 text-[12px] font-normal tracking-wide text-[#25211D]" aria-label="Primary navigation">
          <Link href="/men" className="hover:opacity-100 opacity-85 transition-opacity">
            Men
          </Link>
          <Link href="/women" className="hover:opacity-100 opacity-85 transition-opacity">
            Women
          </Link>

          {/* Categories Dropdown */}
          <div className="relative" ref={categoriesRef}>
            <button
              onClick={() => setCategoriesOpen((prev) => !prev)}
              onMouseEnter={() => setCategoriesOpen(true)}
              className="inline-flex items-center gap-1 opacity-85 hover:opacity-100 transition-opacity"
              aria-expanded={categoriesOpen}
              aria-haspopup="true"
            >
              <span>Categories</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  categoriesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {categoriesOpen && (
              <div
                onMouseLeave={() => setCategoriesOpen(false)}
                className="absolute left-0 top-full mt-3 w-64 bg-[#F7F5F0] border border-[#463627]/20 rounded-xl shadow-xl p-3 text-[#25211D] z-50 animate-fadeIn"
              >
                <div className="text-[10px] font-bold text-[#756A5E] uppercase tracking-wider px-3 py-1 mb-1 border-b border-[#463627]/10">
                  Explore Categories
                </div>
                <div className="space-y-0.5 mt-1">
                  {CATEGORY_NAV_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setCategoriesOpen(false)}
                      className="block px-3 py-2 rounded-lg hover:bg-[#EAE6DD] transition-colors group"
                    >
                      <div className="text-xs font-medium text-[#25211D] group-hover:text-[#6B4A37]">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-[#756A5E]">
                        {item.description}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/new-arrivals" className="hover:opacity-100 opacity-85 transition-opacity">
            New Arrivals
          </Link>
          <Link href="/about" className="hover:opacity-100 opacity-85 transition-opacity">
            About Us
          </Link>
        </nav>

        {/* 3. DESKTOP & MOBILE UTILITY NAVIGATION */}
        <div className="flex items-center space-x-5 text-[12px] font-normal text-[#25211D]" ref={dropdownRef}>
          {/* Search Trigger */}
          <div className="relative">
            {!searchOpen ? (
              <button
                onClick={() => {
                  setSearchOpen(true);
                  setTimeout(() => inputRef.current?.focus(), 100);
                }}
                className="inline-flex items-center gap-1.5 opacity-85 hover:opacity-100 transition-opacity"
                aria-label="Open search"
              >
                <span>Search</span>
                <Search aria-hidden="true" size={15} strokeWidth={1.35} />
              </button>
            ) : (
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-[#EAE6DD] border border-[#463627]/30 rounded-full px-3 py-1 text-xs text-[#25211D] shadow-inner"
              >
                <Search size={13} className="text-[#756A5E] mr-1.5" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="bg-transparent border-0 outline-none w-36 sm:w-48 text-xs text-[#25211D] placeholder-[#756A5E]"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="text-[#756A5E] hover:text-[#25211D] mr-1"
                  >
                    <X size={13} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-[#756A5E] hover:text-[#25211D] ml-1"
                >
                  <X size={14} />
                </button>
              </form>
            )}

            {/* Instant Search Dropdown */}
            {searchOpen && (
              <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-[#F7F5F0] border border-[#463627]/20 rounded-xl shadow-2xl p-4 text-[#25211D] z-50 animate-fadeIn">
                {query.trim() ? (
                  <div>
                    <p className="eyebrow dark mb-3">
                      Matching Products ({matches.length})
                    </p>
                    {matches.length === 0 ? (
                      <div className="py-6 text-center text-xs text-[#756A5E]">
                        No instant matches for &ldquo;{query}&rdquo;.
                        <br />
                        <button
                          onClick={handleSearchSubmit}
                          className="mt-2 text-[#6B4A37] font-semibold underline text-[11px]"
                        >
                          Press Enter to search full catalog
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {matches.map((item) => (
                          <Link
                            key={item.id}
                            href={`/products/${item.slug}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#EAE6DD] transition-colors group"
                          >
                            <div className="w-10 h-12 relative bg-[#EAE6DD] rounded overflow-hidden flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-[#25211D] group-hover:text-[#6B4A37] truncate">
                                {item.name}
                              </p>
                              <p className="text-[10px] text-[#756A5E]">
                                {item.gender} • {item.category}
                              </p>
                            </div>
                            <span className="text-xs font-bold text-[#25211D]">
                              {item.formattedPrice}
                            </span>
                          </Link>
                        ))}
                        <button
                          onClick={handleSearchSubmit}
                          className="w-full text-center text-[11px] font-semibold text-[#6B4A37] hover:underline pt-2 border-t border-[#463627]/10 flex items-center justify-center space-x-1"
                        >
                          <span>View all results for &ldquo;{query}&rdquo;</span>
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-1.5 text-xs text-[#756A5E] mb-2.5">
                      <TrendingUp size={13} className="text-[#6B4A37]" />
                      <span className="eyebrow dark">Popular Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {POPULAR_SEARCHES.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          className="text-[11px] bg-[#EAE6DD] hover:bg-[#25211D] hover:text-white text-[#25211D] px-2.5 py-1 rounded-full transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            className="hidden sm:inline-flex items-center space-x-1.5 opacity-85 hover:opacity-100 transition-opacity relative"
            aria-label="View Wishlist"
          >
            <span>Wishlist</span>
            <Heart aria-hidden="true" className="w-3.5 h-3.5" />
            {wishlistCount > 0 && (
              <span className="bg-[#6B4A37] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Account / Profile Link */}
          <Link
            href={user ? "/profile" : "/login"}
            className="hidden sm:inline-flex items-center space-x-1.5 opacity-85 hover:opacity-100 transition-opacity"
            aria-label={user ? "User Profile" : "Login or Register"}
          >
            <span>{user ? user.name || "Profile" : "Account"}</span>
            <UserRound aria-hidden="true" className="w-3.5 h-3.5" />
          </Link>

          {/* Cart Link with Dynamic Count */}
          <Link
            href="/cart"
            className="inline-flex items-center space-x-1.5 opacity-85 hover:opacity-100 transition-opacity relative"
            aria-label={`Cart with ${cartCount} items`}
          >
            <span>Cart ({cartCount})</span>
            <ShoppingBag aria-hidden="true" className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Trigger Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center gap-1 text-xs uppercase font-medium border border-[#463627]/30 rounded-md px-2.5 py-1 text-[#25211D] hover:bg-[#EAE6DD] transition-colors"
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu"
            aria-controls="mobile-navigation-drawer"
          >
            <Menu size={15} />
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* 4. RESPONSIVE MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="fixed inset-0 z-50 flex"
        >
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Drawer Panel */}
          <div className="relative w-4/5 max-w-sm bg-[#F7F5F0] text-[#25211D] h-full shadow-2xl p-6 flex flex-col justify-between z-50 overflow-y-auto border-r border-[#463627]/20 animate-slideRight">
            <div>
              {/* Drawer Header: Logo + Close Button */}
              <div className="flex items-center justify-between pb-4 border-b border-[#463627]/15 mb-6">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="wordmark text-2xl"
                >
                  YUGEN
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-[#25211D] hover:bg-[#EAE6DD] transition-colors"
                  aria-label="Close mobile menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Search Input */}
              <form onSubmit={handleSearchSubmit} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search catalog..."
                    className="w-full bg-[#EAE6DD] border border-[#463627]/20 rounded-full py-2 pl-4 pr-10 text-xs text-[#25211D] placeholder-[#756A5E] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-2.5 text-[#756A5E]"
                    aria-label="Submit search"
                  >
                    <Search size={14} />
                  </button>
                </div>
              </form>

              {/* Mobile Navigation List */}
              <nav className="space-y-1 text-sm font-medium text-[#25211D]">
                <Link
                  href="/men"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg hover:bg-[#EAE6DD] transition-colors"
                >
                  Men
                </Link>

                <Link
                  href="/women"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg hover:bg-[#EAE6DD] transition-colors"
                >
                  Women
                </Link>

                {/* Categories Accordion inside Mobile Menu */}
                <div>
                  <button
                    onClick={() => setMobileCategoriesOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#EAE6DD] transition-colors text-left"
                  >
                    <span>Categories</span>
                    {mobileCategoriesOpen ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>

                  {mobileCategoriesOpen && (
                    <div className="ml-4 pl-2 border-l border-[#463627]/20 space-y-1 my-1">
                      {CATEGORY_NAV_ITEMS.map((cat) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-2 text-xs text-[#494139] hover:text-[#25211D] hover:bg-[#EAE6DD] rounded-md transition-colors"
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/products?sort=newest"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg hover:bg-[#EAE6DD] transition-colors"
                >
                  New Arrivals
                </Link>

                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg hover:bg-[#EAE6DD] transition-colors"
                >
                  About Us
                </Link>

                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#EAE6DD] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Heart size={16} />
                    <span>Wishlist</span>
                  </span>
                  {wishlistCount > 0 && (
                    <span className="bg-[#6B4A37] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  href={user ? "/profile" : "/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-[#EAE6DD] transition-colors"
                >
                  <UserRound size={16} />
                  <span>{user ? user.name || "Profile" : "Account / Login"}</span>
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#EAE6DD] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag size={16} />
                    <span>Cart</span>
                  </span>
                  <span className="bg-[#25211D] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {cartCount}
                  </span>
                </Link>
              </nav>
            </div>

            {/* Mobile Drawer Footer */}
            <div className="pt-6 border-t border-[#463627]/15 text-center text-xs text-[#756A5E]">
              <p className="font-light">Essence of simplicity.</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

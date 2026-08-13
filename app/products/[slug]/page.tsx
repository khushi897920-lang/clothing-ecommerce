"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  UserRound,
  ShieldCheck,
  Star,
  Truck,
  RotateCcw,
  Shield,
  Banknote,
  Minus,
  Plus,
  Ruler,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Check,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { CatalogProduct } from "@/data/catalogProducts";
import { productApi, cartApi, userApi, mapBackendProduct, colorNameToHex } from "@/lib/apiClient";
import { Header } from "@/components/yugen/Header";
import { BrandValues } from "@/components/yugen/BrandValues";
import { Footer } from "@/components/yugen/Footer";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params.slug as string) || "";

  // Dynamic Product & Variants State from Backend
  const [backendProduct, setBackendProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [cartError, setCartError] = useState<string>("");
  const [cartSuccess, setCartSuccess] = useState<boolean>(false);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  // Interactive States
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedColor, setSelectedColor] = useState<string>("Beige");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeThumb, setActiveThumb] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"description" | "details" | "delivery" | "reviews">("description");

  // Fetch real product by slug/ID on mount
  useEffect(() => {
    if (slug) {
      setLoading(true);
      setError("");
      setActiveThumb(0); // Reset thumbnail/showcase image selection on new page load!
      setQuantity(1);    // Reset quantity selection!
      productApi.getProductBySlug(slug).then(({ data, error: apiError }) => {
        if (data?.product) {
          setBackendProduct(data.product);
          const variants = data.product.variants || [];
          if (variants.length > 0) {
            setSelectedSize(variants[0].size || "M");
            setSelectedColor(variants[0].color || "Beige");
          }
        } else {
          setBackendProduct(null);
          setError(apiError || "Product not found");
        }
        setLoading(false);
      });
    }
  }, [slug]);

  // Fetch wishlist status
  useEffect(() => {
    if (backendProduct?.id) {
      userApi.getWishlist().then(({ data }) => {
        const list = data?.wishlist || data?.items;
        if (list && Array.isArray(list)) {
          const inWishlist = list.some((w: any) => (w.productId || w.product?.id) === backendProduct.id);
          setIsWishlisted(inWishlist);
        }
      });
    }
  }, [backendProduct?.id]);

  const product: any = useMemo(() => {
    return backendProduct ? mapBackendProduct(backendProduct) : null;
  }, [backendProduct]);

  // Calculate pricing & thumbnails from real mapped product
  const discountPercent = 20;
  const originalPrice = product ? (((product as any)?.priceNum || 40) * 1.25).toFixed(0) : "0";
  const img = product ? ((product as any)?.imageUrl || product?.image || "/ABOUT_BG.png") : "/ABOUT_BG.png";
  // Use real images array from mapper; fill to at least 1 image
  const productImages: string[] = (product as any)?.images?.length > 0
    ? (product as any).images
    : [img];
  const thumbnails = productImages;

  // Resolve dynamic colors and sizes from backend product variants
  const colorMap: any[] = useMemo(() => {
    if (!backendProduct?.variants) return [];
    const colors: Record<string, string> = {};
    backendProduct.variants.forEach((v: any) => {
      if (v.color) {
        colors[v.color] = colorNameToHex(v.color);
      }
    });
    return Object.entries(colors).map(([name, hex]) => ({ name, hex }));
  }, [backendProduct]);

  const availableSizes: string[] = useMemo(() => {
    if (!backendProduct?.variants) return [];
    return Array.from(
      new Set(
        backendProduct.variants
          .filter((v: any) => v.color === selectedColor)
          .map((v: any) => (v.size as string))
      )
    );
  }, [backendProduct, selectedColor]);

  // Dynamically keep selected size valid when selected color changes
  useEffect(() => {
    if (availableSizes.length > 0 && !availableSizes.includes(selectedSize)) {
      setSelectedSize(availableSizes[0]);
    }
  }, [selectedColor, availableSizes, selectedSize]);

  // Identify exact Variant ID from backend product variants
  const selectedVariant = useMemo(() => {
    if (!backendProduct?.variants) return null;
    return backendProduct.variants.find(
      (v: any) => v.size === selectedSize && v.color === selectedColor
    ) || null;
  }, [backendProduct, selectedSize, selectedColor]);

  const isOutOfStock = !selectedVariant || (selectedVariant.stockQuantity || 0) <= 0;

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product?.id) return;
    if (isWishlisted) {
      setIsWishlisted(false);
      await userApi.removeFromWishlist(product.id);
    } else {
      setIsWishlisted(true);
      await userApi.addToWishlist(product.id);
    }
    window.dispatchEvent(new Event("yugen-state-updated"));
  };

  const handleAddToCart = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("yugen_token") : null;
    if (!token) {
      router.push("/signin");
      return;
    }

    setCartError("");
    const variantId = selectedVariant?.id;
    if (!variantId && backendProduct?.id) {
      setCartError("Please select a valid size and color combination.");
      return;
    }

    const { data, error } = await cartApi.addToCart({
      variantId: variantId || product?.id,
      quantity,
    });

    if (error) {
      setCartError(error);
      return;
    }

    setCartSuccess(true);
    window.dispatchEvent(new Event("yugen-state-updated"));
    setTimeout(() => setCartSuccess(false), 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] text-[#25211D] font-sans antialiased flex flex-col justify-between">
        <Header />
        <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24 flex flex-col items-center justify-center flex-grow">
          <RefreshCw className="w-8 h-8 text-[#6B4A37] animate-spin mb-4" />
          <p className="text-sm font-medium text-[#756A5E]">Loading product details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] text-[#25211D] font-sans antialiased flex flex-col justify-between">
        <Header />
        <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24 flex flex-col items-center justify-center flex-grow">
          <p className="text-2xl font-normal text-red-700 mb-2 uppercase" style={{ fontFamily: '"Poiret One", sans-serif' }}>
            Product Not Found
          </p>
          <p className="text-[12px] text-[#756A5E] mb-6">{error || "The requested product could not be loaded."}</p>
          <Link href="/products" className="bg-[#25211D] text-white text-[11px] px-6 py-2.5 rounded-full font-medium uppercase tracking-wider">
            Back to Products
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#25211D] font-sans antialiased">
      <Header />

      {/* Main Container */}
      <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
        {/* Breadcrumb */}
        <nav className="text-[11px] text-[#756A5E] mb-8 flex items-center space-x-2">
          <Link href="/" className="hover:text-[#25211D] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#25211D] transition-colors">
            {product.gender || "Catalog"}
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#25211D] transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#25211D] font-medium">{product.name}</span>
        </nav>

        {/* Success Alert Banner */}
        {cartSuccess && (
          <div className="mb-6 p-4 bg-[#6B4A37]/10 border border-[#6B4A37]/30 text-[#6B4A37] rounded-lg text-xs font-medium flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Added &quot;{product.name}&quot; ({selectedSize}, {selectedColor}) to your cart!</span>
            </div>
            <Link href="/cart" className="underline font-bold uppercase text-[10px]">
              View Cart
            </Link>
          </div>
        )}

        {/* Product Details Section (Two Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Left Column: Image Showcase & Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Main Stage Image */}
            <div className="relative w-full aspect-[4/5] bg-[#EAE6DD] rounded-xl overflow-hidden group shadow-xs">
              {/* Discount Badge */}
              <span className="absolute top-4 left-4 z-10 bg-[#C0392B] text-white text-[11px] font-bold px-2.5 py-1 rounded">
                -{discountPercent}%
              </span>

              {/* Maximize Button */}
              <button
                aria-label="Maximize image"
                className="absolute top-4 right-4 z-10 p-2 bg-[#F7F5F0]/80 hover:bg-[#F7F5F0] rounded-full backdrop-blur-md text-[#25211D] transition-transform hover:scale-110"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Next/Prev Carousel Arrows */}
              <button
                onClick={() => setActiveThumb((prev) => (prev > 0 ? prev - 1 : thumbnails.length - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#F7F5F0]/80 hover:bg-[#F7F5F0] rounded-full backdrop-blur-md text-[#25211D] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveThumb((prev) => (prev < thumbnails.length - 1 ? prev + 1 : 0))}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#F7F5F0]/80 hover:bg-[#F7F5F0] rounded-full backdrop-blur-md text-[#25211D] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <Image
                src={thumbnails[activeThumb]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Thumbnail Strip (5 thumbs) */}
            <div className="grid grid-cols-5 gap-3">
              {thumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveThumb(idx)}
                  className={`relative aspect-[4/5] bg-[#EAE6DD] rounded-lg overflow-hidden border-2 transition-all ${
                    activeThumb === idx
                      ? "border-[#25211D] scale-95"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={thumb}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    sizes="15vw"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Info & Buy Box (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div>
              {/* Product Title matching Landing Page typography */}
              <h1
                className="text-3xl sm:text-4xl font-normal text-[#25211D] uppercase leading-tight mb-2 tracking-normal"
                style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
              >
                {product.name}
              </h1>

              {/* Star Rating & Review Count */}
              <div className="flex items-center space-x-2 mb-4 text-[12px]">
                <div className="flex items-center text-[#B48C5A]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current text-[#B48C5A]/50" />
                </div>
                <span className="font-bold text-[#25211D]">4.6</span>
                <span className="text-[#756A5E]">(128 reviews)</span>
              </div>

              {/* Pricing Box */}
              <div className="flex items-baseline space-x-3 mb-2">
                <span className="text-2xl font-bold text-[#C0392B]">
                  {product.price || product.formattedPrice}
                </span>
                <span className="text-sm text-[#8A847C] line-through">
                  ₹{originalPrice}
                </span>
                <span className="bg-[#C0392B]/10 text-[#C0392B] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {discountPercent}% OFF
                </span>
              </div>
              <p className="text-[11px] text-[#756A5E] mb-6">Inclusive of all taxes</p>

              {/* Product Description */}
              <p className="text-[13px] text-[#494139] leading-relaxed mb-6">
                Crafted from premium {selectedColor.toLowerCase()} fabrics, this {product.name.toLowerCase()} is breathable, lightweight, and tailored for everyday elegance. A timeless essential for your quiet-luxury wardrobe.
              </p>
            </div>

            {/* Color Selector */}
            <div className="border-t border-[#463627]/12 pt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="eyebrow dark">
                  Color: <strong className="font-bold">{selectedColor}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-3">
                {colorMap.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedColor(c.name);
                      // Auto select first available size for this color if current size is not available
                      const matches = backendProduct?.variants?.filter((v: any) => v.color === c.name) || [];
                      if (matches.length > 0 && !matches.some((v: any) => v.size === selectedSize)) {
                        setSelectedSize(matches[0].size);
                      }
                    }}
                    className={`w-8 h-8 rounded-full border border-black/15 transition-all ${
                      selectedColor === c.name
                        ? "ring-2 ring-offset-2 ring-[#25211D] scale-110"
                        : "hover:scale-105 opacity-85"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="border-t border-[#463627]/12 pt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="eyebrow dark">
                  Size: <strong className="font-bold">{selectedSize}</strong>
                </span>
                <button className="text-[11px] text-[#756A5E] hover:text-[#25211D] flex items-center space-x-1 underline">
                  <Ruler className="w-3 h-3" />
                  <span>Size Guide</span>
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-[11px] font-medium border rounded-md transition-colors ${
                      selectedSize === size
                        ? "bg-[#25211D] text-white border-[#25211D]"
                        : "bg-[#F7F5F0] text-[#494139] border-[#463627]/20 hover:border-[#25211D]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Buy Actions */}
            <div className="border-t border-[#463627]/12 pt-6 space-y-4">
              <div className="flex items-center space-x-4">
                <span className="eyebrow dark">Quantity:</span>
                <div className="flex items-center border border-[#463627]/20 rounded-md bg-[#FBFAF6]">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="p-2 text-[#756A5E] hover:text-[#25211D] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold text-[#25211D]">{quantity}</span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="p-2 text-[#756A5E] hover:text-[#25211D] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 text-white text-xs font-semibold py-3.5 px-6 rounded-md uppercase tracking-wider transition-colors shadow-md flex items-center justify-center space-x-2 ${
                    isOutOfStock
                      ? "bg-gray-400 cursor-not-allowed shadow-none"
                      : "bg-[#25211D] hover:bg-[#38342F]"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`p-3.5 border rounded-md transition-colors flex items-center justify-center space-x-2 text-xs font-medium ${
                    isWishlisted
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-[#FBFAF6] text-[#25211D] border-[#463627]/20 hover:border-[#25211D]"
                  }`}
                >
                  <Heart className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} />
                  <span className="hidden sm:inline">Add to Wishlist</span>
                </button>
              </div>
              {cartError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-700 rounded text-xs font-medium">
                  {cartError}
                </div>
              )}
            </div>

            {/* Service Guarantee Banner */}
            <div className="grid grid-cols-2 gap-3 border-t border-[#463627]/12 pt-6 text-[11px] text-[#494139]">
              <div className="flex items-center space-x-2 bg-[#FBFAF6] p-2.5 rounded-lg border border-[#463627]/10">
                <Truck className="w-4 h-4 text-[#6B4A37]" />
                <div>
                  <p className="font-bold text-[#25211D]">Free Shipping</p>
                  <p className="text-[10px] text-[#756A5E]">On orders above $70</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-[#FBFAF6] p-2.5 rounded-lg border border-[#463627]/10">
                <RotateCcw className="w-4 h-4 text-[#6B4A37]" />
                <div>
                  <p className="font-bold text-[#25211D]">Easy Returns</p>
                  <p className="text-[10px] text-[#756A5E]">14 days return policy</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-[#FBFAF6] p-2.5 rounded-lg border border-[#463627]/10">
                <Shield className="w-4 h-4 text-[#6B4A37]" />
                <div>
                  <p className="font-bold text-[#25211D]">Secure Payment</p>
                  <p className="text-[10px] text-[#756A5E]">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-[#FBFAF6] p-2.5 rounded-lg border border-[#463627]/10">
                <Banknote className="w-4 h-4 text-[#6B4A37]" />
                <div>
                  <p className="font-bold text-[#25211D]">Cash on Delivery</p>
                  <p className="text-[10px] text-[#756A5E]">Orders above $50</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Tabbed Content Section (Description, Details, Delivery, Reviews) */}
        <div className="border-t border-[#463627]/15 pt-8 mb-16">
          <div className="flex border-b border-[#463627]/15 space-x-8 mb-8 overflow-x-auto">
            {(["description", "details", "delivery", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "border-[#25211D] text-[#25211D]"
                    : "border-transparent text-[#756A5E] hover:text-[#25211D]"
                }`}
              >
                {tab === "description" && "Description"}
                {tab === "details" && "Product Details"}
                {tab === "delivery" && "Delivery Information"}
                {tab === "reviews" && "Reviews (128)"}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-[#FBFAF6] p-6 lg:p-8 rounded-xl border border-[#463627]/12">
            {activeTab === "description" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-[#494139] leading-relaxed">
                <div>
                  <p className="mb-4">
                    Minimal, breathable, and effortlessly stylish — this {product.name.toLowerCase()} is your go-to for a relaxed yet polished look. Designed with a loose fit, button-down front, and classic collar.
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-[#25211D]">
                    <li>Relaxed fit for all-day comfort</li>
                    <li>Made from 100% premium woven fabric</li>
                    <li>Structured button-down front</li>
                    <li>Full sleeves with buttoned cuffs</li>
                    <li>Single chest pocket detail</li>
                    <li>Slightly curved hemline</li>
                  </ul>
                </div>
                <div>
                  <h4 className="eyebrow dark mb-3">Product Specifications</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-[#463627]/10 py-1.5">
                      <span className="text-[#756A5E]">Material</span>
                      <span className="font-medium text-[#25211D]">100% Cotton / Linen</span>
                    </div>
                    <div className="flex justify-between border-b border-[#463627]/10 py-1.5">
                      <span className="text-[#756A5E]">Fit</span>
                      <span className="font-medium text-[#25211D]">{product.fit || "Regular Fit"}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#463627]/10 py-1.5">
                      <span className="text-[#756A5E]">Pattern</span>
                      <span className="font-medium text-[#25211D]">{product.pattern || "Solid"}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-[#756A5E]">Care</span>
                      <span className="font-medium text-[#25211D]">Machine wash cold</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "details" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#494139]">
                <div>
                  <h4 className="eyebrow dark mb-4">Item Details</h4>
                  <p className="mb-2">SKU: <strong className="text-[#25211D]">{product.sku}</strong></p>
                  <p className="mb-2">Audience: <strong className="text-[#25211D]">{product.gender}</strong></p>
                  <p className="mb-2">Sub-Type: <strong className="text-[#25211D]">{product.subType}</strong></p>
                </div>
                <div>
                  <h4 className="eyebrow dark mb-4">Stock &amp; Availability</h4>
                  <p className="mb-2">Stock Status: <strong className="text-[#25211D]">{product.inStock ? "In Stock (Ready to Ship)" : "Backorder"}</strong></p>
                  <p className="mb-2">Quantity Available: <strong className="text-[#25211D]">{product.stockQuantity} units</strong></p>
                </div>
              </div>
            )}

            {activeTab === "delivery" && (
              <div className="text-xs text-[#494139] space-y-3">
                <h4 className="eyebrow dark mb-2">Delivery &amp; Shipping Rates</h4>
                <p>Standard Delivery: 3-5 business days ($5.00 or free on orders over $70).</p>
                <p>Express Shipping: 1-2 business days ($15.00).</p>
                <p>International Express: 5-8 business days (duties included at checkout).</p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                {/* Rating Aggregate & Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[#463627]/12 mb-8">
                  <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-5xl font-bold text-[#25211D] mb-1">4.6</span>
                    <div className="flex text-[#B48C5A] mb-1">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current text-[#B48C5A]/40" />
                    </div>
                    <span className="text-[11px] text-[#756A5E]">Based on 128 reviews</span>
                  </div>

                  {/* Rating Bars */}
                  <div className="space-y-1.5 text-[11px] text-[#756A5E]">
                    <div className="flex items-center space-x-2">
                      <span>5 ★</span>
                      <div className="flex-1 h-2 bg-[#EAE6DD] rounded-full overflow-hidden">
                        <div className="w-[70%] h-full bg-[#B48C5A]" />
                      </div>
                      <span>88</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>4 ★</span>
                      <div className="flex-1 h-2 bg-[#EAE6DD] rounded-full overflow-hidden">
                        <div className="w-[20%] h-full bg-[#B48C5A]" />
                      </div>
                      <span>24</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>3 ★</span>
                      <div className="flex-1 h-2 bg-[#EAE6DD] rounded-full overflow-hidden">
                        <div className="w-[8%] h-full bg-[#B48C5A]" />
                      </div>
                      <span>10</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>2 ★</span>
                      <div className="flex-1 h-2 bg-[#EAE6DD] rounded-full overflow-hidden">
                        <div className="w-[3%] h-full bg-[#B48C5A]" />
                      </div>
                      <span>4</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <button className="bg-[#25211D] text-white text-xs font-semibold px-6 py-3 rounded-md uppercase tracking-wider shadow-sm">
                      Write a Review
                    </button>
                  </div>
                </div>

                {/* Review Cards */}
                <div className="space-y-6">
                  <div className="border-b border-[#463627]/10 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-[#25211D]">Ananya Sharma</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                          Verified Buyer
                        </span>
                      </div>
                      <span className="text-[10px] text-[#8A847C]">May 20, 2026</span>
                    </div>
                    <div className="flex text-[#B48C5A] mb-1.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <p className="text-xs text-[#494139] leading-relaxed">
                      The fabric is so soft and breathable. Perfect for summer and looks super elegant!
                    </p>
                  </div>

                  <div className="border-b border-[#463627]/10 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-[#25211D]">Priya Mehta</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                          Verified Buyer
                        </span>
                      </div>
                      <span className="text-[10px] text-[#8A847C]">May 15, 2026</span>
                    </div>
                    <div className="flex text-[#B48C5A] mb-1.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current text-[#B48C5A]/40" />
                    </div>
                    <p className="text-xs text-[#494139] leading-relaxed">
                      Loved the color and fit. It&apos;s slightly loose which makes it very comfortable.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3. Brand Values Banner */}
      <BrandValues />

      {/* 4. YUGEN Landing Page Footer */}
      <Footer />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingBag,
  UserRound,
  ShieldCheck,
  X,
  Trash2,
  Check,
  ArrowRight,
  Globe2,
  Leaf,
  Sparkles,
  Truck,
} from "lucide-react";
import { CatalogProduct } from "@/data/catalogProducts";
import { userApi, cartApi, mapBackendProduct } from "@/lib/apiClient";
import { useAuth } from "@/lib/useAuth";
import { Header } from "@/components/yugen/Header";
import { BrandValues } from "@/components/yugen/BrandValues";
import { Footer } from "@/components/yugen/Footer";

export default function WishlistPage() {
  const { authState } = useAuth(true);
  const [wishlistItems, setWishlistItems] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string>("");

  const loadWishlist = async () => {
    setLoading(true);
    const { data } = await userApi.getWishlist();
    const list = data?.wishlist || data?.items;
    if (list && Array.isArray(list)) {
      const items = list.map((item: any) => mapBackendProduct(item.product) || item.product);
      setWishlistItems(items.filter(Boolean));
    } else {
      setWishlistItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authState !== "AUTHENTICATED") return;
    loadWishlist();
  }, [authState]);

  if (authState === "CHECKING") {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center text-sm font-medium text-[#25211D]">
        Checking authentication...
      </div>
    );
  }

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Remove single item from wishlist
  const handleRemove = async (productId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
    showToast("Item removed from your wishlist.");
    await userApi.removeFromWishlist(productId);
    window.dispatchEvent(new Event("yugen-state-updated"));
  };

  // Move single item to cart
  const handleMoveToCart = async (product: CatalogProduct) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
    showToast(`Moved "${product.name}" to your shopping cart!`);
    await userApi.removeFromWishlist(product.id);
    const variantId = (product as any).variants?.[0]?.id || product.id;
    await cartApi.addToCart({ variantId, quantity: 1 });
    window.dispatchEvent(new Event("yugen-state-updated"));
  };

  // Move ALL items to cart
  const handleMoveAllToCart = async () => {
    if (wishlistItems.length === 0) return;
    const current = [...wishlistItems];
    setWishlistItems([]);
    showToast("All items moved to your shopping cart!");

    for (const item of current) {
      await userApi.removeFromWishlist(item.id);
      const variantId = (item as any).variants?.[0]?.id || item.id;
      await cartApi.addToCart({ variantId, quantity: 1 });
    }
    window.dispatchEvent(new Event("yugen-state-updated"));
  };

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
          <span className="text-[#25211D] font-medium">Wishlist</span>
        </nav>

        {/* Feedback Toast Notification */}
        {toastMessage && (
          <div className="mb-6 p-3.5 bg-[#25211D] text-white rounded-lg text-xs font-medium flex items-center justify-between shadow-lg animate-fadeIn">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-[#B48C5A]" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage("")} className="text-[#756A5E] hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Page Title & Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-[#463627]/15 pb-6">
          <div>
            <h1
              className="text-[40px] sm:text-[54px] font-normal text-[#25211D] leading-tight tracking-normal mb-1 flex items-center gap-3"
              style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
            >
              <span>My Wishlist</span>
              <span className="text-3xl text-red-500">❤️</span>
            </h1>
            <p className="eyebrow text-[#756A5E]">
              {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <button
              onClick={handleMoveAllToCart}
              className="inline-flex items-center space-x-2 bg-[#FBFAF6] border border-[#463627]/20 hover:border-[#25211D] text-[#25211D] text-xs font-medium px-5 py-2.5 rounded-md transition-colors shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Move All to Cart</span>
            </button>
          )}
        </div>

        {/* Wishlist Items Grid OR Empty State */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {wishlistItems.map((product: any) => {
              const priceVal = product.priceNum || parseFloat((product.price || "0").replace(/[^0-9.]/g, "")) || 40;
              const originalPrice = `₹${(priceVal * 1.25).toFixed(0)}`;
              const discountPercent = 20;

              return (
                <article
                  key={product.id}
                  className="bg-[#FBFAF6] rounded-xl border border-[#463627]/12 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="p-4 flex gap-4">
                    {/* Image Box */}
                    <Link
                      href={`/products/${product.slug || product.id}`}
                      className="w-36 h-48 bg-[#EAE6DD] rounded-lg overflow-hidden relative flex-shrink-0 block"
                    >
                      <Image
                        src={product.imageUrl || product.image || "/ABOUT_BG.png"}
                        alt={product.name || "Product"}
                        fill
                        sizes="150px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Info & Options */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        {/* Remove 'X' top right button */}
                        <div className="flex items-start justify-between">
                          <Link href={`/products/${product.slug || product.id}`}>
                            <h3 className="text-xs font-semibold text-[#25211D] hover:underline truncate pr-2">
                              {product.name}
                            </h3>
                          </Link>
                          <button
                            onClick={() => handleRemove(product.id)}
                            aria-label="Remove item"
                            className="w-6 h-6 rounded-full border border-[#463627]/20 flex items-center justify-center text-[#756A5E] hover:text-red-500 hover:border-red-500 transition-colors flex-shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[10px] text-[#756A5E] mb-2">{product.gender || "Unisex"}</p>

                        {/* Pricing */}
                        <div className="flex items-baseline space-x-2 mb-3">
                          <span className="text-sm font-bold text-[#25211D]">
                            {product.price || `₹${priceVal}`}
                          </span>
                          <span className="text-[11px] text-[#8A847C] line-through">
                            {originalPrice}
                          </span>
                        </div>

                        {/* Color Selection */}
                        <div className="mb-2">
                          <p className="text-[10px] text-[#756A5E] mb-1">
                            Color: <span className="font-medium text-[#25211D]">{product.color || "Default"}</span>
                          </p>
                          <div className="flex items-center space-x-1.5">
                            {(product.swatches || ["#25211D"]).map((hex: string, idx: number) => (
                              <span
                                key={idx}
                                style={{ backgroundColor: hex }}
                                className={`w-3.5 h-3.5 rounded-full border border-black/10 ${
                                  idx === 0 ? "ring-1 ring-offset-1 ring-[#25211D]" : ""
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Size Detail */}
                        <p className="text-[10px] text-[#756A5E]">
                          Size: <span className="font-medium text-[#25211D]">{product.sizes[0] || "M"}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Buttons */}
                  <div className="p-4 pt-0 space-y-2">
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="w-full bg-[#25211D] hover:bg-[#38342F] text-white text-xs font-semibold py-2.5 rounded-md uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center space-x-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="w-full bg-[#F7F5F0] hover:bg-[#EAE6DD] border border-[#463627]/20 text-[#25211D] text-xs font-medium py-2 rounded-md transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* 2. Exact "Your wishlist is empty" Empty State Card */
          <div className="bg-[#FBFAF6] rounded-2xl border border-[#463627]/12 p-8 lg:p-14 mb-16 flex flex-col md:flex-row items-center justify-center gap-10 text-center md:text-left shadow-xs">
            {/* Heart & Bag Illustration Box */}
            <div className="w-56 h-56 bg-[#EAE6DD] rounded-full flex items-center justify-center relative shadow-inner flex-shrink-0">
              <Heart className="w-24 h-24 text-[#6B4A37] stroke-[1.2] fill-[#6B4A37]/10" />
              <div className="absolute bottom-4 right-4 bg-white p-3 rounded-2xl shadow-md border border-[#463627]/15">
                <ShoppingBag className="w-8 h-8 text-[#25211D]" />
              </div>
            </div>

            {/* Empty Copy & Action */}
            <div className="space-y-4 max-w-md">
              <h2
                className="text-3xl sm:text-4xl font-normal text-[#25211D] uppercase tracking-normal"
                style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
              >
                Your wishlist is empty
              </h2>
              <p className="text-xs text-[#756A5E] leading-relaxed">
                Looks like you haven&apos;t saved anything yet. Explore our quiet-luxury collection and find something you love.
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-block bg-[#25211D] hover:bg-[#38342F] text-white text-xs font-semibold px-8 py-3.5 rounded-md uppercase tracking-wider transition-colors shadow-md"
                >
                  Explore Products
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. Exact YUGEN Brand Values Banner */}
      <BrandValues />

      {/* 4. Exact YUGEN Landing Page Footer */}
      <Footer />
    </div>
  );
}

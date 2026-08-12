"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  UserRound,
  ShieldCheck,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  Lock,
  Tag,
  Check,
  Truck,
  RotateCcw,
  Shield,
  X,
} from "lucide-react";
import { catalogProducts, CatalogProduct } from "@/data/catalogProducts";
import { Header } from "@/components/yugen/Header";
import { BrandValues } from "@/components/yugen/BrandValues";
import { Footer } from "@/components/yugen/Footer";

export interface CartItem {
  product: CatalogProduct;
  size: string;
  color: string;
  colorHex: string;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();

  // Initial cart populated with 5 sample items from dataset matching the screenshot
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistCount, setWishlistCount] = useState<number>(6);
  const [couponCode, setCouponCode] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [couponApplied, setCouponApplied] = useState<string>("");
  const [couponError, setCouponError] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string>("");

  useEffect(() => {
    if (catalogProducts && catalogProducts.length >= 4) {
      const initial: CartItem[] = [
        {
          product: catalogProducts[0], // Linen Shirt
          size: "M",
          color: "Sky Blue",
          colorHex: "#3B5998",
          quantity: 1,
        },
        {
          product: catalogProducts[25] || catalogProducts[1], // Floral Maxi Dress
          size: "S",
          color: "Peach",
          colorHex: "#E8A7B8",
          quantity: 2,
        },
        {
          product: catalogProducts[5] || catalogProducts[2], // Oversized Cotton Tee
          size: "L",
          color: "Olive Green",
          colorHex: "#7B8660",
          quantity: 1,
        },
        {
          product: catalogProducts[13] || catalogProducts[3], // Relaxed Fit Trousers / Backpack
          size: "One Size",
          color: "Sand",
          colorHex: "#B9A58D",
          quantity: 1,
        },
      ];
      setCartItems(initial);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Quantity updates
  const updateQuantity = (index: number, delta: number) => {
    setCartItems((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index].quantity = newQty;
      return updated;
    });
  };

  // Remove single item
  const handleRemove = (index: number) => {
    const item = cartItems[index];
    setCartItems((prev) => prev.filter((_, i) => i !== index));
    showToast(`Removed "${item.product.name}" from your cart.`);
  };

  // Move single item to wishlist
  const handleMoveToWishlist = (index: number) => {
    const item = cartItems[index];
    setCartItems((prev) => prev.filter((_, i) => i !== index));
    setWishlistCount((prev) => prev + 1);
    showToast(`Moved "${item.product.name}" to your wishlist ♡`);
  };

  // Calculations
  const totalItemCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    return (subtotal * discountPercent) / 100;
  }, [subtotal, discountPercent]);

  const shippingCost = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal > 70 ? 0 : 5.99;
  }, [subtotal]);

  const estimatedTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + shippingCost);
  }, [subtotal, discountAmount, shippingCost]);

  // Apply Coupon Code
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    if (code === "YUGEN10" || code === "WELCOME10") {
      setDiscountPercent(10);
      setCouponApplied(code);
      showToast("Coupon 'YUGEN10' applied: 10% OFF discount!");
    } else if (code === "YUGEN20" || code === "VIP20") {
      setDiscountPercent(20);
      setCouponApplied(code);
      showToast("Coupon 'YUGEN20' applied: 20% OFF discount!");
    } else {
      setCouponError("Invalid promo code. Try 'YUGEN10' for 10% off.");
    }
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
          <span className="text-[#25211D] font-medium">Cart</span>
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

        {/* Page Title & Subtitle Bar */}
        <div className="mb-8 border-b border-[#463627]/15 pb-6">
          <h1
            className="text-[40px] sm:text-[54px] font-normal text-[#25211D] leading-tight tracking-normal mb-1"
            style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
          >
            Your Cart ({totalItemCount})
          </h1>
          <p className="eyebrow text-[#756A5E]">
            Review your items and proceed to checkout
          </p>
        </div>

        {/* Main Content (Items Table + Order Summary) */}
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
            {/* Left Column: Cart Items Table (8 cols) */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div className="bg-[#FBFAF6] border border-[#463627]/12 rounded-xl overflow-hidden shadow-xs mb-6">
                {/* Desktop Table Header */}
                <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-[#EAE6DD]/60 border-b border-[#463627]/12 text-[11px] font-bold text-[#25211D] uppercase tracking-wider">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-1 text-center">Size</div>
                  <div className="col-span-2 text-center">Color</div>
                  <div className="col-span-1 text-right">Price</div>
                  <div className="col-span-1 text-center">Qty</div>
                  <div className="col-span-1 text-right">Total</div>
                  <div className="col-span-1 text-center">Action</div>
                </div>

                {/* Item Rows */}
                <div className="divide-y divide-[#463627]/10">
                  {cartItems.map((item, idx) => {
                    const itemTotal = (item.product.price * item.quantity).toFixed(2);
                    return (
                      <div
                        key={`${item.product.id}-${idx}`}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 sm:px-6 sm:py-5 items-center hover:bg-[#EAE6DD]/30 transition-colors"
                      >
                        {/* Product Info Column */}
                        <div className="sm:col-span-5 flex items-center space-x-4">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="w-16 h-20 bg-[#EAE6DD] rounded-md overflow-hidden relative flex-shrink-0 block"
                          >
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </Link>
                          <div>
                            <Link href={`/products/${item.product.slug}`}>
                              <h3 className="text-xs font-bold text-[#25211D] hover:underline mb-1">
                                {item.product.name}
                              </h3>
                            </Link>
                            <p className="text-[11px] font-bold text-[#25211D] sm:hidden mb-1">
                              {item.product.formattedPrice}
                            </p>
                            <button
                              onClick={() => handleMoveToWishlist(idx)}
                              className="text-[10px] text-[#756A5E] hover:text-[#25211D] flex items-center space-x-1"
                            >
                              <span>Move to wishlist</span>
                              <Heart className="w-3 h-3 text-[#6B4A37]" />
                            </button>
                          </div>
                        </div>

                        {/* Size Column */}
                        <div className="sm:col-span-1 text-center text-xs font-medium text-[#25211D] flex sm:block justify-between">
                          <span className="sm:hidden text-[#756A5E]">Size:</span>
                          <span>{item.size}</span>
                        </div>

                        {/* Color Column */}
                        <div className="sm:col-span-2 text-center flex sm:justify-center items-center space-x-1.5 text-xs text-[#25211D] justify-between">
                          <span className="sm:hidden text-[#756A5E]">Color:</span>
                          <div className="flex items-center space-x-1.5">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs inline-block"
                              style={{ backgroundColor: item.colorHex }}
                            />
                            <span className="text-[11px] text-[#494139]">{item.color}</span>
                          </div>
                        </div>

                        {/* Unit Price Column */}
                        <div className="sm:col-span-1 text-right text-xs font-medium text-[#25211D] hidden sm:block">
                          {item.product.formattedPrice}
                        </div>

                        {/* Quantity Stepper Column */}
                        <div className="sm:col-span-1 text-center flex sm:justify-center items-center justify-between">
                          <span className="sm:hidden text-[#756A5E] text-xs">Quantity:</span>
                          <div className="flex items-center border border-[#463627]/20 rounded bg-[#F7F5F0]">
                            <button
                              onClick={() => updateQuantity(idx, -1)}
                              className="p-1 text-[#756A5E] hover:text-[#25211D]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-[#25211D]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(idx, 1)}
                              className="p-1 text-[#756A5E] hover:text-[#25211D]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Item Total Column */}
                        <div className="sm:col-span-1 text-right text-xs font-bold text-[#25211D] flex sm:block justify-between">
                          <span className="sm:hidden text-[#756A5E] font-normal">Subtotal:</span>
                          <span>${itemTotal}</span>
                        </div>

                        {/* Trash Action Button */}
                        <div className="sm:col-span-1 text-center flex justify-end sm:justify-center">
                          <button
                            onClick={() => handleRemove(idx)}
                            aria-label="Remove item"
                            className="p-1.5 text-[#756A5E] hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Continue Shopping Button */}
              <div>
                <Link
                  href="/products"
                  className="inline-flex items-center space-x-2 bg-[#FBFAF6] border border-[#463627]/20 hover:border-[#25211D] text-[#25211D] text-xs font-medium px-5 py-2.5 rounded-md transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Order Summary Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#FBFAF6] border border-[#463627]/12 rounded-xl p-6 shadow-xs space-y-6">
                <h2
                  className="text-2xl font-normal text-[#25211D] uppercase border-b border-[#463627]/12 pb-4 tracking-normal"
                  style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
                >
                  Order Summary
                </h2>

                {/* Subtotal & Shipping Breakdown */}
                <div className="space-y-3 text-xs text-[#494139]">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItemCount} items)</span>
                    <span className="font-bold text-[#25211D]">${subtotal.toFixed(2)}</span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Discount ({couponApplied} - {discountPercent}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-[#756A5E]">
                      {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="border-t border-[#463627]/12 pt-3 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-[#25211D]">Estimated Total</span>
                    <span className="text-xl font-bold text-[#25211D]">
                      ${estimatedTotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#756A5E] text-right">Taxes included</p>
                </div>

                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2 border-t border-[#463627]/12">
                  <label className="eyebrow dark block">Coupon Code (Optional)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Enter promo code (e.g. YUGEN10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-[#F7F5F0] border border-[#463627]/20 rounded-md py-2 px-3 text-xs text-[#25211D] focus:outline-none focus:border-[#25211D]"
                    />
                    <button
                      type="submit"
                      className="bg-[#25211D] hover:bg-[#38342F] text-white text-xs font-semibold px-4 py-2 rounded-md uppercase tracking-wider transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-red-600 font-medium">{couponError}</p>
                  )}
                  {couponApplied && (
                    <p className="text-[11px] text-emerald-700 font-medium flex items-center space-x-1">
                      <Tag className="w-3 h-3" />
                      <span>Code &apos;{couponApplied}&apos; active!</span>
                    </p>
                  )}
                </form>

                {/* Proceed to Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full bg-[#25211D] hover:bg-[#38342F] text-white text-xs font-semibold py-3.5 rounded-md uppercase tracking-wider transition-colors shadow-md flex items-center justify-center space-x-2 text-center"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Proceed to Checkout</span>
                </Link>

                {/* Trust Features inside sidebar */}
                <div className="space-y-2.5 pt-4 border-t border-[#463627]/12 text-[11px] text-[#494139]">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-[#6B4A37]" />
                    <span>Free Shipping on orders above $70</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="w-4 h-4 text-[#6B4A37]" />
                    <span>14 days easy return policy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-[#6B4A37]" />
                    <span>100% secure encrypted checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 2. Exact "Your cart is empty" Empty State Card */
          <div className="bg-[#FBFAF6] rounded-2xl border border-[#463627]/12 p-8 lg:p-14 mb-16 flex flex-col md:flex-row items-center justify-center gap-10 text-center md:text-left shadow-xs">
            {/* Shopping Bag Illustration Box */}
            <div className="w-56 h-56 bg-[#EAE6DD] rounded-full flex items-center justify-center relative shadow-inner flex-shrink-0">
              <ShoppingBag className="w-24 h-24 text-[#6B4A37] stroke-[1.2]" />
            </div>

            {/* Empty Copy & Action */}
            <div className="space-y-4 max-w-md">
              <h2
                className="text-3xl sm:text-4xl font-normal text-[#25211D] uppercase tracking-normal"
                style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
              >
                Your cart is empty
              </h2>
              <p className="text-xs text-[#756A5E] leading-relaxed">
                Looks like you haven&apos;t added anything to your shopping cart yet. Explore our quiet-luxury collection and discover timeless essentials.
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

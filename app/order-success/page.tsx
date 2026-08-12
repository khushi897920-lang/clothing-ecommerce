"use client";

import React, { useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  UserRound,
  ShieldCheck,
  Check,
  PackageCheck,
  Truck,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { catalogProducts } from "@/data/catalogProducts";
import { Header } from "@/components/yugen/Header";
import { BrandValues } from "@/components/yugen/BrandValues";
import { Footer } from "@/components/yugen/Footer";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const rawOrderId = searchParams.get("orderId");

  const orderId = useMemo(() => {
    return rawOrderId || "YG-984028";
  }, [rawOrderId]);

  // Purchased items dataset (matching screenshot)
  const purchasedItems = useMemo(() => {
    return [
      {
        product: catalogProducts[0],
        gender: "Men",
        color: "Sky Blue",
        color2: "Peach",
        size: "M",
        price: "$46.99",
        originalPrice: "$59.00",
      },
      {
        product: catalogProducts[13] || catalogProducts[3],
        gender: "Unisex",
        color: "Sand",
        color2: "Olive Green",
        size: "32",
        price: "$49.99",
        originalPrice: "$49.00",
      },
      {
        product: catalogProducts[13] || catalogProducts[3],
        gender: "Unisex",
        color: "Sand",
        color2: "",
        size: "32",
        price: "$39.99",
        originalPrice: "$49.00",
      },
    ];
  }, []);

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
          <span className="text-[#25211D] font-medium">Order Success</span>
        </nav>

        {/* Page Title & Order ID */}
        <div className="mb-10 text-left">
          <h1
            className="text-[42px] sm:text-[56px] font-normal text-[#25211D] leading-tight tracking-normal mb-1 flex items-center gap-3"
            style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
          >
            <span>Order Success!</span>
            <span className="text-3xl text-red-500">❤️</span>
          </h1>
          <p className="eyebrow text-[#756A5E]">
            Order ID: <strong className="font-bold text-[#25211D]">{orderId}</strong>
          </p>
        </div>

        {/* 2. Success Checkmark & Payment Status Banner */}
        <div className="my-10 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-16 h-16 rounded-full border-2 border-[#25211D] flex items-center justify-center text-[#25211D] shadow-xs">
            <Check className="w-10 h-10 stroke-[2.5]" />
          </div>
          <p className="text-base sm:text-lg font-medium text-[#25211D]">
            Payment Status: <span className="text-emerald-700 font-bold">Success</span>
          </p>
        </div>

        {/* 3. Order Summary Section Header */}
        <div className="mb-6">
          <h2
            className="text-3xl font-normal text-[#25211D] uppercase tracking-normal"
            style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
          >
            Order Summary
          </h2>
        </div>

        {/* Purchased Items Grid (3 cards per row) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {purchasedItems.map((item, idx) => (
            <article
              key={idx}
              className="bg-[#FBFAF6] rounded-xl border border-[#463627]/12 overflow-hidden p-4 flex gap-4 shadow-xs hover:shadow-md transition-shadow"
            >
              {/* Product Thumbnail */}
              <div className="w-28 h-36 bg-[#EAE6DD] rounded-lg overflow-hidden relative flex-shrink-0">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="text-xs font-bold text-[#25211D] truncate mb-1">
                    {item.product.name}
                  </h3>
                  <p className="text-[10px] text-[#756A5E] mb-2">{item.gender}</p>

                  <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-xs font-bold text-[#25211D]">{item.price}</span>
                    <span className="text-[10px] text-[#8A847C] line-through">
                      {item.originalPrice}
                    </span>
                  </div>

                  <p className="text-[10px] text-[#494139] mb-0.5">
                    Color: <span className="font-medium text-[#25211D]">{item.color}</span>
                  </p>
                  {item.color2 && (
                    <p className="text-[10px] text-[#494139] mb-0.5">
                      Color: <span className="font-medium text-[#25211D]">{item.color2}</span>
                    </p>
                  )}
                  <p className="text-[10px] text-[#494139]">
                    Size: <span className="font-medium text-[#25211D]">{item.size}</span>
                  </p>
                </div>

                <p className="text-xs font-bold text-[#25211D] text-right mt-2">
                  {item.price}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* 4. Grand Total & Shipping Address Bar */}
        <div className="bg-[#FBFAF6] rounded-xl border border-[#463627]/12 p-6 mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#463627]/12 pb-4 gap-2">
            <span className="text-base font-bold text-[#25211D]">Grand Total</span>
            <span className="text-2xl font-bold text-[#25211D]">$249.00</span>
          </div>

          <div>
            <p className="eyebrow dark mb-1">Shipping Address</p>
            <p className="text-xs font-medium text-[#25211D]">
              1232 Main Street, Fload, Roasm, FA 96687
            </p>
          </div>
        </div>

        {/* 5. Action Buttons (Track Order & Continue Shopping) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          <Link
            href="/admin/dashboard"
            className="w-full bg-[#25211D] hover:bg-[#38342F] text-white text-xs font-semibold py-4 rounded-md uppercase tracking-wider text-center transition-colors shadow-md flex items-center justify-center space-x-2"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Track Order</span>
          </Link>
          <Link
            href="/products"
            className="w-full bg-[#25211D] hover:bg-[#38342F] text-white text-xs font-semibold py-4 rounded-md uppercase tracking-wider text-center transition-colors shadow-md flex items-center justify-center space-x-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* 6. Exact YUGEN Brand Values Banner */}
      <BrandValues />

      {/* 7. Exact YUGEN Landing Page Footer */}
      <Footer />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F5F0]" />}>
      <OrderSuccessContent />
    </Suspense>
  );
}

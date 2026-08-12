"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingBag,
  UserRound,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Package,
  MapPin,
  Clock,
  X,
  ExternalLink,
} from "lucide-react";
import { catalogProducts } from "@/data/catalogProducts";
import { Header } from "@/components/yugen/Header";
import { BrandValues } from "@/components/yugen/BrandValues";
import { Footer } from "@/components/yugen/Footer";

export default function MyOrdersPage() {
  const [activeTrackingModal, setActiveTrackingModal] = useState<boolean>(false);
  const [orders, setOrders] = useState([
    {
      id: "YGN-C1D2E",
      date: "Jan 23, 2026",
      status: "Shipped",
      statusType: "shipped",
      total: "$249.00",
      item: catalogProducts[0],
      itemName: "Linen Relaxed Shirt",
      color: "Peach",
      qty: 3,
    },
    {
      id: "YGN-E3F4G",
      date: "Jan 23, 2026",
      status: "Shipped",
      statusType: "shipped",
      total: "$249.00",
      item: catalogProducts[13] || catalogProducts[3],
      itemName: "Canvas Backpack",
      color: "Sand",
      qty: 2,
    },
    {
      id: "YGN-G5H6I",
      date: "Jan 23, 2026",
      status: "Delivered",
      statusType: "delivered",
      total: "$39.00",
      item: catalogProducts[5] || catalogProducts[2],
      itemName: "Oversized Cotton T-shirt",
      color: "Olive Green",
      qty: 1,
    },
  ]);

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
          <span className="text-[#25211D] font-medium">My Orders</span>
        </nav>

        {/* Page Title */}
        <div className="mb-10 text-left">
          <h1
            className="text-[40px] sm:text-[54px] font-normal text-[#25211D] leading-tight tracking-normal mb-1 flex items-center gap-3"
            style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
          >
            <span>My Orders</span>
            <span className="text-3xl text-red-500">❤️</span>
          </h1>
          <p className="eyebrow text-[#756A5E]">
            View your order history and tracking details
          </p>
        </div>

        {/* 2. Current Order Card (Active Shipment Progress Bar) */}
        <section className="bg-[#FBFAF6] border border-[#463627]/12 rounded-2xl p-6 sm:p-10 mb-14 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#463627]/12 pb-4 mb-6">
            <h2
              className="text-2xl sm:text-3xl font-normal text-[#25211D] uppercase tracking-normal"
              style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
            >
              Current Order
            </h2>
            <Lock className="w-4 h-4 text-[#6B4A37]" />
          </div>

          {/* Details & Tracking Progress Stepper Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-3 text-xs">
              <p className="font-bold text-[#25211D] text-sm">
                Order ID: <span className="text-[#6B4A37]">YGN-A8F7G</span>
              </p>
              <p className="font-bold text-[#25211D]">
                Total: <span className="text-[#25211D]">$249.00</span>
              </p>

              <div className="pt-2">
                <p className="eyebrow dark mb-1 flex items-center space-x-1">
                  <span>Delivery Address</span>
                  <Lock className="w-3 h-3 text-[#6B4A37]" />
                </p>
                <p className="text-xs text-[#756A5E] leading-relaxed">
                  1232 Main Street, Fload,
                  <br />
                  Roasm, FA 96687
                </p>
              </div>
            </div>

            {/* Right Progress Stepper Line (Order Placed -> Shipped -> Delivered) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="relative flex items-center justify-between w-full max-w-lg mx-auto py-4">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-[#25211D] -translate-y-1/2 z-0" />

                {/* Stage 1: Order Placed */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-6 h-6 rounded-full bg-[#25211D] border-2 border-[#25211D] flex items-center justify-center text-white text-[10px] font-bold mb-2">
                    ●
                  </div>
                  <span className="text-xs font-bold text-[#25211D]">Order Placed</span>
                </div>

                {/* Stage 2: Shipped */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-[#F7F5F0] border-2 border-[#25211D] flex items-center justify-center text-[#25211D] mb-2 shadow-xs">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-[#25211D]">Shipped</span>
                  <span className="text-[10px] text-[#756A5E]">May 28, 2026</span>
                </div>

                {/* Stage 3: Delivered */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-emerald-600 flex items-center justify-center text-white mb-2 shadow-xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#25211D]">Delivered</span>
                  <span className="text-[10px] text-[#756A5E]">Estimated Aug, 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Details Table */}
          <div className="border-t border-[#463627]/12 pt-6 mb-6">
            <p className="eyebrow dark mb-3">Order Details</p>
            <div className="bg-[#EAE6DD]/40 rounded-xl p-4 text-xs space-y-2">
              <div className="flex justify-between text-[#756A5E]">
                <span>Order ID</span>
                <span>Amount</span>
                <span className="font-bold text-[#25211D]">Total</span>
              </div>
              <div className="flex justify-between font-bold text-[#25211D] text-sm pt-1 border-t border-[#463627]/10">
                <span>Total</span>
                <span>$249.00</span>
                <span>$249.00</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/orders/track?id=YGN-A8F7G"
              className="flex-1 bg-[#25211D] hover:bg-[#38342F] text-white text-xs font-semibold py-3.5 rounded-md uppercase tracking-wider transition-colors shadow-sm text-center"
            >
              Track Order
            </Link>
            <Link
              href="/products"
              className="flex-1 bg-[#F7F5F0] hover:bg-[#EAE6DD] border border-[#463627]/20 text-[#25211D] text-xs font-medium py-3.5 rounded-md uppercase tracking-wider text-center transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </section>

        {/* 3. Order History Section Header */}
        <div className="mb-6">
          <h2
            className="text-3xl font-normal text-[#25211D] uppercase tracking-normal"
            style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
          >
            Order History
          </h2>
        </div>

        {/* Past Order Cards Grid (3 cards per row) */}
        {orders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {orders.map((ord) => (
              <article
                key={ord.id}
                className="bg-[#FBFAF6] rounded-xl border border-[#463627]/12 p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Card Header (ID + Status Badge + Total) */}
                  <div className="flex items-center justify-between mb-3 border-b border-[#463627]/10 pb-3">
                    <div>
                      <p className="text-xs font-bold text-[#25211D]">{ord.id}</p>
                      <p className="text-[10px] text-[#756A5E]">Date: {ord.date}</p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1 ${
                          ord.statusType === "delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-[#EAE6DD] text-[#494139]"
                        }`}
                      >
                        {ord.status}
                      </span>
                      <p className="text-xs font-bold text-[#25211D]">{ord.total}</p>
                    </div>
                  </div>

                  {/* Card Item Preview */}
                  <div className="flex items-center space-x-3 pt-1">
                    <div className="w-12 h-15 bg-[#EAE6DD] rounded overflow-hidden relative flex-shrink-0">
                      <Image
                        src={ord.item.image}
                        alt={ord.itemName}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-semibold text-[#25211D] truncate">{ord.itemName}</p>
                      <p className="text-[10px] text-[#756A5E]">Color: {ord.color}</p>
                    </div>
                    <span className="text-xs font-bold text-[#756A5E]">qty {ord.qty}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty Orders State Card */
          <div className="bg-[#FBFAF6] rounded-2xl border border-[#463627]/12 p-8 lg:p-12 mb-16 flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left shadow-xs">
            <div className="w-48 h-48 bg-[#EAE6DD] rounded-full flex items-center justify-center relative flex-shrink-0">
              <Package className="w-20 h-20 text-[#6B4A37]" />
            </div>
            <div className="space-y-3 max-w-md">
              <h3
                className="text-2xl font-normal text-[#25211D] uppercase"
                style={{ fontFamily: '"Poiret One", sans-serif' }}
              >
                No past orders found
              </h3>
              <p className="text-xs text-[#756A5E]">
                Looks like you haven&apos;t placed any orders yet. Explore our quiet-luxury collection.
              </p>
              <Link
                href="/products"
                className="inline-block bg-[#25211D] text-white text-xs font-semibold px-6 py-3 rounded-md uppercase"
              >
                Explore Products
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Track Order Live Modal */}
      {activeTrackingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#F7F5F0] border border-[#463627]/20 rounded-2xl p-6 max-w-md w-full shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-[#463627]/15 pb-3">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-[#6B4A37]" />
                <h3 className="text-base font-bold text-[#25211D]">Tracking Shipment #YGN-A8F7G</h3>
              </div>
              <button
                onClick={() => setActiveTrackingModal(false)}
                className="p-1 text-[#756A5E] hover:text-[#25211D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#494139]">
              <div className="flex items-start space-x-3 p-3 bg-[#FBFAF6] rounded-lg border border-[#463627]/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-bold text-[#25211D]">Package Dispatched</p>
                  <p className="text-[10px] text-[#756A5E]">Carrier: DHL Express (Tracking: 948201940)</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-[#FBFAF6] rounded-lg border border-[#463627]/10">
                <Clock className="w-4 h-4 text-[#6B4A37] mt-0.5" />
                <div>
                  <p className="font-bold text-[#25211D]">In Transit to Sorting Facility</p>
                  <p className="text-[10px] text-[#756A5E]">New York Regional Hub • Expected Dec 22</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTrackingModal(false)}
              className="w-full bg-[#25211D] text-white text-xs font-semibold py-2.5 rounded-md uppercase"
            >
              Close Tracking Details
            </button>
          </div>
        </div>
      )}

      {/* 4. Brand Values Banner */}
      <BrandValues />

      {/* 5. YUGEN Landing Page Footer */}
      <Footer />
    </div>
  );
}

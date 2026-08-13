"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  UserRound,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Package,
  MapPin,
  Clock,
  ArrowLeft,
  ExternalLink,
  Shield,
  HelpCircle,
} from "lucide-react";
import { orderApi, mapBackendProduct } from "@/lib/apiClient";
import { useAuth } from "@/lib/useAuth";
import { Header } from "@/components/yugen/Header";
import { BrandValues } from "@/components/yugen/BrandValues";
import { Footer } from "@/components/yugen/Footer";

function OrderTrackingContent() {
  const { authState } = useAuth(true);
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("id") || "";
  const [orderIdInput, setOrderIdInput] = useState<string>(initialOrderId);
  const [activeOrderId, setActiveOrderId] = useState<string>(initialOrderId);
  const [realOrder, setRealOrder] = useState<any>(null);

  useEffect(() => {
    if (authState !== "AUTHENTICATED") return;
    if (activeOrderId) {
      orderApi.getTracking(activeOrderId).then(({ data }) => {
        if (data?.order) {
          setRealOrder(data.order);
        }
      });
    }
  }, [activeOrderId, authState]);

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;
    setActiveOrderId(orderIdInput.trim().toUpperCase());
  };

  const status = realOrder?.status?.toUpperCase() || "CONFIRMED";

  // Dynamic Tracking Events based on status
  const trackingTimeline = [
    {
      title: "Order Placed & Confirmed",
      date: realOrder?.createdAt ? new Date(realOrder.createdAt).toLocaleDateString() : "Recent",
      description: "Payment verified. Your quiet-luxury order has been received.",
      completed: true,
    },
    {
      title: "Quality Check & Packaged",
      date: "In Process",
      description: "Items inspected and packaged in eco-friendly YUGEN box.",
      completed: status === "PACKED" || status === "SHIPPED" || status === "DELIVERED",
    },
    {
      title: "Dispatched & In Transit",
      date: status === "SHIPPED" || status === "DELIVERED" ? "Dispatched" : "Pending",
      description: "Carrier: DHL Express. Package in transit.",
      completed: status === "SHIPPED" || status === "DELIVERED",
      current: status === "SHIPPED",
    },
    {
      title: "Delivered",
      date: status === "DELIVERED" ? "Delivered" : "Estimated",
      description: `Delivering to ${realOrder?.shippingAddress?.street || "Selected Address"}.`,
      completed: status === "DELIVERED",
    },
  ];

  const items = useMemo(() => {
    if (realOrder?.items) {
      return realOrder.items.map((item: any) => {
        const v = item.variant;
        const p = v?.product || item.product;
        const mapped = mapBackendProduct(p) || null;
        if (!mapped) return null;
        return {
          product: mapped,
          qty: item.quantity,
          color: v?.color || "Default",
          size: v?.size || "M",
        };
      });
    }
    return [];
  }, [realOrder]);

  if (authState === "CHECKING") {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center text-sm font-medium text-[#25211D]">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#25211D] font-sans antialiased">
      <Header />

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
        {/* Breadcrumb */}
        <nav className="text-[11px] text-[#756A5E] mb-6 flex items-center space-x-2">
          <Link href="/" className="hover:text-[#25211D] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/orders" className="hover:text-[#25211D] transition-colors">My Orders</Link>
          <span>/</span>
          <span className="text-[#25211D] font-medium">Order Tracking</span>
        </nav>

        {/* Page Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-[#463627]/15 pb-6">
          <div>
            <h1
              className="text-[40px] sm:text-[54px] font-normal text-[#25211D] leading-tight tracking-normal mb-1 flex items-center gap-3"
              style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
            >
              <span>Track Order</span>
              <Truck className="w-8 h-8 text-[#6B4A37]" />
            </h1>
            <p className="eyebrow text-[#756A5E]">
              Tracking ID: <strong className="font-bold text-[#25211D]">{activeOrderId}</strong>
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchOrder} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Enter Order ID (e.g. YGN-A8F7G)"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              className="bg-[#FBFAF6] border border-[#463627]/20 rounded-md px-3.5 py-2 text-xs text-[#25211D] focus:outline-none focus:border-[#25211D] w-64"
            />
            <button
              type="submit"
              className="bg-[#25211D] hover:bg-[#38342F] text-white text-xs font-semibold px-5 py-2 rounded-md uppercase tracking-wider transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Main Grid: Live Timeline + Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          {/* Left Column: Shipment Timeline (7 cols) */}
          <div className="lg:col-span-7 bg-[#FBFAF6] border border-[#463627]/12 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#463627]/12 pb-4 mb-6">
              <div>
                <h2
                  className="text-2xl font-normal text-[#25211D] uppercase tracking-normal"
                  style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
                >
                  Shipment Status
                </h2>
                <p className="text-xs text-[#756A5E]">DHL Express • Waybill #948201940</p>
              </div>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                In Transit
              </span>
            </div>

            {/* Vertical Timeline */}
            <div className="space-y-8 relative pl-6 border-l-2 border-[#463627]/20 ml-3 my-4">
              {trackingTimeline.map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      step.current
                        ? "bg-[#6B4A37] border-[#6B4A37] text-white ring-4 ring-[#6B4A37]/20 scale-110"
                        : step.completed
                        ? "bg-[#25211D] border-[#25211D] text-white"
                        : "bg-[#F7F5F0] border-[#463627]/30 text-transparent"
                    }`}
                  >
                    {step.completed && <CheckCircle2 className="w-3 h-3" />}
                  </div>

                  {/* Event Details */}
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <h3
                        className={`text-sm font-bold ${
                          step.current ? "text-[#6B4A37]" : "text-[#25211D]"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <span className="text-[11px] text-[#756A5E] font-medium">{step.date}</span>
                    </div>
                    <p className="text-xs text-[#756A5E] leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Order Details & Address (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FBFAF6] border border-[#463627]/12 rounded-2xl p-6 shadow-xs space-y-6">
              <h2
                className="text-2xl font-normal text-[#25211D] uppercase border-b border-[#463627]/12 pb-4 tracking-normal"
                style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
              >
                Package Items
              </h2>

              {/* Item Previews */}
              <div className="space-y-4 border-b border-[#463627]/12 pb-4">
                {items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="w-12 h-15 bg-[#EAE6DD] rounded overflow-hidden relative flex-shrink-0">
                      <Image
                        src={item.product?.imageUrl || item.product?.image || "/ABOUT_BG.png"}
                        alt={item.product?.name || "Product"}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-bold text-[#25211D] truncate">{item.product.name}</p>
                      <p className="text-[10px] text-[#756A5E]">
                        Color: {item.color} • Size: {item.size}
                      </p>
                      <p className="text-[10px] text-[#8A847C]">Qty: {item.qty}</p>
                    </div>
                    <span className="text-xs font-bold text-[#25211D]">
                      {item.product.formattedPrice}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery Address Card */}
              <div className="space-y-1 text-xs">
                <p className="eyebrow dark mb-1">Destination Address</p>
                <p className="font-bold text-[#25211D]">Sarah Johnson</p>
                <p className="text-[#756A5E]">1232 Main Street, Fload, Roasm, FA 96687</p>
                <p className="text-[#8A847C]">+1 555-0123</p>
              </div>

              {/* Actions */}
              <div className="pt-2 space-y-2">
                <Link
                  href="/orders"
                  className="w-full bg-[#25211D] hover:bg-[#38342F] text-white text-xs font-semibold py-3 rounded-md uppercase tracking-wider text-center transition-colors shadow-xs flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to My Orders</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BrandValues />
      <Footer />
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F5F0]" />}>
      <OrderTrackingContent />
    </Suspense>
  );
}

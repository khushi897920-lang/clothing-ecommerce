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
  Lock,
  Check,
  CreditCard,
  Plus,
  Truck,
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { catalogProducts, CatalogProduct } from "@/data/catalogProducts";
import { userApi, cartApi, orderApi, paymentApi, mapBackendCartItem } from "@/lib/apiClient";
import { useAuth } from "@/lib/useAuth";
import { Header } from "@/components/yugen/Header";
import { BrandValues } from "@/components/yugen/BrandValues";
import { Footer } from "@/components/yugen/Footer";

export default function CheckoutPage() {
  const router = useRouter();
  const { authState } = useAuth(true);

  // Dynamic Addresses & Cart State from Backend
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [checkoutError, setCheckoutError] = useState<string>("");

  const [showAddAddressModal, setShowAddAddressModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">("standard");

  // Form Fields
  const [cardNumber, setCardNumber] = useState<string>("1234 5678 7727 9000");
  const [expiry, setExpiry] = useState<string>("12/28");
  const [cvc, setCvc] = useState<string>("884");
  const [newAddrLabel, setNewAddrLabel] = useState<string>("");
  const [newAddrStreet, setNewAddrStreet] = useState<string>("");
  const [newAddrPhone, setNewAddrPhone] = useState<string>("");
  const [newAddrCity, setNewAddrCity] = useState<string>("New Delhi");
  const [newAddrState, setNewAddrState] = useState<string>("Delhi");
  const [newAddrPostalCode, setNewAddrPostalCode] = useState<string>("110001");
  const [newAddrCountry, setNewAddrCountry] = useState<string>("India");

  // Order Placement State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>("");

  useEffect(() => {
    if (authState !== "AUTHENTICATED") return;

    // 1. Fetch real Addresses
    userApi.getAddresses().then(({ data }) => {
      if (data?.addresses && data.addresses.length > 0) {
        setAddresses(
          data.addresses.map((a: any) => ({
            id: a.id,
            label: `${a.fullName || "Home"}`,
            street: a.addressLine1 || a.street,
            city: `${a.city}, ${a.state} ${a.postalCode}`,
            isDefault: a.isDefault,
          }))
        );
        setSelectedAddressId(data.addresses[0].id);
      } else {
        setAddresses([]);
        setSelectedAddressId("");
      }
    });

    // 2. Fetch real Cart
    cartApi.getCart().then(({ data }) => {
      if (data?.cart?.items) {
        setCartItems(
          data.cart.items.map((item: any) => mapBackendCartItem(item))
        );
      } else {
        setCartItems([]);
      }
      setLoading(false);
    });
  }, [authState]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cartItems]);

  const shippingCost = deliveryMethod === "express" ? 600.0 : 350.0;
  const taxes = 0.0;
  const orderTotal = subtotal + shippingCost + taxes;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCheckoutError("");

    try {
      // 1. Create real order in order-service
      const { data: orderData, error: orderErr } = await orderApi.createOrder({
        shippingAddressId: selectedAddressId.startsWith("addr-") ? undefined : selectedAddressId,
        shippingAddress: {
          street: "1209 Sky Blvd",
          city: "New York",
          state: "NY",
          postalCode: "10001",
          country: "US",
        },
      });

      const realOrderId = orderData?.order?.id || `YG-${Math.floor(100000 + Math.random() * 900000)}`;

      // 2. Process Stripe Payment Intent
      await paymentApi.createPaymentIntent(orderTotal, realOrderId);

      // 3. Clear cart and redirect
      await cartApi.clearCart();
      window.dispatchEvent(new Event("yugen-state-updated"));

      router.push(`/order-success?orderId=${realOrderId}`);
    } catch (err: any) {
      setCheckoutError(err.message || "Failed to place order. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleAddAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLabel || !newAddrStreet || !newAddrPhone || !newAddrCity || !newAddrState || !newAddrPostalCode) return;

    const { data } = await userApi.addAddress({
      fullName: newAddrLabel,
      phone: newAddrPhone,
      addressLine1: newAddrStreet,
      city: newAddrCity,
      state: newAddrState,
      postalCode: newAddrPostalCode,
      country: newAddrCountry || "India",
    });

    if (data?.address) {
      const newAddr = {
        id: data.address.id,
        label: data.address.fullName || "Home",
        street: data.address.addressLine1 || data.address.street,
        city: `${data.address.city}, ${data.address.state} ${data.address.postalCode}`,
        isDefault: data.address.isDefault || false,
      };
      setAddresses((prev) => [...prev, newAddr]);
      setSelectedAddressId(newAddr.id);
    }
    setShowAddAddressModal(false);
    setNewAddrLabel("");
    setNewAddrStreet("");
    setNewAddrPhone("");
    setNewAddrCity("New Delhi");
    setNewAddrState("Delhi");
    setNewAddrPostalCode("110001");
    setNewAddrCountry("India");
  };

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

      {/* Main Container */}
      <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
        {/* Breadcrumb */}
        <nav className="text-[11px] text-[#756A5E] mb-6 flex items-center space-x-2">
          <Link href="/" className="hover:text-[#25211D] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#25211D] font-medium">Checkout</span>
        </nav>

        {!orderPlaced ? (
          <div>
            {/* Page Title */}
            <div className="mb-8 border-b border-[#463627]/15 pb-6">
              <h1
                className="text-[40px] sm:text-[54px] font-normal text-[#25211D] leading-tight tracking-normal mb-1 flex items-center gap-3"
                style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
              >
                <span>Secure Checkout</span>
                <Lock className="w-8 h-8 text-[#6B4A37]" />
              </h1>
            </div>

            {/* Content Layout (Form + Summary) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
              {/* Left Column: Checkout Steps (8 cols) */}
              <div className="lg:col-span-8 space-y-10">
                {/* Step 1: Delivery Address */}
                <section className="bg-[#FBFAF6] border border-[#463627]/12 rounded-xl p-6 sm:p-8 shadow-xs">
                  <h2
                    className="text-2xl font-normal text-[#25211D] uppercase tracking-normal mb-1"
                    style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
                  >
                    1. Delivery Address
                  </h2>
                  <p className="eyebrow text-[#756A5E] mb-6">Address Selection</p>

                  <p className="text-xs font-bold text-[#25211D] mb-3 uppercase tracking-wider">
                    Saved Addresses
                  </p>

                  {/* Saved Address Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <label
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                            isSelected
                              ? "border-[#25211D] bg-[#F7F5F0] shadow-sm"
                              : "border-[#463627]/15 bg-white hover:border-[#463627]/40"
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={isSelected}
                            onChange={() => setSelectedAddressId(addr.id)}
                            className="mt-0.5 accent-[#25211D]"
                          />
                          <div>
                            <p className="text-xs font-bold text-[#25211D]">{addr.label}</p>
                            <p className="text-[11px] text-[#756A5E]">{addr.street}</p>
                            <p className="text-[10px] text-[#8A847C]">{addr.city}</p>
                          </div>
                        </label>
                      );
                    })}

                    {/* Add Address Card Trigger */}
                    <button
                      type="button"
                      onClick={() => setShowAddAddressModal(true)}
                      className="p-4 rounded-xl border-2 border-dashed border-[#463627]/25 hover:border-[#25211D] bg-transparent flex items-center justify-center space-x-2 text-xs font-semibold text-[#25211D] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Address</span>
                    </button>
                  </div>

                  {/* Add New Address Form Modal/Inline */}
                  {showAddAddressModal && (
                    <form
                      onSubmit={handleAddAddressSubmit}
                      className="mt-4 p-4 bg-[#EAE6DD]/50 rounded-xl border border-[#463627]/20 space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Full Name (e.g. Alex R.)"
                          value={newAddrLabel}
                          onChange={(e) => setNewAddrLabel(e.target.value)}
                          className="bg-white border border-[#463627]/20 rounded p-2 text-xs text-[#25211D]"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Phone Number (e.g. 9876543210)"
                          value={newAddrPhone}
                          onChange={(e) => setNewAddrPhone(e.target.value)}
                          className="bg-white border border-[#463627]/20 rounded p-2 text-xs text-[#25211D]"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Street Address (e.g. 1209 Sky Blvd)"
                          value={newAddrStreet}
                          onChange={(e) => setNewAddrStreet(e.target.value)}
                          className="bg-white border border-[#463627]/20 rounded p-2 text-xs text-[#25211D] sm:col-span-2"
                          required
                        />
                        <input
                          type="text"
                          placeholder="City"
                          value={newAddrCity}
                          onChange={(e) => setNewAddrCity(e.target.value)}
                          className="bg-white border border-[#463627]/20 rounded p-2 text-xs text-[#25211D]"
                          required
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={newAddrState}
                          onChange={(e) => setNewAddrState(e.target.value)}
                          className="bg-white border border-[#463627]/20 rounded p-2 text-xs text-[#25211D]"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Postal Code"
                          value={newAddrPostalCode}
                          onChange={(e) => setNewAddrPostalCode(e.target.value)}
                          className="bg-white border border-[#463627]/20 rounded p-2 text-xs text-[#25211D]"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Country"
                          value={newAddrCountry}
                          onChange={(e) => setNewAddrCountry(e.target.value)}
                          className="bg-white border border-[#463627]/20 rounded p-2 text-xs text-[#25211D]"
                          required
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowAddAddressModal(false)}
                          className="px-3 py-1.5 text-xs text-[#756A5E]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-[#25211D] text-white text-xs font-semibold px-4 py-1.5 rounded uppercase"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowAddAddressModal(true)}
                    className="w-full bg-[#25211D] hover:bg-[#38342F] text-white text-xs font-semibold py-3 rounded-md uppercase tracking-wider transition-colors shadow-xs mt-2"
                  >
                    Add New Address
                  </button>
                </section>

                {/* Step 2: Payment Method */}
                <section className="bg-[#FBFAF6] border border-[#463627]/12 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
                  <div>
                    <h2
                      className="text-2xl font-normal text-[#25211D] uppercase tracking-normal mb-1"
                      style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
                    >
                      2. Payment Method
                    </h2>
                    <p className="eyebrow text-[#756A5E]">Payment Section</p>
                  </div>

                  {/* Payment Radio Selectors */}
                  <div className="space-y-3">
                    <label
                      onClick={() => setPaymentMethod("stripe")}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        paymentMethod === "stripe"
                          ? "border-[#25211D] bg-[#F7F5F0]"
                          : "border-[#463627]/15 bg-white hover:border-[#463627]/40"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "stripe"}
                          onChange={() => setPaymentMethod("stripe")}
                          className="accent-[#25211D]"
                        />
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-[#25211D]" />
                          <span className="text-xs font-bold text-[#25211D]">
                            Credit Card / Stripe
                          </span>
                        </div>
                      </div>
                    </label>

                    <label
                      onClick={() => setPaymentMethod("paypal")}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        paymentMethod === "paypal"
                          ? "border-[#25211D] bg-[#F7F5F0]"
                          : "border-[#463627]/15 bg-white hover:border-[#463627]/40"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "paypal"}
                          onChange={() => setPaymentMethod("paypal")}
                          className="accent-[#25211D]"
                        />
                        <span className="text-xs font-bold text-[#25211D]">PayPal</span>
                      </div>
                      <span className="text-xs font-bold italic text-blue-800">PayPal</span>
                    </label>
                  </div>

                  {/* Credit Card Input Box matching Screenshot */}
                  {paymentMethod === "stripe" && (
                    <div className="p-5 bg-white rounded-xl border border-[#463627]/15 space-y-4">
                      <div className="flex items-center justify-between border-b border-[#463627]/10 pb-3">
                        <div className="flex items-center space-x-2">
                          <input type="radio" checked readOnly className="accent-[#25211D]" />
                          <span className="text-xs font-bold text-[#25211D]">Credit Card</span>
                        </div>
                        {/* Card brand badges */}
                        <div className="flex items-center space-x-1.5 text-[9px] font-bold">
                          <span className="bg-blue-700 text-white px-1.5 py-0.5 rounded">VISA</span>
                          <span className="bg-red-600 text-white px-1.5 py-0.5 rounded">MC</span>
                          <span className="bg-blue-500 text-white px-1.5 py-0.5 rounded">AMEX</span>
                        </div>
                      </div>

                      {/* Form Inputs */}
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-[#756A5E] uppercase block mb-1">
                            Card number
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full bg-[#F7F5F0] border border-[#463627]/20 rounded-md py-2 pl-3 pr-10 text-xs font-mono text-[#25211D] focus:outline-none focus:border-[#25211D]"
                            />
                            <CreditCard className="w-4 h-4 text-[#756A5E] absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-[#756A5E] uppercase block mb-1">
                              Expiry
                            </label>
                            <input
                              type="text"
                              value={expiry}
                              onChange={(e) => setExpiry(e.target.value)}
                              placeholder="MM/YY"
                              className="w-full bg-[#F7F5F0] border border-[#463627]/20 rounded-md py-2 px-3 text-xs text-[#25211D] focus:outline-none focus:border-[#25211D]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-[#756A5E] uppercase block mb-1">
                              CVC
                            </label>
                            <input
                              type="text"
                              value={cvc}
                              onChange={(e) => setCvc(e.target.value)}
                              placeholder="CVC"
                              className="w-full bg-[#F7F5F0] border border-[#463627]/20 rounded-md py-2 px-3 text-xs text-[#25211D] focus:outline-none focus:border-[#25211D]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Stripe Secured Footer */}
                      <div className="pt-2 text-center text-xs font-medium text-[#756A5E] flex items-center justify-center space-x-1.5">
                        <span>Secured by</span>
                        <strong className="font-bold text-[#25211D] tracking-tighter text-sm">stripe</strong>
                      </div>
                    </div>
                  )}
                </section>
              </div>

              {/* Right Column: Order Summary Sidebar (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-[#FBFAF6] border border-[#463627]/12 rounded-xl p-6 shadow-xs space-y-6">
                  <div>
                    <h2
                      className="text-2xl font-normal text-[#25211D] uppercase tracking-normal mb-1"
                      style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
                    >
                      Order Summary
                    </h2>
                    <p className="eyebrow text-[#756A5E]">Order Review and Delivery Summary</p>
                  </div>

                  {/* Order Items List */}
                  <div className="space-y-4 border-b border-[#463627]/12 pb-5">
                    {cartItems.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="w-12 h-15 bg-[#EAE6DD] rounded overflow-hidden relative flex-shrink-0">
                          <Image
                            src={item.imageUrl || "/ABOUT_BG.png"}
                            alt={item.productName || "Product"}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#25211D] truncate">
                            {item.productName}
                          </p>
                          <p className="text-[10px] text-[#756A5E]">Size: {item.size} | Color: {item.color}</p>
                          <p className="text-[10px] text-[#8A847C]">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-xs font-bold text-[#25211D]">
                          ₹{item.unitPrice.toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Method Selection */}
                  <div className="border-b border-[#463627]/12 pb-5 space-y-2">
                    <p className="eyebrow dark mb-2">Delivery Method</p>
                    <label
                      onClick={() => setDeliveryMethod("standard")}
                      className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer text-xs ${
                        deliveryMethod === "standard"
                          ? "border-[#25211D] bg-[#F7F5F0]"
                          : "border-[#463627]/15 bg-white"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <input
                          type="radio"
                          name="delivery"
                          checked={deliveryMethod === "standard"}
                          onChange={() => setDeliveryMethod("standard")}
                          className="mt-0.5 accent-[#25211D]"
                        />
                        <div>
                          <p className="font-bold text-[#25211D]">Standard</p>
                          <p className="text-[10px] text-[#756A5E]">Estimated: Dec 22, 2026</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#25211D]">$14.00</span>
                    </label>

                    <label
                      onClick={() => setDeliveryMethod("express")}
                      className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer text-xs ${
                        deliveryMethod === "express"
                          ? "border-[#25211D] bg-[#F7F5F0]"
                          : "border-[#463627]/15 bg-white"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <input
                          type="radio"
                          name="delivery"
                          checked={deliveryMethod === "express"}
                          onChange={() => setDeliveryMethod("express")}
                          className="mt-0.5 accent-[#25211D]"
                        />
                        <div>
                          <p className="font-bold text-[#25211D]">Express</p>
                          <p className="text-[10px] text-[#756A5E]">Estimated: Dec 18, 2026</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#25211D]">$24.00</span>
                    </label>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="space-y-2 text-xs text-[#494139] border-b border-[#463627]/12 pb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-[#25211D]">₹{subtotal.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-bold text-[#25211D]">₹{shippingCost.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes</span>
                      <span className="text-[#756A5E]">₹0</span>
                    </div>
                  </div>

                  {/* Order Total */}
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-sm font-bold text-[#25211D]">Order Total</span>
                    <span className="text-2xl font-bold text-[#25211D]">
                      ₹{orderTotal.toFixed(0)}
                    </span>
                  </div>

                  {/* Place Order Primary Dark Button */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="w-full bg-[#25211D] hover:bg-[#38342F] text-white text-xs font-semibold py-3.5 rounded-md uppercase tracking-wider transition-colors shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isSubmitting ? "Processing Order..." : "Place Order"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Order Confirmation View */
          <div className="max-w-2xl mx-auto my-12 bg-[#FBFAF6] border border-[#463627]/12 rounded-2xl p-8 sm:p-12 text-center shadow-lg animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2
              className="text-3xl sm:text-4xl font-normal text-[#25211D] uppercase mb-2 tracking-normal"
              style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
            >
              Order Placed Successfully!
            </h2>
            <p className="eyebrow text-[#6B4A37] mb-6">Order ID: #{orderId}</p>
            <p className="text-xs text-[#756A5E] max-w-md mx-auto mb-8 leading-relaxed">
              Thank you for shopping with YUGEN. We have sent your order confirmation receipt to your email. Your quiet-luxury pieces are being prepared for dispatch!
            </p>

            {/* Delivery Status Card */}
            <div className="bg-[#EAE6DD]/50 rounded-xl p-4 text-left text-xs space-y-2 mb-8 border border-[#463627]/10">
              <div className="flex items-center space-x-2 font-bold text-[#25211D]">
                <Truck className="w-4 h-4 text-[#6B4A37]" />
                <span>Estimated Delivery: Dec 22, 2026</span>
              </div>
              <div className="flex items-center space-x-2 text-[#756A5E]">
                <MapPin className="w-4 h-4 text-[#6B4A37]" />
                <span>Delivering to: Home - Alex R. (1209 Sky Blvd, New York, NY)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/products"
                className="w-full sm:w-auto bg-[#25211D] hover:bg-[#38342F] text-white text-xs font-semibold px-8 py-3.5 rounded-md uppercase tracking-wider transition-colors shadow-md"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* 3. Brand Values Banner */}
      <BrandValues />

      {/* 4. YUGEN Landing Page Footer */}
      <Footer />
    </div>
  );
}

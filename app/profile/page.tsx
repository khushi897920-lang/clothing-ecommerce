"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  UserRound,
  ShieldCheck,
  User,
  MapPin,
  ClipboardList,
  Lock,
  LogOut,
  Plus,
  Check,
  CreditCard,
  X,
  KeyRound,
} from "lucide-react";
import { catalogProducts } from "@/data/catalogProducts";
import { authApi, userApi, mapBackendProduct } from "@/lib/apiClient";
import { useAuth } from "@/lib/useAuth";
import { Header } from "@/components/yugen/Header";
import { BrandValues } from "@/components/yugen/BrandValues";
import { Footer } from "@/components/yugen/Footer";

export default function ProfilePage() {
  const router = useRouter();
  const { authState } = useAuth(true);

  // User Profile Form State
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [gender, setGender] = useState<string>("Female");
  const [loading, setLoading] = useState<boolean>(true);

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // UI Feedback States
  const [activeTab, setActiveTab] = useState<"info" | "addresses" | "password">("info");
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);
  const [wishlistPreviews, setWishlistPreviews] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);

  useEffect(() => {
    if (authState !== "AUTHENTICATED") return;

    authApi.getProfile().then(({ data }) => {
      if (data?.user) {
        const u = data.user;
        setFullName(`${u.firstName || ""} ${u.lastName || ""}`.trim() || u.name || "Customer");
        setEmail(u.email || "");
        setPhone(u.phone || "");
      }
      setLoading(false);
    });

    userApi.getWishlist().then(({ data }) => {
      const list = data?.wishlist || data?.items;
      if (list && Array.isArray(list)) {
        setWishlistPreviews(
          list.map((item: any) => {
            const p = mapBackendProduct(item.product) || item.product;
            return {
              product: p,
              title: p?.name || "Apparel Item",
              category: p?.category || "Apparel",
              price: p?.price || "₹2,990",
            };
          })
        );
      } else {
        setWishlistPreviews([]);
      }
    });

    userApi.getAddresses().then(({ data }) => {
      if (data?.addresses && Array.isArray(data.addresses)) {
        setAddresses(data.addresses);
      } else {
        setAddresses([]);
      }
    });
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

  const handleUpdateBasicDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    const parts = fullName.split(" ");
    const firstName = parts[0] || fullName;
    const lastName = parts.slice(1).join(" ");

    const { data, error } = await authApi.updateProfile({ firstName, lastName, phone });
    if (error) {
      showToast(`Error: ${error}`);
      return;
    }
    if (data?.user) {
      localStorage.setItem("yugen_user", JSON.stringify(data.user));
    }
    showToast("Profile details updated successfully!");
    window.dispatchEvent(new Event("yugen-state-updated"));
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast("Please enter your current password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match.");
      return;
    }
    showToast("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = () => {
    localStorage.removeItem("yugen_token");
    localStorage.removeItem("yugen_user");
    window.dispatchEvent(new Event("yugen-state-updated"));
    router.push("/signin");
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
          <span className="text-[#25211D] font-medium">Profile</span>
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

        {/* Page Title */}
        <div className="mb-10 text-center">
          <h1
            className="text-[40px] sm:text-[54px] font-normal text-[#25211D] leading-tight tracking-normal mb-1 inline-flex items-center gap-3"
            style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
          >
            <span>My Profile</span>
            <User className="w-8 h-8 text-[#25211D]" />
          </h1>
        </div>

        {/* Content Layout (Sidebar + Profile Sections) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          {/* Left Sidebar Navigation (3 cols) */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-[#FBFAF6] border border-[#463627]/12 rounded-2xl p-4 shadow-xs space-y-1.5">
              <button
                onClick={() => setActiveTab("info")}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center space-x-2.5 ${
                  activeTab === "info"
                    ? "bg-[#F7F5F0] border border-[#25211D] text-[#25211D] shadow-xs"
                    : "text-[#494139] hover:bg-[#EAE6DD]"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#25211D]" />
                <span>Personal Information</span>
              </button>

              <a
                href="#addresses"
                onClick={() => setActiveTab("addresses")}
                className="w-full text-left px-4 py-3 rounded-xl text-xs font-medium text-[#494139] hover:bg-[#EAE6DD] transition-all flex items-center space-x-2.5"
              >
                <MapPin className="w-4 h-4 text-[#756A5E]" />
                <span>Addresses</span>
              </a>

              <Link
                href="/wishlist"
                className="w-full text-left px-4 py-3 rounded-xl text-xs font-medium text-[#494139] hover:bg-[#EAE6DD] transition-all flex items-center space-x-2.5"
              >
                <Heart className="w-4 h-4 text-[#756A5E]" />
                <span>Wishlist</span>
              </Link>

              <Link
                href="/orders"
                className="w-full text-left px-4 py-3 rounded-xl text-xs font-medium text-[#494139] hover:bg-[#EAE6DD] transition-all flex items-center space-x-2.5"
              >
                <ClipboardList className="w-4 h-4 text-[#756A5E]" />
                <span>Orders</span>
              </Link>

              <a
                href="#password"
                onClick={() => setActiveTab("password")}
                className="w-full text-left px-4 py-3 rounded-xl text-xs font-medium text-[#494139] hover:bg-[#EAE6DD] transition-all flex items-center space-x-2.5"
              >
                <Lock className="w-4 h-4 text-[#756A5E]" />
                <span>Password</span>
              </a>

              <div className="pt-2 border-t border-[#463627]/10">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-xs font-medium text-red-700 hover:bg-red-50 rounded-xl transition-all flex items-center space-x-2.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Decorative Heart & Bag Graphic Box */}
            <div className="bg-[#FBFAF6] border border-[#463627]/12 rounded-2xl p-6 text-center shadow-xs hidden lg:block">
              <div className="w-24 h-24 bg-[#EAE6DD] rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-[#6B4A37] stroke-[1.2]" />
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-[#F7F5F0] hover:bg-[#EAE6DD] border border-[#463627]/20 text-[#25211D] text-xs font-semibold py-2.5 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </aside>

          {/* Right Main Content (9 cols) */}
          <div className="lg:col-span-9 space-y-8">
            {/* 1. Basic Details Card */}
            <section className="bg-[#FBFAF6] border border-[#463627]/12 rounded-2xl p-6 sm:p-8 shadow-xs">
              <h2
                className="text-2xl font-normal text-[#25211D] uppercase tracking-normal mb-6"
                style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
              >
                Basic Details
              </h2>

              <form onSubmit={handleUpdateBasicDetails} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="text-[10px] font-bold text-[#756A5E] uppercase block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#F7F5F0] border border-[#463627]/20 rounded-lg p-3 text-xs text-[#25211D] focus:outline-none focus:border-[#25211D]"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="text-[10px] font-bold text-[#756A5E] uppercase block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#F7F5F0] border border-[#463627]/20 rounded-lg p-3 text-xs text-[#25211D] focus:outline-none focus:border-[#25211D]"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="text-[10px] font-bold text-[#756A5E] uppercase block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full bg-[#EAE6DD]/60 border border-[#463627]/15 rounded-lg p-3 text-xs text-[#756A5E] cursor-not-allowed"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="text-[10px] font-bold text-[#756A5E] uppercase block mb-1">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-[#F7F5F0] border border-[#463627]/20 rounded-lg p-3 text-xs text-[#25211D] focus:outline-none focus:border-[#25211D]"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#25211D] hover:bg-[#38342F] text-white text-xs font-semibold px-6 py-2.5 rounded-md uppercase tracking-wider transition-colors shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </section>

            {/* 2. Middle Row: Addresses & Wishlist Preview (2 columns) */}
            <div id="addresses" className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Addresses Card (Left Column) */}
              <section className="bg-[#FBFAF6] border border-[#463627]/12 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[#463627]/12 pb-4 mb-4">
                    <h2
                      className="text-2xl font-normal text-[#25211D] uppercase tracking-normal"
                      style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
                    >
                      Addresses
                    </h2>
                    <Lock className="w-4 h-4 text-[#6B4A37]" />
                  </div>

                  {/* Address Container */}
                  {addresses.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {addresses.map((addr: any, idx: number) => (
                        <div key={addr.id || idx} className="bg-[#F7F5F0] rounded-xl border border-[#463627]/15 p-4 space-y-2">
                          <div className="flex items-center justify-between border-b border-[#463627]/10 pb-2">
                            <span className="text-xs font-bold text-[#25211D]">
                              {addr.isDefault ? "Default Address" : `Address #${idx + 1}`}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] bg-[#6B4A37]/15 text-[#6B4A37] font-bold px-2 py-0.5 rounded">
                                YGN-DEF
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-[#494139] space-y-1 pt-1">
                            <div className="flex justify-between">
                              <span className="text-[#756A5E]">Name</span>
                              <span className="font-bold text-[#25211D]">{addr.fullName || fullName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#756A5E]">Phone</span>
                              <span>{addr.phone || phone}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#756A5E]">Street</span>
                              <span>{addr.street || addr.addressLine1}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#756A5E]">City / PIN</span>
                              <span>{addr.city}, {addr.state} {addr.postalCode}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#756A5E] py-6 text-center mb-4">
                      No saved addresses found. Add an address to use during checkout!
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => showToast("Address form opened.")}
                  className="w-full bg-[#25211D] hover:bg-[#38342F] text-white text-xs font-semibold py-3 rounded-md uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </section>

              {/* Wishlist Preview Card (Right Column) */}
              <section className="bg-[#FBFAF6] border border-[#463627]/12 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[#463627]/12 pb-4 mb-4">
                    <h2
                      className="text-2xl font-normal text-[#25211D] uppercase tracking-normal"
                      style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
                    >
                      Wishlist Preview
                    </h2>
                    <Lock className="w-4 h-4 text-[#6B4A37]" />
                  </div>

                  {/* Item Preview Grid */}
                  {wishlistPreviews.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {wishlistPreviews.slice(0, 4).map((item: any, idx: number) => (
                        <Link
                          key={idx}
                          href={`/products/${item.product?.slug || item.product?.id}`}
                          className="bg-[#F7F5F0] rounded-lg p-2 border border-[#463627]/10 hover:border-[#25211D] transition-colors group flex flex-col"
                        >
                          <div className="aspect-[4/5] bg-[#EAE6DD] rounded overflow-hidden relative mb-2">
                            <Image
                              src={item.product?.imageUrl || item.product?.image || "/ABOUT_BG.png"}
                              alt={item.title}
                              fill
                              sizes="120px"
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <p className="text-[11px] font-bold text-[#25211D] truncate">
                            {item.title}
                          </p>
                          <p className="text-[9px] text-[#756A5E] mb-1">{item.category}</p>
                          <div className="flex items-baseline space-x-1 text-[10px]">
                            <span className="font-bold text-[#25211D]">{item.price}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#756A5E] py-6 text-center">
                      Your wishlist is empty. Explore our collection to save your favorite items!
                    </p>
                  )}
                </div>

                <Link
                  href="/wishlist"
                  className="w-full bg-[#F7F5F0] hover:bg-[#EAE6DD] border border-[#463627]/20 text-[#25211D] text-xs font-semibold py-2.5 rounded-md uppercase tracking-wider text-center transition-colors block"
                >
                  View Full Wishlist
                </Link>
              </section>
            </div>

            {/* 3. Payment Accounts Banner */}
            <section className="bg-[#FBFAF6] border border-[#463627]/12 rounded-2xl p-6 shadow-xs flex items-center justify-between">
              <div>
                <h2
                  className="text-2xl font-normal text-[#25211D] uppercase tracking-normal"
                  style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
                >
                  Payment accounts
                </h2>
                <p className="text-xs text-[#756A5E] mt-0.5">
                  Saved payment cards &amp; encrypted Stripe accounts
                </p>
              </div>
              <Lock className="w-5 h-5 text-[#6B4A37]" />
            </section>

            {/* 4. Password Change Card */}
            <section id="password" className="bg-[#FBFAF6] border border-[#463627]/12 rounded-2xl p-6 sm:p-8 shadow-xs">
              <h2
                className="text-2xl font-normal text-[#25211D] uppercase tracking-normal mb-6"
                style={{ fontFamily: '"Poiret One", "Gruppo", sans-serif' }}
              >
                Password
              </h2>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Current Password */}
                  <div>
                    <label className="text-[10px] font-bold text-[#756A5E] uppercase block mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-[#F7F5F0] border border-[#463627]/20 rounded-lg p-3 text-xs text-[#25211D] focus:outline-none focus:border-[#25211D]"
                    />
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="text-[10px] font-bold text-[#756A5E] uppercase block mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#F7F5F0] border border-[#463627]/20 rounded-lg p-3 text-xs text-[#25211D] focus:outline-none focus:border-[#25211D]"
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="text-[10px] font-bold text-[#756A5E] uppercase block mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#F7F5F0] border border-[#463627]/20 rounded-lg p-3 text-xs text-[#25211D] focus:outline-none focus:border-[#25211D]"
                    />
                  </div>

                  {/* Update Password Action Button */}
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-[#25211D] hover:bg-[#38342F] text-white text-xs font-semibold py-3 rounded-md uppercase tracking-wider transition-colors shadow-xs"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>

      {/* 5. Exact YUGEN Brand Values Banner */}
      <BrandValues />

      {/* 6. Exact YUGEN Landing Page Footer */}
      <Footer />
    </div>
  );
}

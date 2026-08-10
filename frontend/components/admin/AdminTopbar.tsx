"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminTopbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 0) {
      setShowSearchDropdown(true);
    } else {
      setShowSearchDropdown(false);
    }
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim().length > 0) {
      setShowSearchDropdown(false);
      alert(`Simulating global search for: "${searchQuery}"`);
    }
  };

  return (
    <header className="h-[72px] bg-[#F8F6F2] border-b border-black/5 flex items-center justify-between px-8 lg:px-12 sticky top-0 z-30 font-sans text-[#1c1c1a]">
      <div className="flex items-center space-x-4">
        <button className="lg:hidden text-[#2d2a26] hover:opacity-70 transition-opacity">
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <div className="hidden lg:flex items-center">
          {/* We leave this empty on desktop as sidebar acts as navigation */}
        </div>
      </div>

      <div className="flex items-center space-x-6">
        {/* Global Search */}
        <div className="relative hidden md:block" ref={searchRef}>
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#a39e99]">
            search
          </span>
          <input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
            onFocus={() => {
              if (searchQuery.trim().length > 0) setShowSearchDropdown(true);
            }}
            className="w-[260px] h-10 pl-10 pr-4 bg-white/60 border border-black/5 rounded-lg text-[13px] outline-none focus:border-[#b09b85] focus:bg-white transition-colors placeholder:text-[#a39e99]"
          />

          {/* Search Dropdown Results */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 mt-2 w-[320px] bg-white border border-black/5 rounded-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] py-2 z-50">
              <div className="px-4 py-2 border-b border-black/5">
                <span className="text-[11px] font-semibold text-[#6b6762] uppercase tracking-wider">Quick Results</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                <Link 
                  href="/admin/orders" 
                  onClick={() => setShowSearchDropdown(false)}
                  className="px-4 py-3 hover:bg-[#F8F6F2] transition-colors border-b border-black/5 last:border-0 flex items-center space-x-3"
                >
                  <div className="w-8 h-8 rounded bg-[#eef4ef] flex items-center justify-center text-[#4d7050] shrink-0">
                    <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                  </div>
                  <div>
                    <p className="text-[13px] text-[#2d2a26] font-medium">Order #ORD-10234</p>
                    <p className="text-[11px] text-[#a39e99]">Customer: Sarah Johnson</p>
                  </div>
                </Link>
                <Link 
                  href="/admin/products"
                  onClick={() => setShowSearchDropdown(false)}
                  className="px-4 py-3 hover:bg-[#F8F6F2] transition-colors border-b border-black/5 last:border-0 flex items-center space-x-3"
                >
                  <div className="w-8 h-8 rounded bg-[#f2eefa] flex items-center justify-center text-[#6b5b95] shrink-0">
                    <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                  </div>
                  <div>
                    <p className="text-[13px] text-[#2d2a26] font-medium">Oversized Cotton T-Shirt</p>
                    <p className="text-[11px] text-[#a39e99]">Product • T-Shirts</p>
                  </div>
                </Link>
                <div 
                  className="px-4 py-3 hover:bg-[#F8F6F2] cursor-pointer transition-colors flex items-center space-x-3"
                  onClick={() => {
                    setShowSearchDropdown(false);
                    alert(`Searching all records for: "${searchQuery}"`);
                  }}
                >
                  <div className="w-8 h-8 rounded bg-black/5 flex items-center justify-center text-[#2d2a26] shrink-0">
                    <span className="material-symbols-outlined text-[16px]">search</span>
                  </div>
                  <div>
                    <p className="text-[13px] text-[#2d2a26] font-medium">Search all results for "{searchQuery}"</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-[#2d2a26] hover:opacity-70 transition-opacity"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D35446] text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-[#F8F6F2]">
              3
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-black/5 rounded-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] py-2 z-50">
              <div className="px-4 py-2 border-b border-black/5 flex justify-between items-center">
                <span className="font-semibold text-[13px]">Notifications</span>
                <button className="text-[11px] text-[#B48C5A] hover:underline">Mark all read</button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                <div className="px-4 py-3 hover:bg-[#F8F6F2] cursor-pointer transition-colors border-b border-black/5 last:border-0">
                  <p className="text-[13px] text-[#2d2a26] mb-1">New order <span className="font-semibold">#ORD-10234</span> received</p>
                  <span className="text-[11px] text-[#a39e99]">2 minutes ago</span>
                </div>
                <div className="px-4 py-3 hover:bg-[#F8F6F2] cursor-pointer transition-colors border-b border-black/5 last:border-0">
                  <p className="text-[13px] text-[#2d2a26] mb-1">Inventory for <span className="font-semibold">Oversized T-Shirt</span> is critical</p>
                  <span className="text-[11px] text-[#a39e99]">1 hour ago</span>
                </div>
                <div className="px-4 py-3 hover:bg-[#F8F6F2] cursor-pointer transition-colors border-b border-black/5 last:border-0">
                  <p className="text-[13px] text-[#2d2a26] mb-1">Payment of $1,250.00 processed successfully</p>
                  <span className="text-[11px] text-[#a39e99]">3 hours ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-[1px] bg-black/10 hidden md:block"></div>

        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 group text-left"
          >
            <div className="w-9 h-9 rounded-full bg-[#E5E0D8] overflow-hidden relative border border-black/5">
              <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#6b6762]">
                person
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-[13px] font-medium text-[#2d2a26] leading-tight group-hover:opacity-80 transition-opacity">
                Admin User
              </p>
              <p className="text-[11px] text-[#6b6762]">Administrator</p>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#6b6762] hidden md:block group-hover:opacity-80 transition-opacity">
              expand_more
            </span>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-48 bg-white border border-black/5 rounded-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] py-2 z-50">
              <button className="w-full text-left px-4 py-2 text-[13px] text-[#2d2a26] hover:bg-[#F8F6F2] transition-colors flex items-center space-x-2">
                <span className="material-symbols-outlined text-[18px] text-[#6b6762]">person</span>
                <span>My Profile</span>
              </button>
              <button className="w-full text-left px-4 py-2 text-[13px] text-[#2d2a26] hover:bg-[#F8F6F2] transition-colors flex items-center space-x-2">
                <span className="material-symbols-outlined text-[18px] text-[#6b6762]">settings</span>
                <span>Settings</span>
              </button>
              <div className="my-1 border-t border-black/5"></div>
              <button 
                onClick={() => {
                  alert("Logging out...");
                  router.push('/');
                }}
                className="w-full text-left px-4 py-2 text-[13px] text-[#D35446] hover:bg-[#F8F6F2] transition-colors flex items-center space-x-2"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

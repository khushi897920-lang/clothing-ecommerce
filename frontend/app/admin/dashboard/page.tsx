"use client";

import React, { useState, useRef, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminStatCard from "@/components/admin/AdminStatCard";
import RevenueChart from "@/components/admin/RevenueChart";
import OrdersOverview from "@/components/admin/OrdersOverview";
import RecentOrders from "@/components/admin/RecentOrders";
import LowStockProducts from "@/components/admin/LowStockProducts";

export default function AdminDashboardPage() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("May 15, 2024 - May 21, 2024");
  const dateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dateOptions = [
    "Today",
    "Yesterday",
    "Last 7 Days",
    "Last 30 Days",
    "This Month",
    "May 15, 2024 - May 21, 2024",
  ];

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-[36px] md:text-[42px] font-serif font-bold text-[#2d2a26] leading-none mb-2">
            Dashboard
          </h1>
          <p className="text-[14px] text-[#6b6762]">
            Overview of your store performance and activities.
          </p>
        </div>
        
        <div className="relative" ref={dateRef}>
          <button 
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center space-x-3 bg-white border border-black/10 rounded-lg px-4 py-2.5 hover:border-black/20 hover:bg-black/5 transition-colors text-[13px] text-[#2d2a26] font-medium self-start md:self-auto shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
          >
            <span className="material-symbols-outlined text-[18px] text-[#a39e99]">
              calendar_today
            </span>
            <span>{selectedDateRange}</span>
            <span className="material-symbols-outlined text-[18px] text-[#a39e99] transition-transform" style={{ transform: showDatePicker ? 'rotate(180deg)' : 'none' }}>
              expand_more
            </span>
          </button>

          {showDatePicker && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-black/5 rounded-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] py-2 z-20">
              {dateOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedDateRange(option);
                    setShowDatePicker(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-[#F8F6F2] transition-colors flex justify-between items-center ${
                    selectedDateRange === option ? 'text-[#B48C5A] bg-[#B48C5A]/5' : 'text-[#2d2a26]'
                  }`}
                >
                  <span>{option}</span>
                  {selectedDateRange === option && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <AdminStatCard
          title="Total Revenue"
          value="$24,890.50"
          change="↗ 18.6%"
          changeType="positive"
          icon="payments"
          iconBgColor="#f3eee8"
          iconColor="#B48C5A"
        />
        <AdminStatCard
          title="Total Orders"
          value="456"
          change="↗ 12.4%"
          changeType="positive"
          icon="shopping_bag"
          iconBgColor="#f3eee8"
          iconColor="#B48C5A"
        />
        <AdminStatCard
          title="Total Products"
          value="248"
          change="↗ 8.7%"
          changeType="positive"
          icon="checkroom"
          iconBgColor="#f3eee8"
          iconColor="#B48C5A"
        />
        <AdminStatCard
          title="Customers"
          value="1,256"
          change="↗ 15.2%"
          changeType="positive"
          icon="person"
          iconBgColor="#f3eee8"
          iconColor="#B48C5A"
        />
        <AdminStatCard
          title="Low Stock Items"
          value="23"
          change="↘ 5"
          changeType="negative"
          icon="inventory_2"
          iconBgColor="#faeeed"
          iconColor="#b34c3e"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[65%_calc(35%-1.5rem)] gap-6 mb-6">
        <RevenueChart />
        <OrdersOverview />
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        <RecentOrders />
        <LowStockProducts />
      </div>
    </AdminLayout>
  );
}

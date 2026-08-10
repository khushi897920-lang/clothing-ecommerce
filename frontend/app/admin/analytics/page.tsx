"use client";

import React, { useState, useRef, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AnalyticsStatCard from "@/components/admin/AnalyticsStatCard";
import AnalyticsLineChart from "@/components/admin/AnalyticsLineChart";
import AnalyticsDonutChart from "@/components/admin/AnalyticsDonutChart";
import TopProductsList from "@/components/admin/TopProductsList";

const MOCK_REVENUE_DATA = [
  { date: "May 15", value: 3400 },
  { date: "May 16", value: 4700 },
  { date: "May 17", value: 4000 },
  { date: "May 18", value: 5700 },
  { date: "May 19", value: 4100 },
  { date: "May 20", value: 4800 },
  { date: "May 21", value: 4200 },
];

const MOCK_ORDERS_DATA = [
  { date: "May 15", value: 55 },
  { date: "May 16", value: 85 },
  { date: "May 17", value: 60 },
  { date: "May 18", value: 70 },
  { date: "May 19", value: 58 },
  { date: "May 20", value: 88 },
  { date: "May 21", value: 62 },
];

const MOCK_CATEGORY_DATA = [
  { label: "T-Shirts", value: 6540.0, displayValue: "$6,540.00", color: "#4d7050" }, // Green
  { label: "Shirts", value: 5280.5, displayValue: "$5,280.50", color: "#4d6a80" }, // Blue
  { label: "Dresses", value: 4890.2, displayValue: "$4,890.20", color: "#d4a373" }, // Muted Amber
  { label: "Hoodies", value: 3980.4, displayValue: "$3,980.40", color: "#8b78a5" }, // Muted Purple
  { label: "Others", value: 7849.5, displayValue: "$7,849.50", color: "#d9d2c5" }, // Beige/Gray
];

const MOCK_STATUS_DATA = [
  { label: "Delivered", value: 186, displayValue: "186 (40.8%)", color: "#4d7050" }, // Green
  { label: "Processing", value: 102, displayValue: "102 (22.4%)", color: "#b27a5d" }, // Amber/Orange
  { label: "Shipped", value: 128, displayValue: "128 (28.1%)", color: "#4d6a80" }, // Blue
  { label: "Cancelled", value: 40, displayValue: "40 (8.7%)", color: "#b34c3e" }, // Red
  { label: "Pending", value: 18, displayValue: "18 (3.9%)", color: "#8b78a5" }, // Purple
];

const MOCK_TOP_PRODUCTS = [
  { id: "1", name: "Oversized Cotton T-Shirt", sold: 128, revenue: "$2,560.00", image: "/images/product_cotton_tee.jpg" },
  { id: "2", name: "Linen Casual Shirt", sold: 96, revenue: "$2,112.00", image: "/images/product_linen_shirt.jpg" },
  { id: "3", name: "Essential Hoodie", sold: 85, revenue: "$1,912.50", image: "/images/product_cotton_jacket.jpg" },
  { id: "4", name: "Slim Fit Jeans", sold: 72, revenue: "$1,584.00", image: "/images/product_tailored_blazer.jpg" },
  { id: "5", name: "Floral Maxi Dress", sold: 68, revenue: "$1,496.00", image: "/images/grace in every thread.png" },
];

export default function AnalyticsPage() {
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div className="flex flex-col">
          <h1 className="text-[36px] md:text-[42px] font-serif font-bold text-[#2d2a26] leading-none mb-2">
            Analytics
          </h1>
          <p className="text-[14px] text-[#6b6762]">
            Overview of store performance and key metrics.
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <AnalyticsStatCard
          title="Total Revenue"
          value="$28,540.60"
          comparison="↑ 18.6% vs May 8 - May 14"
          isPositive={true}
          icon="monetization_on"
          iconBgColor="#eef4ef"
          iconColor="#4d7050"
        />
        <AnalyticsStatCard
          title="Total Orders"
          value="456"
          comparison="↑ 14.2% vs May 8 - May 14"
          isPositive={true}
          icon="shopping_bag"
          iconBgColor="#f2eefa"
          iconColor="#6b5b95"
        />
        <AnalyticsStatCard
          title="Total Customers"
          value="321"
          comparison="↑ 12.7% vs May 8 - May 14"
          isPositive={true}
          icon="group"
          iconBgColor="#f9f3ea"
          iconColor="#b27a5d"
        />
        <AnalyticsStatCard
          title="Average Order Value"
          value="$62.59"
          comparison="↑ 3.4% vs May 8 - May 14"
          isPositive={true}
          icon="inventory_2"
          iconBgColor="#eef3f7"
          iconColor="#4d6a80"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <AnalyticsLineChart
          title="Revenue Overview"
          data={MOCK_REVENUE_DATA}
          color="#4d7050" // Muted Green
          isCurrency={true}
          maxValue={8000}
          yTickInterval={2000}
        />
        <AnalyticsLineChart
          title="Orders Overview"
          data={MOCK_ORDERS_DATA}
          color="#4d6a80" // Muted Blue
          isCurrency={false}
          maxValue={120}
          yTickInterval={30}
        />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnalyticsDonutChart
          title="Top Categories by Revenue"
          centerTopText="$28,540.60"
          centerBottomText="Total"
          data={MOCK_CATEGORY_DATA}
          viewAllLink="/admin/categories"
          viewAllText="View all categories"
        />
        
        <TopProductsList products={MOCK_TOP_PRODUCTS} />
        
        <AnalyticsDonutChart
          title="Orders by Status"
          centerTopText="456"
          centerBottomText="Total"
          data={MOCK_STATUS_DATA}
          viewAllLink="/admin/orders"
          viewAllText="View all orders"
        />
      </div>
    </AdminLayout>
  );
}

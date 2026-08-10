"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Modal from "./Modal";

type InventoryStatus = "In Stock" | "Low Stock" | "Out of Stock";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  variant: {
    colorCode: string;
    label: string;
  };
  stock: number;
  status: InventoryStatus;
  lastUpdated: string;
  image: string;
  category: string;
}

const MOCK_INVENTORY_INITIAL: InventoryItem[] = [
  {
    id: "1",
    name: "Oversized Cotton T-Shirt",
    sku: "TSH-001",
    category: "T-Shirts",
    variant: { colorCode: "#556b2f", label: "M / Olive Green" },
    stock: 120,
    status: "In Stock",
    lastUpdated: "May 21, 2024\n10:30 AM",
    image: "/images/product_cotton_tee.jpg",
  },
  {
    id: "2",
    name: "Linen Casual Shirt",
    sku: "SHIRT-023",
    category: "Shirts",
    variant: { colorCode: "#d3b89e", label: "L / Beige" },
    stock: 18,
    status: "Low Stock",
    lastUpdated: "May 21, 2024\n09:15 AM",
    image: "/images/product_linen_shirt.jpg",
  },
  {
    id: "3",
    name: "Essential Hoodie",
    sku: "HOOD-012",
    category: "Hoodies",
    variant: { colorCode: "#000000", label: "XL / Black" },
    stock: 0,
    status: "Out of Stock",
    lastUpdated: "May 20, 2024\n04:45 PM",
    image: "/images/product_cotton_jacket.jpg",
  },
  {
    id: "4",
    name: "Slim Fit Jeans",
    sku: "JEAN-045",
    category: "Jeans",
    variant: { colorCode: "#4a7bb2", label: "32 / Blue" },
    stock: 35,
    status: "In Stock",
    lastUpdated: "May 20, 2024\n11:20 AM",
    image: "/images/product_tailored_blazer.jpg",
  },
  {
    id: "5",
    name: "Cargo Joggers",
    sku: "JOG-009",
    category: "Joggers",
    variant: { colorCode: "#6b705c", label: "M / Olive" },
    stock: 7,
    status: "Low Stock",
    lastUpdated: "May 20, 2024\n10:05 AM",
    image: "/images/grace in every thread.png",
  },
  {
    id: "6",
    name: "Checked Flannel Shirt",
    sku: "SHIRT-056",
    category: "Shirts",
    variant: { colorCode: "#8b0000", label: "L / Red" },
    stock: 22,
    status: "In Stock",
    lastUpdated: "May 19, 2024\n06:40 PM",
    image: "/images/product_linen_shirt.jpg",
  },
  {
    id: "7",
    name: "Bomber Jacket",
    sku: "JKT-021",
    category: "Jackets",
    variant: { colorCode: "#1a1a1a", label: "M / Black" },
    stock: 0,
    status: "Out of Stock",
    lastUpdated: "May 19, 2024\n03:30 PM",
    image: "/images/product_cotton_jacket.jpg",
  },
  {
    id: "8",
    name: "Canvas Backpack",
    sku: "BAG-002",
    category: "Accessories",
    variant: { colorCode: "#c4a484", label: "One Size / Tan" },
    stock: 60,
    status: "In Stock",
    lastUpdated: "May 19, 2024\n01:25 PM",
    image: "/images/grace in every thread.png",
  },
];

const CATEGORIES = ["All Categories", "T-Shirts", "Shirts", "Hoodies", "Jeans", "Joggers", "Jackets", "Accessories"];
const STATUSES = ["All Status", "In Stock", "Low Stock", "Out of Stock"];
const ITEMS_PER_PAGE = 5;

export default function InventoryTable() {
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY_INITIAL);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  const categoryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(1);

  // Modal State
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [newStockValue, setNewStockValue] = useState<string>("");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStockColor = (stock: number) => {
    if (stock === 0) return "text-[#D35446]"; // Red
    if (stock <= 20) return "text-[#D38B46]"; // Orange/Gold
    return "text-[#588157]"; // Green
  };

  const getStatusBadge = (status: InventoryStatus) => {
    switch (status) {
      case "In Stock":
        return "bg-[#eef4ef] text-[#4d7050]";
      case "Low Stock":
        return "bg-[#f9f3ea] text-[#9a7b54]";
      case "Out of Stock":
        return "bg-[#faeeed] text-[#b34c3e]";
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
    const matchesStatus = selectedStatus === "All Status" || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);
  const paginatedInventory = filteredInventory.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);

  useEffect(() => {
    setActivePage(1);
  }, [searchQuery, selectedCategory, selectedStatus]);

  const confirmAdjust = () => {
    if (adjustItem) {
      const stockNum = parseInt(newStockValue, 10);
      if (!isNaN(stockNum) && stockNum >= 0) {
        setInventory(inventory.map(i => {
          if (i.id === adjustItem.id) {
            let status: InventoryStatus = "In Stock";
            if (stockNum === 0) status = "Out of Stock";
            else if (stockNum <= 20) status = "Low Stock";
            return { ...i, stock: stockNum, status };
          }
          return i;
        }));
      }
      setAdjustItem(null);
    }
  };

  return (
    <>
      <div className="bg-white border border-black/5 rounded-[12px] shadow-[0_2px_10px_rgba(0,0,0,0.01)] flex flex-col font-sans w-full mt-6">
        {/* Toolbar */}
        <div className="p-6 border-b border-black/5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative w-full lg:w-[320px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#a39e99]">
              search
            </span>
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white border border-black/10 rounded-[8px] text-[13px] outline-none focus:border-[#b09b85] transition-colors placeholder:text-[#a39e99]"
            />
          </div>

          <div className="flex items-center space-x-3 overflow-x-auto pb-1 lg:pb-0">
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Categories");
                setSelectedStatus("All Status");
              }}
              className="flex items-center space-x-2 border border-black/10 rounded-[8px] px-4 py-2 hover:bg-black/5 transition-colors text-[13px] font-medium text-[#2d2a26] min-w-[90px] justify-between"
            >
              <span className="material-symbols-outlined text-[18px] text-[#6b6762]">filter_alt_off</span>
              <span>Clear</span>
            </button>

            {/* Category Dropdown */}
            <div className="relative" ref={categoryRef}>
              <button 
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center space-x-2 border border-black/10 rounded-[8px] px-4 py-2 hover:bg-black/5 transition-colors text-[13px] font-medium text-[#2d2a26] min-w-[140px] justify-between"
              >
                <span>{selectedCategory}</span>
                <span className="material-symbols-outlined text-[18px] text-[#6b6762] transition-transform" style={{ transform: showCategoryDropdown ? 'rotate(180deg)' : 'none' }}>
                  expand_more
                </span>
              </button>
              {showCategoryDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-black/5 rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] py-1 z-20">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-[13px] hover:bg-[#F8F6F2] transition-colors ${
                        selectedCategory === cat ? 'text-[#B48C5A] font-medium' : 'text-[#2d2a26]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="relative" ref={statusRef}>
              <button 
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center space-x-2 border border-black/10 rounded-[8px] px-4 py-2 hover:bg-black/5 transition-colors text-[13px] font-medium text-[#2d2a26] min-w-[130px] justify-between"
              >
                <span>{selectedStatus}</span>
                <span className="material-symbols-outlined text-[18px] text-[#6b6762] transition-transform" style={{ transform: showStatusDropdown ? 'rotate(180deg)' : 'none' }}>
                  expand_more
                </span>
              </button>
              {showStatusDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-black/5 rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] py-1 z-20">
                  {STATUSES.map((stat) => (
                    <button
                      key={stat}
                      onClick={() => {
                        setSelectedStatus(stat);
                        setShowStatusDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-[13px] hover:bg-[#F8F6F2] transition-colors ${
                        selectedStatus === stat ? 'text-[#B48C5A] font-medium' : 'text-[#2d2a26]'
                      }`}
                    >
                      {stat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="flex items-center space-x-2 border border-black/10 rounded-[8px] px-4 py-2 hover:bg-black/5 transition-colors text-[13px] font-medium text-[#2d2a26] whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px] text-[#6b6762]">download</span>
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-black/5 bg-[#FAFAFA]">
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider w-[25%]">
                  Product
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider">
                  SKU
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider">
                  Variant<br/><span className="text-[10px] font-normal text-[#a39e99] normal-case">Size / Color</span>
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider text-center">
                  Stock
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider text-center">
                  Status
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedInventory.length > 0 ? (
                paginatedInventory.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-black/5 last:border-0 hover:bg-[#F8F6F2]/50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-12 bg-[#E5E0D8] rounded-[4px] overflow-hidden relative shrink-0 border border-black/5">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-[13px] font-semibold text-[#2d2a26]">
                          {item.name}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[13px] text-[#6b6762]">
                      {item.sku}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: item.variant.colorCode }}
                        ></div>
                        <span className="text-[13px] text-[#6b6762]">
                          {item.variant.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`text-[13px] font-semibold ${getStockColor(item.stock)}`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-block px-3 py-1.5 text-[11px] font-semibold rounded-md tracking-wide ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-[12px] text-[#2d2a26]">{item.lastUpdated.split('\n')[0]}</p>
                      <p className="text-[11px] text-[#6b6762]">{item.lastUpdated.split('\n')[1]}</p>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => {
                          setAdjustItem(item);
                          setNewStockValue(item.stock.toString());
                        }}
                        className="w-8 h-8 rounded border border-black/10 inline-flex items-center justify-center text-[#6b6762] hover:bg-black/5 hover:text-[#2d2a26] transition-colors"
                        title="Edit Stock"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[13px] text-[#6b6762]">
                    No inventory items found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[13px] text-[#6b6762]">
              Showing {((activePage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(activePage * ITEMS_PER_PAGE, filteredInventory.length)} of {filteredInventory.length} variants
            </p>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setActivePage(Math.max(1, activePage - 1))}
                className="w-8 h-8 flex items-center justify-center rounded border border-black/10 text-[#6b6762] hover:bg-black/5 disabled:opacity-50 transition-colors"
                disabled={activePage === 1}
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setActivePage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded text-[13px] font-medium transition-colors ${
                    activePage === i + 1 
                      ? "bg-[#B48C5A] text-white border-transparent" 
                      : "border border-transparent text-[#6b6762] hover:bg-black/5"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button 
                onClick={() => setActivePage(Math.min(totalPages, activePage + 1))}
                className="w-8 h-8 flex items-center justify-center rounded border border-black/10 text-[#6b6762] hover:bg-black/5 disabled:opacity-50 transition-colors"
                disabled={activePage === totalPages}
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal 
        isOpen={!!adjustItem} 
        onClose={() => setAdjustItem(null)}
        title="Adjust Stock"
      >
        <div className="space-y-6">
          <p className="text-[14px] text-[#6b6762]">
            Adjust stock for <strong>{adjustItem?.name} ({adjustItem?.variant.label})</strong>.
          </p>
          
          <div>
            <label className="block text-[12px] font-medium text-[#6b6762] mb-1.5">New Stock Value</label>
            <input 
              type="number" 
              value={newStockValue}
              onChange={(e) => setNewStockValue(e.target.value)}
              className="w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#B48C5A]"
            />
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button 
              onClick={() => setAdjustItem(null)}
              className="px-4 py-2 border border-black/10 rounded-[8px] text-[13px] font-medium text-[#2d2a26] hover:bg-black/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={confirmAdjust}
              className="px-4 py-2 bg-[#B48C5A] border border-transparent rounded-[8px] text-[13px] font-medium text-white hover:bg-[#a07c50] transition-colors shadow-sm"
            >
              Save Stock
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

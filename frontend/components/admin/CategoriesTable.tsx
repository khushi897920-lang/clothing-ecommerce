"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Modal from "./Modal";

type GenderCategory = "Men" | "Women" | "Unisex";
type CategoryStatus = "Active" | "Inactive";

interface Category {
  id: string;
  name: string;
  slug: string;
  gender: GenderCategory;
  productsCount: number;
  status: CategoryStatus;
  image: string;
}

const MOCK_CATEGORIES_INITIAL: Category[] = [
  {
    id: "1",
    name: "T-Shirts",
    slug: "t-shirts",
    gender: "Men",
    productsCount: 56,
    status: "Active",
    image: "/images/product_cotton_tee.jpg",
  },
  {
    id: "2",
    name: "Dresses",
    slug: "dresses",
    gender: "Women",
    productsCount: 61,
    status: "Active",
    image: "/images/product_linen_shirt.jpg", 
  },
  {
    id: "3",
    name: "Shirts",
    slug: "shirts",
    gender: "Men",
    productsCount: 42,
    status: "Active",
    image: "/images/product_linen_shirt.jpg", 
  },
  {
    id: "4",
    name: "Co-ord Sets",
    slug: "co-ord-sets",
    gender: "Women",
    productsCount: 33,
    status: "Active",
    image: "/images/grace in every thread.png", 
  },
  {
    id: "5",
    name: "Jeans",
    slug: "jeans",
    gender: "Unisex",
    productsCount: 75,
    status: "Active",
    image: "/images/product_tailored_blazer.jpg", 
  },
  {
    id: "6",
    name: "Hoodies",
    slug: "hoodies",
    gender: "Unisex",
    productsCount: 24,
    status: "Active",
    image: "/images/product_cotton_jacket.jpg", 
  },
  {
    id: "7",
    name: "Jackets",
    slug: "jackets",
    gender: "Men",
    productsCount: 28,
    status: "Active",
    image: "/images/product_cotton_jacket.jpg", 
  },
  {
    id: "8",
    name: "Accessories",
    slug: "accessories",
    gender: "Unisex",
    productsCount: 18,
    status: "Inactive",
    image: "/images/grace in every thread.png", 
  },
];

const GENDERS = ["All Genders", "Men", "Women", "Unisex"];
const STATUSES = ["All Status", "Active", "Inactive"];
const ITEMS_PER_PAGE = 5;

export default function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES_INITIAL);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState("All Genders");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  const genderRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(1);

  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (genderRef.current && !genderRef.current.contains(event.target as Node)) {
        setShowGenderDropdown(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getGenderBadge = (gender: GenderCategory) => {
    switch (gender) {
      case "Men":
        return "bg-[#eef3f7] text-[#4d6a80]"; 
      case "Women":
        return "bg-[#faeeed] text-[#b34c3e]"; 
      case "Unisex":
        return "bg-[#f9f3ea] text-[#9a7b54]"; 
    }
  };

  const getStatusBadge = (status: CategoryStatus) => {
    switch (status) {
      case "Active":
        return "bg-[#eef4ef] text-[#4d7050]";
      case "Inactive":
        return "bg-[#faeeed] text-[#b34c3e]";
    }
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(c => c.id !== categoryToDelete.id));
      setCategoryToDelete(null);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGender("All Genders");
    setSelectedStatus("All Status");
  };

  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) || category.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = selectedGender === "All Genders" || category.gender === selectedGender;
    const matchesStatus = selectedStatus === "All Status" || category.status === selectedStatus;
    
    return matchesSearch && matchesGender && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const paginatedCategories = filteredCategories.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);

  useEffect(() => {
    setActivePage(1);
  }, [searchQuery, selectedGender, selectedStatus]);

  return (
    <>
      <div className="bg-white border border-black/5 rounded-[12px] shadow-[0_2px_10px_rgba(0,0,0,0.01)] flex flex-col font-sans w-full">
        {/* Toolbar */}
        <div className="p-6 border-b border-black/5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative w-full lg:w-[320px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#a39e99]">
              search
            </span>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white border border-black/10 rounded-[8px] text-[13px] outline-none focus:border-[#b09b85] transition-colors placeholder:text-[#a39e99]"
            />
          </div>

          <div className="flex items-center space-x-3 overflow-x-auto pb-1 lg:pb-0">
            <button 
              onClick={clearFilters}
              className="flex items-center space-x-2 border border-black/10 rounded-[8px] px-4 py-2 hover:bg-black/5 transition-colors text-[13px] font-medium text-[#2d2a26] whitespace-nowrap shrink-0"
            >
              <span className="material-symbols-outlined text-[16px] text-[#6b6762]">filter_alt_off</span>
              <span>Clear</span>
            </button>

            {/* Gender Dropdown */}
            <div className="relative shrink-0" ref={genderRef}>
              <button 
                onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                className="flex items-center space-x-2 border border-black/10 rounded-[8px] px-4 py-2 hover:bg-black/5 transition-colors text-[13px] font-medium text-[#2d2a26] min-w-[140px] justify-between"
              >
                <div className="flex items-center space-x-2">
                  <span className="material-symbols-outlined text-[16px] text-[#6b6762]">filter_alt</span>
                  <span>{selectedGender}</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#6b6762] transition-transform" style={{ transform: showGenderDropdown ? 'rotate(180deg)' : 'none' }}>
                  expand_more
                </span>
              </button>
              {showGenderDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-black/5 rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] py-1 z-20">
                  {GENDERS.map((gender) => (
                    <button
                      key={gender}
                      onClick={() => {
                        setSelectedGender(gender);
                        setShowGenderDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-[13px] hover:bg-[#F8F6F2] transition-colors ${
                        selectedGender === gender ? 'text-[#B48C5A] font-medium' : 'text-[#2d2a26]'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="relative shrink-0" ref={statusRef}>
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
                <div className="absolute right-0 mt-2 w-32 bg-white border border-black/5 rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] py-1 z-20">
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
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-black/5 bg-[#FAFAFA]">
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider w-[35%]">
                  Category
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider">
                  Slug
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider text-center">
                  Gender
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider text-center">
                  Products
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider text-center">
                  Status
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.length > 0 ? (
                paginatedCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-black/5 last:border-0 hover:bg-[#F8F6F2]/50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-[#E5E0D8] rounded-[6px] overflow-hidden relative shrink-0 border border-black/5">
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-[13px] font-semibold text-[#2d2a26]">
                          {category.name}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[13px] text-[#6b6762]">
                      {category.slug}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 text-[11px] font-medium rounded-md tracking-wide ${getGenderBadge(
                          category.gender
                        )}`}
                      >
                        {category.gender}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-[13px] font-semibold text-[#2d2a26]">
                        {category.productsCount}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-block px-3 py-1.5 text-[11px] font-medium rounded-md tracking-wide ${getStatusBadge(
                          category.status
                        )}`}
                      >
                        {category.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => alert(`Edit ${category.name}`)}
                          className="w-8 h-8 rounded border border-black/10 flex items-center justify-center text-[#6b6762] hover:bg-black/5 hover:text-[#2d2a26] transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button 
                          onClick={() => setCategoryToDelete(category)}
                          className="w-8 h-8 rounded border border-[#faeeed] bg-[#fff] flex items-center justify-center text-[#D35446] hover:bg-[#faeeed] transition-colors"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[13px] text-[#6b6762]">
                    No categories found matching your filters.
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
              Showing {((activePage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(activePage * ITEMS_PER_PAGE, filteredCategories.length)} of {filteredCategories.length} categories
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
        isOpen={!!categoryToDelete} 
        onClose={() => setCategoryToDelete(null)}
        title="Delete Category"
      >
        <div className="space-y-6">
          <p className="text-[14px] text-[#6b6762]">
            Are you sure you want to delete the <strong>{categoryToDelete?.name}</strong> category? This will also affect {categoryToDelete?.productsCount} products.
          </p>
          <div className="flex items-center justify-end space-x-3">
            <button 
              onClick={() => setCategoryToDelete(null)}
              className="px-4 py-2 border border-black/10 rounded-[8px] text-[13px] font-medium text-[#2d2a26] hover:bg-black/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={confirmDelete}
              className="px-4 py-2 bg-[#b34c3e] border border-transparent rounded-[8px] text-[13px] font-medium text-white hover:bg-[#a04235] transition-colors"
            >
              Delete Category
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "./Modal";
import { productApi } from "@/lib/apiClient"; // We will create this

type ProductStatus = "Active" | "Low Stock" | "Out of Stock";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  stock: number;
  status: ProductStatus;
  image: string;
}

const MOCK_PRODUCTS_INITIAL: Product[] = [
  {
    id: "1",
    name: "Oversized Cotton T-Shirt",
    sku: "TSH-001",
    category: "T-Shirts",
    price: 29.00,
    stock: 120,
    status: "Active",
    image: "/images/product_cotton_tee.jpg",
  },
  {
    id: "2",
    name: "Linen Casual Shirt",
    sku: "SHIRT-023",
    category: "Shirts",
    price: 49.00,
    stock: 80,
    status: "Active",
    image: "/images/product_linen_shirt.jpg",
  },
  {
    id: "3",
    name: "Essential Hoodie",
    sku: "HOOD-012",
    category: "Hoodies",
    price: 79.00,
    originalPrice: 99.00,
    discount: "20% OFF",
    stock: 65,
    status: "Active",
    image: "/images/product_cotton_jacket.jpg", 
  },
  {
    id: "4",
    name: "Slim Fit Jeans",
    sku: "JEAN-045",
    category: "Jeans",
    price: 69.00,
    stock: 55,
    status: "Active",
    image: "/images/product_tailored_blazer.jpg", 
  },
  {
    id: "5",
    name: "Cargo Joggers",
    sku: "JOG-009",
    category: "Joggers",
    price: 49.00,
    stock: 70,
    status: "Active",
    image: "/images/grace in every thread.png", 
  },
  {
    id: "6",
    name: "Checked Flannel Shirt",
    sku: "SHIRT-056",
    category: "Shirts",
    price: 44.00,
    stock: 30,
    status: "Low Stock",
    image: "/images/product_linen_shirt.jpg", 
  },
  {
    id: "7",
    name: "Bomber Jacket",
    sku: "JKT-021",
    category: "Jackets",
    price: 99.00,
    stock: 0,
    status: "Out of Stock",
    image: "/images/product_cotton_jacket.jpg", 
  },
];

const CATEGORIES = ["All Categories", "T-Shirts", "Shirts", "Hoodies", "Jeans", "Joggers", "Jackets"];
const STATUSES = ["All Status", "Active", "Low Stock", "Out of Stock"];
const ITEMS_PER_PAGE = 5;

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  const categoryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(1);

  // Modal State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    productApi.getAdminProducts().then(({ data, error: apiError }) => {
      if (apiError) {
        setError(apiError);
        setProducts([]);
      } else if (data?.products) {
        setProducts(
          data.products.map((p: any) => ({
            id: p.id,
            name: p.name,
            sku: p.sku || `SKU-${p.id.slice(0, 5)}`,
            category: p.category?.name || "Apparel",
            price: parseFloat(p.price || "0"),
            stock: p.variants?.reduce((acc: number, v: any) => acc + (v.stockQuantity || 0), 0) || 0,
            status: p.isActive ? (p.variants?.some((v: any) => (v.stockQuantity || 0) > 0) ? "Active" : "Out of Stock") : "Out of Stock",
            image: p.images?.[0]?.imageUrl || p.imageUrl || "/ABOUT_BG.png",
          }))
        );
      } else {
        setProducts([]);
      }
      setLoading(false);
    });
  }, []);

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

  // Filtering Logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || p.category === selectedCategory;
    const matchesStatus = selectedStatus === "All Status" || p.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);

  // Reset page when filters change
  useEffect(() => {
    setActivePage(1);
  }, [searchQuery, selectedCategory, selectedStatus]);

  const getStockColor = (stock: number) => {
    if (stock === 0) return "text-[#D35446]"; // Red
    if (stock <= 30) return "text-[#D38B46]"; // Orange/Gold
    return "text-[#588157]"; // Green
  };

  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case "Active":
        return "bg-[#eef4ef] text-[#4d7050]";
      case "Low Stock":
        return "bg-[#f9f3ea] text-[#9a7b54]";
      case "Out of Stock":
        return "bg-[#faeeed] text-[#b34c3e]";
    }
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete.id));
      await productApi.deleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  return (
    <>
      <div className="bg-white border border-black/5 rounded-[12px] shadow-[0_2px_10px_rgba(0,0,0,0.01)] flex flex-col font-sans w-full">
        {/* Toolbar */}
        <div className="p-6 border-b border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-[320px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#a39e99]">
              search
            </span>
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white border border-black/10 rounded-[8px] text-[13px] outline-none focus:border-[#b09b85] transition-colors placeholder:text-[#a39e99]"
            />
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Categories");
                setSelectedStatus("All Status");
              }}
              className="flex items-center space-x-2 border border-black/10 rounded-[8px] px-4 py-2 hover:bg-black/5 transition-colors text-[13px] font-medium text-[#2d2a26]"
            >
              <span className="material-symbols-outlined text-[18px] text-[#6b6762]">filter_alt_off</span>
              <span>Clear</span>
            </button>

            {/* Category Dropdown */}
            <div className="relative hidden md:block" ref={categoryRef}>
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
            <div className="relative hidden sm:block" ref={statusRef}>
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
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-black/5 bg-[#FAFAFA]">
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider w-[35%]">
                  Product
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider">
                  Category
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider">
                  Price
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider text-center">
                  Stock
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#a39e99]">
                    Loading products list...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-red-500 font-semibold">
                    Error: {error}
                  </td>
                </tr>
              ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-black/5 last:border-0 hover:bg-[#F8F6F2]/50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-12 bg-[#E5E0D8] rounded-[4px] overflow-hidden relative shrink-0 border border-black/5">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-[#2d2a26] mb-0.5">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-[#a39e99]">
                            SKU: {product.sku}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[13px] text-[#6b6762]">
                      {product.category}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-[13px] font-semibold text-[#2d2a26]">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[12px] text-[#a39e99] line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                        {product.discount && (
                          <span className="bg-[#faeeed] text-[#D35446] text-[10px] font-semibold px-1.5 py-0.5 rounded">
                            {product.discount}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`text-[13px] font-semibold ${getStockColor(product.stock)}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-block px-3 py-1.5 text-[11px] font-semibold rounded-md tracking-wide ${getStatusBadge(
                          product.status
                        )}`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link 
                          href="/admin/products/new"
                          className="w-8 h-8 rounded border border-black/10 flex items-center justify-center text-[#6b6762] hover:bg-black/5 hover:text-[#2d2a26] transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </Link>
                        <button 
                          onClick={() => setProductToDelete(product)}
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
                  <td colSpan={6} className="py-12 text-center">
                    <p className="text-[14px] font-medium text-[#2d2a26]">No products found</p>
                    <p className="text-[13px] text-[#6b6762] mt-1">Try adjusting your filters or search query.</p>
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
              Showing {((activePage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(activePage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
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
        isOpen={!!productToDelete} 
        onClose={() => setProductToDelete(null)}
        title="Delete Product"
      >
        <div className="space-y-6">
          <p className="text-[14px] text-[#6b6762]">
            Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end space-x-3">
            <button 
              onClick={() => setProductToDelete(null)}
              className="px-4 py-2 border border-black/10 rounded-[8px] text-[13px] font-medium text-[#2d2a26] hover:bg-black/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={confirmDelete}
              className="px-4 py-2 bg-[#b34c3e] border border-transparent rounded-[8px] text-[13px] font-medium text-white hover:bg-[#a04235] transition-colors"
            >
              Delete Product
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

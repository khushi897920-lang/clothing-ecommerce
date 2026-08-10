"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    productType: "",
    sellingPrice: "",
    originalPrice: "",
    discount: "",
    tax: "",
    sku: "",
    stockQuantity: "",
    lowStockThreshold: "",
    trackInventory: true,
    seoTitle: "",
    metaDescription: "",
    urlSlug: "",
    status: "Draft",
    isFeatured: false,
  });

  const [variants, setVariants] = useState([{ size: "", color: "" }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAddVariant = () => {
    setVariants([...variants, { size: "", color: "" }]);
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handleVariantChange = (index: number, field: string, value: string) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.sellingPrice || isNaN(Number(formData.sellingPrice))) newErrors.sellingPrice = "Valid price is required";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (!formData.stockQuantity || isNaN(Number(formData.stockQuantity))) newErrors.stockQuantity = "Valid stock quantity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowToast(true);
      
      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
    }, 800);
  };

  return (
    <AdminLayout>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 bg-white border-l-4 border-[#4d7050] shadow-lg rounded p-4 z-50 animate-fade-in flex items-center space-x-3">
          <span className="material-symbols-outlined text-[#4d7050]">check_circle</span>
          <div>
            <p className="text-[14px] font-semibold text-[#2d2a26]">Success</p>
            <p className="text-[12px] text-[#6b6762]">Product added successfully.</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Link href="/admin/products" className="text-[#a39e99] hover:text-[#2d2a26] transition-colors flex items-center">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <h1 className="text-[30px] font-serif font-bold text-[#2d2a26] leading-none mb-1">
            Add New Product
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
            className="px-5 py-2.5 border border-black/10 rounded-[8px] text-[13px] font-medium text-[#2d2a26] hover:bg-black/5 transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button 
            onClick={(e) => handleSubmit(e, false)}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-[#B48C5A] rounded-[8px] text-[13px] font-medium text-white hover:bg-[#a07c50] transition-colors shadow-sm disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? (
              <span className="material-symbols-outlined animate-spin mr-2 text-[16px]">sync</span>
            ) : null}
            Add Product
          </button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Column */}
        <div className="flex-1 space-y-6">
          
          {/* Basic Info */}
          <section className="bg-white border border-black/5 rounded-[12px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
            <h2 className="text-[16px] font-semibold text-[#2d2a26] mb-6 border-b border-black/5 pb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#6b6762] mb-1.5">Product Name <span className="text-[#b34c3e]">*</span></label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.name ? 'border-[#b34c3e]' : 'border-black/10'} rounded-[8px] px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#B48C5A]`}
                  placeholder="e.g. Oversized Cotton T-Shirt"
                />
                {errors.name && <p className="text-[#b34c3e] text-[11px] mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-[12px] font-medium text-[#6b6762] mb-1.5">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#B48C5A] resize-none"
                  placeholder="Describe the product..."
                />
              </div>
            </div>
          </section>
          
          {/* Images */}
          <section className="bg-white border border-black/5 rounded-[12px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
            <h2 className="text-[16px] font-semibold text-[#2d2a26] mb-6 border-b border-black/5 pb-4">Media</h2>
            
            <div className="border-2 border-dashed border-black/10 rounded-[8px] p-8 flex flex-col items-center justify-center text-center hover:bg-black/5 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[32px] text-[#a39e99] mb-3">cloud_upload</span>
              <p className="text-[14px] font-medium text-[#2d2a26] mb-1">Drag and drop your images here</p>
              <p className="text-[12px] text-[#6b6762] mb-4">or click to browse files</p>
              <button className="px-4 py-2 border border-black/10 rounded text-[12px] font-medium text-[#2d2a26] bg-white">
                Browse Files
              </button>
            </div>
          </section>

          {/* Pricing */}
          <section className="bg-white border border-black/5 rounded-[12px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
            <h2 className="text-[16px] font-semibold text-[#2d2a26] mb-6 border-b border-black/5 pb-4">Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-[#6b6762] mb-1.5">Selling Price ($) <span className="text-[#b34c3e]">*</span></label>
                <input 
                  type="number" 
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleInputChange}
                  step="0.01"
                  className={`w-full border ${errors.sellingPrice ? 'border-[#b34c3e]' : 'border-black/10'} rounded-[8px] px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#B48C5A]`}
                  placeholder="0.00"
                />
                {errors.sellingPrice && <p className="text-[#b34c3e] text-[11px] mt-1">{errors.sellingPrice}</p>}
              </div>
              
              <div>
                <label className="block text-[12px] font-medium text-[#6b6762] mb-1.5">Original Price ($)</label>
                <input 
                  type="number" 
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#B48C5A]"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-[12px] font-medium text-[#6b6762] mb-1.5">Discount (%)</label>
                <input 
                  type="number" 
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#B48C5A]"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#6b6762] mb-1.5">Tax Class</label>
                <select 
                  name="tax"
                  value={formData.tax}
                  onChange={handleInputChange}
                  className="w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#B48C5A] bg-white"
                >
                  <option value="">Standard Tax</option>
                  <option value="exempt">Tax Exempt</option>
                </select>
              </div>
            </div>
          </section>

          {/* Inventory */}
          <section className="bg-white border border-black/5 rounded-[12px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
            <h2 className="text-[16px] font-semibold text-[#2d2a26] mb-6 border-b border-black/5 pb-4">Inventory</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[12px] font-medium text-[#6b6762] mb-1.5">SKU (Stock Keeping Unit) <span className="text-[#b34c3e]">*</span></label>
                <input 
                  type="text" 
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.sku ? 'border-[#b34c3e]' : 'border-black/10'} rounded-[8px] px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#B48C5A]`}
                  placeholder="e.g. TSH-001"
                />
                {errors.sku && <p className="text-[#b34c3e] text-[11px] mt-1">{errors.sku}</p>}
              </div>
              
              <div>
                <label className="block text-[12px] font-medium text-[#6b6762] mb-1.5">Stock Quantity <span className="text-[#b34c3e]">*</span></label>
                <input 
                  type="number" 
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.stockQuantity ? 'border-[#b34c3e]' : 'border-black/10'} rounded-[8px] px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#B48C5A]`}
                  placeholder="0"
                />
                {errors.stockQuantity && <p className="text-[#b34c3e] text-[11px] mt-1">{errors.stockQuantity}</p>}
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#6b6762] mb-1.5">Low Stock Threshold</label>
                <input 
                  type="number" 
                  name="lowStockThreshold"
                  value={formData.lowStockThreshold}
                  onChange={handleInputChange}
                  className="w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#B48C5A]"
                  placeholder="10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <input 
                type="checkbox" 
                id="trackInventory"
                name="trackInventory"
                checked={formData.trackInventory}
                onChange={handleInputChange}
                className="w-4 h-4 accent-[#B48C5A]"
              />
              <label htmlFor="trackInventory" className="text-[13px] text-[#2d2a26]">Track inventory for this product</label>
            </div>
          </section>

          {/* Variants */}
          <section className="bg-white border border-black/5 rounded-[12px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
            <div className="flex items-center justify-between border-b border-black/5 pb-4 mb-6">
              <h2 className="text-[16px] font-semibold text-[#2d2a26]">Variants</h2>
              <button 
                type="button"
                onClick={handleAddVariant}
                className="text-[12px] font-medium text-[#B48C5A] hover:text-[#2d2a26] transition-colors"
              >
                + Add Variant
              </button>
            </div>
            
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={index} className="flex items-end gap-4 p-4 border border-black/5 rounded-[8px] bg-[#FAFAFA]">
                  <div className="flex-1">
                    <label className="block text-[12px] font-medium text-[#6b6762] mb-1.5">Size</label>
                    <input 
                      type="text" 
                      value={variant.size}
                      onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                      className="w-full border border-black/10 rounded-[8px] px-4 py-2 text-[13px] focus:outline-none focus:border-[#B48C5A]"
                      placeholder="e.g. S, M, L"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[12px] font-medium text-[#6b6762] mb-1.5">Color</label>
                    <input 
                      type="text" 
                      value={variant.color}
                      onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                      className="w-full border border-black/10 rounded-[8px] px-4 py-2 text-[13px] focus:outline-none focus:border-[#B48C5A]"
                      placeholder="e.g. Black, White"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleRemoveVariant(index)}
                    disabled={variants.length === 1}
                    className="h-[38px] w-[38px] flex items-center justify-center rounded border border-black/10 text-[#6b6762] hover:text-[#b34c3e] hover:border-[#b34c3e] transition-colors disabled:opacity-30 disabled:hover:border-black/10 disabled:hover:text-[#6b6762]"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
        
        {/* Sidebar Column */}
        <div className="w-full lg:w-[320px] space-y-6">
          
          {/* Status */}
          <section className="bg-white border border-black/5 rounded-[12px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
            <h2 className="text-[16px] font-semibold text-[#2d2a26] mb-4">Status</h2>
            
            <select 
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#B48C5A] bg-white mb-4"
            >
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>

            <div className="flex items-center space-x-2 pt-4 border-t border-black/5">
              <input 
                type="checkbox" 
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="w-4 h-4 accent-[#B48C5A]"
              />
              <label htmlFor="isFeatured" className="text-[13px] text-[#2d2a26]">Featured Product</label>
            </div>
          </section>

          {/* Organization */}
          <section className="bg-white border border-black/5 rounded-[12px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
            <h2 className="text-[16px] font-semibold text-[#2d2a26] mb-4">Organization</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#6b6762] mb-1.5">Category <span className="text-[#b34c3e]">*</span></label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.category ? 'border-[#b34c3e]' : 'border-black/10'} rounded-[8px] px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#B48C5A] bg-white`}
                >
                  <option value="">Select category...</option>
                  <option value="mens">Men's Clothing</option>
                  <option value="womens">Women's Clothing</option>
                  <option value="unisex">Unisex</option>
                  <option value="accessories">Accessories</option>
                </select>
                {errors.category && <p className="text-[#b34c3e] text-[11px] mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#6b6762] mb-1.5">Product Type</label>
                <input 
                  type="text" 
                  name="productType"
                  value={formData.productType}
                  onChange={handleInputChange}
                  className="w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#B48C5A]"
                  placeholder="e.g. T-Shirt, Jeans"
                />
              </div>
            </div>
          </section>

          {/* SEO */}
          <section className="bg-white border border-black/5 rounded-[12px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
            <h2 className="text-[16px] font-semibold text-[#2d2a26] mb-4">Search Engine Optimization</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#6b6762] mb-1.5">Page Title</label>
                <input 
                  type="text" 
                  name="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleInputChange}
                  className="w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#B48C5A]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#6b6762] mb-1.5">Meta Description</label>
                <textarea 
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#B48C5A] resize-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#6b6762] mb-1.5">URL Handle</label>
                <input 
                  type="text" 
                  name="urlSlug"
                  value={formData.urlSlug}
                  onChange={handleInputChange}
                  className="w-full border border-black/10 rounded-[8px] px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#B48C5A]"
                  placeholder="e.g. oversized-cotton-t-shirt"
                />
              </div>
            </div>
          </section>
          
        </div>
      </div>
    </AdminLayout>
  );
}

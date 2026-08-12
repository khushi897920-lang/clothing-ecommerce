import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import CategoriesTable from "@/components/admin/CategoriesTable";
import Link from "next/link";

export default function CategoriesPage() {
  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-[36px] md:text-[42px] font-serif font-bold text-[#2d2a26] leading-none mb-2">
            Categories
          </h1>
          <p className="text-[14px] text-[#6b6762]">
            Manage all product categories in your store.
          </p>
        </div>
        
        <Link 
          href="/admin/categories/new"
          className="flex items-center space-x-2 bg-[#B48C5A] hover:bg-[#967448] transition-colors text-white rounded-lg px-6 py-2.5 text-[13px] font-medium self-start md:self-auto shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add Category</span>
        </Link>
      </div>
      
      <CategoriesTable />
    </AdminLayout>
  );
}

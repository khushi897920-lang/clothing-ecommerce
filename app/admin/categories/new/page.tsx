import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";

export default function NewCategoryPage() {
  return (
    <AdminLayout>
      <div className="flex items-center space-x-3 mb-8">
        <Link href="/admin/categories" className="text-[#a39e99] hover:text-[#2d2a26] transition-colors flex items-center">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-[30px] font-serif font-bold text-[#2d2a26] leading-none mb-1">
            Add New Category
          </h1>
        </div>
      </div>
      
      <div className="bg-white border border-black/5 rounded-[12px] p-12 shadow-[0_2px_10px_rgba(0,0,0,0.01)] flex flex-col items-center justify-center text-center min-h-[400px]">
        <span className="material-symbols-outlined text-[48px] text-[#a39e99] mb-4">
          add_circle
        </span>
        <h2 className="text-[18px] font-medium text-[#2d2a26] mb-2">Category Creator Coming Soon</h2>
        <p className="text-[14px] text-[#6b6762] max-w-md">
          The category creation form is under development.
        </p>
      </div>
    </AdminLayout>
  );
}

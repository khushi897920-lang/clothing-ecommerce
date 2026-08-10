import React from "react";
import Image from "next/image";
import Link from "next/link";

interface TopProduct {
  id: string;
  name: string;
  sold: number;
  revenue: string;
  image: string;
}

interface TopProductsListProps {
  products: TopProduct[];
}

export default function TopProductsList({ products }: TopProductsListProps) {
  return (
    <div className="bg-white border border-black/5 rounded-[12px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.01)] flex flex-col h-full font-sans">
      <h3 className="text-[15px] font-semibold text-[#2d2a26] mb-4">Top Selling Products</h3>
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 pb-2 mb-3">
          <span className="text-[11px] font-medium text-[#a39e99] uppercase tracking-wider w-[55%]">Product</span>
          <span className="text-[11px] font-medium text-[#a39e99] uppercase tracking-wider text-center w-[20%]">Sold</span>
          <span className="text-[11px] font-medium text-[#a39e99] uppercase tracking-wider text-right w-[25%]">Revenue</span>
        </div>
        
        {/* Product List */}
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between group">
              <div className="flex items-center space-x-3 w-[55%]">
                <div className="w-8 h-10 bg-[#F8F6F2] rounded overflow-hidden relative shrink-0 border border-black/5">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-[12px] font-medium text-[#2d2a26] truncate pr-2 group-hover:text-[#B48C5A] transition-colors cursor-pointer">
                  {product.name}
                </span>
              </div>
              <span className="text-[12px] text-[#6b6762] text-center w-[20%]">
                {product.sold}
              </span>
              <span className="text-[12px] font-medium text-[#2d2a26] text-right w-[25%]">
                {product.revenue}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-black/5">
        <Link 
          href="/admin/products"
          className="text-[12px] font-medium text-[#6b6762] hover:text-[#2d2a26] transition-colors flex items-center justify-between group"
        >
          <span>View all products</span>
          <span className="material-symbols-outlined text-[16px] transform group-hover:translate-x-1 transition-transform">
            chevron_right
          </span>
        </Link>
      </div>
    </div>
  );
}

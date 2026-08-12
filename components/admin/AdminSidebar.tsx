"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const NAV_ITEMS = [
  { name: "Dashboard", icon: "dashboard", href: "/admin/dashboard" },
  { name: "Products", icon: "inventory_2", href: "/admin/products" },
  { name: "Categories", icon: "category", href: "/admin/categories" },
  { name: "Inventory", icon: "warehouse", href: "/admin/inventory" },
  { name: "Orders", icon: "receipt_long", href: "/admin/orders" },
  { name: "Payments / Refunds", icon: "payments", href: "/admin/payments" },
  { name: "Analytics", icon: "bar_chart", href: "/admin/analytics" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    alert("Logging out...");
    router.push("/");
  };

  return (
    <aside className="w-[240px] h-screen fixed left-0 top-0 bg-[#fcf9f6] border-r border-black/5 flex flex-col z-40 font-sans text-[#1c1c1a]">
      <div className="h-[72px] flex items-center px-8 border-b border-black/5">
        <Link href="/" className="text-2xl font-serif tracking-widest font-normal hover:opacity-70 transition-opacity">
          YUGEN
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col space-y-8">
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-[13px] font-medium ${
                  isActive
                    ? "bg-[#B48C5A]/10 text-[#2d2a26]"
                    : "text-[#6b6762] hover:bg-black/5 hover:text-[#2d2a26]"
                }`}
              >
                <span className="material-symbols-outlined text-[20px] font-light">
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4">
          <p className="text-[10px] uppercase tracking-[0.15em] font-medium text-[#6b6762] mb-4">
            Quick Actions
          </p>
          <div className="space-y-2">
            <Link
              href="/admin/products/new"
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg border border-black/10 hover:border-black/20 hover:bg-black/5 transition-colors text-[12px] font-medium text-[#2d2a26]"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add Product</span>
            </Link>
            <Link
              href="/admin/orders"
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg border border-black/10 hover:border-black/20 hover:bg-black/5 transition-colors text-[12px] font-medium text-[#2d2a26]"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>View Orders</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-black/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-[#6b6762] hover:bg-black/5 hover:text-[#2d2a26] transition-colors text-[13px] font-medium"
        >
          <span className="material-symbols-outlined text-[20px] font-light">
            logout
          </span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

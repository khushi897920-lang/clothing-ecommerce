import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import InventoryStatCard from "@/components/admin/InventoryStatCard";
import InventoryTable from "@/components/admin/InventoryTable";

export default function InventoryPage() {
  return (
    <AdminLayout>
      <div className="flex flex-col mb-8">
        <h1 className="text-[36px] md:text-[42px] font-serif font-bold text-[#2d2a26] leading-none mb-2">
          Inventory
        </h1>
        <p className="text-[14px] text-[#6b6762]">
          Monitor and manage product stock across all variants.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InventoryStatCard
          title="Total SKUs"
          value="256"
          subtitle="All variants"
          icon="inventory_2"
          iconBgColor="#eef4ef"
          iconColor="#4d7050"
        />
        <InventoryStatCard
          title="In Stock"
          value="214"
          subtitle="83.6% of total"
          icon="inventory"
          iconBgColor="#f9f3ea"
          iconColor="#9a7b54"
        />
        <InventoryStatCard
          title="Low Stock"
          value="28"
          subtitle="10.9% of total"
          icon="error"
          iconBgColor="#fdf0e6"
          iconColor="#c27429"
        />
        <InventoryStatCard
          title="Out of Stock"
          value="14"
          subtitle="5.5% of total"
          icon="cancel"
          iconBgColor="#faeeed"
          iconColor="#b34c3e"
        />
      </div>
      
      <InventoryTable />
    </AdminLayout>
  );
}

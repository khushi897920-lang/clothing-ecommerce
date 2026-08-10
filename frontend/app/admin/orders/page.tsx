import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import OrderSummaryCard from "@/components/admin/OrderSummaryCard";
import OrdersTable from "@/components/admin/OrdersTable";

export default function OrdersPage() {
  return (
    <AdminLayout>
      <div className="flex flex-col mb-8">
        <h1 className="text-[36px] md:text-[42px] font-serif font-bold text-[#2d2a26] leading-none mb-2">
          Orders
        </h1>
        <p className="text-[14px] text-[#6b6762]">
          View and manage all customer orders.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <OrderSummaryCard
          title="Total Orders"
          value="456"
          subtitle="All time"
          icon="shopping_bag"
          iconBgColor="#eef3f7"
          iconColor="#4d6a80"
        />
        <OrderSummaryCard
          title="Delivered"
          value="186"
          subtitle="40.8% of total"
          icon="receipt_long"
          iconBgColor="#eef4ef"
          iconColor="#4d7050"
        />
        <OrderSummaryCard
          title="Processing"
          value="102"
          subtitle="22.4% of total"
          icon="local_shipping"
          iconBgColor="#f9f3ea"
          iconColor="#9a7b54"
        />
        <OrderSummaryCard
          title="Shipped"
          value="128"
          subtitle="28.1% of total"
          icon="inventory_2"
          iconBgColor="#f2eefa"
          iconColor="#6b5b95"
        />
        <OrderSummaryCard
          title="Cancelled"
          value="40"
          subtitle="8.7% of total"
          icon="cancel"
          iconBgColor="#faeeed"
          iconColor="#b34c3e"
        />
      </div>
      
      <OrdersTable />
    </AdminLayout>
  );
}

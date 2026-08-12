import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import OrderSummaryCard from "@/components/admin/OrderSummaryCard";
import PaymentsTable from "@/components/admin/PaymentsTable";

export default function PaymentsPage() {
  return (
    <AdminLayout>
      <div className="flex flex-col mb-8">
        <h1 className="text-[36px] md:text-[42px] font-serif font-bold text-[#2d2a26] leading-none mb-2">
          Payments
        </h1>
        <p className="text-[14px] text-[#6b6762]">
          Track and manage all payments and refunds.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <OrderSummaryCard
          title="Total Revenue"
          value="$28,540.60"
          subtitle="All time"
          icon="monetization_on"
          iconBgColor="#eef4ef"
          iconColor="#4d7050"
        />
        <OrderSummaryCard
          title="Successful Payments"
          value="412"
          subtitle="90.4% of total"
          icon="account_balance_wallet"
          iconBgColor="#eef4ef"
          iconColor="#4d7050"
        />
        <OrderSummaryCard
          title="Pending Payments"
          value="18"
          subtitle="3.9% of total"
          icon="pending_actions"
          iconBgColor="#f9f3ea"
          iconColor="#9a7b54"
        />
        <OrderSummaryCard
          title="Refunds Issued"
          value="26"
          subtitle="5.7% of total"
          icon="settings_backup_restore"
          iconBgColor="#faeeed"
          iconColor="#b34c3e"
        />
      </div>
      
      <PaymentsTable />
    </AdminLayout>
  );
}

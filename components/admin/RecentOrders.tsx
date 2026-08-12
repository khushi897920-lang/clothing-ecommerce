import React from "react";
import Image from "next/image";
import Link from "next/link";

type OrderStatus = "Delivered" | "Shipped" | "Processing" | "Cancelled";

const RECENT_ORDERS = [
  {
    id: "#ORD-10234",
    customer: "Sarah Johnson",
    date: "May 21, 2024",
    amount: "$129.00",
    status: "Delivered" as OrderStatus,
  },
  {
    id: "#ORD-10233",
    customer: "Michael Brown",
    date: "May 21, 2024",
    amount: "$89.50",
    status: "Shipped" as OrderStatus,
  },
  {
    id: "#ORD-10232",
    customer: "Emily Davis",
    date: "May 20, 2024",
    amount: "$159.90",
    status: "Processing" as OrderStatus,
  },
  {
    id: "#ORD-10231",
    customer: "David Wilson",
    date: "May 20, 2024",
    amount: "$69.00",
    status: "Delivered" as OrderStatus,
  },
  {
    id: "#ORD-10230",
    customer: "Jessica Miller",
    date: "May 19, 2024",
    amount: "$199.00",
    status: "Cancelled" as OrderStatus,
  },
];

const getStatusBadgeStyles = (status: OrderStatus) => {
  switch (status) {
    case "Delivered":
      return "bg-[#eef4ef] text-[#4d7050]";
    case "Shipped":
      return "bg-[#eef3f7] text-[#4d6a80]";
    case "Processing":
      return "bg-[#f9f3ea] text-[#9a7b54]";
    case "Cancelled":
      return "bg-[#faeeed] text-[#b34c3e]";
    default:
      return "bg-black/5 text-[#6b6762]";
  }
};

export default function RecentOrders() {
  return (
    <div className="bg-white border border-black/5 rounded-[12px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.01)] flex flex-col font-sans">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[15px] font-semibold text-[#2d2a26]">Recent Orders</h3>
        <Link href="/admin/orders" className="text-[11px] font-medium text-[#B48C5A] hover:text-[#967448] transition-colors">
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-black/5">
              <th className="pb-3 text-[11px] font-medium text-[#a39e99] uppercase tracking-wider pl-2">
                Order ID
              </th>
              <th className="pb-3 text-[11px] font-medium text-[#a39e99] uppercase tracking-wider">
                Customer
              </th>
              <th className="pb-3 text-[11px] font-medium text-[#a39e99] uppercase tracking-wider">
                Date
              </th>
              <th className="pb-3 text-[11px] font-medium text-[#a39e99] uppercase tracking-wider">
                Amount
              </th>
              <th className="pb-3 text-[11px] font-medium text-[#a39e99] uppercase tracking-wider text-right pr-2">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {RECENT_ORDERS.map((order, index) => (
              <tr
                key={order.id}
                className="border-b border-black/5 last:border-0 hover:bg-[#F8F6F2] transition-colors group"
              >
                <td className="py-4 pl-2 text-[13px] font-medium text-[#2d2a26]">
                  {order.id}
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-full bg-[#E5E0D8] overflow-hidden relative flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#a39e99] text-[16px]">
                        person
                      </span>
                    </div>
                    <span className="text-[13px] text-[#2d2a26]">{order.customer}</span>
                  </div>
                </td>
                <td className="py-4 text-[13px] text-[#6b6762]">{order.date}</td>
                <td className="py-4 text-[13px] font-medium text-[#2d2a26]">
                  {order.amount}
                </td>
                <td className="py-4 text-right pr-2">
                  <span
                    className={`inline-block px-2.5 py-1 text-[10px] font-medium rounded-md tracking-wide ${getStatusBadgeStyles(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

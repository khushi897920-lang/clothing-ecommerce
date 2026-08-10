"use client";

import React, { useState, useRef, useEffect } from "react";
import Modal from "./Modal";

type OrderStatus = "Delivered" | "Shipped" | "Processing" | "Cancelled";
type PaymentStatus = "Paid" | "Pending";

interface Order {
  id: string;
  orderId: string;
  customer: string;
  email: string;
  date: string;
  time: string;
  items: number;
  amount: string;
  payment: PaymentStatus;
  status: OrderStatus;
  avatarColor: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    orderId: "#ORD-10234",
    customer: "Sarah Johnson",
    email: "sarah.j@gmail.com",
    date: "May 21, 2024",
    time: "10:30 AM",
    items: 3,
    amount: "$129.00",
    payment: "Paid",
    status: "Delivered",
    avatarColor: "#b27a5d",
  },
  {
    id: "2",
    orderId: "#ORD-10233",
    customer: "Michael Brown",
    email: "michael.b@gmail.com",
    date: "May 21, 2024",
    time: "09:15 AM",
    items: 2,
    amount: "$89.50",
    payment: "Paid",
    status: "Shipped",
    avatarColor: "#4d6a80",
  },
  {
    id: "3",
    orderId: "#ORD-10232",
    customer: "Emily Davis",
    email: "emily.d@gmail.com",
    date: "May 20, 2024",
    time: "04:45 PM",
    items: 4,
    amount: "$159.90",
    payment: "Paid",
    status: "Processing",
    avatarColor: "#9a7b54",
  },
  {
    id: "4",
    orderId: "#ORD-10231",
    customer: "David Wilson",
    email: "david.w@gmail.com",
    date: "May 20, 2024",
    time: "11:20 AM",
    items: 1,
    amount: "$69.00",
    payment: "Paid",
    status: "Delivered",
    avatarColor: "#588157",
  },
  {
    id: "5",
    orderId: "#ORD-10230",
    customer: "Jessica Miller",
    email: "jessica.m@gmail.com",
    date: "May 19, 2024",
    time: "06:40 PM",
    items: 2,
    amount: "$199.00",
    payment: "Paid",
    status: "Cancelled",
    avatarColor: "#b34c3e",
  },
  {
    id: "6",
    orderId: "#ORD-10229",
    customer: "Daniel Taylor",
    email: "daniel.t@gmail.com",
    date: "May 19, 2024",
    time: "03:30 PM",
    items: 3,
    amount: "$109.00",
    payment: "Pending",
    status: "Processing",
    avatarColor: "#6a7b82",
  },
  {
    id: "7",
    orderId: "#ORD-10228",
    customer: "Olivia Martinez",
    email: "olivia.m@gmail.com",
    date: "May 18, 2024",
    time: "12:10 PM",
    items: 2,
    amount: "$84.00",
    payment: "Paid",
    status: "Shipped",
    avatarColor: "#d4a373",
  },
  {
    id: "8",
    orderId: "#ORD-10227",
    customer: "James Anderson",
    email: "james.a@gmail.com",
    date: "May 18, 2024",
    time: "09:05 AM",
    items: 1,
    amount: "$49.00",
    payment: "Paid",
    status: "Delivered",
    avatarColor: "#5e695d",
  },
];

const STATUSES = ["All Status", "Delivered", "Shipped", "Processing", "Cancelled"];
const PAYMENT_STATUSES = ["All Payment Status", "Paid", "Pending"];
const ITEMS_PER_PAGE = 5;

export default function OrdersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedPayment, setSelectedPayment] = useState("All Payment Status");
  
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  
  const statusRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(1);

  // Modal state
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
      if (paymentRef.current && !paymentRef.current.contains(event.target as Node)) {
        setShowPaymentDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Delivered":
        return "bg-[#eef4ef] text-[#4d7050]";
      case "Shipped":
        return "bg-[#eef3f7] text-[#4d6a80]";
      case "Processing":
        return "bg-[#f9f3ea] text-[#9a7b54]";
      case "Cancelled":
        return "bg-[#faeeed] text-[#b34c3e]";
    }
  };

  const getPaymentBadge = (payment: PaymentStatus) => {
    switch (payment) {
      case "Paid":
        return "bg-[#eef4ef] text-[#4d7050]";
      case "Pending":
        return "bg-[#f9f3ea] text-[#9a7b54]";
    }
  };

  // Local filtering logic
  const filteredOrders = MOCK_ORDERS.filter((order) => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = selectedStatus === "All Status" || order.status === selectedStatus;
    const matchesPayment = selectedPayment === "All Payment Status" || order.payment === selectedPayment;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);

  useEffect(() => {
    setActivePage(1);
  }, [searchQuery, selectedStatus, selectedPayment]);

  return (
    <>
      <div className="bg-white border border-black/5 rounded-[12px] shadow-[0_2px_10px_rgba(0,0,0,0.01)] flex flex-col font-sans w-full mt-8">
        {/* Toolbar */}
        <div className="p-6 border-b border-black/5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative w-full lg:w-[480px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#a39e99]">
              search
            </span>
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[42px] pl-10 pr-4 bg-white border border-black/10 rounded-[8px] text-[13px] outline-none focus:border-[#b09b85] transition-colors placeholder:text-[#a39e99]"
            />
          </div>

          <div className="flex items-center space-x-3 overflow-x-auto pb-1 lg:pb-0">
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedStatus("All Status");
                setSelectedPayment("All Payment Status");
              }}
              className="flex items-center space-x-2 border border-black/10 rounded-[8px] px-4 h-[42px] hover:bg-black/5 transition-colors text-[13px] font-medium text-[#2d2a26] shrink-0"
            >
              <span className="material-symbols-outlined text-[18px] text-[#6b6762]">filter_alt_off</span>
              <span>Clear</span>
            </button>

            {/* Status Dropdown */}
            <div className="relative shrink-0" ref={statusRef}>
              <button 
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center space-x-2 border border-black/10 rounded-[8px] px-4 h-[42px] hover:bg-black/5 transition-colors text-[13px] font-medium text-[#2d2a26] min-w-[130px] justify-between"
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

            {/* Payment Dropdown */}
            <div className="relative shrink-0" ref={paymentRef}>
              <button 
                onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
                className="flex items-center space-x-2 border border-black/10 rounded-[8px] px-4 h-[42px] hover:bg-black/5 transition-colors text-[13px] font-medium text-[#2d2a26] min-w-[160px] justify-between"
              >
                <span>{selectedPayment}</span>
                <span className="material-symbols-outlined text-[18px] text-[#6b6762] transition-transform" style={{ transform: showPaymentDropdown ? 'rotate(180deg)' : 'none' }}>
                  expand_more
                </span>
              </button>
              {showPaymentDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-black/5 rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] py-1 z-20">
                  {PAYMENT_STATUSES.map((stat) => (
                    <button
                      key={stat}
                      onClick={() => {
                        setSelectedPayment(stat);
                        setShowPaymentDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-[13px] hover:bg-[#F8F6F2] transition-colors ${
                        selectedPayment === stat ? 'text-[#B48C5A] font-medium' : 'text-[#2d2a26]'
                      }`}
                    >
                      {stat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="flex items-center space-x-3 bg-white border border-black/10 rounded-[8px] px-4 h-[42px] hover:bg-black/5 transition-colors text-[13px] text-[#2d2a26] font-medium shrink-0">
              <span className="material-symbols-outlined text-[16px] text-[#6b6762]">
                calendar_today
              </span>
              <span>May 15, 2024 - May 21, 2024</span>
              <span className="material-symbols-outlined text-[16px] text-[#6b6762]">
                expand_more
              </span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-black/5 bg-[#FAFAFA]">
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider">
                  Order ID
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider w-[25%]">
                  Customer
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider">
                  Date
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider text-center">
                  Items
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider">
                  Amount
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider text-center">
                  Payment
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
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-black/5 last:border-0 hover:bg-[#F8F6F2]/50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <span className="text-[13px] font-semibold text-[#2d2a26]">
                        {order.orderId}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-semibold shrink-0"
                          style={{ backgroundColor: order.avatarColor }}
                        >
                          {order.customer.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-[#2d2a26] mb-0.5">
                            {order.customer}
                          </p>
                          <p className="text-[11px] text-[#6b6762]">
                            {order.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-[13px] text-[#2d2a26] mb-0.5">{order.date}</p>
                      <p className="text-[11px] text-[#a39e99]">{order.time}</p>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-[13px] text-[#2d2a26]">
                        {order.items}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[13px] font-semibold text-[#2d2a26]">
                        {order.amount}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-md tracking-wide ${getPaymentBadge(
                          order.payment
                        )}`}
                      >
                        {order.payment}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-md tracking-wide ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => setViewingOrder(order)}
                        className="w-8 h-8 rounded border border-black/10 inline-flex items-center justify-center text-[#6b6762] hover:bg-black/5 hover:text-[#2d2a26] transition-colors"
                        title="View Order"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <p className="text-[14px] font-medium text-[#2d2a26]">No orders found</p>
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
              Showing {((activePage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(activePage * ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
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
        isOpen={!!viewingOrder} 
        onClose={() => setViewingOrder(null)}
        title={`Order ${viewingOrder?.orderId}`}
      >
        {viewingOrder && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-black/5 pb-4">
              <div>
                <p className="text-[12px] font-medium text-[#6b6762] mb-1">Customer</p>
                <p className="text-[14px] font-semibold text-[#2d2a26]">{viewingOrder.customer}</p>
                <p className="text-[12px] text-[#6b6762]">{viewingOrder.email}</p>
              </div>
              <div className="text-right">
                <p className="text-[12px] font-medium text-[#6b6762] mb-1">Order Total</p>
                <p className="text-[18px] font-bold text-[#2d2a26]">{viewingOrder.amount}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-b border-black/5 pb-4">
              <div>
                <p className="text-[12px] font-medium text-[#6b6762] mb-1">Status</p>
                <span className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-md tracking-wide ${getStatusBadge(viewingOrder.status)}`}>
                  {viewingOrder.status}
                </span>
              </div>
              <div>
                <p className="text-[12px] font-medium text-[#6b6762] mb-1">Payment</p>
                <span className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-md tracking-wide ${getPaymentBadge(viewingOrder.payment)}`}>
                  {viewingOrder.payment}
                </span>
              </div>
            </div>

            <div>
              <p className="text-[12px] font-medium text-[#6b6762] mb-2">Order Summary ({viewingOrder.items} items)</p>
              <div className="bg-[#FAFAFA] border border-black/5 rounded-[8px] p-4 text-[13px] text-[#2d2a26]">
                Mock items listing for order {viewingOrder.orderId}...
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

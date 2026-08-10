"use client";

import React, { useState, useRef, useEffect } from "react";
import Modal from "./Modal";

type PaymentStatus = "Paid" | "Pending" | "Refunded";
type PaymentMethodName = "Visa" | "Mastercard" | "UPI";

interface PaymentItem {
  id: string;
  transactionId: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
    avatarColor: string;
  };
  amount: string;
  paymentMethod: PaymentMethodName;
  paymentType: string;
  status: PaymentStatus;
  date: string;
  time: string;
}

const MOCK_PAYMENTS_INITIAL: PaymentItem[] = [
  {
    id: "1",
    transactionId: "txn_1PL8X9e2eZvKYlo2A1B2",
    orderId: "#ORD-10234",
    customer: { name: "Sarah Johnson", email: "sarah.j@gmail.com", avatarColor: "#b27a5d" },
    amount: "$129.00",
    paymentMethod: "Visa",
    paymentType: "Card",
    status: "Paid",
    date: "May 21, 2024",
    time: "10:30 AM",
  },
  {
    id: "2",
    transactionId: "txn_1PL8X7e2eZvKYlo2A1B3",
    orderId: "#ORD-10233",
    customer: { name: "Michael Brown", email: "michael.b@gmail.com", avatarColor: "#4d6a80" },
    amount: "$89.50",
    paymentMethod: "Mastercard",
    paymentType: "Card",
    status: "Paid",
    date: "May 21, 2024",
    time: "09:15 AM",
  },
  {
    id: "3",
    transactionId: "txn_1PL8X5e2eZvKYlo2A1B4",
    orderId: "#ORD-10232",
    customer: { name: "Emily Davis", email: "emily.d@gmail.com", avatarColor: "#9a7b54" },
    amount: "$159.90",
    paymentMethod: "Visa",
    paymentType: "Card",
    status: "Pending",
    date: "May 20, 2024",
    time: "04:45 PM",
  },
  {
    id: "4",
    transactionId: "txn_1PL8X3e2eZvKYlo2A1B5",
    orderId: "#ORD-10231",
    customer: { name: "David Wilson", email: "david.w@gmail.com", avatarColor: "#588157" },
    amount: "$69.00",
    paymentMethod: "UPI",
    paymentType: "",
    status: "Paid",
    date: "May 20, 2024",
    time: "11:20 AM",
  },
  {
    id: "5",
    transactionId: "txn_1PL8X1e2eZvKYlo2A1B6",
    orderId: "#ORD-10230",
    customer: { name: "Jessica Miller", email: "jessica.m@gmail.com", avatarColor: "#b34c3e" },
    amount: "$199.00",
    paymentMethod: "Visa",
    paymentType: "Card",
    status: "Refunded",
    date: "May 19, 2024",
    time: "06:40 PM",
  },
  {
    id: "6",
    transactionId: "txn_1PL8W9e2eZvKYlo2A1B7",
    orderId: "#ORD-10229",
    customer: { name: "Daniel Taylor", email: "daniel.t@gmail.com", avatarColor: "#6a7b82" },
    amount: "$109.00",
    paymentMethod: "UPI",
    paymentType: "",
    status: "Paid",
    date: "May 19, 2024",
    time: "03:30 PM",
  },
  {
    id: "7",
    transactionId: "txn_1PL8W7e2eZvKYlo2A1B8",
    orderId: "#ORD-10228",
    customer: { name: "Olivia Martinez", email: "olivia.m@gmail.com", avatarColor: "#d4a373" },
    amount: "$84.00",
    paymentMethod: "Mastercard",
    paymentType: "Card",
    status: "Paid",
    date: "May 18, 2024",
    time: "12:10 PM",
  },
  {
    id: "8",
    transactionId: "txn_1PL8W5e2eZvKYlo2A1B9",
    orderId: "#ORD-10227",
    customer: { name: "James Anderson", email: "james.a@gmail.com", avatarColor: "#5e695d" },
    amount: "$49.00",
    paymentMethod: "UPI",
    paymentType: "",
    status: "Paid",
    date: "May 18, 2024",
    time: "09:05 AM",
  },
];

const STATUSES = ["All Payment Status", "Paid", "Pending", "Refunded"];
const METHODS = ["All Payment Methods", "Visa", "Mastercard", "UPI", "Other"];
const ITEMS_PER_PAGE = 5;

export default function PaymentsTable() {
  const [payments, setPayments] = useState<PaymentItem[]>(MOCK_PAYMENTS_INITIAL);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Payment Status");
  const [selectedMethod, setSelectedMethod] = useState("All Payment Methods");
  
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  
  const statusRef = useRef<HTMLDivElement>(null);
  const methodRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(1);

  // Modal State
  const [refundPayment, setRefundPayment] = useState<PaymentItem | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
      if (methodRef.current && !methodRef.current.contains(event.target as Node)) {
        setShowMethodDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "Paid":
        return "bg-[#eef4ef] text-[#4d7050]";
      case "Pending":
        return "bg-[#f9f3ea] text-[#9a7b54]";
      case "Refunded":
        return "bg-[#faeeed] text-[#b34c3e]";
    }
  };

  const renderPaymentMethodBadge = (method: PaymentMethodName, type: string) => {
    if (method === "Visa" || method === "Mastercard") {
      return (
        <div className="flex items-center space-x-1.5 border border-black/10 rounded px-2 py-0.5 w-fit">
          <span className={`text-[10px] font-bold ${method === "Visa" ? "text-[#1a1f71]" : "text-[#eb001b]"}`}>
            {method.toUpperCase()}
          </span>
          <span className="text-[10px] text-[#6b6762]">{type}</span>
        </div>
      );
    }
    if (method === "UPI") {
      return (
        <div className="flex items-center border border-black/10 rounded px-2 py-0.5 w-fit">
          <span className="text-[10px] font-bold text-[#2d2a26] italic tracking-tight">UPI</span>
        </div>
      );
    }
    return <span className="text-[11px] text-[#2d2a26]">{method}</span>;
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = 
      payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = selectedStatus === "All Payment Status" || payment.status === selectedStatus;
    const matchesMethod = selectedMethod === "All Payment Methods" || payment.paymentMethod === selectedMethod;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const paginatedPayments = filteredPayments.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);

  useEffect(() => {
    setActivePage(1);
  }, [searchQuery, selectedStatus, selectedMethod]);

  const confirmRefund = () => {
    if (refundPayment) {
      setPayments(payments.map(p => 
        p.id === refundPayment.id ? { ...p, status: "Refunded" } : p
      ));
      setRefundPayment(null);
    }
  };

  return (
    <>
      <div className="bg-white border border-black/5 rounded-[12px] shadow-[0_2px_10px_rgba(0,0,0,0.01)] flex flex-col font-sans w-full mt-8">
        {/* Toolbar */}
        <div className="p-6 border-b border-black/5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative w-full lg:w-[400px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#a39e99]">
              search
            </span>
            <input
              type="text"
              placeholder="Search by order ID or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[42px] pl-10 pr-4 bg-white border border-black/10 rounded-[8px] text-[13px] outline-none focus:border-[#b09b85] transition-colors placeholder:text-[#a39e99]"
            />
          </div>

          <div className="flex items-center space-x-3 overflow-x-auto pb-1 lg:pb-0">
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedStatus("All Payment Status");
                setSelectedMethod("All Payment Methods");
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
                className="flex items-center space-x-2 border border-black/10 rounded-[8px] px-4 h-[42px] hover:bg-black/5 transition-colors text-[13px] font-medium text-[#2d2a26] min-w-[160px] justify-between"
              >
                <span>{selectedStatus}</span>
                <span className="material-symbols-outlined text-[18px] text-[#6b6762] transition-transform" style={{ transform: showStatusDropdown ? 'rotate(180deg)' : 'none' }}>
                  expand_more
                </span>
              </button>
              {showStatusDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-black/5 rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] py-1 z-20">
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

            {/* Payment Method Dropdown */}
            <div className="relative shrink-0" ref={methodRef}>
              <button 
                onClick={() => setShowMethodDropdown(!showMethodDropdown)}
                className="flex items-center space-x-2 border border-black/10 rounded-[8px] px-4 h-[42px] hover:bg-black/5 transition-colors text-[13px] font-medium text-[#2d2a26] min-w-[170px] justify-between"
              >
                <span>{selectedMethod}</span>
                <span className="material-symbols-outlined text-[18px] text-[#6b6762] transition-transform" style={{ transform: showMethodDropdown ? 'rotate(180deg)' : 'none' }}>
                  expand_more
                </span>
              </button>
              {showMethodDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-black/5 rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] py-1 z-20">
                  {METHODS.map((method) => (
                    <button
                      key={method}
                      onClick={() => {
                        setSelectedMethod(method);
                        setShowMethodDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-[13px] hover:bg-[#F8F6F2] transition-colors ${
                        selectedMethod === method ? 'text-[#B48C5A] font-medium' : 'text-[#2d2a26]'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="border-b border-black/5 bg-[#FAFAFA]">
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider">
                  Order ID
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider w-[20%]">
                  Customer
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider">
                  Amount
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider text-center">
                  Status
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider">
                  Date
                </th>
                <th className="py-4 px-6 text-[11px] font-semibold text-[#a39e99] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-black/5 last:border-0 hover:bg-[#F8F6F2]/50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <span className="text-[12px] text-[#2d2a26] font-medium font-mono">
                        {payment.transactionId}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[13px] font-semibold text-[#2d2a26]">
                        {payment.orderId}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-semibold shrink-0"
                          style={{ backgroundColor: payment.customer.avatarColor }}
                        >
                          {payment.customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-[#2d2a26] mb-0.5">
                            {payment.customer.name}
                          </p>
                          <p className="text-[11px] text-[#6b6762]">
                            {payment.customer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[13px] font-semibold text-[#2d2a26]">
                        {payment.amount}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {renderPaymentMethodBadge(payment.paymentMethod, payment.paymentType)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-md tracking-wide ${getStatusBadge(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-[13px] text-[#2d2a26] mb-0.5">{payment.date}</p>
                      <p className="text-[11px] text-[#a39e99]">{payment.time}</p>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {payment.status !== "Refunded" && (
                          <button 
                            onClick={() => setRefundPayment(payment)}
                            className="w-8 h-8 rounded border border-black/10 inline-flex items-center justify-center text-[#6b6762] hover:bg-[#faeeed] hover:text-[#b34c3e] hover:border-[#faeeed] transition-colors"
                            title="Issue Refund"
                          >
                            <span className="material-symbols-outlined text-[16px]">currency_exchange</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[13px] text-[#6b6762]">
                    No payments found matching your filters.
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
              Showing {((activePage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(activePage * ITEMS_PER_PAGE, filteredPayments.length)} of {filteredPayments.length} payments
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
        isOpen={!!refundPayment} 
        onClose={() => setRefundPayment(null)}
        title="Issue Refund"
      >
        <div className="space-y-6">
          <p className="text-[14px] text-[#6b6762]">
            Are you sure you want to refund <strong>{refundPayment?.amount}</strong> for order <strong>{refundPayment?.orderId}</strong>? 
          </p>
          <div className="bg-[#FAFAFA] border border-black/5 rounded-[8px] p-4 flex flex-col space-y-2 text-[13px] text-[#2d2a26]">
             <div className="flex justify-between">
                <span className="text-[#6b6762]">Customer:</span>
                <span className="font-semibold">{refundPayment?.customer.name}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-[#6b6762]">Transaction:</span>
                <span className="font-mono">{refundPayment?.transactionId}</span>
             </div>
          </div>
          <div className="flex items-center justify-end space-x-3">
            <button 
              onClick={() => setRefundPayment(null)}
              className="px-4 py-2 border border-black/10 rounded-[8px] text-[13px] font-medium text-[#2d2a26] hover:bg-black/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={confirmRefund}
              className="px-4 py-2 bg-[#b34c3e] border border-transparent rounded-[8px] text-[13px] font-medium text-white hover:bg-[#a04235] transition-colors"
            >
              Confirm Refund
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

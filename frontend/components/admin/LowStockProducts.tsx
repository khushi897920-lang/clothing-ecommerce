import React from "react";
import Image from "next/image";
import Link from "next/link";

type StockStatus = "Critical" | "Low";

const LOW_STOCK_PRODUCTS = [
  {
    name: "Oversized Cotton T-Shirt",
    sku: "TSH-001",
    stock: 5,
    status: "Critical" as StockStatus,
    image: "/images/product_cotton_tee.jpg",
  },
  {
    name: "Linen Casual Shirt",
    sku: "SHIRT-023",
    stock: 7,
    status: "Low" as StockStatus,
    image: "/images/product_linen_shirt.jpg",
  },
  {
    name: "Essential Hoodie",
    sku: "HOOD-012",
    stock: 8,
    status: "Low" as StockStatus,
    image: "/images/product_cotton_jacket.jpg", // Reusing available mock image
  },
  {
    name: "Slim Fit Jeans",
    sku: "JEAN-045",
    stock: 9,
    status: "Low" as StockStatus,
    image: "/images/product_tailored_blazer.jpg", // Reusing available mock image
  },
  {
    name: "Cargo Joggers",
    sku: "JOG-009",
    stock: 10,
    status: "Low" as StockStatus,
    image: "/images/grace in every thread.png", // Reusing available mock image
  },
];

const getStockBadgeStyles = (status: StockStatus) => {
  if (status === "Critical") {
    return "bg-[#faeeed] text-[#b34c3e]";
  }
  return "bg-[#f9f3ea] text-[#9a7b54]";
};

export default function LowStockProducts() {
  return (
    <div className="bg-white border border-black/5 rounded-[12px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.01)] flex flex-col font-sans">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[15px] font-semibold text-[#2d2a26]">
          Low Stock Products
        </h3>
        <Link href="/admin/inventory" className="text-[11px] font-medium text-[#B48C5A] hover:text-[#967448] transition-colors">
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-black/5">
              <th className="pb-3 text-[11px] font-medium text-[#a39e99] uppercase tracking-wider pl-2">
                Product
              </th>
              <th className="pb-3 text-[11px] font-medium text-[#a39e99] uppercase tracking-wider">
                SKU
              </th>
              <th className="pb-3 text-[11px] font-medium text-[#a39e99] uppercase tracking-wider text-right">
                Stock
              </th>
              <th className="pb-3 text-[11px] font-medium text-[#a39e99] uppercase tracking-wider text-right pr-2">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {LOW_STOCK_PRODUCTS.map((product, index) => (
              <tr
                key={index}
                className="border-b border-black/5 last:border-0 hover:bg-[#F8F6F2] transition-colors group"
              >
                <td className="py-3 pl-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-10 bg-[#E5E0D8] rounded-[4px] overflow-hidden relative shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[13px] font-medium text-[#2d2a26]">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-[13px] text-[#6b6762]">{product.sku}</td>
                <td className="py-3 text-[13px] font-medium text-[#2d2a26] text-right">
                  {product.stock}
                </td>
                <td className="py-3 text-right pr-2">
                  <span
                    className={`inline-block px-2.5 py-1 text-[10px] font-medium rounded-md tracking-wide ${getStockBadgeStyles(
                      product.status
                    )}`}
                  >
                    {product.status}
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

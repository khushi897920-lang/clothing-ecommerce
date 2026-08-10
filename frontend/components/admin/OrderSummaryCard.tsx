import React from "react";

interface OrderSummaryCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
}

export default function OrderSummaryCard({
  title,
  value,
  subtitle,
  icon,
  iconBgColor,
  iconColor,
}: OrderSummaryCardProps) {
  return (
    <div className="bg-white border border-black/5 rounded-[12px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.01)] flex items-start space-x-4 h-full">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-black/5"
        style={{ backgroundColor: iconBgColor, color: iconColor }}
      >
        <span className="material-symbols-outlined font-light text-[22px]">
          {icon}
        </span>
      </div>
      <div className="flex flex-col pt-0.5">
        <h3 className="text-[12px] text-[#2d2a26] font-medium tracking-wide">
          {title}
        </h3>
        <p className="text-[24px] font-semibold text-[#2d2a26] mt-1 tracking-tight leading-none">
          {value}
        </p>
        <p className="text-[11px] font-medium mt-2" style={{ color: iconColor }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

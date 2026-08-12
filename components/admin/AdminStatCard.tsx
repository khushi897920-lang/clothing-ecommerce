import React from "react";

interface AdminStatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: string;
  iconBgColor?: string;
  iconColor?: string;
}

export default function AdminStatCard({
  title,
  value,
  change,
  changeType,
  icon,
  iconBgColor = "#E5E0D8", // Default subtle beige
  iconColor = "#5D4E41",
}: AdminStatCardProps) {
  const isPositive = changeType === "positive";

  return (
    <div className="bg-white border border-black/5 rounded-[12px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.03)] transition-shadow duration-300 flex items-start space-x-4 h-[130px]">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-black/5"
        style={{ backgroundColor: iconBgColor, color: iconColor }}
      >
        <span className="material-symbols-outlined font-light text-[22px]">
          {icon}
        </span>
      </div>
      <div className="flex flex-col justify-between h-full pt-0.5">
        <div>
          <h3 className="text-[12px] text-[#6b6762] font-medium tracking-wide">
            {title}
          </h3>
          <p className="text-[24px] font-semibold text-[#2d2a26] mt-1 tracking-tight leading-none">
            {value}
          </p>
        </div>
        <div className="flex items-center space-x-1.5 mt-auto">
          <span
            className={`material-symbols-outlined text-[14px] ${
              isPositive ? "text-[#588157]" : "text-[#D35446]"
            }`}
          >
            {isPositive ? "trending_up" : "trending_down"}
          </span>
          <span
            className={`text-[11px] font-medium ${
              isPositive ? "text-[#588157]" : "text-[#D35446]"
            }`}
          >
            {change}
          </span>
          <span className="text-[11px] text-[#a39e99]">vs last week</span>
        </div>
      </div>
    </div>
  );
}

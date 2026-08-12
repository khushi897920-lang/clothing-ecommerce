import React from "react";

interface AnalyticsStatCardProps {
  title: string;
  value: string;
  comparison: string;
  isPositive: boolean;
  icon: string;
  iconBgColor: string;
  iconColor: string;
}

export default function AnalyticsStatCard({
  title,
  value,
  comparison,
  isPositive,
  icon,
  iconBgColor,
  iconColor,
}: AnalyticsStatCardProps) {
  return (
    <div className="bg-white border border-black/5 rounded-[12px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.01)] flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-black/5"
          style={{ backgroundColor: iconBgColor, color: iconColor }}
        >
          <span className="material-symbols-outlined font-light text-[22px]">
            {icon}
          </span>
        </div>
      </div>
      <div>
        <h3 className="text-[13px] text-[#6b6762] font-medium tracking-wide mb-1">
          {title}
        </h3>
        <p className="text-[28px] font-semibold text-[#2d2a26] tracking-tight leading-none mb-2">
          {value}
        </p>
        <p className={`text-[11px] font-medium flex items-center space-x-1 ${isPositive ? 'text-[#4d7050]' : 'text-[#b34c3e]'}`}>
          <span className="material-symbols-outlined text-[14px]">
            {isPositive ? 'arrow_upward' : 'arrow_downward'}
          </span>
          <span>{comparison}</span>
        </p>
      </div>
    </div>
  );
}

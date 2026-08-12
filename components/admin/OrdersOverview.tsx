"use client";

import React from "react";

const DATA = [
  { label: "Delivered", value: 186, percent: 40.8, color: "#7D8469" },
  { label: "Shipped", value: 128, percent: 28.1, color: "#6A8496" },
  { label: "Processing", value: 102, percent: 22.4, color: "#D1C9B9" }, // warm beige
  { label: "Cancelled", value: 40, percent: 8.7, color: "#C47265" },
];

export default function OrdersOverview() {
  const total = DATA.reduce((sum, item) => sum + item.value, 0);

  // SVG calculations for a donut chart with circumference 100
  // Radius = 100 / (2 * PI) = 15.91549430918954
  const radius = 15.91549430918954;
  let accumulatedPercent = 0;

  return (
    <div className="bg-white border border-black/5 rounded-[12px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.01)] flex flex-col h-full font-sans">
      <h3 className="text-[15px] font-semibold text-[#2d2a26] mb-8">Orders Overview</h3>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-10 flex-1">
        {/* Donut Chart */}
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="21"
              cy="21"
              r={radius}
              fill="transparent"
              stroke="#F5F2ED"
              strokeWidth="6"
            />
            
            {/* Segments */}
            {DATA.map((item, i) => {
              const dashoffset = 100 - accumulatedPercent;
              accumulatedPercent += item.percent;
              
              return (
                <circle
                  key={i}
                  cx="21"
                  cy="21"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="6"
                  strokeDasharray={`${item.percent} ${100 - item.percent}`}
                  strokeDashoffset={dashoffset}
                  className="transition-all duration-700 hover:stroke-[7px]"
                  style={{ cursor: "pointer" }}
                >
                  <title>{`${item.label}: ${item.value} (${item.percent}%)`}</title>
                </circle>
              );
            })}
          </svg>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-1">
            <span className="text-[22px] font-semibold text-[#2d2a26] leading-none">
              {total}
            </span>
            <span className="text-[10px] text-[#6b6762] uppercase tracking-wider mt-1">
              Total
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col space-y-4">
          {DATA.map((item, i) => (
            <div key={i} className="flex items-center text-[12px]">
              <div
                className="w-2.5 h-2.5 rounded-full mr-3 shrink-0"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-[#6b6762] w-[80px]">{item.label}</span>
              <span className="text-[#2d2a26] font-medium w-[40px] text-right">
                {item.value}
              </span>
              <span className="text-[#a39e99] w-[50px] text-right">
                ({item.percent}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

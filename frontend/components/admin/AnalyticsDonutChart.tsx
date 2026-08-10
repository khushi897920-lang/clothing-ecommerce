"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface DonutDataItem {
  label: string;
  value: number;
  color: string;
  displayValue: string; // e.g. "$6,540.00" or "186 (40.8%)"
}

interface AnalyticsDonutChartProps {
  title: string;
  centerTopText: string;
  centerBottomText: string;
  data: DonutDataItem[];
  viewAllLink: string;
  viewAllText: string;
}

export default function AnalyticsDonutChart({
  title,
  centerTopText,
  centerBottomText,
  data,
  viewAllLink,
  viewAllText,
}: AnalyticsDonutChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // SVG parameters
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const strokeWidth = 35;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);

  let currentOffset = 0;
  const segments = data.map((item, i) => {
    const fraction = item.value / total;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -currentOffset;
    
    // Add gap (only if not 100%)
    const gap = 2; // pixel gap
    const dashLength = Math.max(0, fraction * circumference - gap);
    const dashArrayWithGap = `${dashLength} ${circumference}`;
    
    currentOffset += fraction * circumference;
    
    return {
      ...item,
      strokeDasharray: dashArrayWithGap,
      strokeDashoffset,
    };
  });

  return (
    <div className="bg-white border border-black/5 rounded-[12px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.01)] flex flex-col h-full font-sans relative">
      <h3 className="text-[15px] font-semibold text-[#2d2a26] mb-6">{title}</h3>
      
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
        {/* Donut SVG */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            {segments.map((segment, i) => {
              const isHovered = hoverIndex === i;
              const isAnyHovered = hoverIndex !== null;
              
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="transparent"
                  stroke={segment.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={segment.strokeDasharray}
                  strokeDashoffset={segment.strokeDashoffset}
                  className="transition-all duration-300 ease-out cursor-pointer"
                  style={{ 
                    opacity: isAnyHovered && !isHovered ? 0.6 : 1,
                    transformOrigin: 'center'
                  }}
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                />
              );
            })}
          </svg>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[14px] font-semibold text-[#2d2a26] leading-none mb-1">
              {hoverIndex !== null ? segments[hoverIndex].label : centerTopText}
            </span>
            <span className="text-[11px] text-[#6b6762] uppercase tracking-wider">
              {hoverIndex !== null ? '' : centerBottomText}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col space-y-3 min-w-[120px]">
          {data.map((item, i) => {
            const isHovered = hoverIndex === i;
            const isAnyHovered = hoverIndex !== null;
            
            return (
              <div 
                key={i} 
                className={`flex items-center justify-between text-[12px] transition-opacity duration-200 cursor-pointer ${
                  isAnyHovered && !isHovered ? 'opacity-50' : 'opacity-100'
                }`}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className={`font-medium ${isHovered ? 'text-[#2d2a26]' : 'text-[#6b6762]'}`}>
                    {item.label}
                  </span>
                </div>
                <span className="font-semibold text-[#2d2a26] ml-4">
                  {item.displayValue}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-black/5">
        <Link 
          href={viewAllLink}
          className="text-[12px] font-medium text-[#6b6762] hover:text-[#2d2a26] transition-colors flex items-center justify-between group"
        >
          <span>{viewAllText}</span>
          <span className="material-symbols-outlined text-[16px] transform group-hover:translate-x-1 transition-transform">
            chevron_right
          </span>
        </Link>
      </div>
    </div>
  );
}

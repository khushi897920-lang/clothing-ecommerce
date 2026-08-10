"use client";

import React, { useState, useRef, useEffect } from "react";

const DATA = [
  { date: "May 15", value: 1000 },
  { date: "May 16", value: 2500 },
  { date: "May 17", value: 4300 },
  { date: "May 18", value: 5500 },
  { date: "May 19", value: 4100 },
  { date: "May 20", value: 6100 },
  { date: "May 21", value: 7260 },
];

export default function RevenueChart() {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [showTimeframe, setShowTimeframe] = useState(false);
  const [timeframe, setTimeframe] = useState("This Week");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTimeframe(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const timeframes = ["This Week", "Last Week", "This Month", "Last Month"];
  
  // SVG viewBox dimensions
  const width = 800;
  const height = 280;
  const paddingX = 40;
  const paddingY = 40;
  
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;
  
  const maxValue = 8000; // Fixed max value for this mock data
  
  const getX = (index: number) => paddingX + (index / (DATA.length - 1)) * innerWidth;
  const getY = (value: number) => height - paddingY - (value / maxValue) * innerHeight;
  
  const linePath = DATA.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.value)}`).join(' ');
  const areaPath = `${linePath} L ${getX(DATA.length - 1)} ${height - paddingY} L ${paddingX} ${height - paddingY} Z`;

  const yTicks = [0, 2000, 4000, 6000, 8000];

  return (
    <div className="bg-white border border-black/5 rounded-[12px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.01)] flex flex-col h-full font-sans">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[15px] font-semibold text-[#2d2a26]">Revenue Overview</h3>
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowTimeframe(!showTimeframe)}
            className="flex items-center space-x-1 border border-black/10 rounded-md px-3 py-1.5 text-[11px] font-medium text-[#6b6762] hover:border-black/20 hover:text-[#2d2a26] transition-colors"
          >
            <span>{timeframe}</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>
          
          {showTimeframe && (
            <div className="absolute right-0 mt-1 w-32 bg-white border border-black/5 rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] py-1 z-20">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setTimeframe(tf);
                    setShowTimeframe(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-[11px] hover:bg-[#F8F6F2] transition-colors ${
                    timeframe === tf ? 'text-[#B48C5A] font-medium' : 'text-[#2d2a26]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 w-full relative min-h-[260px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B48C5A" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#B48C5A" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y-axis labels */}
          {yTicks.map((tick, i) => {
            const y = getY(tick);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#e5e5e5"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-[#a39e99]"
                >
                  {tick === 0 ? "$0" : `$${tick / 1000}k`}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#areaGradient)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#B48C5A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points & X-axis labels */}
          {DATA.map((d, i) => {
            const x = getX(i);
            const y = getY(d.value);
            const isHovered = hoverIndex === i;
            
            return (
              <g key={i}>
                {/* X-axis label */}
                <text
                  x={x}
                  y={height - 15}
                  textAnchor="middle"
                  className="text-[10px] fill-[#a39e99]"
                >
                  {d.date}
                </text>
                
                {/* Invisible hover target */}
                <circle
                  cx={x}
                  cy={y}
                  r={20}
                  fill="transparent"
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                  className="cursor-pointer"
                />
                
                {/* Point */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4}
                  fill={isHovered ? "#fff" : "#B48C5A"}
                  stroke="#B48C5A"
                  strokeWidth={isHovered ? 2.5 : 2}
                  className="transition-all duration-200 pointer-events-none"
                />
              </g>
            );
          })}
        </svg>

        {/* Custom Tooltip */}
        {hoverIndex !== null && (
          <div
            className="absolute bg-white border border-black/10 rounded-lg p-3 shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full flex flex-col items-center"
            style={{
              left: `${(getX(hoverIndex) / width) * 100}%`,
              top: `${(getY(DATA[hoverIndex].value) / height) * 100}%`,
              marginTop: "-16px",
            }}
          >
            <span className="text-[10px] text-[#6b6762] mb-1 font-medium">
              {DATA[hoverIndex].date}, 2024
            </span>
            <span className="text-[14px] font-semibold text-[#2d2a26]">
              ${DATA[hoverIndex].value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <div className="w-3 h-3 bg-white border-b border-r border-black/10 absolute -bottom-1.5 transform rotate-45"></div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";

interface DataPoint {
  date: string;
  value: number;
}

interface AnalyticsLineChartProps {
  title: string;
  data: DataPoint[];
  color: string;
  isCurrency?: boolean;
  maxValue: number;
  yTickInterval: number;
}

export default function AnalyticsLineChart({
  title,
  data,
  color,
  isCurrency = false,
  maxValue,
  yTickInterval,
}: AnalyticsLineChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [showTimeframe, setShowTimeframe] = useState(false);
  const [timeframe, setTimeframe] = useState("Daily");
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

  const timeframes = ["Daily", "Weekly", "Monthly"];
  
  // SVG viewBox dimensions
  const width = 800;
  const height = 280;
  const paddingX = 40;
  const paddingY = 40;
  
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;
  
  const getX = (index: number) => paddingX + (index / (data.length - 1)) * innerWidth;
  const getY = (value: number) => height - paddingY - (value / maxValue) * innerHeight;
  
  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.value)}`).join(' ');
  const areaPath = `${linePath} L ${getX(data.length - 1)} ${height - paddingY} L ${paddingX} ${height - paddingY} Z`;

  const yTicks = [];
  for (let i = 0; i <= maxValue; i += yTickInterval) {
    yTicks.push(i);
  }

  const formatValue = (val: number) => {
    if (isCurrency) {
      if (val === 0) return "$0";
      return `$${val >= 1000 ? val / 1000 + 'k' : val}`;
    }
    return val.toString();
  };

  const formatTooltipValue = (val: number) => {
    if (isCurrency) {
      return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    }
    return val.toString();
  };

  const gradientId = `areaGradient-${title.replace(/\s+/g, '')}`;

  return (
    <div className="bg-white border border-black/5 rounded-[12px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.01)] flex flex-col h-full font-sans">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[15px] font-semibold text-[#2d2a26]">{title}</h3>
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
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.15" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
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
                  {formatValue(tick)}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill={`url(#${gradientId})`} />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points & X-axis labels */}
          {data.map((d, i) => {
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
                  r={isHovered ? 5 : 4}
                  fill={isHovered ? "#fff" : color}
                  stroke={color}
                  strokeWidth={isHovered ? 2 : 2}
                  className="transition-all duration-200 pointer-events-none"
                />
              </g>
            );
          })}
        </svg>

        {/* Custom Tooltip */}
        {hoverIndex !== null && (
          <div
            className="absolute bg-white border border-black/10 rounded-lg p-3 shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full flex flex-col items-center z-10"
            style={{
              left: `${(getX(hoverIndex) / width) * 100}%`,
              top: `${(getY(data[hoverIndex].value) / height) * 100}%`,
              marginTop: "-16px",
            }}
          >
            <span className="text-[10px] text-[#6b6762] mb-1 font-medium">
              {data[hoverIndex].date}, 2024
            </span>
            <span className="text-[14px] font-semibold text-[#2d2a26]">
              {formatTooltipValue(data[hoverIndex].value)}
            </span>
            <div className="w-3 h-3 bg-white border-b border-r border-black/10 absolute -bottom-1.5 transform rotate-45"></div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client"

import * as React from "react"
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts"

import { cn } from "@/lib/utils"

export function Sparkline({ data, color }: { data: number[], color?: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  
  const width = 100;
  const height = 30;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / (range || 1)) * height;
    return `${x},${y}`;
  }).join(" ");

  const isPositive = data[data.length - 1] >= data[0];
  const strokeColor = color || (isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))");

  return (
    <svg width="100" height="30" className="overflow-visible" viewBox={`0 0 ${width} ${height}`}>
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

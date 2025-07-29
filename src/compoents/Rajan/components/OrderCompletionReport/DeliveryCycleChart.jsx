import React from "react";
import {
  RadialBarChart,
  RadialBar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Paper, Typography } from "@mui/material";

const deliveryCycleData = [
  { name: "Type 17", fill: "#fef08a", gradient: { from: "#fde047", to: "#facc15" } },
  { name: "Type 2", fill: "#bae6fd", gradient: { from: "#93c5fd", to: "#60a5fa" } },
  { name: "Type 18", fill: "#fcd5ce", gradient: { from: "#f8c1b2", to: "#f4b4a2" } },
  { name: "Type 3", fill: "#fdba74", gradient: { from: "#fb923c", to: "#f59e0b" } },
  { name: "Type 19", fill: "#c1d3fe", gradient: { from: "#a1bffb", to: "#8eaaf9" } },
  { name: "Type 4", fill: "#fed7aa", gradient: { from: "#fcd34d", to: "#fbbf24" } },
  { name: "Type 5", fill: "#38bdf8", gradient: { from: "#3b82f6", to: "#6366f1" } },
  { name: "Type 6", fill: "#7dd3fc", gradient: { from: "#60a5fa", to: "#3b82f6" } },
  { name: "Type 7", fill: "#a5f3fc", gradient: { from: "#67e8f9", to: "#22d3ee" } },
  { name: "Type 8", fill: "#c4b5fd", gradient: { from: "#a78bfa", to: "#8b5cf6" } },
  { name: "Type 9", fill: "#fda4af", gradient: { from: "#fb7185", to: "#f43f5e" } },
  { name: "Type 10", fill: "#fcd34d", gradient: { from: "#fbbf24", to: "#f59e0b" } },
  { name: "Type 11", fill: "#6ee7b7", gradient: { from: "#34d399", to: "#10b981" } },
  { name: "Type 12", fill: "#f9a8d4", gradient: { from: "#ec4899", to: "#db2777" } },
  { name: "Type 13", fill: "#ddd6fe", gradient: { from: "#c4b5fd", to: "#a78bfa" } },
  { name: "Type 14", fill: "#fca5a5", gradient: { from: "#f87171", to: "#ef4444" } },
  { name: "Type 15", fill: "#86efac", gradient: { from: "#4ade80", to: "#22c55e" } },
  { name: "Type 1", fill: "#0ea5e9", gradient: { from: "#0ea5e9", to: "#38bdf8" } },
  { name: "Type 16", fill: "#d8b4fe", gradient: { from: "#c084fc", to: "#a855f7" } },
  { name: "Type 20", fill: "#e9d5ff", gradient: { from: "#d8b4fe", to: "#c084fc" } },
];


export default function DeliveryCycleRadialChart({averageDeliveryDayByCompanyType}) {
  const formatted = averageDeliveryDayByCompanyType?.map((item, i) => {
    const colorSource = deliveryCycleData[i % deliveryCycleData.length]; 
    return {
      name: item?.companyType,
      days: item?.averageDelayDays,
      gradientId: `gradient-${i}`,
      fill: colorSource.fill,
      gradient: colorSource.gradient,
    };
  });
  
  return (
    <>
      <Typography variant="h6" gutterBottom>
       Average Delivery Day (Company Type)
      </Typography>

      <ResponsiveContainer width="100%" height={380}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius={20}
          outerRadius="95%"
          barSize={25}
          startAngle={0}
          endAngle={360}
          data={formatted}
          margin={{
            top: 20,
            bottom: 20,
          }}
        >
          <defs>
            {formatted?.map((entry, index) => (
              <linearGradient
                key={`grad-${index}`}
                id={`grad-${index}`}
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor={entry.gradient.from} />
                <stop offset="100%" stopColor={entry.gradient.to} />
              </linearGradient>
            ))}
          </defs>

          <PolarGrid gridType="circle" stroke="#e5e7eb" />
          <PolarAngleAxis type="number" hide reversed />
          <PolarRadiusAxis type="category" hide />

          <RadialBar
            dataKey="days"
            clockWise
            cornerRadius={12}
            label={{
              fill: "#1f2937",
              fontSize: 12,
              fontWeight: 600,
              position: "insideStart",
            }}
          >
            {formatted?.map((entry, index) => (
              <Cell key={`bar-${index}`} fill={`url(#grad-${index})`} />
            ))}
          </RadialBar>

          <Legend
            iconType="circle"
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: 13, marginBottom: -30 }}
          />


          <Tooltip
            content={<CustomTooltip />}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </>
  );
}


const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const value = payload[0]?.value;

  return (
    <Paper
      elevation={3}
      sx={{
        px: 2,
        py: 1,
        borderRadius: 2,
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(255,255,255,0.9)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={500}
      >
        Day
      </Typography>
      <Typography variant="subtitle2" fontWeight={600}>
        {value}
      </Typography>
    </Paper>
  );
};
import React from "react";
import { Typography, useTheme } from "@mui/material";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";

const BAR_COLORS = [
  "#6366F1", // Indigo
  "#10B981", // Emerald
  "#F43F5E", // Rose
  "#F59E0B", // Amber
  "#3B82F6", // Blue
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#A855F7", // Purple
  "#EF4444", // Red
];

const LocationWiseSales = ({ LocationWieseSalesData }) => {
  const theme = useTheme();
  const branchKeys = Object.keys(LocationWieseSalesData?.[0] || {}).filter((key) => key !== "name");

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 500,
          color: "text.primary",
          mb: 2,
        }}
      >
        Location-wise Sales
      </Typography>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={LocationWieseSalesData} barCategoryGap={10}>
          <CartesianGrid strokeDasharray="4" vertical={false} stroke={theme.palette.mode === "dark" ? "#2e2e2e" : "#e5e7eb"} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 13,
              fill: theme.palette.text.secondary,
              dy: 8,
            }}
          />
          <YAxis hide axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: theme.palette.text.disabled }} />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.03)" }}
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 8,
              fontSize: 13,
              boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
            }}
            labelStyle={{
              color: theme.palette.text.primary,
              fontWeight: 600,
              marginBottom: 4,
            }}
            itemStyle={{
              color: theme.palette.text.secondary,
              fontSize: 13,
            }}
          />
          {branchKeys?.map((key, index) =>(
            <Bar key={key} dataKey={key} stackId="a" fill={BAR_COLORS[index % BAR_COLORS.length]} radius={[index === branchKeys.length - 1 ? 4 : 0, index === branchKeys.length - 1 ? 4 : 0, 0, 0]} opacity={0.8} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default LocationWiseSales;

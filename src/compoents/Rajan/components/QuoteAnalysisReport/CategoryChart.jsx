import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Box, Typography } from "@mui/material";

const categoryColors = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#14b8a6", // Teal
  "#6366f1", // Indigo
  "#f97316", // Orange
  "#ec4899", // Pink
  "#22c55e", // Green
];

const CategoryChart = ({ CategoryWiseSaleData }) => {
  if (!CategoryWiseSaleData || CategoryWiseSaleData?.length === 0) return null;
  const totalSales = CategoryWiseSaleData?.reduce((sum, item) => sum + item.salesCount, 0);
  const processedData = CategoryWiseSaleData?.map((item, index) => ({
    ...item,
    salesPercent: ((item.salesCount / totalSales) * 100).toFixed(1), // 1 decimal
    color: categoryColors[index % categoryColors.length],
  }));
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        backgroundColor: "#f9fafb",
        borderRadius: 3,
        p: 3,
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 500, color: "#0f172a", mb: 2 }}>
          Category-wise Sales
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={processedData} cx="50%" cy="50%" innerRadius={40} outerRadius={100} paddingAngle={3} dataKey="salesCount" animationDuration={800}>
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => [`${value} sales`, props.payload.name]}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
              labelStyle={{ color: "#475569", fontWeight: 600 }}
              itemStyle={{ color: "#0f172a" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Right: Category Legend */}
      <Box sx={{ flex: 1 }}>
        {processedData.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: item.color,
                  borderRadius: "50%",
                  mr: 1.5,
                }}
              />
              <Typography variant="body2" sx={{ color: "#475569" }}>
                {item?.name}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f172a" }}>
              {item?.salesPercent}%
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CategoryChart;

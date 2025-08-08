import React from "react";
import { Box, Typography } from "@mui/material";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const Top10Category = ({ Top10CategoryData }) => {
  const SalesData = Top10CategoryData?.[0]?.data;
  const colors = [
    "#F43F5E", // rose
    "#F59E0B", // amber
    "#10B981", // emerald
    "#6366F1", // indigo
    "#A855F7", // violet
    "#06B6D4", // cyan
  ];

  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: 500, color: "#0f172a", mb: 2 }}>
        Top 10 Category by Sales
      </Typography>

      <Box display="flex" alignItems="center" gap={3}>
        <ResponsiveContainer width="60%" height={240}>
          <PieChart>
            <Pie data={SalesData} dataKey="sales" nameKey="name" innerRadius={60} outerRadius={110} paddingAngle={2} stroke="none">
              {SalesData?.map((entry, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip
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

        <Box display="flex" flexDirection="column" gap={0.4}>
          {SalesData?.map((cat, i) => (
            <Box key={i} display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: colors[i % colors.length],
                  flexShrink: 0,
                }}
              />
              <Typography variant="body2" sx={{ color: "#334155", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {cat?.name} — {cat?.sales}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default Top10Category;

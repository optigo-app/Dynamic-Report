import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";

const SalesRepwise = ({ SalesRepWiseData }) => {
  const data = SalesRepWiseData?.[0]?.data || [];

  const rawMax = Math.max(...data?.map((r) => r?.sales || 0));
  const niceMax = Math.ceil(rawMax / 1000000) * 1000000 || 100000; 

  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: 500, color: "#0f172a", mb: 2 }}>
        Sales by Sales Rep
      </Typography>

      <Box display="flex" alignItems="center" gap={4}>
        {/* Left: Radar Chart */}
        <ResponsiveContainer width="60%" height={250}>
          <RadarChart data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#334155" }}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, niceMax]}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              stroke="#cbd5e1"
              axisLine={false}
            />
            <Radar
              name="Sales"
              dataKey="sales"
              stroke="#6366F1"
              fill="#8B5CF6"
              fillOpacity={0.4}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 13,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>

        {/* Right: Custom Legend */}
        <Stack spacing={0.5} maxHeight={320} overflow="auto" pr={1}>
          {data?.map((rep, i) => (
            <Box key={i} display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#8B5CF6",
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "#334155",
                  fontSize: 13,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {rep.name} — {rep.sales.toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </>
  );
};

export default SalesRepwise;

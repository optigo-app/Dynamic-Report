import React, { useState } from "react";
import { Chip, Paper, Typography } from "@mui/material";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts";
import ModernSelectChip from "../shared/ModernSelectChip";
import { Box } from "@mui/material";

const MonthWiseSalesArearChart = ({ selectedValue, setSelectedValue, YearlySalesData }) => {
  const selectedYear = new Date().getFullYear();
  const chartTitle = `Year Wise Sales - ${selectedYear}`;
  const formattedMonthlySales = YearlySalesData?.map(({ month, totalAmount }) => ({
    month,
    delayPercent: totalAmount,
  }));

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">{chartTitle}</Typography>
        <ModernSelectChip
          value={selectedValue}
          onChange={setSelectedValue}
          options={[
            { label: "All", value: "all" },
            { label: "Labour", value: "labour sale" },
            { label: "Jewellery", value: "Jewellery sale" },
            { label: "Repair", value: "repair sale" },
          ]}
        />
      </Box>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={formattedMonthlySales}>
          <defs>
            <linearGradient id="colorDelay" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f5c6d6" stopOpacity={0.9} />
              <stop offset="50%" stopColor="#fcd3e1" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#fff0f5" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            interval={0}
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={({ x, y, payload, index }) => {
              const isFirst = index === 0;
              const isLast = index === formattedMonthlySales.length - 1;
              const shift = isFirst ? 10 : isLast ? -20 : 0;
              const month = payload.value;
              return (
                <foreignObject x={x + shift - 10} y={y + 0} width={100} height={30}>
                  <Chip
                    label={`${month}`}
                    size="small"
                    color="primary"
                    sx={{
                      fontSize: 10,
                      height: 20,
                      borderRadius: "16px",
                      px: 1,
                      color: "#fff",
                      bgcolor: "#e293b5",
                      ".MuiChip-label": {
                        padding: 0,
                      },
                    }}
                  />
                </foreignObject>
              );
            }}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} formatter={(value) => [`₹ ${value}`, "Sales"]} />
          <Area type="monotone" dataKey="delayPercent" stroke="#e293b5" strokeWidth={3} fillOpacity={1} fill="url(#colorDelay)">
            <LabelList
              dataKey="delayPercent"
              position="top"
              dy={-14}
              content={({ x, y, value, index }) => {
                if (value == null) return null;
                return (
                  <foreignObject x={x - 18} y={y - 26} width={100} height={20}>
                    <Box
                      sx={{
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: "#22c55e",
                        backgroundColor: "#fff",
                        borderRadius: "4px",
                        px: "3px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ₹ {value}
                    </Box>
                  </foreignObject>
                );
              }}
            />
          </Area>
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
};

export default MonthWiseSalesArearChart;

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
      <Typography variant="caption" color="text.secondary" fontWeight={500}>
        Month {label}
      </Typography>
      <Typography variant="subtitle2" fontWeight={600}>
        ₹ {value}
      </Typography>
    </Paper>
  );
};

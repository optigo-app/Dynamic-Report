import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Box, Chip, Typography, useTheme } from "@mui/material";
import { parseISO, format } from "date-fns";

const ProcessLossChart = ({ dayAnalysis }) => {
  const theme = useTheme();

  if (!dayAnalysis || dayAnalysis.length === 0) return null;
  const firstDate = parseISO(dayAnalysis[0].date);
  const chartTitle = `Process Loss (%) – ${format(firstDate, "MMMM yyyy")}`;
  const FormattedDate = dayAnalysis.map((val, i) => ({
    day: i + 1,
    loss: val?.factoryLoss,
  }));
  
  return (
    <>
      <Typography variant="h6" gutterBottom>
        {chartTitle}
      </Typography>

      <ResponsiveContainer width="100%" height={280} style={{ padding: "1px" }}>
        <AreaChart data={FormattedDate}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#FECACA" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          {/* Hide grid and axes */}
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={({ x, y, payload }) => {
              const day = payload.value;
              return (
                <foreignObject x={x - 10} y={y + 0} width={30} height={30}>
                  <Chip
                    label={`${day}`}
                    size="small"
                    color="primary"
                    sx={{
                      fontSize: 10,
                      height: 24,
                      borderRadius: "16px",
                      px: 1,
                      bgcolor: "#E0F2FE", // light blue
                      color: "#0369A1", // blue text
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
          <CartesianGrid vertical={false} horizontal={false} />

          <Tooltip
            formatter={(val) => `${Number(val)?.toFixed(0)}%`}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              boxShadow: theme.shadows[2],
            }}
            labelFormatter={(label) => `Day ${label}`}
            labelStyle={{ color: "#374151", fontWeight: 600 }}
          />

          <Area
            type="monotone"
            dataKey="loss"
            stroke="#EF4444"
            strokeWidth={2.5}
            fill="url(#areaGradient)"
            dot={{ r: 3, stroke: "#DC2626", strokeWidth: 1.5, fill: "#FFF" }}
            activeDot={{ r: 5, fill: "#B91C1C" }}
            label={({ x, y, value }) => (
              <text
                x={x}
                y={y - 10}
                fill="#1F2937"
                fontSize={12}
                fontWeight={500}
                textAnchor="middle"
                style={{
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {`${Number(value).toFixed(0)}%`}
              </text>
            )}
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
};

export default ProcessLossChart;

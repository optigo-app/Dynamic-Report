import React from "react";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Tooltip, LabelList } from "recharts";
import {  Typography } from "@mui/material";

const Top10Customers = ({ Top10CustomersData }) => {
  const data = Top10CustomersData?.[0]?.data || [];
  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: 500, color: "#0f172a", mb: 2 }}>
        Top 10 Customers by Sales – {Top10CustomersData?.[0]?.year}
      </Typography>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: -10 }}>
          <XAxis
            dataKey="name"
            interval={0}
            tick={{
              fontSize: 11,
              fill: "#475569",
            }}
            tickFormatter={(name) => (name.length > 14 ? name.slice(0, 12) + "…" : name)}
          />
          <YAxis hide />

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

          <Bar dataKey="sales" fill="url(#gradientCustomer)" radius={[6, 6, 0, 0]}>
            <LabelList
              dataKey="sales"
              position="top"
              style={{
                fill: "#6b7280",
                fontWeight: 500,
                fontSize: 12,
              }}
              formatter={(value) => (value > 0 ? value : "")} // hide label for 0s
            />
          </Bar>

          <defs>
            <linearGradient id="gradientCustomer" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#bfdbfe" stopOpacity={0.2} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default Top10Customers;

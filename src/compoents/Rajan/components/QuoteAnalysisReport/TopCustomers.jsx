import React from "react";
import { Box, Typography, ToggleButton } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ModernToggleButtonGroup } from "../../styled/ToggleButton";

const TopCustomers = ({ customerView, setCustomerView, TopCustomersData }) => {
  const activeView = customerView || "count";
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 500, color: "#0f172a" }}>
          Top Customers by {activeView === "amount" ? "Amount" : "Count"}
        </Typography>
        <ModernToggleButtonGroup value={customerView} exclusive onChange={(e, newView) => setCustomerView(newView || "count")} size="small">
          <ToggleButton value="count">Count</ToggleButton>
          <ToggleButton value="amount">Amount</ToggleButton>
        </ModernToggleButtonGroup>
      </Box>
      <Box sx={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={TopCustomersData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis hide tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                zIndex: 1000,
              }}
              labelStyle={{ color: "#475569", fontWeight: 600, zIndex: 1000 }}
              itemStyle={{ color: "#0f172a", zIndex: 1000 }}
            />
            {activeView === "count" ? (
              <>
                <Bar dataKey="orderCount" name="Orders" fill="#6366f1" radius={[4, 4, 0, 0]}>
                  {TopCustomersData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={"#6366f1"} opacity={1} />
                  ))}
                </Bar>
                <Bar dataKey="salesCount" name="Sales" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                  {TopCustomersData.map((entry, index) => (
                    <Cell key={`cell-sales-${index}`} fill={"#8b5cf6"} opacity={1} />
                  ))}
                </Bar>
              </>
            ) : (
              <>
                <Bar dataKey="orderAmount" name="Total Orders" fill="#6366f1" radius={[4, 4, 0, 0]}>
                  {TopCustomersData.map((entry, index) => (
                    <Cell key={`cell-total-${index}`} fill={"#6366f1"} opacity={1} />
                  ))}
                </Bar>
                <Bar dataKey="saleAmount" name="Total Sales" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                  {TopCustomersData.map((entry, index) => (
                    <Cell key={`cell-total-sales-${index}`} fill={"#8b5cf6"} opacity={1} />
                  ))}
                </Bar>
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </>
  );
};

export default TopCustomers;

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Typography, Box } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const gradient = [
  { from: "#f472b6", to: "#ec4899" },
];

const CustomerDelayChart = ({ customerWiseDelayPcs }) => {
  const FormattedData = customerWiseDelayPcs.map((item) => ({
    name: item?.customer,
    pcs: item?.totalDelayDays,
  }));

  const total = FormattedData?.reduce((sum, row) => sum + row.pcs, 0);


  return (
    <>
      <Typography variant="h6" mb={2}>
        Customer Wise Delay Pcs
      </Typography>

      {/* Header */}
      <Box
        display="flex"
        flexDirection="column"
        bgcolor="#fff"
        borderRadius={2}
        overflow="hidden"
        height={390} // ⬅️ Set height to enable scroll area
      >
        {/* Scrollable Chart Container */}
        <Box
          sx={{
            overflowY: "auto",
            flexGrow: 1,
          }}
        >
          {/* Header */}
          <Box
            display="flex"
            px={2}
            py={1}
            bgcolor="#f5f5f5"
            alignItems="center"
            borderBottom="1px solid #eee"
          >
            <Box
              width="50%"
              display="flex"
              alignItems="center"
              fontSize={13}
              fontWeight={600}
              color="#333"
            >
              Customer
              <ArrowDropDownIcon fontSize="small" />
            </Box>
            <Box
              width="50%"
              textAlign="right"
              fontSize={13}
              fontWeight={600}
              color="#333"
            >
              No of Pcs
            </Box>
          </Box>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={FormattedData.length * 32}>
            <BarChart
              data={FormattedData}
              layout="vertical"
              margin={{ top: 0, right: 30, left: 30, bottom: 0 }}
              barCategoryGap={8}
              barSize={28}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={gradient[0].from} />
                  <stop offset="100%" stopColor={gradient[0].to} />
                </linearGradient>
              </defs>

              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={80}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 13, fill: "#555", fontWeight: 500 }}
              />
              <Bar
                dataKey="pcs"
                radius={[0, 6, 6, 0]}
                isAnimationActive={false}
                label={({ x, y, width, height, value }) => {
                  const padding = 6;
                  const minWidth = 50;
                  const inside = width > minWidth;

                  return (
                    <text
                      x={inside ? x + width - padding : x + width + padding}
                      y={y + height / 2}
                      fill={inside ? "#fff" : "#111"}
                      fontSize={12}
                      fontWeight={500}
                      textAnchor={inside ? "end" : "start"}
                      alignmentBaseline="middle"
                    >
                      {value}
                    </text>
                  );
                }}
              >
                {FormattedData?.map((_, idx) => (
                  <Cell key={idx} fill="url(#barGradient)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Sticky Footer */}
        <Box
          px={2}
          py={1}
          bgcolor="#f5f5f5"
          display="flex"
          justifyContent="space-between"
          fontSize={14}
          fontWeight={600}
          color="#333"
          borderTop="1px solid #eee"
          sx={{
            position: "sticky",
            bottom: 0,
            zIndex: 1,
          }}
        >
          <Box>Total</Box>
          <Box>{total}</Box>
        </Box>
      </Box>

    </>
  );
};

export default CustomerDelayChart;

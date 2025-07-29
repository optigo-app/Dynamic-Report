import { Box, Typography, Paper } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer, defs } from "recharts";
import CustomTooltip from "./CustomTooltip";

const gradientId = "blueGradient";

const CustomBarLabel = ({ x, y, width, value }) => {
  return (
    <text
      x={x + width + 6}
      y={y + 14}
      fontSize={13}
      fill="#374151" // Tailwind Gray-700
      fontWeight={500}
    >
      {`${value}%`}
    </text>
  );
};

const CategoryBarChart = ({ categoryAnalysis }) => {
  const formattedData = categoryAnalysis?.map((val) => {
    const loss = Number(val?.factoryLoss);
    return {
      category: val?.category ?? "Unknown",
      percentage: isNaN(loss) ? 0 : +loss.toFixed(2), // + converts string to number
    };
  });
  return (
    <>
      <Typography variant="h6" gutterBottom >
        Category-wise Percentage
      </Typography>

      <Box sx={{  height: 350, overflowY: "auto" }}>
        <ResponsiveContainer width="100%" height={formattedData.length * 45}>
          <BarChart data={formattedData} layout="vertical" margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#2563EB" stopOpacity={1} />
              </linearGradient>
            </defs>

            <XAxis type="number" hide domain={[0, 150]} />
            <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 14, fill: "#6B7280", fontWeight: 500 }} width={150} />
            <Tooltip cursor={{ fill: "rgba(59, 130, 246, 0.05)" }} content={<CustomTooltip />} labelStyle={{ display: "none" }} formatter={(val) => [`${val}%`, "Percentage"]} />
            <Bar dataKey="percentage" fill={`url(#${gradientId})`} barSize={22} radius={[14, 14, 14, 14]}>
              <LabelList content={<CustomBarLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </>
  );
};

export default CategoryBarChart;

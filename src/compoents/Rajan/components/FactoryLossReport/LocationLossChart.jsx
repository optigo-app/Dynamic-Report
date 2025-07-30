import { XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Area, Bar, ComposedChart } from "recharts";
import { Typography } from "@mui/material";

const Dashboard = ({ locationAnalysis }) => {
  const chartData = Array?.isArray(locationAnalysis)
    ? locationAnalysis.map((item) => ({
      name: item.location || "Unknown",
      value: Number(item.factoryLoss?.toFixed(2)) || 0,
    }))
    : [];

  // 🌿 Light green tone palette
  // const barFill = "#DBEAFE";        // Lightest blue (calm background fill)
  // const areaStroke = "#3B82F6";     // Blue 500 (sharp stroke)
  // const gradientStart = "#93C5FD";  // Blue 300 (smooth overlay)

  // const barFill = "#DBEAFE";       // Soft sky blue
  // const areaStroke = "#3B82F6";    // Strong, crisp stroke
  // const gradientStart = "#93C5FD"; // Calm gradient

  // const barFill = "#EDE9FE"; // Lavender 100
  // const areaStroke = "#8B5CF6"; // Violet 500
  // const gradientStart = "#C4B5FD"; // Violet 300

  // const barFill = "#F3F4F6";       // Gray 100 (background-style bar)
  // const areaStroke = "#6B7280";    // Gray 500
  // const gradientStart = "#9CA3AF"; // Gray 400

  // const barFill = "#FFE4E6";       // Rose 100
  // const areaStroke = "#FB7185";    // Rose 500
  // const gradientStart = "#FDA4AF"; // Rose 300

  const barFill = "#93c5fd";       // Light Blue (start)
  const areaStroke = "#3b82f6";    // Strong Blue (end)
  const gradientStart = "#93c5fd"; // Match barFill for visual continuity


  // Chart color palette (modern SaaS - cool green tone)
  //   const barFill = "#B7F0D9"; // Bar color (mint green)
  //   const areaStroke = "#2EB67D"; // Line stroke (modern green, like Slack)
  //   const gradientStart = "#7EE0B8"; // Area fill gradient start (soft emerald)
  const gridStroke = "#E5E7EB"; // Grid line (cool gray)
  const axisColor = "#6B7280"; // X/Y axis text (muted gray)
  const tooltipBg = "#FFFFFF"; // Tooltip background
  const tooltipBorder = "#D1D5DB"; // Tooltip border
  const tooltipText = "#111827"; // Tooltip text color

  console.log(locationAnalysis, "locationAnalysis");

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Cell Wise Loss
      </Typography>

      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={chartData}>
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={gradientStart} stopOpacity={10} />
              <stop offset="100%" stopColor={gradientStart} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />

          <XAxis dataKey="name" stroke={axisColor} />
          <YAxis stroke={axisColor} />

          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: `1px solid ${tooltipBorder}`,
              background: tooltipBg,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
            }}
            labelStyle={{
              color: tooltipText,
              fontWeight: 500,
            }}
            itemStyle={{
              color: tooltipText,
            }}
            formatter={(value) => `${value.toLocaleString()}%`}
          />

          <Bar dataKey="value" barSize={28} fill={barFill} radius={[4, 4, 0, 0]} />

          {/* <Area type="monotone" dataKey="value" stroke={areaStroke} fill="url(#areaFill)" strokeWidth={2} /> */}
        </ComposedChart>
      </ResponsiveContainer>
    </>
  );
};

export default Dashboard;

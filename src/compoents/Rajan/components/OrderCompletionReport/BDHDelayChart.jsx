import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { Paper, Typography, Box, useTheme, alpha } from "@mui/material";
import { TrendingUp, TrendingDown } from "lucide-react";

const getGradient = (value) => {
  return value <= 50
    ? { from: "#93c5fd", to: "#3b82f6" } // Blue
    : { from: "#fee2e2", to: "#f87171" } // Red
};

const getIcon = (value) => (value <= 50 ? TrendingDown : TrendingUp);

export default function BDHDelayChart({ saleRepWieseDelay }) {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const chartId = useMemo(() => `bdh-chart-${Math.random().toString(36).substr(2, 9)}`, []);

  useEffect(() => {
    const processData = saleRepWieseDelay?.map((item) => {
      const gradient = getGradient(item?.delayPercent);
      return {
        name: item?.salesRep,
        value: item?.delayPercent,
        gradientId: `${chartId}-gradient-${item?.salesRep?.toLowerCase()}`,
        gradient,
        icon: getIcon(item?.delayPercent),
      };
    });

    setData(processData || []);
  }, [saleRepWieseDelay, chartId]);

  return (
    <>
      <Box mb={3}>
        <Typography variant="h5" gutterBottom>
          Sales Rep Wise Delay
        </Typography>
      </Box>

      <Box sx={{ height: 370, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 30, right: 20, left: 0, bottom: 10 }}
            barCategoryGap="25%"
          >
            <defs>
              {data.map((item) => (
                <linearGradient key={item.gradientId} id={item.gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={item.gradient.from} />
                  <stop offset="100%" stopColor={item.gradient.to} />
                </linearGradient>
              ))}
            </defs>

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fontWeight: 600, dy: 8 }}
            />
            <YAxis domain={[0, 100]} hide />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: alpha(theme.palette.action.hover, 0.1), radius: 2 }}
            />
            <Bar dataKey="value" radius={[2, 2, 0, 0]} maxBarSize={60}>
              <LabelList
                dataKey="value"
                position="top"
                fill="#000"
                fontSize={14}
                fontWeight={700}
                offset={8}
                formatter={(value) => `${value}%`}
              />
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`url(#${entry.gradientId})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    const { icon: IconComponent, value } = payload[0].payload;

    return (
      <Paper
        elevation={8}
        sx={{
          p: 1.2,
          backdropFilter: "blur(10px)",
          borderRadius: 2,
          minWidth: 90,
          bgcolor: "#fff",
        }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <IconComponent size={16} color="#000" />
          <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
            {label}
          </Typography>
        </Box>
        <Typography variant="h6" color="primary.main" fontWeight={700}>
          {value}%
        </Typography>
      </Paper>
    );
  }
  return null;
};


// import React, { useState, useEffect, useMemo } from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, LabelList } from "recharts";
// import { Paper, Typography, Box, useTheme, alpha } from "@mui/material";
// import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// const getPerformanceTier = (value) => {
//   if (value >= 90) return "excellent";
//   if (value >= 80) return "good";
//   if (value >= 60) return "average";
//   return "poor";
// };

// const performanceConfig = {
//   excellent: {
//     gradients: [
//       { from: "#a7f3d0", to: "#6ee7b7" }, // Linear-style minty green
//       { from: "#93c5fd", to: "#3b82f6" }, // Superhuman soft blue
//     ],
//     chipColor: "success",
//     icon: TrendingUp,
//   },
//   good: {
//     gradients: [
//       { from: "#ddd6fe", to: "#a78bfa" }, // Figma-ish lavender
//       { from: "#c7d2fe", to: "#6366f1" }, // Linear-indigo
//     ],
//     chipColor: "primary",
//     icon: TrendingUp,
//   },
//   average: {
//     gradients: [
//       { from: "#fef3c7", to: "#fcd34d" }, // Notion-light amber
//       { from: "#fbcfe8", to: "#f9a8d4" }, // Figma soft pink
//     ],
//     chipColor: "warning",
//     icon: Minus,
//   },
//   poor: {
//     gradients: [
//       { from: "#fee2e2", to: "#f87171" }, // Calm red
//       { from: "#fca5a5", to: "#ef4444" }, // Vercel red tone
//     ],
//     chipColor: "error",
//     icon: TrendingDown,
//   },
// };

// export default function BDHDelayChart({ saleRepWieseDelay }) {
//   const theme = useTheme();
//   const [data, setData] = useState([]);
//   const chartId = useMemo(() => `bdh-chart-${Math.random().toString(36).substr(2, 9)}`, []);
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const apiData = saleRepWieseDelay;
//         const processedData = apiData?.map((item, index) => {
//           const tier = getPerformanceTier(item?.delayPercent);
//           const tierConfig = performanceConfig[tier];
//           const gradientIndex = index % tierConfig?.gradients?.length;

//           return {
//             name: item?.salesRep,
//             value: item?.delayPercent,
//             tier,
//             gradientId: `${chartId}-gradient-${item?.salesRep?.toLowerCase()}`,
//             gradient: tierConfig?.gradients[gradientIndex],
//             chipColor: tierConfig?.chipColor,
//             icon: tierConfig?.icon,
//           };
//         });

//         setData(processedData);
//       } catch (err) {
//         console.error("Error fetching BDH data:", err);
//       }
//     };

//     loadData();
//   }, [chartId]);

//   return (
//     <>
//       <Box mb={3}>
//         <Typography variant="h5" gutterBottom>
//           Sales Rep Wise Delay
//         </Typography>
//       </Box>
//       <Box sx={{ height: 370, width: "100%" }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={data} margin={{ top: 30, right: 20, left: 0, bottom: 10 }} barCategoryGap="25%">
//             <defs>
//               {data.map((item) => (
//                 <linearGradient key={item.gradientId} id={item.gradientId} x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="0%" stopColor={item.gradient.from} />
//                   <stop offset="100%" stopColor={item.gradient.to} />
//                 </linearGradient>
//               ))}
//             </defs>

//             <XAxis
//               dataKey="name"
//               axisLine={false}
//               tickLine={false}
//               tick={{
//                 fontSize: 12,
//                 fontWeight: 600,
//                 dy: 8,
//               }}
//             />
//             <YAxis domain={[0, 100]} hide />
//             <Tooltip
//               content={<CustomTooltip />}
//               cursor={{
//                 fill: alpha(theme.palette.action.hover, 0.1),
//                 radius: 2,
//               }}
//             />

//             <Bar dataKey="value" radius={[2, 2, 0, 0]} maxBarSize={60}>
//               <LabelList dataKey="value" position="top" fill={"#000"} fontSize={14} fontWeight={700} offset={8} formatter={(value) => `${value}%`} />
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={`url(#${entry.gradientId})`} />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </Box>
//     </>
//   );
// }

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     const data = payload[0].payload;
//     const IconComponent = data.icon;

//     return (
//       <Paper
//         elevation={8}
//         sx={{
//           p: 1.2,
//           backdropFilter: "blur(10px)",
//           borderRadius: 2,
//           minWidth: 90,
//           bgcolor: "#fff",
//         }}
//       >
//         <Box display="flex" alignItems="center" gap={1} mb={0.5}>
//           <IconComponent size={16} color={"#000"} />
//           <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
//             {label}
//           </Typography>
//         </Box>
//         <Typography variant="h6" color="primary.main" fontWeight={700}>
//           {payload[0].value}%
//         </Typography>
//       </Paper>
//     );
//   }
//   return null;
// };

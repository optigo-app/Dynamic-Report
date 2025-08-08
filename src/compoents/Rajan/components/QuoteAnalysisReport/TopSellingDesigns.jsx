import { Box, Typography, ToggleButton } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { ModernToggleButtonGroup } from "../../styled/ToggleButton";



const TopSellingDesigns = ({ designView, setDesignView, TopSellingDesignsData }) => {

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 500, color: "#0f172a" }}>
          Top Selling Designs
        </Typography>
        <ModernToggleButtonGroup value={designView} exclusive onChange={(e, newView) => newView && setDesignView(newView)} size="small">
          <ToggleButton value="high">High</ToggleButton>
          <ToggleButton value="low">Low</ToggleButton>
        </ModernToggleButtonGroup>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          maxHeight: 290,
          overflowY: "auto",
          pr: 1, // avoid scrollbar overlapping text
          scrollbarWidth: "thin",
          scrollbarColor: "#d1d5db transparent", // Firefox
          "&::-webkit-scrollbar": {
            width: 6,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#d1d5db",
            borderRadius: 6,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#a1a1aa",
          },
        }}
      >
        {TopSellingDesignsData?.map((design, index) => (
          <Box key={design?.name}>
            <Typography variant="body2" fontWeight={500} ml={1}>
              {design?.name}
            </Typography>
            <ResponsiveContainer
              width="100%"
              height={40}
              style={{
                outline: "none",
                border: "none",
              }}
            >
              <BarChart layout="vertical" data={[design]}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" hide />
                <Tooltip
                  wrapperStyle={{ zIndex: 1000 }}
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

                <Bar dataKey="orderCount" stackId="a" radius={[4, 0, 0, 4]}>
                  <Cell fill="#ffba08" />
                  <LabelList
                    dataKey="orderCount"
                    position="insideLeft"
                    content={({ x, y, width, height, value }) => (
                      <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="central" fill="#1e293b" fontSize={12} fontWeight={600}>
                        {value}
                      </text>
                    )}
                  />
                </Bar>

                <Bar dataKey="salesCount" stackId="a" radius={[0, 4, 4, 0]}>
                  <Cell fill="#ff36ab" />
                  <LabelList
                    dataKey="salesCount"
                    position="insideRight"
                    content={({ x, y, width, height, value }) => (
                      <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="central" fill="#ffffff" fontSize={12} fontWeight={600}>
                        {value}
                      </text>
                    )}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default TopSellingDesigns;

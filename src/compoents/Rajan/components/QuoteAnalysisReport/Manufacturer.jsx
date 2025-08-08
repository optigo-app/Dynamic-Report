import React from "react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from "recharts";
import { Box, Typography, List, ListItem, ListItemText, Chip, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const { name, salesCount, orderCount, saleAmount, items } = payload[0].payload;

  return (
    <Box
      sx={{
        px: 2,  
        py: 1.5,
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.7)", // Light mode
        color: "text.primary",
        borderRadius: 2,
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        border: "1px solid",
        borderColor: "divider",
        minWidth: 200,
        transition: "all 0.2s ease-in-out",
        ...(theme => theme.palette.mode === "dark" && {
          backgroundColor: "rgba(30, 30, 30, 0.6)", // Dark mode
        }),
      }}
    >
      <Typography variant="subtitle2" sx={{fontSize:"1rem"}} fontWeight={600} gutterBottom>
        {name}
      </Typography>
      <Typography variant="body2" sx={{fontSize:"0.8rem"}}>Sales Count: <b>{salesCount}</b></Typography>
      <Typography variant="body2" sx={{fontSize:"0.8rem"}}>Order Count: <b>{orderCount}</b></Typography>
      <Typography variant="body2" sx={{fontSize:"0.8rem"}}>Sale Amount: <b>₹{saleAmount.toLocaleString()}</b></Typography>
      <Typography variant="body2" sx={{fontSize:"0.8rem"}}>Item Count: <b>{items?.length || 0}</b></Typography>
    </Box>
  );
};


const Manufacturer = ({ TopManufacturerData }) => {
  const theme = useTheme();
  return (
    <Box sx={{ backgroundColor: "#f9fafb", borderRadius: 3, p: 3 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {/* LEFT LIST */}
        <Box sx={{ flex: 1, minWidth: 300, maxHeight: 300, display: "flex", flexDirection: "column" }}>
          <Typography variant="h6" sx={{ fontWeight: 500, color: "#0f172a", mb: 1 }}>
            Top Manufacturer Performance
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#0f172a", mb: 1 }}>
            Top Manufacturers
          </Typography>
          <Box sx={{ overflowY: "auto", pr: 1, flex: 1 }}>
            <List dense disablePadding>
              {TopManufacturerData?.map((manufacturer, index) => (
                <ListItem key={manufacturer?.name} sx={{ px: 0, py: 1, alignItems: "flex-start", gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, mt: 0.5, bgcolor: "#f1f5f9", color: "#3b82f6", fontSize: "0.875rem", fontWeight: 600 }}>{index + 1}</Avatar>
                  <ListItemText primary={manufacturer?.name} secondary={`${manufacturer?.orderCount} orders • ₹${manufacturer?.saleAmount.toLocaleString()}`} primaryTypographyProps={{ fontWeight: 500, fontSize: "0.875rem", noWrap: true, sx: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }} secondaryTypographyProps={{ fontSize: "0.75rem", color: "#64748b" }} />
                  <Chip label={`${manufacturer?.salesPercent}%`} size="small" sx={{ bgcolor: "#dcfce7", color: "#166534", fontWeight: 600, fontSize: "0.75rem", height: 22, mt: 0.5 }} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
        <Box sx={{ flex: 2, minWidth: 300 }}>
          <Box sx={{ position: "relative", height: 300, mt: -5 }}>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart outerRadius={130} data={TopManufacturerData}>
                <PolarGrid stroke={theme.palette.divider} />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 12, fill: theme.palette.text.secondary }} />
                <PolarRadiusAxis angle={90} tick={{ fontSize: 10, fill: theme.palette.text.disabled }} />

                <Radar name="Manufacturers" dataKey="salesCount" stroke={theme.palette.primary.main} fill={theme.palette.primary.main} fillOpacity={0.3} />

                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Manufacturer;

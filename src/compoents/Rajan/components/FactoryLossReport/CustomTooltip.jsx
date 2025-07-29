import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

// Modern styled tooltip container
const TooltipContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.25, 1.5),
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)", // smooth subtle shadow
  borderRadius: 12,
  minWidth: 120,
  border: "1px solid #E5E7EB", // light border like Tailwind Gray-200
}));

const CustomTooltip = ({ active, payload, label, ShowPer = true }) => {
  if (!active || !payload?.length) return null;

  const data = payload[0];

  return (
    <TooltipContainer>
      <Box display="flex" flexDirection="column" gap={0.5}>
        <Typography
          variant="body2"
          sx={{ fontSize: 13, fontWeight: 500, color: "#6B7280" }} // Tailwind Gray-500
        >
          {label || data?.name}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontSize: 18,
            fontWeight: 600,
            color: "#1D4ED8", // Tailwind Blue-700
          }}
        >
          {data.value}
          {ShowPer && "%"}
        </Typography>
      </Box>
    </TooltipContainer>
  );
};

export default CustomTooltip;

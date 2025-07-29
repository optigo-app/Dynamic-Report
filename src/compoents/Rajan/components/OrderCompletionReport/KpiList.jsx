import React from "react";
import { Grid, Box, Typography, CardContent, styled, Card } from "@mui/material";

const StatCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(3),
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.04)",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.08)",
  },
}));

const KpiList = ({ analyticsData }) => {
  return (
    <>
      {analyticsData?.map((kpi, index) => (
        <Grid item xs={12} size={{sm:6, md:2}} key={index}>
          <StatCard elevation={0}>
            <CardContent sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {kpi?.label}
                  </Typography>
                  <Typography variant="h5" fontWeight={600} color="text.primary">
                    {kpi?.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: kpi?.bgColor,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: kpi?.color,
                  }}
                >
                  {kpi?.icon}
                </Box>
              </Box>
            </CardContent>
          </StatCard>
        </Grid>
      ))}
    </>
  );
};

export default KpiList;

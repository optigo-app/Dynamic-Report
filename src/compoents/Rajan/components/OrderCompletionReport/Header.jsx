import { styled, Paper, Button, Box, Typography } from "@mui/material";
import React from "react";
import { CheckCircle } from "@mui/icons-material";
import RangeDatePicker from "../shared/RangeDatePicker";

const HeaderCard = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: "none",
  border: "none",
  outline: "none",
}));
const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.875rem",
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(0.6),
  transition: "all 0.2s ease-in-out",
  boxShadow: "none",
  "&:hover": {
    boxShadow: "0px 6px 18px rgba(0,0,0,0.06)",
  },
}));

const Header = ({ activeTab, setActiveTab, dateRange, setDateRange }) => {
  return (
    <>
      <HeaderCard elevation={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h4" fontWeight={600}>
             Order Completion Analysis
            </Typography>
          </Box>
          <Box display="flex" gap={1} alignItems="center">
            <RangeDatePicker value={dateRange} onChange={setDateRange} />
            <Box display="flex" gap={2} alignItems="center">
              <ActionButton variant={activeTab === 0 ? "contained" : "outlined"} onClick={() => setActiveTab(0)} color="primary">
                Running Orders
              </ActionButton>
              <ActionButton
                sx={{
                  color: activeTab === 1 ? "white" : "primary",
                }}
                variant={activeTab === 1 ? "contained" : "outlined"}
                onClick={() => setActiveTab(1)}
                color="success"
                startIcon={<CheckCircle />}
              >
                Sold Orders
              </ActionButton>
            </Box>
          </Box>
        </Box>
      </HeaderCard>
    </>
  );
};

export default Header;

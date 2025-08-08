import { styled, Paper, Box, Typography } from "@mui/material";
import React from "react";
import RangeDatePicker from "../shared/RangeDatePicker";

const HeaderCard = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: "none",
  border: "none",
  outline: "none",
}));

const Header = ({ dateRange, setDateRange }) => {
  return (
    <>
      <HeaderCard elevation={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h4" fontWeight={600}>
              Quote Analysis
            </Typography>
          </Box>
          <Box display="flex" gap={1} alignItems="center">
            <RangeDatePicker value={dateRange} onChange={setDateRange} />
          </Box>
        </Box>
      </HeaderCard>
    </>
  );
};

export default Header;

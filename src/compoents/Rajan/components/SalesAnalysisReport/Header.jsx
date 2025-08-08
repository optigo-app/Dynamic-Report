import { styled, Paper, Box, Typography } from "@mui/material";
import React, { memo } from "react";
import YearPicker from "./YearPicker";

const HeaderCard = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: "none",
  border: "none",
  outline: "none",
}));

const Header = memo(({ CurrentMonth, CurrentYear, setCurrentMonth, setCurrentYear }) => {
  const handleChange = (data) => {
    setCurrentMonth(data.month);
    setCurrentYear(data.year);
  };

  const handlePrev = (month, year) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const handleNext = (month, year) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const handleMonthChange = (month) => {
    setCurrentMonth(month);
  };

  const handleYearChange = (year) => {
    setCurrentYear(year);
  };

  return (
    <>
      <HeaderCard elevation={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h4" fontWeight={600}>
              Sales Analysis
            </Typography>
          </Box>
          <Box display="flex" gap={1} alignItems="center">
            <YearPicker month={CurrentMonth} year={CurrentYear} onChange={handleChange} onMonthChange={handleMonthChange} onYearChange={handleYearChange} onPrev={handlePrev} onNext={handleNext} />
          </Box>
        </Box>
      </HeaderCard>
    </>
  );
});

export default Header;

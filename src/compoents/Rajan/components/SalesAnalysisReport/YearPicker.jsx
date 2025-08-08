import React, { useState } from "react";
import { Box, IconButton, Typography, useTheme, Menu, MenuItem } from "@mui/material";
import { alpha, styled } from "@mui/system";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { format } from "date-fns";

const GlassyContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: 8,
  borderRadius: 999,
}));

const NavButton = styled(IconButton)(({ theme }) => ({
  cursor: "pointer",
  fontSize: 13.5,
  fontWeight: 500,
  borderRadius: "50%",
  color: "text.primary",
  px: 1,
  height: 37,
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  backdropFilter: "blur(6px)",
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  border: "1px solid #ddd",
  borderColor: "divider",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.background.paper, 0.75),
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
}));

const Pill = styled(IconButton)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 4,
  padding: "7.5px 18px",
  borderRadius: 24,
  background: "#fff",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  cursor: "pointer",
  fontSize: 13.5,
  fontWeight: 500,
  color: "text.primary",
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  backdropFilter: "blur(6px)",
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  border: "1px solid #ddd",
  borderColor: "divider",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.background.paper, 0.75),
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
}));

const BlueDot = styled("span")({
  width: 5,
  height: 5,
  borderRadius: "50%",
  backgroundColor: "#3b82f6",
  transform: "rotate(45deg)",
  marginLeft: 4,
});


const MONTHS = [
  { label: "All", value: null },
  ...Array.from({ length: 12 }, (_, i) => ({
    label: format(new Date(2021, i), "MMMM"),
    value: i,
  }))
];

const YEARS = Array.from({ length: 20 }, (_, i) => {
  const year = new Date().getFullYear() - 10 + i;
  return { label: year.toString(), value: year };
});

const MonthYearSelector = ({ month, year , onChange, onPrev, onNext, onMonthChange, onYearChange }) => {
  const theme = useTheme();

  const [anchorElMonth, setAnchorElMonth] = useState(null);
  const [anchorElYear, setAnchorElYear] = useState(null);

  const handleMonthClick = (event) => setAnchorElMonth(event.currentTarget);
  const handleYearClick = (event) => setAnchorElYear(event.currentTarget);

  const handleSelectMonth = (value) => {
    const newDate = new Date(year, value, 1);
    onMonthChange?.(value);
    onChange?.({
      month: value,
      year: year,
      date: newDate,
    });

    setAnchorElMonth(null);
  };

  const handleSelectYear = (value) => {
    const newDate = new Date(value, month, 1);
    onYearChange?.(value);

    onChange?.({
      month: month,
      year: value,
      date: newDate,
    });

    setAnchorElYear(null);
  };

  const handlePrev = () => {
    let newMonth = month;
    let newYear = year;

    if (month === 0) {
      newMonth = 11;
      newYear = year - 1;
    } else {
      newMonth = month - 1;
    }

    const newDate = new Date(newYear, newMonth, 1);

    onPrev?.(newMonth, newYear);
    onMonthChange?.(newMonth);
    onYearChange?.(newYear);

    onChange?.({
      month: newMonth,
      year: newYear,
      date: newDate,
    });
  };

  const handleNext = () => {
    let newMonth = month;
    let newYear = year;

    if (month === 11) {
      newMonth = 0;
      newYear = year + 1;
    } else {
      newMonth = month + 1;
    }

    const newDate = new Date(newYear, newMonth, 1);

    onNext?.(newMonth, newYear);
    onMonthChange?.(newMonth);
    onYearChange?.(newYear);

    onChange?.({
      month: newMonth,
      year: newYear,
      date: newDate,
    });
  };

  const monthLabel = MONTHS.find(m => m.value === month)?.label || "All";


  return (
    <>
      <GlassyContainer>
        <NavButton aria-label="Previous" onClick={handlePrev}>
          <ChevronLeftIcon fontSize="small" />
        </NavButton>

        <Pill onClick={handleYearClick}>
          <Typography variant="subtitle2" fontWeight={700}>
            {year || "Year"}
          </Typography>
          <BlueDot />
        </Pill>

        <Pill onClick={handleMonthClick}>
          <Typography variant="subtitle2" fontWeight={700} width={80}>
            {monthLabel}
          </Typography>
          <BlueDot />
        </Pill>

        <NavButton aria-label="Next" onClick={handleNext}>
          <ChevronRightIcon fontSize="small" />
        </NavButton>
      </GlassyContainer>

      {/* Year Menu */}
      <Menu
        anchorEl={anchorElYear}
        open={Boolean(anchorElYear)}
        onClose={() => setAnchorElYear(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 5,
            backdropFilter: "blur(10px)",
            backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.75),
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            border: "1px solid",
            borderColor: "divider",
            px: 0.5,
            py: 0.7,
            minWidth: 180,
            maxHeight: 350,
          },
        }}
        sx={{
          mt: 0.5,
          ml: 0.5,
          "& .MuiMenu-list": {
            p: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          },
        }}
      >
        {YEARS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === year}
            onClick={() => handleSelectYear(option.value)}
            disableRipple
            sx={{
              fontSize: 14,
              fontWeight: option.value === year ? 600 : 400,
              borderRadius: 8,
              py: 1,
              px: 2,
              color: option.value === year ? "primary.main" : "text.primary",
              backgroundColor: option.value === year ? "action.selected" : "transparent",
              transition: "background-color 0.15s ease",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Month Menu */}
      <Menu
        anchorEl={anchorElMonth}
        open={Boolean(anchorElMonth)}
        onClose={() => setAnchorElMonth(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 5,
            backdropFilter: "blur(10px)",
            backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.75),
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            border: "1px solid",
            borderColor: "divider",
            px: 0.5,
            py: 0.7,
            minWidth: 180,
            maxHeight: 350,
          },
        }}
        sx={{
          mt: 0.5,
          ml: 0.5,
          "& .MuiMenu-list": {
            p: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          },
        }}
      >
        {MONTHS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value  === month}
            onClick={() => handleSelectMonth(option.value)}
            disableRipple
            sx={{
              fontSize: 14,
              fontWeight: option.value === month ? 600 : 400,
              borderRadius: 8,
              py: 1,
              px: 2,
              color: option.value === month ? "primary.main" : "text.primary",
              backgroundColor: option.value === month ? "action.selected" : "transparent",
              transition: "background-color 0.15s ease",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default MonthYearSelector;

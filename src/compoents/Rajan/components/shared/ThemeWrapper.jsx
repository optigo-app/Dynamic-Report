import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { MuithemeR } from "../../constants/Theme";
import "@fontsource/poppins";
import "../../index.css";

const ThemeWrapper = ({ children }) => {
  return (
    <>
      <ThemeProvider theme={MuithemeR}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          {children}
        </LocalizationProvider>
      </ThemeProvider>
    </>
  );
};

export default ThemeWrapper;

import React from "react";
import { FactoryLossProvider } from "../../context/FactoryLossReport";
import FactoryLossReport from "./Main";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { MuithemeR } from "../../constants/Theme";
import "@fontsource/poppins";
import "../../index.css";

const index = () => {
  return (
    <>
      <ThemeProvider theme={MuithemeR}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <FactoryLossProvider>
            <FactoryLossReport />
          </FactoryLossProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  );
};

export default index;

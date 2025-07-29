import React from "react";
import OrderCompletionReport from "./Main";
import { OrderCompletionProvider } from "../../context/OrderCompletionReport";
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
          <OrderCompletionProvider>
            <OrderCompletionReport />
          </OrderCompletionProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  );
};

export default index;

import React from "react";
import SalesAnalysisReport from "./Main";
import ThemeWrapper from "../shared/ThemeWrapper";
import { GlobalStyles } from "@mui/material";
import { SalesReportProvider } from "../../context/SalesAnalysisReport";

const index = () => {
  return (
    <>
      <SalesReportProvider>
        <GlobalStyles
          styles={{
            ".recharts-wrapper:focus, .recharts-surface:focus": {
              outline: "none",
              border: "none",
            },
          }}
        />
        <ThemeWrapper>
          <SalesAnalysisReport />
        </ThemeWrapper>
      </SalesReportProvider>
    </>
  );
};

export default index;

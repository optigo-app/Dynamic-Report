import React from "react";
import QuoteAnalysisReport from "./Main";
import ThemeWrapper from "../shared/ThemeWrapper";
import { GlobalStyles } from "@mui/material";
import { QuoteReportProvider } from "../../context/QuoteReportProvider";

const index = () => {
  return (
    <>
      <QuoteReportProvider>
        <GlobalStyles
          styles={{
            ".recharts-wrapper:focus, .recharts-surface:focus": {
              outline: "none",
              border: "none",
            },
          }}
        />
        <ThemeWrapper>
          <QuoteAnalysisReport />
        </ThemeWrapper>
      </QuoteReportProvider>
    </>
  );
};

export default index;

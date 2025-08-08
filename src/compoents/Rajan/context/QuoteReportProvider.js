import React, { createContext, useContext, useState } from "react";
import { QuoteReportData } from "../data/quote";
const QuoteReportContext = createContext();

export const useQuoteReport = () => useContext(QuoteReportContext);

export const QuoteReportProvider = ({ children }) => {
  const [rawData, setRawData] = useState(QuoteReportData);

  return (
    <QuoteReportContext.Provider
      value={{
        rawData,
        setRawData,
      }}
    >
      {children}
    </QuoteReportContext.Provider>
  );
};

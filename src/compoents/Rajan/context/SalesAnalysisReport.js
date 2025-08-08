import React, { createContext, useContext, useState } from "react";
import { SalesReportData } from "../data/sales";
const SalesReportContext = createContext();

export const useSalesReport = () => useContext(SalesReportContext);

export const SalesReportProvider = ({ children }) => {
  const [rawData, setRawData] = useState(SalesReportData);

  return (
    <SalesReportContext.Provider
      value={{
        rawData,
        setRawData,
      }}
    >
      {children}
    </SalesReportContext.Provider>
  );
};

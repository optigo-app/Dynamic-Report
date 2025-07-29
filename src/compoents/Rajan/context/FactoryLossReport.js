import React, { createContext, useContext, useState } from "react";
import { FactoryLossReportData } from "../data/data";
const FactoryLossContext = createContext();

export const useFactoryLoss = () => useContext(FactoryLossContext);

export const FactoryLossProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    category: null,
    location: null,
    dateRange: [null, null],
  });

  const [rawData, setRawData] = useState(FactoryLossReportData);

  return (
    <FactoryLossContext.Provider
      value={{
        filters,
        setFilters,
        rawData,
        setRawData,
      }}
    >
      {children}
    </FactoryLossContext.Provider>
  );
};

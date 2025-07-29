import React, { createContext, useContext, useState } from "react";
import { OrderDelayData } from "../data/data";
const OrderCompletionContext = createContext();

export const useOrderCompletion = () => useContext(OrderCompletionContext);

export const OrderCompletionProvider = ({ children }) => {
  const [rawData, setRawData] = useState(OrderDelayData);

  return (
    <OrderCompletionContext.Provider
      value={{
        rawData,
        setRawData,
      }}
    >
      {children}
    </OrderCompletionContext.Provider>
  );
};

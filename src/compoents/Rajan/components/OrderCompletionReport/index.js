import React from "react";
import OrderCompletionReport from "./Main";
import { OrderCompletionProvider } from "../../context/OrderCompletionReport";
import ThemeWrapper from "../shared/ThemeWrapper";

const index = () => {
  return (
    <>
      <ThemeWrapper>
        <OrderCompletionProvider>
          <OrderCompletionReport />
        </OrderCompletionProvider>
      </ThemeWrapper>
    </>
  );
};

export default index;

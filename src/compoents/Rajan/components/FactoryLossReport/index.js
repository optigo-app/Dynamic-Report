import React from "react";
import { FactoryLossProvider } from "../../context/FactoryLossReport";
import FactoryLossReport from "./Main";
import ThemeWrapper from "../shared/ThemeWrapper";

const index = () => {
  return (
    <>
      <ThemeWrapper>
        <FactoryLossProvider>
          <FactoryLossReport />
        </FactoryLossProvider>
      </ThemeWrapper>
    </>
  );
};

export default index;

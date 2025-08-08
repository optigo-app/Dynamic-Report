import React, { useState } from "react";
import { Box, Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { endOfMonth, startOfMonth } from "date-fns";
import TopCustomers from "./TopCustomers";
import TopSellingDesigns from "./TopSellingDesigns";
import CategoryChart from "./CategoryChart";
import Manufacturer from "./Manufacturer";
import Header from "./Header";
import { useQuoteReport } from "../../context/QuoteReportProvider";
import { useMemo } from "react";
import QuoteAnalyticsReport from "../../analytics/QuoteAnalyticsReport";

const Root = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  padding: theme.spacing(3),
  backgroundColor: "#fff",
}));

const ChartCard = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.04)",
  transition: "all 0.2s ease-in-out",
  height: "100%",
  "&:hover": {
    boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.06)",
    transform: "translateY(-2px)",
  },
}));

export default function QuoteAnalysisReport() {
  const { rawData } = useQuoteReport();
  const defaultStart = startOfMonth(new Date());
  const defaultEnd = endOfMonth(new Date());
  const defaultSelectedDate = { startDate: defaultStart, endDate: defaultEnd };
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [customerView, setCustomerView] = useState("count");
  const [designView, setDesignView] = useState("high");
  const QuoteAnalytics = useMemo(() => {
    return new QuoteAnalyticsReport(rawData, dateRange);
  }, [rawData, dateRange]);
  const TopCustomersData = useMemo(() => {
    return QuoteAnalytics?.GetTopCustomersByOrders(customerView);
  }, [rawData, customerView]);
  const TopSellingDesignsData = useMemo(() => {
    return QuoteAnalytics?.GetTopSellingDesigns(designView);
  }, [rawData, designView]);

  const CategoryWiseSaleData = QuoteAnalytics?.GetCategoryWiseSale();
  const TopManufacturerData = QuoteAnalytics?.GetTopManufacturer();

  return (
    <Root>
      <Header dateRange={dateRange} setDateRange={setDateRange} />
      <Grid container spacing={3}>
        <Grid item size={{ xs: 12, md: 6 }}>
          <ChartCard>
            <TopCustomers customerView={customerView} setCustomerView={setCustomerView} TopCustomersData={TopCustomersData} />
          </ChartCard>
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <ChartCard>
            <TopSellingDesigns designView={designView} setDesignView={setDesignView} TopSellingDesignsData={TopSellingDesignsData} />
          </ChartCard>
        </Grid>
        <Grid item size={{ xs: 12, md: 5 }}>
          <ChartCard>
            <CategoryChart CategoryWiseSaleData={CategoryWiseSaleData} />
          </ChartCard>
        </Grid>
        <Grid item size={{ xs: 12, md: 7 }}>
          <ChartCard>
            <Manufacturer TopManufacturerData={TopManufacturerData} />
          </ChartCard>
        </Grid>
      </Grid>
    </Root>
  );
}

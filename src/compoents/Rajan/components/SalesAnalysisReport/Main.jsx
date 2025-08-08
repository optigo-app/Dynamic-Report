import React, { useMemo, useState } from "react";
import { Box, Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import MonthWiseSalesArearChart from "./MonthWiseSales";
import LocationWiesSales from "./LocationWiesSales";
import Top10Customers from "./Top10Customers";
import Top10Category from "./Top10Category";
import SalesByVendor from "./SalesByVendor";
import SalesRepwise from "./SalesRepwise";
import Header from "./Header";
import { useSalesReport } from "../../context/SalesAnalysisReport";
import SalesAnalyticsReport from "../../analytics/SalesAnalysisReport";

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

export default function SalesAnalysisReport() {
  const { rawData } = useSalesReport();
  const [currentMonth, setCurrentMonth] = useState(null); // null means show all months
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedValue, setSelectedValue] = useState("all");

  // Create date filter object
  const dateFilter = useMemo(() => ({
    currentYear,
    currentMonth: currentMonth 
    // null for all months, 0-11 for specific month
  }), [currentYear, currentMonth]);

  const SalesAnalytics = useMemo(() => {
    return new SalesAnalyticsReport(rawData, dateFilter);
  }, [rawData, dateFilter]);

  const YearlySalesData = useMemo(() => {
    return SalesAnalytics.GetGroupByYear(selectedValue);
  }, [SalesAnalytics, selectedValue]);

  const LocationWieseSalesData = useMemo(() => {
    return SalesAnalytics.GetLocationWieseSale();
  }, [SalesAnalytics]);

  const Top10CustomersData = useMemo(() => {
    return SalesAnalytics.GetTop10CustomersByYear();
  }, [SalesAnalytics]);

  const Top10CategoryData = useMemo(() => {
    return SalesAnalytics.GetTop10Category();
  }, [SalesAnalytics]);

  const TopVendorData = useMemo(() => {
    return SalesAnalytics.GetTopVendorBySales();
  }, [SalesAnalytics]);

  const SalesRepWiseData = useMemo(() => {
    return SalesAnalytics.GetSalesRepWise();
  }, [SalesAnalytics]);

  return (
    <Root>
      <Header 
        CurrentMonth={currentMonth} 
        CurrentYear={currentYear} 
        setCurrentMonth={setCurrentMonth} 
        setCurrentYear={setCurrentYear} 
      />
      <Grid container spacing={3}>
        <Grid item size={{ xs: 12 }}>
          <ChartCard>
            <MonthWiseSalesArearChart 
              selectedValue={selectedValue} 
              setSelectedValue={setSelectedValue} 
              YearlySalesData={YearlySalesData} 
            />
          </ChartCard>
        </Grid>
        <Grid item size={{ xs: 12, md: 5 }}>
          <ChartCard>
            <LocationWiesSales LocationWieseSalesData={LocationWieseSalesData} />
          </ChartCard>
        </Grid>
        <Grid item size={{ xs: 12, md: 7 }}>
          <ChartCard>
            <Top10Customers Top10CustomersData={Top10CustomersData} />
          </ChartCard>
        </Grid>
        <Grid item size={{ xs: 12, md: 4 }}>
          <ChartCard>
            <Top10Category Top10CategoryData={Top10CategoryData} />
          </ChartCard>
        </Grid>
        <Grid item size={{ xs: 12, md: 4 }}>
          <ChartCard>
            <SalesByVendor TopVendorData={TopVendorData} />
          </ChartCard>
        </Grid>
        <Grid item size={{ xs: 12, md: 4 }}>
          <ChartCard>
            <SalesRepwise SalesRepWiseData={SalesRepWiseData} />
          </ChartCard>
        </Grid>
      </Grid>
    </Root>
  );
}
// import React, { useMemo, useState } from "react";
// import { Box, Grid, Paper } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import { endOfMonth, startOfMonth } from "date-fns";
// import MonthWiseSalesArearChart from "./MonthWiseSales";
// import LocationWiesSales from "./LocationWiesSales";
// import Top10Customers from "./Top10Customers";
// import Top10Category from "./Top10Category";
// import SalesByVendor from "./SalesByVendor";
// import SalesRepwise from "./SalesRepwise";
// import Header from "./Header";
// import { useSalesReport } from "../../context/SalesAnalysisReport";
// import SalesAnalyticsReport from "../../analytics/SalesAnalysisReport";

// const Root = styled(Box)(({ theme }) => ({
//   minHeight: "100vh",
//   padding: theme.spacing(3),
//   backgroundColor: "#fff",
// }));

// const ChartCard = styled(Paper)(({ theme }) => ({
//   borderRadius: theme.spacing(3),
//   padding: theme.spacing(3),
//   backgroundColor: theme.palette.background.paper,
//   border: `1px solid ${theme.palette.divider}`,
//   boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.04)",
//   transition: "all 0.2s ease-in-out",
//   height: "100%",
//   "&:hover": {
//     boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.06)",
//     transform: "translateY(-2px)",
//   },
// }));

// export default function SalesAnalysisReport() {
//   const { rawData } = useSalesReport();
//   const defaultStart = startOfMonth(new Date());
//   const defaultEnd = endOfMonth(new Date());
//   const defaultSelectedDate = { startDate: defaultStart, endDate: defaultEnd };
//   const [dateRange, setDateRange] = useState(defaultSelectedDate);
//   const [currentMonth, setCurrentMonth] = useState();
//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
//   const [selectedValue, setSelectedValue] = useState("all");
//   const SalesAnalytics = useMemo(() => {
//     return new SalesAnalyticsReport(rawData, dateRange,{ currentMonth, currentYear});
//   }, [rawData, dateRange, currentMonth, currentYear]);

//   const YearlySalesData = useMemo(() => {
//     return SalesAnalytics.GetGroupByYear(selectedValue);
//   }, [SalesAnalytics, selectedValue]);

//   const LocationWieseSalesData = useMemo(() => {
//     return SalesAnalytics.GetLocationWieseSale();
//   }, [SalesAnalytics]);

//   const Top10CustomersData = useMemo(() => {
//     return SalesAnalytics.GetTop10CustomersByYear();
//   }, [SalesAnalytics]);

//   const Top10CategoryData = useMemo(() => {
//     return SalesAnalytics.GetTop10Category();
//   }, [SalesAnalytics]);

//   const TopVendorData = useMemo(() => {
//     return SalesAnalytics.GetTopVendorBySales();
//   }, [SalesAnalytics]);

//   const SalesRepWiseData = useMemo(() => {
//     return SalesAnalytics.GetSalesRepWise();
//   }, [SalesAnalytics]);

//   return (
//     <Root>
//       <Header CurrentMonth={currentMonth} CurrentYear={currentYear} setCurrentMonth={setCurrentMonth} setCurrentYear={setCurrentYear} />
//       <Grid container spacing={3}>
//         <Grid item size={{ xs: 12 }}>
//           <ChartCard>
//             <MonthWiseSalesArearChart selectedValue={selectedValue} setSelectedValue={setSelectedValue} YearlySalesData={YearlySalesData} />
//           </ChartCard>
//         </Grid>
//         <Grid item size={{ xs: 12, md: 5 }}>
//           <ChartCard>
//             <LocationWiesSales LocationWieseSalesData={LocationWieseSalesData} />
//           </ChartCard>
//         </Grid>
//         <Grid item size={{ xs: 12, md: 7 }}>
//           <ChartCard>
//             <Top10Customers Top10CustomersData={Top10CustomersData} />
//           </ChartCard>
//         </Grid>
//         <Grid item size={{ xs: 12, md: 4 }}>
//           <ChartCard>
//             <Top10Category Top10CategoryData={Top10CategoryData} />
//           </ChartCard>
//         </Grid>
//         <Grid item size={{ xs: 12, md: 4 }}>
//           <ChartCard>
//             <SalesByVendor TopVendorData={TopVendorData} />
//           </ChartCard>
//         </Grid>
//         <Grid item size={{ xs: 12, md: 4 }}>
//           <ChartCard>
//             <SalesRepwise SalesRepWiseData={SalesRepWiseData} />
//           </ChartCard>
//         </Grid>
//       </Grid>
//     </Root>
//   );
// }

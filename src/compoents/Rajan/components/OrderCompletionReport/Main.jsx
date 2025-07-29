import React, { useMemo, useState } from "react";
import { Box, Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { endOfMonth, startOfMonth } from "date-fns";
import DeliveryCycleChart from "./DeliveryCycleChart";
import CustomerDelayChart from "./CustomerDelayChart";
import DelayByMonthArearChart from "./DelayByMonthArearChart";
import BDHDelayChart from "./BDHDelayChart";
import CompanyTypeChart from "./CompanyTypeChart";
import KpiList from "./KpiList";
import Header from "./Header";
import { useOrderCompletion } from "../../context/OrderCompletionReport";
import OrderCompletionReport from "../../analytics/OrderCompletionReport";

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

export default function DelayOrdersReport() {
  const [activeTab, setActiveTab] = useState(1);
  const defaultStart = startOfMonth(new Date());
  const defaultEnd = endOfMonth(new Date());
  const defaultSelectedDate = { startDate: defaultStart, endDate: defaultEnd };
  const { rawData } = useOrderCompletion();
  const [dateRange, setDateRange] = useState(defaultSelectedDate);
  const data = useMemo(() => {
    return new OrderCompletionReport(rawData, activeTab, dateRange);
  }, [rawData, activeTab, dateRange]);
  const delaybyday = data.getDelayDayGrouping();
  const customerWiseDelayPcs = data.getCustomerWiseDelayPcs();
  const averageDeliveryDayByCompanyType = data.getAverageDeliveryDayByCompanyType();
  const saleRepWieseDelay = data.getSalesRepWiseDelay();
  const companyTypeSummary = data.getCompanyTypeSummary();
  const analyticsData = data.getAnalyticsData();

  return (
    <Root>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} dateRange={dateRange} setDateRange={setDateRange} />
      <Grid container spacing={3} mb={4}>
        <KpiList analyticsData={analyticsData} />
      </Grid>
      <Grid container spacing={3}>
        {/* Company Type Table */}
        <Grid item size={{ xs: 12,  md: 4.2 }}>
          <ChartCard>
            <CompanyTypeChart companyTypeSummary={companyTypeSummary} />
          </ChartCard>
        </Grid>

        {/* BDH Wise Delay % */}
        <Grid item size={{ xs: 12, md: 4.3 }}>
          <ChartCard>
            <BDHDelayChart saleRepWieseDelay={saleRepWieseDelay} />
          </ChartCard>
        </Grid>

        {/* Delivery Date Cycle */}
        <Grid item size={{ xs: 12, md: 3.5 }}>
          <ChartCard>
            <DeliveryCycleChart averageDeliveryDayByCompanyType={averageDeliveryDayByCompanyType} />
          </ChartCard>
        </Grid>

        {/* Delay by Months Chart */}
        <Grid item size={{ xs: 12, md: 8 }}>
          <ChartCard>
            <DelayByMonthArearChart delaybyday={delaybyday} />
          </ChartCard>
        </Grid>

        {/* Customer Wise Delay Pcs */}
        <Grid item size={{ xs: 12, md: 4 }}>
          <ChartCard>
            <CustomerDelayChart customerWiseDelayPcs={customerWiseDelayPcs} />
          </ChartCard>
        </Grid>
      </Grid>
    </Root>
  );
}

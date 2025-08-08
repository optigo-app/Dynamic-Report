import { isWithinInterval } from "date-fns";
import normalizeDate from "../libs/normalizeDate";

class QuoteAnalyticsReport {
  constructor(data, dateRange) {
    const start = normalizeDate(dateRange?.startDate);
    const end = normalizeDate(dateRange?.endDate);
    const isValidRange = start && end;
    this.data = Array.isArray(data)
      ? isValidRange
        ? data.filter((item) => {
            const parsed = normalizeDate(item["Order Date"]);
            return parsed && isWithinInterval(parsed, { start, end });
          })
        : data 
      : [];

    this.dateRange = isValidRange ? { start, end } : null;
  }
  setData(data) {
    this.data = Array.isArray(data) ? data : [];
    return this;
  }
  GetTopCustomersByOrders(showView = "count") {
    const groups = {};

    this.data.forEach((item) => {
      const customer = item["CUSTOMER NAME"];
      if (!customer) return;

      if (!groups[customer]) {
        groups[customer] = {
          name: customer,
          orderCount: 0,
          salesCount: 0,
          orderAmount: 0,
          saleAmount: 0,
          items: [],
        };
      }

      const group = groups[customer];
      group.orderCount += Number(item["Order Count"] || 0);
      group.salesCount += Number(item["Sales Count"] || 0);
      group.orderAmount += Number(item["order amount"] || 0);
      group.saleAmount += Number(item["saleAmount"] || 0);
      if (group.items.length < 10) {
        group.items.push(item);
      }
    });

    const groupList = Object.values(groups).map((g) => ({
      name: g.name,
      orderCount: Math.round(g.orderCount),
      salesCount: Math.round(g.salesCount),
      orderAmount: Math.round(g.orderAmount),
      saleAmount: Math.round(g.saleAmount),
      items: g.items,
    }));

    const sorted = groupList.sort((a, b) => {
      if (showView === "amount") {
        return b.saleAmount - a.saleAmount;
      } else {
        return b.salesCount - a.salesCount;
      }
    });

    const top9 = sorted.slice(0, 9);
    const othersRaw = sorted.slice(9);

    if (othersRaw.length > 0) {
      const others = {
        name: "Others",
        orderCount: 0,
        salesCount: 0,
        orderAmount: 0,
        saleAmount: 0,
        items: [],
      };

      for (const entry of othersRaw) {
        others.orderCount += entry.orderCount;
        others.salesCount += entry.salesCount;
        others.orderAmount += entry.orderAmount;
        others.saleAmount += entry.saleAmount;
        others.items.push(...entry.items.slice(0, 10 - others.items.length));
        if (others.items.length >= 10) break;
      }

      top9.push(others);
    }
    return top9.map((group) => {
      if (showView === "amount") {
        return {
          name: group.name,
          orderAmount: group.orderAmount,
          saleAmount: group.saleAmount,
          items: group.items,
        };
      } else {
        return {
          name: group.name,
          orderCount: group.orderCount,
          salesCount: group.salesCount,
          items: group.items,
        };
      }
    });
  }
  GetTopSellingDesigns(sort = "high") {
    const groups = {};

    this.data.forEach((item) => {
      const design = item["Design#"];
      if (!design) return;

      if (!groups[design]) {
        groups[design] = {
          name: design,
          orderCount: 0,
          salesCount: 0,
          orderAmount: 0,
          saleAmount: 0,
          items: [],
        };
      }

      const group = groups[design];
      group.orderCount += Number(item["Order Count"] || 0);
      group.salesCount += Number(item["Sales Count"] || 0);
      group.orderAmount += Number(item["order amount"] || 0);
      group.saleAmount += Number(item["saleAmount"] || 0);

      if (group.items.length < 10) {
        group.items.push(item);
      }
    });

    const groupList = Object.values(groups).map((g) => ({
      name: g.name,
      orderCount: Math.round(g.orderCount),
      salesCount: Math.round(g.salesCount),
      orderAmount: Math.round(g.orderAmount),
      saleAmount: Math.round(g.saleAmount),
      items: g.items,
    }));

    const sorted = groupList.sort((a, b) => {
      return sort === "low" ? a.salesCount - b.salesCount : b.salesCount - a.salesCount;
    });

    const top9 = sorted.slice(0, 9);
    const othersRaw = sorted.slice(9);

    if (othersRaw.length > 0) {
      const others = {
        name: "Others",
        orderCount: 0,
        salesCount: 0,
        orderAmount: 0,
        saleAmount: 0,
        items: [],
      };

      for (const entry of othersRaw) {
        others.orderCount += entry.orderCount;
        others.salesCount += entry.salesCount;
        others.orderAmount += entry.orderAmount;
        others.saleAmount += entry.saleAmount;

        others.items.push(...entry.items.slice(0, 10 - others.items.length));
        if (others.items.length >= 10) break;
      }

      top9.push(others);
    }

    return top9.map((group) => ({
      name: group.name,
      orderCount: group.orderCount,
      salesCount: group.salesCount,
      orderAmount: group.orderAmount,
      saleAmount: group.saleAmount,
      items: group.items,
    }));
  }
  GetCategoryWiseSale() {
    const groups = {};
    let totalSales = 0;
    let totalOrders = 0;

    this.data.forEach((item) => {
      const category = item["Category"];
      if (!category) return;

      if (!groups[category]) {
        groups[category] = {
          name: category,
          orderCount: 0,
          salesCount: 0,
          orderAmount: 0,
          saleAmount: 0,
          items: [],
        };
      }

      const group = groups[category];
      const orderCount = Number(item["Order Count"] || 0);
      const salesCount = Number(item["Sales Count"] || 0);
      const orderAmount = Number(item["order amount"] || 0);
      const saleAmount = Number(item["saleAmount"] || 0);

      group.orderCount += orderCount;
      group.salesCount += salesCount;
      group.orderAmount += orderAmount;
      group.saleAmount += saleAmount;
      if (group.items.length < 10) group.items.push(item);

      totalOrders += orderCount;
      totalSales += salesCount;
    });

    let groupList = Object.values(groups);

    // Sort by salesCount descending
    groupList.sort((a, b) => b.salesCount - a.salesCount);

    const topN = 8;
    const topGroups = groupList.slice(0, topN);
    const restGroups = groupList.slice(topN);

    const sumRest = restGroups.reduce(
      (acc, g) => {
        acc.orderCount += g.orderCount;
        acc.salesCount += g.salesCount;
        acc.orderAmount += g.orderAmount;
        acc.saleAmount += g.saleAmount;
        acc.items.push(...g.items);
        return acc;
      },
      {
        name: "Others",
        orderCount: 0,
        salesCount: 0,
        orderAmount: 0,
        saleAmount: 0,
        items: [],
      }
    );

    const finalGroups = [...topGroups];
    if (restGroups.length > 0) finalGroups.push(sumRest);

    // Calculate percentages — ensure they sum to 100%
    let orderPercentTotal = 0;
    let salesPercentTotal = 0;

    const withPercents = finalGroups.map((g, i, arr) => {
      const isLast = i === arr.length - 1;
      const orderPercent = totalOrders ? (g.orderCount / totalOrders) * 100 : 0;
      const salesPercent = totalSales ? (g.salesCount / totalSales) * 100 : 0;

      const roundedOrder = isLast ? 100 - orderPercentTotal : Math.round(orderPercent);
      const roundedSales = isLast ? 100 - salesPercentTotal : Math.round(salesPercent);

      orderPercentTotal += roundedOrder;
      salesPercentTotal += roundedSales;

      return {
        name: g.name,
        orderCount: Math.round(g.orderCount),
        salesCount: Math.round(g.salesCount),
        orderAmount: Math.round(g.orderAmount),
        saleAmount: Math.round(g.saleAmount),
        orderPercent: roundedOrder,
        salesPercent: roundedSales,
        items: g.items.slice(0, 10),
      };
    });

    return withPercents;
  }
  GetTopManufacturer() {
    const groups = {};
    let totalSales = 0;
    let totalOrders = 0;
    let totalSaleAmount = 0;
    let totalOrderAmount = 0;

    this.data.forEach((item) => {
      const manufacturer = item["Manufacturer"];
      if (!manufacturer) return;

      if (!groups[manufacturer]) {
        groups[manufacturer] = {
          name: manufacturer,
          salesCount: 0,
          orderCount: 0,
          saleAmount: 0,
          orderAmount: 0,
          items: [],
        };
      }

      const group = groups[manufacturer];
      const salesCount = Number(item["Sales Count"] || 0);
      const orderCount = Number(item["Order Count"] || 0);
      const saleAmount = Number(item["saleAmount"] || 0);
      const orderAmount = Number(item["order amount"] || 0);

      group.salesCount += salesCount;
      group.orderCount += orderCount;
      group.saleAmount += saleAmount;
      group.orderAmount += orderAmount;

      if (group.items.length < 10) {
        group.items.push(item);
      }

      totalSales += salesCount;
      totalOrders += orderCount;
      totalSaleAmount += saleAmount;
      totalOrderAmount += orderAmount;
    });

    const allGroups = Object.values(groups).map((g) => ({
      name: g.name,
      salesCount: g.salesCount,
      orderCount: g.orderCount,
      saleAmount: g.saleAmount,
      orderAmount: g.orderAmount,
      items: g.items,
    }));

    const sorted = allGroups.sort((a, b) => b.salesCount - a.salesCount);

    const top9 = sorted.slice(0, 9);
    const others = sorted.slice(9);

    if (others.length) {
      const otherGroup = {
        name: "Others",
        salesCount: 0,
        orderCount: 0,
        saleAmount: 0,
        orderAmount: 0,
        items: [],
      };

      others.forEach((g) => {
        otherGroup.salesCount += g.salesCount;
        otherGroup.orderCount += g.orderCount;
        otherGroup.saleAmount += g.saleAmount;
        otherGroup.orderAmount += g.orderAmount;
        otherGroup.items.push(...g.items);
      });

      top9.push(otherGroup);
    }

    // Add percentage after slicing/aggregating
    return top9.map((g) => ({
      ...g,
      salesPercent: totalSales ? Math.round((g.salesCount / totalSales) * 100) : 0,
      orderPercent: totalOrders ? Math.round((g.orderCount / totalOrders) * 100) : 0,
    }));
  }
}

export default QuoteAnalyticsReport;

import { isValid, startOfDay, endOfDay, startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth } from "date-fns";

class FactoryLossAnalytics {
  constructor(data) {
    this.data = Array.isArray(data) ? data : [];
  }
  setData(data) {
    this.data = Array.isArray(data) ? data : [];
    return this;
  }
  extractPurePrcLoss(value) {
    if (!value || typeof value !== "string") return 0;
    return parseFloat(value.split("|")[1].trim()) || 0;
  }
  getPurePrcLossRange(value) {
    const pureValue = this.extractPurePrcLoss(value);
    if (pureValue < 10) return "0 - 10%";
    if (pureValue < 15) return "10 - 15%";
    if (pureValue < 20) return "15 - 20%";
    if (pureValue < 25) return "20 - 25%";
    if (pureValue < 30) return "25 - 30%";
    if (pureValue < 40) return "30 - 40%";
    if (pureValue < 50) return "40 - 50%";
    return "Above 50%";
  }
  formatDate(dateString) {
    if (!dateString) return "Invalid Date";
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "Invalid Date" : date.toISOString().split("T")[0];
    } catch {
      return "Invalid Date";
    }
  }
  getCategoryGrouping() {
    const groups = {};

    this.data.forEach((item) => {
      const category = item.category || "Unknown";
      const grossLoss = parseFloat(item["Gross Loss"]) || 0;
      const netLoss = parseFloat(item["NetWt (F+M)"]) || 0;

      if (!groups[category]) {
        groups[category] = {
          category,
          items: [],
          totalGrossLoss: 0,
          totalNetLoss: 0,
          factoryLoss: 0,
        };
      }

      groups[category].items.push(item);
      groups[category].totalGrossLoss += grossLoss;
      groups[category].totalNetLoss += netLoss;
    });

    Object.values(groups).forEach((group) => {
      group.factoryLoss = group.totalNetLoss > 0 ? (group.totalGrossLoss / group.totalNetLoss) * 100 : 0;
    });

    return Object.values(groups);
  }
  getLocationGrouping() {
    const groups = {};

    this.data.forEach((item) => {
      const location = item.Locationname || "Unknown";
      const grossLoss = parseFloat(item["Gross Loss"]) || 0;
      const netLoss = parseFloat(item["NetWt (F+M)"]) || 0;

      if (!groups[location]) {
        groups[location] = {
          location,
          items: [],
          totalGrossLoss: 0,
          totalNetLoss: 0,
          factoryLoss: 0,
        };
      }

      groups[location].items.push(item);
      groups[location].totalGrossLoss += grossLoss;
      groups[location].totalNetLoss += netLoss;
    });

    Object.values(groups).forEach((group) => {
      group.factoryLoss = group.totalNetLoss > 0 ? (group.totalGrossLoss / group.totalNetLoss) * 100 : 0;
    });

    return Object.values(groups);
  }
  getRangeGrouping() {
    const ranges = ["0 - 10%", "10 - 15%", "15 - 20%", "20 - 25%", "25 - 30%", "30 - 40%", "40 - 50%", "Above 50%"];

    const groups = Object.fromEntries(ranges.map((range) => [range, { range, items: [], totalGrossLoss: 0, totalNetLoss: 0, factoryLoss: 0 }]));

    this.data.forEach((item) => {
      const range = this.getPurePrcLossRange(item["PurePrcLoss||GrossPrcLoss"]);
      const grossLoss = parseFloat(item["Gross Loss"]) || 0;
      const netLoss = parseFloat(item["NetWt (F+M)"]) || 0;

      groups[range].items.push(item);
      groups[range].totalGrossLoss += grossLoss;
      groups[range].totalNetLoss += netLoss;
    });

    Object.values(groups).forEach((group) => {
      group.factoryLoss = group.totalNetLoss > 0 ? (group.totalGrossLoss / group.totalNetLoss) * 100 : 0;
    });

    return Object.values(groups).filter((g) => g.items.length > 0);
  }
  // getDayGrouping() {
  //   const now = new Date();
  //   const currentMonth = now.getMonth();
  //   const currentYear = now.getFullYear();
  //   const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  //   const allDates = Array.from({ length: daysInMonth }, (_, i) => {
  //     const date = new Date(currentYear, currentMonth, i + 1);
  //     return date.toISOString().split("T")[0];
  //   });

  //   const groups = {};

  //   this.data.forEach((item) => {
  //     const rawDate = new Date(item.orderdate);
  //     if (isNaN(rawDate)) return;

  //     if (rawDate.getFullYear() !== currentYear || rawDate.getMonth() !== currentMonth) return;

  //     const dateKey = rawDate.toISOString().split("T")[0];
  //     const grossLoss = parseFloat(item["Gross Loss"]) || 0;
  //     const netLoss = parseFloat(item["NetWt (F+M)"]) || 0;

  //     if (!groups[dateKey]) {
  //       groups[dateKey] = {
  //         date: dateKey,
  //         items: [],
  //         totalGrossLoss: 0,
  //         totalNetLoss: 0,
  //         factoryLoss: 0,
  //       };
  //     }

  //     groups[dateKey].items.push(item);
  //     groups[dateKey].totalGrossLoss += grossLoss;
  //     groups[dateKey].totalNetLoss += netLoss;
  //   });

  //   return allDates.map((date) => {
  //     const group = groups[date] || {
  //       date,
  //       items: [],
  //       totalGrossLoss: 0,
  //       totalNetLoss: 0,
  //       factoryLoss: 0,
  //     };

  //     group.factoryLoss = group.totalNetLoss > 0 ? (group.totalGrossLoss / group.totalNetLoss) * 100 : 0;

  //     return group;
  //   });
  // }
 getDayGrouping(dateRange = {}) {
  const start = isValid(dateRange.startDate) ? startOfDay(dateRange.startDate) : startOfDay(new Date());
  const end = isValid(dateRange.endDate) ? endOfDay(dateRange.endDate) : start;

  const monthStart = startOfMonth(start);
  const monthEnd = endOfMonth(end);

  const allDates = eachDayOfInterval({ start: monthStart, end: monthEnd }).map((d) =>
    format(d, "yyyy-MM-dd")
  );

  const groups = {};

  this.data.forEach((item) => {
    const rawDate = new Date(item.orderdate);
    if (!isValid(rawDate) || !isSameMonth(rawDate, start)) return;

    const dateKey = format(rawDate, "yyyy-MM-dd");
    const grossLoss = parseFloat(item["Gross Loss"]) || 0;
    const netLoss = parseFloat(item["NetWt (F+M)"]) || 0;

    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: dateKey,
        items: [],
        totalGrossLoss: 0,
        totalNetLoss: 0,
        factoryLoss: 0,
      };
    }

    groups[dateKey].items.push(item);
    groups[dateKey].totalGrossLoss += grossLoss;
    groups[dateKey].totalNetLoss += netLoss;
  });

  return allDates.map((date) => {
    const group = groups[date] || {
      date,
      items: [],
      totalGrossLoss: 0,
      totalNetLoss: 0,
      factoryLoss: 0,
    };

    group.factoryLoss =
      group.totalNetLoss > 0 ? (group.totalGrossLoss / group.totalNetLoss) * 100 : 0;

    return group;
  });
}

  getUniqueMetalTypes() {
    const uniqueSet = new Set();

    this.data.forEach((item) => {
      if (item.MetalType && typeof item.MetalType === "string") {
        const baseType = item.MetalType.trim().split(" ")[0].toUpperCase();
        if (baseType) uniqueSet.add(baseType);
      }
    });

    return Array.from(uniqueSet).sort();
  }
  getOverallFactoryLoss() {
    let totalGrossLoss = 0;
    let totalNetLoss = 0;

    this.data.forEach((item) => {
      totalGrossLoss += parseFloat(item["Gross Loss"]) || 0;
      totalNetLoss += parseFloat(item["NetWt (F+M)"]) || 0;
    });

    const factoryLoss = totalNetLoss > 0 ? (totalGrossLoss / totalNetLoss) * 100 : 0;

    return {
      totalGrossLoss,
      totalNetLoss,
      factoryLoss,
    };
  }
}

export default FactoryLossAnalytics;

import { getYear, getMonth, isSameYear, isSameMonth, format } from "date-fns";
import normalizeDate from "../libs/normalizeDate";

class SalesAnalyticsReport {
  constructor(data, dateFilter) {
    this.data = Array.isArray(data) ? data : [];
    this.dateFilter = dateFilter; // { currentYear, currentMonth? }
    console.log(this.dateFilter);
  }

  setData(data) {
    this.data = Array.isArray(data) ? data : [];
    return this;
  }

  // Helper method to check if an entry matches the date filter
  matchesDateFilter(parsedDate) {
    if (!parsedDate) return false;
    
    const { currentYear, currentMonth } = this.dateFilter || {};
    
    if (!currentYear) return true; // No filter applied
    
    const entryYear = getYear(parsedDate);
    const entryMonth = getMonth(parsedDate); // 0-based (0 = Jan, 11 = Dec)
    
    // If year doesn't match, exclude
    if (entryYear !== currentYear) return false;
    
    // If month is specified, check if it matches
    if (currentMonth !== undefined && currentMonth !== null) {
      return entryMonth === currentMonth;
    }
    
    // If only year is specified, include all months of that year
    return true;
  }

  GetGroupByYear(voucherFilter = "all") {
    const { currentYear, currentMonth } = this.dateFilter || {};
    
    if (!currentYear) return [];

    const result = {};

    this.data.forEach((entry) => {
      const parsedDate = normalizeDate(entry["Invoice Date"]);
      if (!parsedDate || getYear(parsedDate) !== currentYear) return;

      // Apply voucher filter
      if (voucherFilter !== "all" && String(entry["voucher type"]).toLowerCase() !== voucherFilter.toLowerCase()) {
        return;
      }

      const monthKey = format(parsedDate, "MMM");
      const entryMonth = getMonth(parsedDate); // 0-based month
      
      // If specific month is selected, only include data for that month
      const shouldIncludeData = currentMonth === null || currentMonth === undefined || entryMonth === currentMonth;

      if (!result[monthKey]) {
        result[monthKey] = {
          month: monthKey,
          entries: [],
          totalAmount: 0,
        };
      }

      if (shouldIncludeData) {
        result[monthKey].entries.push(entry);
        result[monthKey].totalAmount += Math.round(Number(entry.TotalAmount || 0));
      }
    });

    const orderedMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Always return all months to maintain chart structure
    return orderedMonths.map(
      (month) =>
        result[month] || {
          month,
          entries: [],
          totalAmount: 0,
        }
    );
  }

  GetLocationWieseSale() {
    const { currentYear, currentMonth } = this.dateFilter || {};
    const monthMap = new Map();
    
    this.data.forEach((entry) => {
      const parsedDate = normalizeDate(entry["Invoice Date"]);
      if (!parsedDate || (currentYear && getYear(parsedDate) !== currentYear)) return;
      
      const monthKey = format(parsedDate, "MMM");
      const entryMonth = getMonth(parsedDate); // 0-based month
      const branch = (entry.Location || "Unknown").trim();

      // If specific month is selected, only count data for that month
      const shouldIncludeData = currentMonth === null || currentMonth === undefined || entryMonth === currentMonth;

      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, new Map());
      }

      const branchMap = monthMap.get(monthKey);
      if (shouldIncludeData) {
        branchMap.set(branch, (branchMap.get(branch) || 0) + 1);
      }
    });

    const orderedMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Get all unique branches from the data (considering year filter only)
    const allBranches = [...new Set(
      this.data
        .filter(entry => {
          const parsedDate = normalizeDate(entry["Invoice Date"]);
          return parsedDate && (!currentYear || getYear(parsedDate) === currentYear);
        })
        .map(e => (e.Location || "Unknown").trim())
    )];

    // Always return all months to maintain chart structure
    return orderedMonths.map((month) => {
      const branchMap = monthMap.get(month) || new Map();
      const result = { name: month };

      allBranches.forEach((branch) => {
        result[branch] = branchMap.get(branch) || 0;
      });

      return result;
    });
  }

  GetTop10CustomersByYear() {
    const { currentYear, currentMonth } = this.dateFilter || {};
    const salesByYear = {};

    this.data.forEach((entry) => {
      const parsedDate = normalizeDate(entry["Invoice Date"]);
      if (!parsedDate) return;
      
      const year = parsedDate.getFullYear();
      const entryMonth = getMonth(parsedDate); // 0-based month
      
      // Apply year filter
      if (currentYear && year !== currentYear) return;
      
      // If specific month is selected, only include data for that month
      const shouldIncludeData = currentMonth === null || currentMonth === undefined || entryMonth === currentMonth;
      
      if (!shouldIncludeData) return;
      
      const customer = entry.CustomerName?.trim() || "Unknown";
      const amount = Number(entry.TotalAmount || 0);

      if (!salesByYear[year]) salesByYear[year] = {};
      if (!salesByYear[year][customer]) salesByYear[year][customer] = 0;

      salesByYear[year][customer] += amount;
    });

    const result = Object.entries(salesByYear).map(([year, customerSales]) => {
      const sorted = Object.entries(customerSales)
        .sort(([, a], [, b]) => b - a);

      const top10 = sorted.slice(0, 10);
      const others = sorted.slice(10);

      const othersTotal = others.reduce((sum, [, val]) => sum + val, 0);

      const formatted = top10.map(([name, value]) => ({
        name,
        sales: Math.round(value),
      }));

      if (others.length > 0) {
        formatted.push({
          name: "Others",
          sales: Math.round(othersTotal),
        });
      }

      return {
        year,
        data: formatted,
      };
    });

    return result;
  }

  GetTop10Category() {
    const { currentYear, currentMonth } = this.dateFilter || {};
    const Category = {};
    
    this.data.forEach((entry) => {
      const parsedDate = normalizeDate(entry["Invoice Date"]);
      if (!parsedDate) return;
      
      const year = parsedDate.getFullYear();
      const entryMonth = getMonth(parsedDate); // 0-based month
      
      // Apply year filter
      if (currentYear && year !== currentYear) return;
      
      // If specific month is selected, only include data for that month
      const shouldIncludeData = currentMonth === null || currentMonth === undefined || entryMonth === currentMonth;
      
      if (!shouldIncludeData) return;
      
      const category = entry.Category?.trim() || "Unknown";
      const amount = Number(entry.TotalAmount || 0);

      if (!Category[year]) Category[year] = {};
      if (!Category[year][category]) Category[year][category] = 0;

      Category[year][category] += amount;
    });

    const result = Object.entries(Category).map(([year, categorySales]) => {
      const sorted = Object.entries(categorySales)
        .sort(([, a], [, b]) => b - a);

      const top10 = sorted.slice(0, 10);
      const others = sorted.slice(10);

      const othersTotal = others.reduce((sum, [, val]) => sum + val, 0);

      const formatted = top10.map(([name, value]) => ({
        name,
        sales: Math.round(value),
      }));

      if (others.length > 0) {
        formatted.push({
          name: "Others",
          sales: Math.round(othersTotal),
        });
      }

      return {
        year,
        data: formatted,
      };
    });
    
    return result;
  }

  GetTopVendorBySales() {
    const { currentYear, currentMonth } = this.dateFilter || {};
    const Category = {};
    
    this.data.forEach((entry) => {
      const parsedDate = normalizeDate(entry["Invoice Date"]);
      if (!parsedDate) return;
      
      const year = parsedDate.getFullYear();
      const entryMonth = getMonth(parsedDate); // 0-based month
      
      // Apply year filter
      if (currentYear && year !== currentYear) return;
      
      // If specific month is selected, only include data for that month
      const shouldIncludeData = currentMonth === null || currentMonth === undefined || entryMonth === currentMonth;
      
      if (!shouldIncludeData) return;
      
      const category = entry["vendor name"]?.trim() || "Unknown";
      const amount = Number(entry.TotalAmount || 0);

      if (!Category[year]) Category[year] = {};
      if (!Category[year][category]) Category[year][category] = 0;

      Category[year][category] += amount;
    });

    const result = Object.entries(Category).map(([year, categorySales]) => {
      const sorted = Object.entries(categorySales)
        .sort(([, a], [, b]) => b - a);

      const top10 = sorted.slice(0, 10);
      const others = sorted.slice(10);

      const othersTotal = others.reduce((sum, [, val]) => sum + val, 0);

      const formatted = top10.map(([name, value]) => ({
        name,
        sales: Math.round(value),
      }));

      if (others.length > 0) {
        formatted.push({
          name: "Others",
          sales: Math.round(othersTotal),
        });
      }

      return {
        year,
        data: formatted,
      };
    });
    
    return result;
  }

  GetSalesRepWise() {
    const { currentYear, currentMonth } = this.dateFilter || {};
    const Category = {};
    
    this.data.forEach((entry) => {
      const parsedDate = normalizeDate(entry["Invoice Date"]);
      if (!parsedDate) return;
      
      const year = parsedDate.getFullYear();
      const entryMonth = getMonth(parsedDate); // 0-based month
      
      // Apply year filter
      if (currentYear && year !== currentYear) return;
      
      // If specific month is selected, only include data for that month
      const shouldIncludeData = currentMonth === null || currentMonth === undefined || entryMonth === currentMonth;
      
      if (!shouldIncludeData) return;
      
      const category = entry?.salesrep?.trim() || "Unknown";
      const amount = Number(entry?.TotalAmount || 0);

      if (!Category[year]) Category[year] = {};
      if (!Category[year][category]) Category[year][category] = 0;

      Category[year][category] += amount;
    });

    const result = Object.entries(Category).map(([year, categorySales]) => {
      const sorted = Object.entries(categorySales)
        .sort(([, a], [, b]) => b - a);

      const top10 = sorted.slice(0, 10);
      const others = sorted.slice(10);

      const othersTotal = others.reduce((sum, [, val]) => sum + val, 0);

      const formatted = top10.map(([name, value]) => ({
        name,
        sales: Math.round(value),
      }));

      if (others.length > 0) {
        formatted.push({
          name: "Others",
          sales: Math.round(othersTotal),
        });
      }

      return {
        year,
        data: formatted,
      };
    });
    
    return result;
  }
}

export default SalesAnalyticsReport;


// import { getYear, getMonth, isSameYear, isSameMonth, format } from "date-fns";
// import normalizeDate from "../libs/normalizeDate";

// class SalesAnalyticsReport {
//   constructor(data, dateFilter) {
//     this.data = Array.isArray(data) ? data : [];
//     this.dateFilter = dateFilter; // { currentYear, currentMonth? }
//     console.log(this.dateFilter);
//   }

//   setData(data) {
//     this.data = Array.isArray(data) ? data : [];
//     return this;
//   }

//   // Helper method to check if an entry matches the date filter
//   matchesDateFilter(parsedDate) {
//     if (!parsedDate) return false;
    
//     const { currentYear, currentMonth } = this.dateFilter || {};
    
//     if (!currentYear) return true; // No filter applied
    
//     const entryYear = getYear(parsedDate);
//     const entryMonth = getMonth(parsedDate); // 0-based (0 = Jan, 11 = Dec)
    
//     // If year doesn't match, exclude
//     if (entryYear !== currentYear) return false;
    
//     // If month is specified, check if it matches
//     if (currentMonth !== undefined && currentMonth !== null) {
//       return entryMonth === currentMonth;
//     }
    
//     // If only year is specified, include all months of that year
//     return true;
//   }

//   GetGroupByYear(voucherFilter = "all") {
//     const { currentYear, currentMonth } = this.dateFilter || {};
    
//     if (!currentYear) return [];

//     const result = {};

//     this.data.forEach((entry) => {
//       const parsedDate = normalizeDate(entry["Invoice Date"]);
      
//       // Apply date filter
//       if (!this.matchesDateFilter(parsedDate)) return;

//       // Apply voucher filter
//       if (voucherFilter !== "all" && String(entry["voucher type"]).toLowerCase() !== voucherFilter.toLowerCase()) {
//         return;
//       }

//       const monthKey = format(parsedDate, "MMM");
//       if (!result[monthKey]) {
//         result[monthKey] = {
//           month: monthKey,
//           entries: [],
//           totalAmount: 0,
//         };
//       }

//       result[monthKey].entries.push(entry);
//       result[monthKey].totalAmount += Math.round(Number(entry.TotalAmount || 0));
//     });

//     const orderedMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
//     // If specific month is selected, return only that month
//     if (currentMonth !== undefined && currentMonth !== null) {
//       const monthName = orderedMonths[currentMonth];
//       return [
//         result[monthName] || {
//           month: monthName,
//           entries: [],
//           totalAmount: 0,
//         }
//       ];
//     }

//     // Return all months for the year
//     return orderedMonths.map(
//       (month) =>
//         result[month] || {
//           month,
//           entries: [],
//           totalAmount: 0,
//         }
//     );
//   }

//   GetLocationWieseSale() {
//     const monthMap = new Map();
    
//     this.data.forEach((entry) => {
//       const parsedDate = normalizeDate(entry["Invoice Date"]);
      
//       // Apply date filter
//       if (!this.matchesDateFilter(parsedDate)) return;
      
//       const monthKey = format(parsedDate, "MMM");
//       const branch = (entry.Location || "Unknown").trim();

//       if (!monthMap.has(monthKey)) {
//         monthMap.set(monthKey, new Map());
//       }

//       const branchMap = monthMap.get(monthKey);
//       branchMap.set(branch, (branchMap.get(branch) || 0) + 1);
//     });

//     const { currentMonth } = this.dateFilter || {};
//     const orderedMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
//     // Get all unique branches from filtered data
//     const allBranches = [...new Set(
//       this.data
//         .filter(entry => this.matchesDateFilter(normalizeDate(entry["Invoice Date"])))
//         .map(e => (e.Location || "Unknown").trim())
//     )];

//     // If specific month is selected, return only that month
//     if (currentMonth !== undefined && currentMonth !== null) {
//       const monthName = orderedMonths[currentMonth];
//       const branchMap = monthMap.get(monthName) || new Map();
//       const result = { name: monthName };

//       allBranches.forEach((branch) => {
//         result[branch] = branchMap.get(branch) || 0;
//       });

//       return [result];
//     }

//     // Return all months
//     return orderedMonths.map((month) => {
//       const branchMap = monthMap.get(month) || new Map();
//       const result = { name: month };

//       allBranches.forEach((branch) => {
//         result[branch] = branchMap.get(branch) || 0;
//       });

//       return result;
//     });
//   }

//   GetTop10CustomersByYear() {
//     const salesByYear = {};

//     this.data.forEach((entry) => {
//       const parsedDate = normalizeDate(entry["Invoice Date"]);
      
//       // Apply date filter
//       if (!this.matchesDateFilter(parsedDate)) return;
      
//       const year = parsedDate.getFullYear();
//       const customer = entry.CustomerName?.trim() || "Unknown";
//       const amount = Number(entry.TotalAmount || 0);

//       if (!salesByYear[year]) salesByYear[year] = {};
//       if (!salesByYear[year][customer]) salesByYear[year][customer] = 0;

//       salesByYear[year][customer] += amount;
//     });

//     const result = Object.entries(salesByYear).map(([year, customerSales]) => {
//       const sorted = Object.entries(customerSales)
//         .sort(([, a], [, b]) => b - a);

//       const top10 = sorted.slice(0, 10);
//       const others = sorted.slice(10);

//       const othersTotal = others.reduce((sum, [, val]) => sum + val, 0);

//       const formatted = top10.map(([name, value]) => ({
//         name,
//         sales: Math.round(value),
//       }));

//       if (others.length > 0) {
//         formatted.push({
//           name: "Others",
//           sales: Math.round(othersTotal),
//         });
//       }

//       return {
//         year,
//         data: formatted,
//       };
//     });

//     return result;
//   }

//   GetTop10Category() {
//     const Category = {};
    
//     this.data.forEach((entry) => {
//       const parsedDate = normalizeDate(entry["Invoice Date"]);
      
//       // Apply date filter
//       if (!this.matchesDateFilter(parsedDate)) return;
      
//       const year = parsedDate.getFullYear();
//       const category = entry.Category?.trim() || "Unknown";
//       const amount = Number(entry.TotalAmount || 0);

//       if (!Category[year]) Category[year] = {};
//       if (!Category[year][category]) Category[year][category] = 0;

//       Category[year][category] += amount;
//     });

//     const result = Object.entries(Category).map(([year, categorySales]) => {
//       const sorted = Object.entries(categorySales)
//         .sort(([, a], [, b]) => b - a);

//       const top10 = sorted.slice(0, 10);
//       const others = sorted.slice(10);

//       const othersTotal = others.reduce((sum, [, val]) => sum + val, 0);

//       const formatted = top10.map(([name, value]) => ({
//         name,
//         sales: Math.round(value),
//       }));

//       if (others.length > 0) {
//         formatted.push({
//           name: "Others",
//           sales: Math.round(othersTotal),
//         });
//       }

//       return {
//         year,
//         data: formatted,
//       };
//     });
    
//     return result;
//   }

//   GetTopVendorBySales() {
//     const Category = {};
    
//     this.data.forEach((entry) => {
//       const parsedDate = normalizeDate(entry["Invoice Date"]);
      
//       // Apply date filter
//       if (!this.matchesDateFilter(parsedDate)) return;
      
//       const year = parsedDate.getFullYear();
//       const category = entry["vendor name"]?.trim() || "Unknown";
//       const amount = Number(entry.TotalAmount || 0);

//       if (!Category[year]) Category[year] = {};
//       if (!Category[year][category]) Category[year][category] = 0;

//       Category[year][category] += amount;
//     });

//     const result = Object.entries(Category).map(([year, categorySales]) => {
//       const sorted = Object.entries(categorySales)
//         .sort(([, a], [, b]) => b - a);

//       const top10 = sorted.slice(0, 10);
//       const others = sorted.slice(10);

//       const othersTotal = others.reduce((sum, [, val]) => sum + val, 0);

//       const formatted = top10.map(([name, value]) => ({
//         name,
//         sales: Math.round(value),
//       }));

//       if (others.length > 0) {
//         formatted.push({
//           name: "Others",
//           sales: Math.round(othersTotal),
//         });
//       }

//       return {
//         year,
//         data: formatted,
//       };
//     });
    
//     return result;
//   }

//   GetSalesRepWise() {
//     const Category = {};
    
//     this.data.forEach((entry) => {
//       const parsedDate = normalizeDate(entry["Invoice Date"]);
      
//       // Apply date filter
//       if (!this.matchesDateFilter(parsedDate)) return;
      
//       const year = parsedDate.getFullYear();
//       const category = entry?.salesrep?.trim() || "Unknown";
//       const amount = Number(entry?.TotalAmount || 0);

//       if (!Category[year]) Category[year] = {};
//       if (!Category[year][category]) Category[year][category] = 0;

//       Category[year][category] += amount;
//     });

//     const result = Object.entries(Category).map(([year, categorySales]) => {
//       const sorted = Object.entries(categorySales)
//         .sort(([, a], [, b]) => b - a);

//       const top10 = sorted.slice(0, 10);
//       const others = sorted.slice(10);

//       const othersTotal = others.reduce((sum, [, val]) => sum + val, 0);

//       const formatted = top10.map(([name, value]) => ({
//         name,
//         sales: Math.round(value),
//       }));

//       if (others.length > 0) {
//         formatted.push({
//           name: "Others",
//           sales: Math.round(othersTotal),
//         });
//       }

//       return {
//         year,
//         data: formatted,
//       };
//     });
    
//     return result;
//   }
// }

// export default SalesAnalyticsReport;


// import { getYear, isSameYear, format } from "date-fns";
// import normalizeDate from "../libs/normalizeDate";

// class SalesAnalyticsReport {
//   constructor(data, dateRange , date) {
//     this.data = Array.isArray(data) ? data : [];
//     this.dateRange = dateRange;
//     this.date = date;
//     console.log(this.date)
//   }

//   setData(data) {
//     this.data = Array.isArray(data) ? data : [];
//     return this;
//   }
//   GetGroupByYear(voucherFilter = "all") {
//     const { startDate, endDate } = this.dateRange || {};
//     const start = normalizeDate(startDate);
//     const end = normalizeDate(endDate);

//     if (!start || !end) return [];

//     const year = getYear(start);
//     const result = {};

//     this.data.forEach((entry) => {
//       const parsedDate = normalizeDate(entry["Invoice Date"]);
//       if (!parsedDate || !isSameYear(parsedDate, new Date(year, 0))) return;

//       if (voucherFilter !== "all" && String(entry["voucher type"]).toLowerCase() !== voucherFilter.toLowerCase()) {
//         return;
//       }

//       const monthKey = format(parsedDate, "MMM");
//       if (!result[monthKey]) {
//         result[monthKey] = {
//           month: monthKey,
//           entries: [],
//           totalAmount: 0,
//         };
//       }

//       result[monthKey].entries.push(entry);
//       result[monthKey].totalAmount += Math.round(Number(entry.TotalAmount || 0));
//     });

//     const orderedMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//     return orderedMonths.map(
//       (month) =>
//         result[month] || {
//           month,
//           entries: [],
//           totalAmount: 0,
//         }
//     );
//   }
//   GetLocationWieseSale() {
//     const monthMap = new Map();
//     this.data.forEach((entry) => {
//       const parsedDate = normalizeDate(entry["Invoice Date"]);
//       if (!parsedDate) return;
//       const monthKey = format(parsedDate, "MMM");
//       const branch = (entry.Location || "Unknown").trim();

//       if (!monthMap.has(monthKey)) {
//         monthMap.set(monthKey, new Map());
//       }

//       const branchMap = monthMap.get(monthKey);
//       branchMap.set(branch, (branchMap.get(branch) || 0) + 1);
//     });

//     const orderedMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     const allBranches = [...new Set(this.data.map((e) => (e.Location || "Unknown").trim()))];
//     return orderedMonths.map((month) => {
//       const branchMap = monthMap.get(month) || new Map();
//       const result = { name: month };

//       allBranches.forEach((branch) => {
//         result[branch] = branchMap.get(branch) || 0;
//       });

//       return result;
//     });
//   }
//   GetTop10CustomersByYear() {
//     const salesByYear = {};

//     this.data.forEach((entry) => {
//       const parsedDate = normalizeDate(entry["Invoice Date"]);
//       if (!parsedDate) return;
//       const year = parsedDate.getFullYear();
//       const customer = entry.CustomerName?.trim() || "Unknown";
//       const amount = Number(entry.TotalAmount || 0);

//       if (!salesByYear[year]) salesByYear[year] = {};
//       if (!salesByYear[year][customer]) salesByYear[year][customer] = 0;

//       salesByYear[year][customer] += amount;
//     });

//     const result = Object.entries(salesByYear).map(([year, customerSales]) => {
//       const sorted = Object.entries(customerSales)
//         .sort(([, a], [, b]) => b - a);

//       const top10 = sorted.slice(0, 10);
//       const others = sorted.slice(10);

//       const othersTotal = others.reduce((sum, [, val]) => sum + val, 0);

//       const formatted = top10.map(([name, value]) => ({
//         name,
//         sales: Math.round(value),
//       }));

//       if (others.length > 0) {
//         formatted.push({
//           name: "Others",
//           sales: Math.round(othersTotal),
//         });
//       }

//       return {
//         year,
//         data: formatted,
//       };
//     });

//     return result;
//   }
//   GetTop10Category() {
//     const Category = {};
//     this.data.forEach((entry) => {
//       const parsedDate = normalizeDate(entry["Invoice Date"]);
//       if (!parsedDate) return;
//       const year = parsedDate.getFullYear();
//       const category = entry.Category?.trim() || "Unknown";
//       const amount = Number(entry.TotalAmount || 0);

//       if (!Category[year]) Category[year] = {};
//       if (!Category[year][category]) Category[year][category] = 0;

//       Category[year][category] += amount;
//     });
//     const result = Object.entries(Category).map(([year, categorySales]) => {
//       const sorted = Object.entries(categorySales)
//         .sort(([, a], [, b]) => b - a);

//       const top10 = sorted.slice(0, 10);
//       const others = sorted.slice(10);

//       const othersTotal = others.reduce((sum, [, val]) => sum + val, 0);

//       const formatted = top10.map(([name, value]) => ({
//         name,
//         sales: Math.round(value),
//       }));

//       if (others.length > 0) {
//         formatted.push({
//           name: "Others",
//           sales: Math.round(othersTotal),
//         });
//       }

//       return {
//         year,
//         data: formatted,
//       };
//     });
//     return result;
//   }
//   GetTopVendorBySales() {
//     const Category = {};
//     this.data.forEach((entry) => {
//       const parsedDate = normalizeDate(entry["Invoice Date"]);
//       if (!parsedDate) return;
//       const year = parsedDate.getFullYear();
//       const category = entry["vendor name"]?.trim() || "Unknown";
//       const amount = Number(entry.TotalAmount || 0);

//       if (!Category[year]) Category[year] = {};
//       if (!Category[year][category]) Category[year][category] = 0;

//       Category[year][category] += amount;
//     });
//     const result = Object.entries(Category).map(([year, categorySales]) => {
//       const sorted = Object.entries(categorySales)
//         .sort(([, a], [, b]) => b - a);

//       const top10 = sorted.slice(0, 10);
//       const others = sorted.slice(10);

//       const othersTotal = others.reduce((sum, [, val]) => sum + val, 0);

//       const formatted = top10.map(([name, value]) => ({
//         name,
//         sales: Math.round(value),
//       }));

//       if (others.length > 0) {
//         formatted.push({
//           name: "Others",
//           sales: Math.round(othersTotal),
//         });
//       }

//       return {
//         year,
//         data: formatted,
//       };
//     });
//     return result;
//   }
//   GetSalesRepWise() {
//     const Category = {};
//     this.data.forEach((entry) => {
//       const parsedDate = normalizeDate(entry["Invoice Date"]);
//       if (!parsedDate) return;
//       const year = parsedDate.getFullYear();
//       const category = entry?.salesrep?.trim() || "Unknown";
//       const amount = Number(entry?.TotalAmount || 0);

//       if (!Category[year]) Category[year] = {};
//       if (!Category[year][category]) Category[year][category] = 0;

//       Category[year][category] += amount;
//     });
//     const result = Object.entries(Category).map(([year, categorySales]) => {
//       const sorted = Object.entries(categorySales)
//         .sort(([, a], [, b]) => b - a);

//       const top10 = sorted.slice(0, 10);
//       const others = sorted.slice(10);

//       const othersTotal = others.reduce((sum, [, val]) => sum + val, 0);

//       const formatted = top10.map(([name, value]) => ({
//         name,
//         sales: Math.round(value),
//       }));

//       if (others.length > 0) {
//         formatted.push({
//           name: "Others",
//           sales: Math.round(othersTotal),
//         });
//       }

//       return {
//         year,
//         data: formatted,
//       };
//     });
//     return result;
//   }
// }

// export default SalesAnalyticsReport;

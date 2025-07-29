export const filterFactoryLossData = (data = [], filters = {}) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const {
    metalTypes = [], 
    date = {}, 
  } = filters;

  const normalizeToLocalDate = (date) => {
    if (!date) return null;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const parseDate = (value) => {
    try {
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    } catch {
      return null;
    }
  };

  return data.filter((entry) => {
    try {
      const entryMetalType = entry?.MetalType?.trim()?.split(" ")[0]?.toUpperCase() || "";

      const matchesMetalType = metalTypes.length === 0 ? true : metalTypes.includes(entryMetalType);
      const entryDate = parseDate(entry?.ExportBatchDate);
      if (!entryDate) return false;

      const normalizedEntryDate = normalizeToLocalDate(entryDate);
      const normalizedStart = date?.startDate ? normalizeToLocalDate(new Date(date.startDate)) : null;
      const normalizedEnd = date?.endDate ? normalizeToLocalDate(new Date(date.endDate)) : null;

      const matchesDateRange = (() => {
        if (!normalizedStart && !normalizedEnd) return true;
        if (normalizedStart && normalizedEnd && normalizedStart.getTime() === normalizedEnd.getTime()) {
          return normalizedEntryDate.getTime() === normalizedStart.getTime();
        }
        const afterStart = normalizedStart ? normalizedEntryDate >= normalizedStart : true;
        const beforeEnd = normalizedEnd ? normalizedEntryDate <= normalizedEnd : true;
        return afterStart && beforeEnd;
      })();

      return matchesMetalType && matchesDateRange;
    } catch (err) {
      console.warn("Error filtering entry:", err);
      return false;
    }
  });
};

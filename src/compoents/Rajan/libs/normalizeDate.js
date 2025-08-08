import { parse, isValid } from "date-fns";

const normalizeDate = (input) => {
  if (!input) return null;
  if (input instanceof Date && isValid(input)) return input;
  if (typeof input === "number") {
    const d = new Date(input);
    return isValid(d) ? d : null;
  }
  const knownFormats = [
    "yyyy-MM-dd",    // 2025-08-01
    "dd-MM-yyyy",    // 01-08-2025
    "d-MM-yyyy",     // 1-08-2025
    "MM/dd/yyyy",    // 08/01/2025
    "d/M/yyyy",      // 1/8/2025
    "dd/MM/yyyy",    // 01/08/2025
    "yyyy/MM/dd",    // 2025/08/01
  ];

  for (const format of knownFormats) {
    const parsed = parse(input, format, new Date());
    if (isValid(parsed)) return parsed;
  }
  const fallback = new Date(input);
  return isValid(fallback) ? fallback : null;
};

export default normalizeDate;


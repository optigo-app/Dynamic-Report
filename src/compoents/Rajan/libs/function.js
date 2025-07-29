import { REASONS, DESIGN_CODES } from "../constants/data";

const generateDetails = (count) => {
  if (count === 0) return [];
  return Array.from({ length: count }, (_, i) => ({
    id: `DSN-${DESIGN_CODES[i % DESIGN_CODES.length]}0${count}-${i + 1}`,
    reason: REASONS[i % REASONS.length],
    qty: Math.floor(Math.random() * 5) + 1,
  }));
};

const getChipColorStyles = (delayPercent) => {
  if (delayPercent > 80) {
    return {
      backgroundColor: "#fda4af", // Soft Red
      color: "#7f1d1d", // Dark Red text
    };
  } else if (delayPercent > 50) {
    return {
      backgroundColor: "#fef3c7", // Soft Amber
      color: "#78350f", // Deep amber text
    };
  } else {
    return {
      backgroundColor: "#bbf7d0", // Soft Green
      color: "#064e3b", // Deep green text
    };
  }
};

export { getChipColorStyles, generateDetails };

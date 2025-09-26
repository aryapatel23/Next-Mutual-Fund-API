// src/lib/utils.ts

// ✅ Format a date into DD-MM-YYYY
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}


// ✅ Format currency (Indian Rupees style)
export function formatCurrency(value: number, currency: string = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

// ✅ Convert a number to percentage with 2 decimals
export function formatPercent(value?: number, decimals = 2) {
  if (typeof value !== "number" || isNaN(value)) return "-";
  return `${value.toFixed(decimals)}%`;
}


// ✅ Calculate CAGR (Compound Annual Growth Rate)
export function calculateCAGR(
  startValue: number,
  endValue: number,
  years: number
): number {
  if (startValue <= 0 || years <= 0) return 0;
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
}

// ✅ Helper: generate a random ID (useful for charts, keys, etc.)
export function generateId(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

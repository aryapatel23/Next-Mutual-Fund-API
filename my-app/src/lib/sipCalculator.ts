// src/lib/sipCalculator.ts
import { differenceInDays, parseISO } from "date-fns";

interface SIPInput {
  amount: number;            // SIP amount
  frequency: "monthly";      // extend later if needed
  from: string;              // YYYY-MM-DD
  to: string;                // YYYY-MM-DD
  navHistory: { date: string; nav: number }[];
}

interface SIPResult {
  totalInvested: number;
  totalUnits: number;
  currentValue: number;
  absoluteReturn: number;
  annualizedReturn: number;
  timeline: { date: string; value: number }[];
}

/**
 * Find nearest NAV <= given date
 */
function findNearestNAV(navHistory: { date: string; nav: number }[], targetDate: string) {
  const target = parseISO(targetDate);
  for (let entry of navHistory) {
    const entryDate = parseISO(entry.date);
    if (entryDate <= target && entry.nav > 0) {
      return entry;
    }
  }
  return null;
}

/**
 * SIP Calculator
 */
export function calculateSIP(input: SIPInput): SIPResult {
  const { amount, from, to, navHistory } = input;

  let totalInvested = 0;
  let totalUnits = 0;
  let timeline: { date: string; value: number }[] = [];

  let start = parseISO(from);
  let end = parseISO(to);

  let current = new Date(start);

  while (current <= end) {
    const isoDate = current.toISOString().split("T")[0];
    const navEntry = findNearestNAV(navHistory, isoDate);

    if (navEntry) {
      const units = amount / navEntry.nav;
      totalUnits += units;
      totalInvested += amount;
      timeline.push({ date: isoDate, value: totalUnits * navEntry.nav });
    }

    // move to next month
    current.setMonth(current.getMonth() + 1);
  }

  const latestNAV = navHistory[0]; // navHistory is usually sorted latest → oldest
  const currentValue = totalUnits * latestNAV.nav;

  const absoluteReturn = ((currentValue - totalInvested) / totalInvested) * 100;

  const days = differenceInDays(end, start);
  const years = days / 365;
  const annualizedReturn =
    years > 0 ? (Math.pow(currentValue / totalInvested, 1 / years) - 1) * 100 : 0;

  return {
    totalInvested,
    totalUnits,
    currentValue,
    absoluteReturn,
    annualizedReturn,
    timeline,
  };
}

import dayjs from "dayjs";

export interface SipResult {
  totalInvested: number;
  totalUnits: number;
  currentValue: number;
  absoluteReturn: number;
  annualizedReturn: number;
  growthOverTime: { date: string; value: number }[];
}

export function calculateSIP(
  navHistory: { date: string; nav: number }[],
  amount: number,
  frequency: "monthly" | "quarterly",
  from: string,
  to: string
): SipResult {
  navHistory.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());

  const startDate = dayjs(from);
  const endDate = dayjs(to);
  const growthOverTime: { date: string; value: number }[] = [];

  let totalUnits = 0;
  let totalInvested = 0;

  let sipDate = startDate;

  while (sipDate.isBefore(endDate) || sipDate.isSame(endDate)) {
    // Find NAV for the SIP date or nearest earlier date
    const navEntry = [...navHistory]
      .reverse()
      .find((entry) => dayjs(entry.date).isBefore(sipDate.add(1, "day")));

    if (navEntry && navEntry.nav > 0) {
      const units = amount / navEntry.nav;
      totalUnits += units;
      totalInvested += amount;
      growthOverTime.push({
        date: sipDate.format("YYYY-MM-DD"),
        value: totalUnits * navEntry.nav,
      });
    }

    sipDate = frequency === "monthly" ? sipDate.add(1, "month") : sipDate.add(3, "month");
  }

  const latestNav = navHistory[0]?.nav || 0; // Latest NAV (assume first entry after sort)

  const currentValue = totalUnits * latestNav;
  const absoluteReturn = ((currentValue - totalInvested) / totalInvested) * 100;

  const years = endDate.diff(startDate, "year", true);
  const annualizedReturn = years > 0 ? (Math.pow(currentValue / totalInvested, 1 / years) - 1) * 100 : 0;

  return {
    totalInvested,
    totalUnits,
    currentValue,
    absoluteReturn,
    annualizedReturn,
    growthOverTime,
  };
}

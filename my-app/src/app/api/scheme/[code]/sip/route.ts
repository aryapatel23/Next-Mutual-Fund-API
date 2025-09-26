import { NextResponse } from "next/server";
import { calculateSIP } from "@/lib/sipCalculator";

export async function POST(req: Request) {
  try {
    const { amount, frequency, from, to } = await req.json();

    const codeMatch = req.url.match(/\/scheme\/(\d+)\/sip/);
    const code = codeMatch ? codeMatch[1] : null;

    if (!code) {
      return NextResponse.json(
        { error: "Missing scheme code" },
        { status: 400 }
      );
    }

    const res = await fetch(`https://api.mfapi.in/mf/${code}`);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch scheme data" },
        { status: 500 }
      );
    }

    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      return NextResponse.json(
        { error: "NAV history not found" },
        { status: 404 }
      );
    }

    const navHistory = data.data.map((entry: any) => ({
      date: entry.date,
      nav: parseFloat(entry.nav),
    }));

    const result = calculateSIP(navHistory, amount, frequency, from, to);

    return NextResponse.json({
      totalInvested: result.totalInvested || 0,
      currentValue: result.currentValue || 0,
      totalUnits: result.totalUnits || 0,
      absoluteReturn: result.absoluteReturn || 0,
      annualizedReturn: result.annualizedReturn || 0,
      growthOverTime: result.growthOverTime || [],
    });
  } catch (error) {
    console.error("Error in SIP calculation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

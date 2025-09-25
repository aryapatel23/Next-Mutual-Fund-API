// src/app/api/scheme/[code]/sip/route.ts
import { NextResponse } from "next/server";
import { getScheme } from "@/lib/api";
import { calculateSIP } from "@/lib/sipCalculator";

interface Params {
  params: { code: string };
}

export async function POST(req: Request, { params }: Params) {
  try {
    const { code } = params;
    const body = await req.json();

    const scheme = await getScheme(code);
    const navHistory = scheme.data.map((d: any) => ({
      date: d.date,
      nav: parseFloat(d.nav),
    }));

    const result = calculateSIP({
      ...body,
      navHistory,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

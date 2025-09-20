import { NextResponse } from "next/server";

import { getDashboardData } from "@/app/lib/dashboards";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (!params.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const d = await getDashboardData(params.id);
  return NextResponse.json(d);
}

/*
export async function POST(req: Request) {
  const body = await req.json();
  const parsed = CreateDash.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const row = await createDashboard(parsed.data);
  return NextResponse.json(row, { status: 201 });
}
 */

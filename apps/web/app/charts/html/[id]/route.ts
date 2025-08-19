import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export const GET = async (
  _req: NextRequest,
  { params }: any,
  _res: NextResponse,
) => {
  try {
    return await fetch(
      `${process.env.APEGPT_API_URL}/api/v1/chart/html/${params.id}`,
      {
        headers: {
          Accept: "text/html",
        },
      },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: "Error fetching chart html" },
      { status: 500 },
    );
  }
};

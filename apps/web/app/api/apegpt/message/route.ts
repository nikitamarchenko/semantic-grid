import { getAccessToken } from "@auth0/nextjs-auth0";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import client from "@/app/lib/gptAPI";

const GET = async (req: NextRequest) => {
  try {
    const sessionId = req.nextUrl.searchParams.get("sessionId");
    const seqNum = req.nextUrl.searchParams.get("seqNum");
    const guestToken = cookies().get("uid")?.value;
    let token = null; //
    try {
      token = await getAccessToken();
    } catch (error: any) {
      token = { accessToken: guestToken };
    }
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const res = await client.GET("/api/v1/request/{session_id}/{seq_num}", {
      params: {
        path: { session_id: sessionId!, seq_num: parseInt(seqNum || "0") },
      },
      headers: { Authorization: `Bearer ${token.accessToken}` },
    });
    return NextResponse.json(res.data);
  } catch (error: any) {
    if (error.code === "ERR_EXPIRED_ACCESS_TOKEN") {
      return NextResponse.json(
        { error: "Error fetching sessions: token expired" },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { error: "Error fetching sessions" },
      { status: 500 },
    );
  }
};

export { GET };

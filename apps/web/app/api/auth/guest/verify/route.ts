import * as jose from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const JWKS_URL = ".well-known/jwks.json";

async function getJWKs(req: NextRequest) {
  const host = req.headers.get("host");
  const schema = req.headers.get("x-forwarded-proto") || "http";
  const url = `${schema}://${host}/${JWKS_URL}`;
  const res = await fetch(url);
  const { keys } = await res.json();

  return keys;
}

async function verifyGuestJWT(token: string, req: NextRequest) {
  const jwks = await getJWKs(req);
  const key = await jose.importJWK(jwks[0], "RS256");
  return jose.jwtVerify(token, key);
}

export const GET = async (req: NextRequest) => {
  const token = cookies().get("uid")?.value;
  if (!token) {
    return NextResponse.json(
      { valid: false, message: "No token provided" },
      { status: 401 },
    );
  }
  const res = await verifyGuestJWT(token, req);
  if (res) {
    return NextResponse.json({ valid: true });
  }
  return NextResponse.json(
    { valid: false, message: "Invalid token" },
    { status: 401 },
  );
};

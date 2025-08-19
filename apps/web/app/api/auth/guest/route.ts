import * as jose from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY!;
const PUBLIC_KEY = process.env.JWT_PUBLIC_KEY!;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE!;

export const GET = async (req: NextRequest) => {
  const uid = cookies().get("uid")?.value;
  if (uid) {
    // console.log("uid cookie found", uid);
    const publicKey = await jose.importSPKI(PUBLIC_KEY, "RS256");
    const jwt = await jose.jwtVerify(uid, publicKey);
    const trialCookie = cookies().get("apegpt-trial")?.value;
    const trialQuota = process.env.FREE_TIER_QUOTA || "5";
    const hasQuota = trialCookie
      ? parseInt(trialCookie) < parseInt(trialQuota)
      : false;
    return NextResponse.json({ uid: jwt.payload.sub, hasQuota });
  }

  const host = (req.headers as any).get("host");
  const schema = (req.headers as any).get("x-forwarded-proto") || "http";
  // console.log("asking for guest cookie", host);
  if (req.method !== "GET")
    return NextResponse.json("Method not allowed", { status: 405 });

  const guestId = `guest-${crypto.randomUUID()}`;

  // Sign the JWT with the private key
  const privateKey = await jose.importPKCS8(PRIVATE_KEY, "RS256");
  const jwt = await new jose.SignJWT({ sub: guestId })
    .setProtectedHeader({ alg: "RS256", kid: "guest-key" })
    .setAudience(AUTH0_AUDIENCE)
    .setIssuer("https://apegpt.ai")
    .setExpirationTime("365d")
    .sign(privateKey);

  // Set JWT as a cookie
  // Set the JWT as an httpOnly cookie using Next.js cookies API
  cookies().set("uid", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 365 * 24 * 60 * 60, // 7 days
  });

  console.log("uid cookie set", guestId);

  const freeRequests = cookies().get("apegpt-trial")?.value;
  // Increase free trial count
  if (!freeRequests) {
    cookies().set("apegpt-trial", (0).toString(), {
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60, // 7 days
    });
  }
  // console.log("trial cookie set");

  return NextResponse.redirect(`${schema}://${host}/query`);
};

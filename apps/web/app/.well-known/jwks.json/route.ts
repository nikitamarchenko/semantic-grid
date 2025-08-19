import { NextApiRequest, NextApiResponse } from "next";
import * as jose from "jose";
import { NextResponse } from "next/server";

const PUBLIC_KEY = process.env.JWT_PUBLIC_KEY!;

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") return res.status(405).end();

  // Convert PEM public key to JWK
  const publicKey = await jose.importSPKI(PUBLIC_KEY, "RS256");
  const jwk = await jose.exportJWK(publicKey);

  return NextResponse.json({
    keys: [
      {
        ...jwk,
        kid: "guest-key", // Key ID
        alg: "RS256",
        typ: "JWT",
        use: "sig", // Signature key
      },
    ],
  });
};

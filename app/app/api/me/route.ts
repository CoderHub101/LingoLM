import { NextResponse } from "next/server";
import { decodeJwt } from "jose";

function readCookieValue(cookieHeader: string, name: string) {
  const match = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const idToken = readCookieValue(cookieHeader, "id_token");

  if (!idToken) return NextResponse.json({ authenticated: false }, { status: 200 });

  const claims = decodeJwt(idToken);

  return NextResponse.json({
    authenticated: true,
    user: {
      sub: claims.sub,
      email: claims.email,
      name: claims.name,
      picture: claims.picture,
    },
    rawClaims: claims,
  });
}
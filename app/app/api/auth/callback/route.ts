import { NextResponse } from "next/server";

function readCookieValue(cookieHeader: string, name: string) {
  const match = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const errorDesc = url.searchParams.get("error_description");

  if (error) {
    return NextResponse.json({ error, error_description: errorDesc }, { status: 400 });
  }
  if (!code || !state) {
    return NextResponse.json({ error: "Missing code/state" }, { status: 400 });
  }

  const domain = process.env.COGNITO_DOMAIN!;
  const clientId = process.env.COGNITO_CLIENT_ID!;
  const redirectUri = process.env.COGNITO_REDIRECT_URI!;

  const cookieHeader = req.headers.get("cookie") ?? "";
  const expectedState = readCookieValue(cookieHeader, "oauth_state");
  const verifier = readCookieValue(cookieHeader, "pkce_verifier");

  if (!expectedState || !verifier || state !== expectedState) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    redirect_uri: redirectUri,
    code,
    code_verifier: verifier,
  });

  const tokenResp = await fetch(`https://${domain}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const tokenJson = await tokenResp.json();
  if (!tokenResp.ok) {
    return NextResponse.json(tokenJson, { status: tokenResp.status });
  }

  const secure = process.env.NODE_ENV === "production";

  const res = NextResponse.redirect(new URL("/", url));

  res.cookies.set("access_token", tokenJson.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: tokenJson.expires_in ?? 3600,
  });
  res.cookies.set("id_token", tokenJson.id_token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: tokenJson.expires_in ?? 3600,
  });

  if (tokenJson.refresh_token) {
    res.cookies.set("refresh_token", tokenJson.refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
    });
  }

  res.cookies.set("oauth_state", "", { path: "/", maxAge: 0 });
  res.cookies.set("pkce_verifier", "", { path: "/", maxAge: 0 });

  return res;
}

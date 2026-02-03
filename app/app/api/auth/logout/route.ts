import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secure = process.env.NODE_ENV === "production";

  const res = NextResponse.redirect(new URL("/", url));

  for (const name of ["access_token", "id_token", "refresh_token"]) {
    res.cookies.set(name, "", { path: "/", maxAge: 0, secure });
  }

  const domain = process.env.COGNITO_DOMAIN;
  const clientId = process.env.COGNITO_CLIENT_ID;
  const logoutUri = process.env.COGNITO_LOGOUT_URI;

  if (domain && clientId && logoutUri) {
    const cognitoLogout =
      `https://${domain}/logout` +
      `?client_id=${encodeURIComponent(clientId)}` +
      `&logout_uri=${encodeURIComponent(logoutUri)}`;
    return NextResponse.redirect(cognitoLogout);
  }

  return res;
}
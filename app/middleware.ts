import { NextRequest, NextResponse } from "next/server";
import { getAuthorizationUrl, verifyJwtToken } from "./auth";

export async function middleware(request: NextRequest) {
  const { cookies } = request;
  const { value: token } = cookies.get("token") ?? { value: null };

  const hasVerifiedToken = token && (await verifyJwtToken(token));

  if (!hasVerifiedToken) {
    const authorizationUrl = await getAuthorizationUrl();
    const response = NextResponse.redirect(authorizationUrl);

    response.cookies.delete("token");

    return response;
  }

  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };

import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import {
  getClientId,
  workos,
  getJwtSecretKey,
} from "@/store/services/authService";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (code) {
    try {
      const { user } = await workos.userManagement.authenticateWithCode({
        clientId: getClientId(),
        code,
      });

      const token = await new SignJWT({
        user,
      })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(getJwtSecretKey());

      const url = request.nextUrl.clone();

      url.searchParams.delete("code");

      url.pathname = "/";
      const response = NextResponse.redirect(url);

      response.cookies.set({
        name: "token",
        value: token,
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });

      return response;
    } catch (error) {
      return NextResponse.json(error);
    }
  }

  return NextResponse.json({
    error: "No authorization code was received from AuthKit",
  });
}

import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if ((process.env.AUTONOMOUS_GROWTH_MODE ?? "test") === "test") {
    return NextResponse.next();
  }

  const expectedUser = process.env.GROWTH_ADMIN_USERNAME;
  const expectedPassword = process.env.GROWTH_ADMIN_PASSWORD;
  const authorization = request.headers.get("authorization");

  if (!expectedUser || !expectedPassword || !authorization?.startsWith("Basic ")) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Field Agent AI Growth"' }
    });
  }

  const decoded = atob(authorization.slice(6));
  const separator = decoded.indexOf(":");
  const username = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1);
  if (separator < 0 || username !== expectedUser || password !== expectedPassword) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Field Agent AI Growth"' }
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/autonomous-growth/:path*", "/api/autonomous-growth/:path*"]
};

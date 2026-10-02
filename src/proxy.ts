import { NextResponse, type NextRequest } from "next/server";

// The configurator is unfinished: it runs in local development only, or where CONFIGURATOR=on.
// Its quote list also needs basic auth.
export const config = { matcher: ["/configurator/:path*", "/api/configurator/:path*"] };

/** Constant time, so a wrong password leaks nothing through response timing. */
function same(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= a.charCodeAt(i % a.length || 0) ^ b.charCodeAt(i % b.length || 0);
  }
  return diff === 0;
}

export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV !== "development" && process.env.CONFIGURATOR !== "on") {
    return NextResponse.rewrite(new URL("/_not-found", request.url));
  }
  if (!request.nextUrl.pathname.startsWith("/configurator/admin")) return NextResponse.next();

  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASS;
  if (!user || !pass) return new NextResponse("admin not configured", { status: 503 });

  const [scheme, encoded] = (request.headers.get("authorization") ?? "").split(" ");
  if (scheme === "Basic" && encoded) {
    try {
      if (same(atob(encoded), `${user}:${pass}`)) return NextResponse.next();
    } catch {
      // malformed base64 falls through to the challenge
    }
  }
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Screenery admin"' },
  });
}

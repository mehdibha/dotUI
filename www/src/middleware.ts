import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle /r/ routes
  if (!pathname.startsWith("/r/")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/api${pathname.replace(".json", "")}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Match all requests to test
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

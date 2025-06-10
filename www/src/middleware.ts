import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

const OFFICIAL_STYLES = [
  "minimalist",
  "material",
  "ghibli",
  "primer",
  "supabase",
  "brutalist",
  "polaris",
  "retro",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle /r/ routes
  if (!pathname.startsWith("/r/")) {
    return NextResponse.next();
  }

  const segments = pathname.slice(3).split("/").filter(Boolean);

  if (segments.length === 2) {
    const [styleName, registryItem] = segments;

    if (
      OFFICIAL_STYLES.includes(styleName!)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = `/api/r/dotui/${styleName}/${registryItem}`;
      return NextResponse.rewrite(url);
    } else {
      const url = request.nextUrl.clone();
      url.pathname = `/api/r/community/${styleName}/${registryItem}`;
      return NextResponse.rewrite(url);
    }
  }

  if (segments.length === 3) {
    const [username, styleName, registryItem] = segments;

    const url = request.nextUrl.clone();
    url.pathname = `/api/r/${username}/${styleName}/${registryItem}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all requests to test
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

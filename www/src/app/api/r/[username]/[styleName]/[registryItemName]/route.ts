import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { resolveComponent } from "@/lib/registry-resolver";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { username: string; styleName: string; registryItemName: string };
  },
) {
  try {
    const { username, styleName, registryItemName } = params;

    // Remove .json extension if present
    const componentName = registryItemName.replace(/\.json$/, "");

    // Resolve the component using our new resolver
    const result = await resolveComponent(username, styleName, componentName);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    // Return the resolved component with proper caching headers
    return NextResponse.json(result.component, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        Vary: "Accept-Encoding",
      },
    });
  } catch (error) {
    console.error("Error serving component:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

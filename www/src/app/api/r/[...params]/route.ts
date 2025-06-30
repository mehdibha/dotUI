import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { buildItemRegistry } from "@dotui/style-engine/shadcn-registry";

import { caller } from "@/trpc/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ params: string[] }> },
) {
  try {
    const { params: routeParams } = await params;

    if (!routeParams || routeParams.length !== 2) {
      // console.error(routeParams);
      return NextResponse.json(
        {
          error: "Invalid URL format. Expected /r/{styleSlug}/{registryItem}",
        },
        { status: 400 },
      );
    }

    const [styleSlug, registryItemName] = routeParams as [string, string];

    const style = await caller.style.bySlug({
      slug: styleSlug,
    });

    if (!style) {
      return NextResponse.json({ error: "Style not found" }, { status: 404 });
    }

    
    const registryItem = buildItemRegistry(registryItemName, style);

    const response = NextResponse.json(registryItem);

    return response;
  } catch (error) {
    console.error("Registry API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { and, eq } from "@dotui/db";
import { db } from "@dotui/db/client";
import { style, user } from "@dotui/db/schema";
import { buildItemRegistry } from "@dotui/style-engine/shadcn-registry";
import type { Style } from "@dotui/style-engine/types";

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
          error: "Invalid URL format. Expected /r/{styleSlug}/{componentName}",
        },
        { status: 400 },
      );
    }

    const [styleSlug, componentName] = routeParams as [string, string];

    const styleRecord = await db
      .select()
      .from(style)
      .where(eq(style.slug, styleSlug))
      .limit(1);

    if (!styleRecord || styleRecord.length === 0) {
      return NextResponse.json({ error: "Style not found" }, { status: 404 });
    }

    const foundStyle = styleRecord[0] as Style;

    const registryItem = buildItemRegistry(componentName, foundStyle);

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

import path from "node:path";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { buildItemRegistry } from "@dotui/style-engine/shadcn-registry";

import { env } from "@/env";
import { caller } from "@/trpc/server";

const registryBasePath = path.resolve(
  process.cwd(),
  "..",
  "packages",
  "ui",
  "src",
  "registry",
);

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

    const registryItem = await buildItemRegistry(registryItemName, {
      style,
      registryBasePath,
      baseUrl:
        env.NODE_ENV === "development"
          ? "http://localhost:3000/r"
          : "https://dotui.com/r",
    });

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

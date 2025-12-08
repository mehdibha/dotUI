import { NextResponse } from "next/server";
import path from "node:path";
import type { NextRequest } from "next/server";

import { buildRegistryItem } from "@dotui/registry-generator/shadcn";
import { createStyle } from "@dotui/style-system";
import type { RouterOutputs } from "@dotui/api";
import type { ColorFormat } from "@dotui/style-system";

import { env } from "@/env";
import { caller } from "@/lib/trpc/server";

const registryBasePath = path.resolve(
  process.cwd(),
  "../packages/registry/src",
);

export async function GET(
  request: NextRequest,
  { params }: RouteContext<"/r/[...params]">,
) {
  try {
    const { params: routeParams } = await params;
    const { searchParams } = new URL(request.url);

    // Get color format from query params, default to "oklch"
    const colorFormat = (searchParams.get("format") as ColorFormat) || "oklch";

    // Validate color format
    if (!["oklch", "hex", "hsl"].includes(colorFormat)) {
      return NextResponse.json(
        { error: "Invalid color format. Must be one of: oklch, hex, hsl" },
        { status: 400 },
      );
    }

    if (
      !routeParams ||
      (routeParams.length !== 2 && routeParams.length !== 3)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid URL format. Expected /r/{username}/{style}/{name} or /r/{style}/{name}",
        },
        { status: 400 },
      );
    }

    let style: RouterOutputs["style"]["getBySlug"];
    let styleSlug: string | undefined;
    let registryItemName: string | undefined;

    if (routeParams.length === 3) {
      const [username, styleName, name] = routeParams as [
        string,
        string,
        string,
      ];
      registryItemName = name;
      styleSlug = `${username}/${styleName}`;
      style = await caller.style.getBySlug({
        slug: styleSlug,
      });
    } else {
      const [styleName, name] = routeParams as [string, string];
      registryItemName = name;
      styleSlug = styleName;
      style = await caller.style.getBySlug({
        slug: styleName,
      });
    }

    if (!style) {
      return NextResponse.json({ error: "Style not found" }, { status: 404 });
    }

    const registryItem = await buildRegistryItem(registryItemName, {
      styleName: styleSlug,
      style: createStyle(style, false, colorFormat),
      registryBasePath,
      baseUrl:
        env.NODE_ENV === "development"
          ? "http://localhost:4444/r"
          : "https://dotui.org/r",
      colorFormat,
    });

    if (!registryItem) {
      return NextResponse.json(
        { error: "Registry item not found" },
        { status: 404 },
      );
    }

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

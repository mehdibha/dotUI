import path from "node:path";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { buildRegistryItem } from "@dotui/registry/style-system/shadcn-registry";
import { createStyle } from "@dotui/registry/style-system/core";

import { env } from "@/env";
import { caller } from "@/lib/trpc/server";

const registryBasePath = path.resolve(
  process.cwd(),
  "../packages/ui/src/registry",
);

export async function GET(
  _: NextRequest,
  { params }: RouteContext<"/r/[...params]">,
) {
  try {
    const { params: routeParams } = await params;

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

    let style;
    let styleSlug;
    let registryItemName;

    if (routeParams.length === 3) {
      const [username, styleName, name] = routeParams as [
        string,
        string,
        string,
      ];
      registryItemName = name;
      styleSlug = `${username}/${styleName}`;
      style = await caller.style.getByNameAndUsername({
        name: styleName,
        username: username,
      });
    } else {
      const [styleName, name] = routeParams as [string, string];
      registryItemName = name;
      styleSlug = styleName;
      style = await caller.style.byPublicSlug({
        slug: styleName,
      });
    }

    if (!style) {
      return NextResponse.json({ error: "Style not found" }, { status: 404 });
    }

    const registryItem = await buildRegistryItem(registryItemName, {
      styleName: styleSlug,
      style: createStyle(style, false),
      registryBasePath,
      baseUrl:
        env.NODE_ENV === "development"
          ? "http://localhost:4444/r"
          : "https://dotui.org/r",
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

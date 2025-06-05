import { NextRequest, NextResponse } from "next/server";

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

    const componentName = registryItemName.replace(/\.json$/, "");

    if (username === "dotui") {
      return NextResponse.json(
        data({ componentName, styleName, username: "dotui" }),
        {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=3600",
          },
        },
      );
    }

    if (username === "community") {
      return NextResponse.json(
        data({ componentName, styleName, username: "community" }),
        {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=3600",
          },
        },
      );
    }

    return NextResponse.json(data({ componentName, styleName, username }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error serving style:", error);
    return NextResponse.json({ error: "Style not found" }, { status: 404 });
  }
}

const data = ({
  componentName,
  styleName,
  username,
}: {
  componentName: string;
  styleName: string;
  username: string;
}) => {
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: componentName,
    type: "registry:ui",
    styleName,
    username,
  };
};

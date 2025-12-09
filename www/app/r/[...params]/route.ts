import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createStyle } from "@dotui/style-system/core";
import type { ColorFormat } from "@dotui/style-system/types";

import { env } from "@/env";
import {
	cached,
	generateThemeJson,
	getCacheKey,
	loadItemFromAnyCategory,
	loadSpecialItem,
	transformItemJson,
} from "@/lib/registry";
import { caller } from "@/lib/trpc/server";

// Feature flag for rollback capability
const USE_PREBUILT_JSON = true;

export async function GET(request: NextRequest, { params }: RouteContext<"/r/[...params]">) {
	try {
		const { params: routeParams } = await params;
		const { searchParams } = new URL(request.url);

		// Get color format from query params, default to "oklch"
		const colorFormat = (searchParams.get("format") as ColorFormat) || "oklch";

		// Validate color format
		if (!["oklch", "hex", "hsl"].includes(colorFormat)) {
			return NextResponse.json({ error: "Invalid color format. Must be one of: oklch, hex, hsl" }, { status: 400 });
		}

		if (!routeParams || (routeParams.length !== 2 && routeParams.length !== 3)) {
			return NextResponse.json(
				{
					error: "Invalid URL format. Expected /r/{username}/{style}/{name} or /r/{style}/{name}",
				},
				{ status: 400 },
			);
		}

		// Parse route params
		let styleSlug: string;
		let registryItemName: string;

		if (routeParams.length === 3) {
			const [username, styleName, name] = routeParams as [string, string, string];
			registryItemName = name;
			styleSlug = `${username}/${styleName}`;
		} else {
			const [styleName, name] = routeParams as [string, string];
			registryItemName = name;
			styleSlug = styleName;
		}

		// Fetch style from database
		const style = await caller.style.getBySlug({ slug: styleSlug });

		if (!style) {
			return NextResponse.json({ error: "Style not found" }, { status: 404 });
		}

		// Generate style object
		const styleObj = createStyle(style, false, colorFormat);

		const baseUrl = env.NODE_ENV === "development" ? "http://localhost:4444/r" : "https://dotui.org/r";

		// Handle special items
		if (registryItemName === "registry") {
			const registry = await loadSpecialItem("registry");
			return NextResponse.json(registry);
		}

		if (registryItemName === "theme") {
			const themeJson = generateThemeJson(styleObj, styleSlug, colorFormat);
			return NextResponse.json(themeJson);
		}

		if (registryItemName === "base") {
			const base = await loadSpecialItem("base");
			return NextResponse.json(base);
		}

		if (registryItemName === "all") {
			const all = await loadSpecialItem("all");
			return NextResponse.json(all);
		}

		// Use feature flag for pre-built JSON vs runtime generation
		if (USE_PREBUILT_JSON) {
			// Load pre-built item JSON with caching
			const cacheKey = getCacheKey(styleSlug, registryItemName, colorFormat);

			const result = await cached(cacheKey, async () => {
				// Load pre-built JSON from any category
				const item = await loadItemFromAnyCategory(registryItemName);

				if (!item) {
					return null;
				}

				// Apply style-specific transforms
				return transformItemJson(item, {
					style: styleObj,
					styleName: styleSlug,
					baseUrl,
					colorFormat,
				});
			});

			if (!result) {
				return NextResponse.json({ error: "Registry item not found" }, { status: 404 });
			}

			// Return with cache headers
			const response = NextResponse.json(result);
			response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");

			return response;
		}

		// Fallback to runtime generation (old path)
		const { buildShadcnItem } = await import("@dotui/shadcn-adapter");
		const path = await import("node:path");

		const registryBasePath = path.resolve(process.cwd(), "../packages/registry/src");

		const registryItem = await buildShadcnItem(registryItemName, {
			styleName: styleSlug,
			style: styleObj,
			registryBasePath,
			baseUrl,
			colorFormat,
		});

		if (!registryItem) {
			return NextResponse.json({ error: "Registry item not found" }, { status: 404 });
		}

		return NextResponse.json(registryItem);
	} catch (_error) {
		console.error("Registry API error:", _error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

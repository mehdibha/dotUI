import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Index } from "@dotui/registry/blocks";
import type { StyleConfig } from "@dotui/core/schemas";

import { BlockViewLayout } from "@/modules/blocks/block-view-layout";
import { BlockViewer } from "@/modules/blocks/block-viewer";
import { useTRPC } from "@/lib/trpc";

const searchSchema = z.object({
	style: z.string().optional(),
	config: z.string().optional(),
	mode: z.enum(["light", "dark"]).optional(),
	view: z.coerce.boolean().optional(),
});

export const Route = createFileRoute("/view/$block")({
	validateSearch: searchSchema,
	component: BlockViewPage,
	loader: ({ params }) => {
		if (!Index[params.block]) {
			throw notFound();
		}
		return { block: params.block };
	},
});

function BlockViewPage() {
	const { block } = Route.useLoaderData();
	const { style, config: configParam, mode, view } = Route.useSearch();
	const trpc = useTRPC();

	const inlineConfig = configParam ? decodeStyleConfig(configParam) : null;

	const { data: styleData, isLoading } = useQuery({
		...trpc.style.getBySlug.queryOptions({ slug: style ?? "" }),
		enabled: !!style && !inlineConfig,
	});

	const config = inlineConfig ?? styleData?.config ?? null;

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<span className="text-fg-muted">Loading...</span>
			</div>
		);
	}

	return (
		<BlockViewLayout config={config} mode={mode} view={view}>
			<BlockViewer name={block} />
		</BlockViewLayout>
	);
}

function decodeStyleConfig(encoded: string): StyleConfig | null {
	try {
		return JSON.parse(atob(encoded)) as StyleConfig;
	} catch {
		return null;
	}
}

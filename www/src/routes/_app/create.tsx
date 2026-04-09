import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { z } from "zod";

import { CustomizerPanel } from "@/modules/create/customizer-panel";

export const createSearchSchema = z.object({
	panel: z.string().optional().catch(undefined),
	preview: z.string().default("accordion").catch("accordion"),
});

const searchDefaults = { preview: "accordion" };

export const Route = createFileRoute("/_app/create")({
	validateSearch: createSearchSchema,
	search: {
		middlewares: [stripSearchParams(searchDefaults)],
	},
	component: CreatePage,
});

function CreatePage() {
	const { panel, preview } = Route.useSearch();

	// When viewing a specific component detail, preview that component
	const effectivePreview = panel?.startsWith("components.") ? panel.split(".")[1]! : preview;

	return (
		<div className="flex h-[calc(100svh-var(--header-height))] min-h-0 flex-1 flex-row gap-6 p-6 pt-2">
			<CustomizerPanel />
			<iframe key={effectivePreview} src={`/preview/${effectivePreview}`} title="preview" className="flex-1 rounded-xl border" />
		</div>
	);
}

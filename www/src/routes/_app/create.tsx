import { useEffect, useRef } from "react";
import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { z } from "zod";

import { CustomizerPanel } from "@/modules/create/customizer-panel";
import { sendToIframe, useDesignSystem } from "@/modules/create/preset";

export const createSearchSchema = z.object({
	panel: z.string().optional().catch(undefined),
	preview: z.string().default("accordion").catch("accordion"),
	preset: z.string().optional().catch(undefined),
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
	const { designSystem } = useDesignSystem();
	const iframeRef = useRef<HTMLIFrameElement>(null);

	// When viewing a specific component detail, preview that component
	const effectivePreview = panel?.startsWith("components.") ? panel.split(".")[1]! : preview;

	// Send design system to iframe on changes + iframe load
	useEffect(() => {
		const iframe = iframeRef.current;
		if (!iframe) return;

		const send = () => sendToIframe(iframe, designSystem);

		if (iframe.contentWindow) send();

		iframe.addEventListener("load", send);
		return () => iframe.removeEventListener("load", send);
	}, [designSystem]);

	return (
		<div className="flex h-[calc(100svh-var(--header-height))] min-h-0 flex-1 flex-row gap-6 p-6 pt-2">
			<CustomizerPanel />
			<iframe ref={iframeRef} key={effectivePreview} src={`/preview/${effectivePreview}`} title="preview" className="flex-1 rounded-xl border" />
		</div>
	);
}

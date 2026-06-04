import { useEffect, useMemo, useRef, useState } from "react";

import { createFileRoute, stripSearchParams } from "@tanstack/react-router";

import { z } from "zod";

import { CustomizerPanel } from "@/modules/create/customizer-panel";
import { sendPreviewMode, sendToIframe, useDesignSystem } from "@/modules/create/preset";

import type { PreviewMode } from "@/modules/create/preset";

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
	const { preview, preset } = Route.useSearch();
	const { designSystem } = useDesignSystem();
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const [previewMode, setPreviewMode] = useState<PreviewMode>("light");

	const effectivePreview = preview;

	// Bake the preset into the iframe src so the initial render has the right state.
	// Only recompute when the previewed component changes (not on every param change)
	// — further updates go through postMessage without reloading the iframe.
	const iframeSrc = useMemo(() => {
		const base = `/preview/${effectivePreview}`;
		return preset ? `${base}?preset=${encodeURIComponent(preset)}` : base;
		// oxlint-disable-next-line react/exhaustive-deps -- keep live preset changes on the postMessage channel to avoid iframe reloads
	}, [effectivePreview]);

	// Send the design system to the iframe on change, on load, and when the iframe signals it's
	// ready — its message listener can mount after the load event, racing the load-fired send.
	useEffect(() => {
		const iframe = iframeRef.current;
		if (!iframe) return;

		const send = () => sendToIframe(iframe, designSystem);

		if (iframe.contentWindow) send();

		iframe.addEventListener("load", send);
		const onReady = (event: MessageEvent) => {
			if (event.data?.type === "preview-ready") send();
		};
		window.addEventListener("message", onReady);
		return () => {
			iframe.removeEventListener("load", send);
			window.removeEventListener("message", onReady);
		};
	}, [designSystem]);

	// Forward the previewed display mode (light / dark) to the iframe — on change,
	// on load, and when the iframe signals it's ready (its listener can mount after load).
	useEffect(() => {
		const iframe = iframeRef.current;
		if (!iframe) return;
		const send = () => sendPreviewMode(iframe, previewMode);
		if (iframe.contentWindow) send();
		iframe.addEventListener("load", send);
		const onReady = (event: MessageEvent) => {
			if (event.data?.type === "preview-ready") send();
		};
		window.addEventListener("message", onReady);
		return () => {
			iframe.removeEventListener("load", send);
			window.removeEventListener("message", onReady);
		};
	}, [previewMode]);

	return (
		<div className="flex h-[calc(100svh-var(--header-height))] min-h-0 flex-1 flex-row gap-6 p-6 pt-2">
			<CustomizerPanel
				previewMode={previewMode}
				onTogglePreviewMode={() => setPreviewMode((m) => (m === "dark" ? "light" : "dark"))}
			/>
			<iframe
				ref={iframeRef}
				key={effectivePreview}
				src={iframeSrc}
				title="preview"
				className="flex-1 rounded-xl border"
			/>
		</div>
	);
}

import { useEffect, useMemo, useRef, useState } from "react";

import { createFileRoute, stripSearchParams } from "@tanstack/react-router";

import { useTheme } from "starter-themes";
import { z } from "zod";

import { CustomizerPanel } from "@/modules/create/customizer-panel";
import { sendPreviewMode, sendToIframe, useDesignSystem } from "@/modules/create/preset";
import { PreviewToolbar } from "@/modules/create/preview-toolbar";

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
	const { resolvedTheme } = useTheme();
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const [previewMode, setPreviewMode] = useState<PreviewMode>("light");

	// Open the preview in the same light / dark mode the site is currently in. Seeded on
	// mount rather than via the useState initializer: this page is server-rendered and the
	// server can't know the client's stored theme (it always resolves "light"), so reading
	// it during render would mismatch the SSR'd toggle icon on hydration. Runs once — the
	// preview mode is toggled independently of the site theme afterwards.
	useEffect(() => {
		setPreviewMode(resolvedTheme);
		// oxlint-disable-next-line react/exhaustive-deps -- seed once from the site theme at open; preview mode is independent thereafter
	}, []);

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
			<CustomizerPanel />
			<div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card">
				<PreviewToolbar
					previewMode={previewMode}
					onTogglePreviewMode={() => setPreviewMode((m) => (m === "dark" ? "light" : "dark"))}
				/>
				<iframe
					ref={iframeRef}
					key={effectivePreview}
					src={iframeSrc}
					title="preview"
					className="min-h-0 w-full flex-1 border-0"
				/>
			</div>
		</div>
	);
}

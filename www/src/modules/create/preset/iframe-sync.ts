"use client";

import * as React from "react";

import type { DesignSystem } from "./types";

/* --------------------------------- Types --------------------------------- */

export type PreviewMode = "light" | "dark";

type ParentToIframeMessage =
	| { type: "design-system"; data: DesignSystem }
	| { type: "preview-mode"; mode: PreviewMode };

/* ------------------------------ Send (parent) ------------------------------ */

export function sendToIframe(iframe: HTMLIFrameElement | null, data: DesignSystem) {
	if (!iframe?.contentWindow) return;
	iframe.contentWindow.postMessage({ type: "design-system", data } satisfies ParentToIframeMessage, "*");
}

export function sendPreviewMode(iframe: HTMLIFrameElement | null, mode: PreviewMode) {
	if (!iframe?.contentWindow) return;
	iframe.contentWindow.postMessage({ type: "preview-mode", mode } satisfies ParentToIframeMessage, "*");
}

/* ----------------------------- Listen (iframe) ----------------------------- */

function isInIframe(): boolean {
	try {
		return window.self !== window.top;
	} catch {
		return true;
	}
}

export function useIframeMessageListener(onMessage: (data: DesignSystem) => void) {
	const onMessageRef = React.useRef(onMessage);

	React.useEffect(() => {
		onMessageRef.current = onMessage;
	}, [onMessage]);

	React.useEffect(() => {
		if (!isInIframe()) return;

		const handleMessage = (event: MessageEvent) => {
			if (event.data?.type === "design-system") {
				onMessageRef.current(event.data.data);
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, []);
}

/**
 * Inside the preview iframe: apply display-mode messages from the customizer by
 * toggling the `.dark` class (the customizer owns the previewed mode, overriding
 * the iframe's own theme state).
 */
export function useIframePreviewModeListener() {
	React.useEffect(() => {
		if (!isInIframe()) return;

		const handleMessage = (event: MessageEvent) => {
			if (event.data?.type === "preview-mode") {
				const mode: PreviewMode = event.data.mode === "dark" ? "dark" : "light";
				const root = document.documentElement;
				root.classList.toggle("dark", mode === "dark");
				root.style.colorScheme = mode;
			}
		};

		window.addEventListener("message", handleMessage);
		// Signal readiness so the parent can push the current mode — its load-event
		// send can race ahead of this listener mounting.
		window.parent.postMessage({ type: "preview-ready" }, "*");
		return () => window.removeEventListener("message", handleMessage);
	}, []);
}

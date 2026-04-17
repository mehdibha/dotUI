"use client";

import * as React from "react";

import type { DesignSystem } from "./types";

/* --------------------------------- Types --------------------------------- */

type ParentToIframeMessage = {
	type: "design-system";
	data: DesignSystem;
};

/* ------------------------------ Send (parent) ------------------------------ */

export function sendToIframe(iframe: HTMLIFrameElement | null, data: DesignSystem) {
	if (!iframe?.contentWindow) return;
	iframe.contentWindow.postMessage({ type: "design-system", data } satisfies ParentToIframeMessage, "*");
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

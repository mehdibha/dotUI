/**
 * "Open in v0" button on the customizer panel.
 *
 * Hands v0 a deeplink to the `/r/showcase-bundle` registry item (themed to the
 * current preset). v0 fetches that item and boots a project rendering the dotUI
 * showcase as its first view — components installed, the preset's theme already
 * in `globals.css`.
 *
 * Deeplink shape: `https://v0.dev/chat/api/open?url=<url-encoded item URL>`.
 * The item URL must be publicly reachable, so this only does something useful on
 * the deployed origin (on localhost v0 can't fetch back) — same caveat as the
 * install command.
 */

import { useEffect, useMemo, useState } from "react";

import { useDesignSystem } from "./preset";
import { encodePreset } from "./preset/codec";

const DEFAULT_REGISTRY_HOST = "https://dotui.com";

function getRegistryHost(): string {
	if (typeof window === "undefined") return DEFAULT_REGISTRY_HOST;
	const { origin } = window.location;
	if (origin === "null" || origin === "http://localhost" || origin.startsWith("file:")) {
		return DEFAULT_REGISTRY_HOST;
	}
	return origin;
}

function V0Logo() {
	return (
		<svg viewBox="0 0 40 20" fill="currentColor" aria-hidden className="h-3.5 w-auto">
			<path d="M23.94 9.06v6.51c0 .47.38.85.85.85h.94v3.08h-1.27a3.46 3.46 0 0 1-3.46-3.46c-1.05 1.2-2.6 1.96-4.32 1.96a5.74 5.74 0 1 1 5.74-5.74l-.01.05h.01v-3.2h1.57zm-7.26 9.07a2.66 2.66 0 1 0 0-5.32 2.66 2.66 0 0 0 0 5.32z" />
			<path
				d="M8.06 5.73 3.3 14.4h9.52L8.06 5.73zm0-4.6 8.06 14.7H0L8.06 1.13z"
				transform="translate(0 1.5) scale(.78)"
			/>
		</svg>
	);
}

export function OpenInV0() {
	const { designSystem } = useDesignSystem();
	const [host, setHost] = useState(DEFAULT_REGISTRY_HOST);

	useEffect(() => {
		setHost(getRegistryHost());
	}, []);

	const href = useMemo(() => {
		const encoded = encodePreset(designSystem);
		const itemUrl = encoded ? `${host}/r/showcase-bundle?preset=${encoded}` : `${host}/r/showcase-bundle`;
		return `https://v0.dev/chat/api/open?url=${encodeURIComponent(itemUrl)}`;
	}, [designSystem, host]);

	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-fg-on-primary transition-colors hover:bg-primary-hover"
		>
			Open in <V0Logo />
		</a>
	);
}

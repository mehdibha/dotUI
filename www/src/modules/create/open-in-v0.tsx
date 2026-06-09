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

import { V0Icon } from "@/components/icons/v0";

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
			{/* h-3 (not h-3.5): V0Icon's viewBox is cropped to the glyph, so it renders
			    optically larger than the padded legacy lockup it replaced. */}
			Open in <V0Icon className="h-3 w-auto" />
		</a>
	);
}

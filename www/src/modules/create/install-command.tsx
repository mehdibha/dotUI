/**
 * Footer block on the customizer panel: shows the `shadcn init` command
 * the user can paste into their project to install the current preset.
 *
 * Updates live as the design system changes (the encoded preset is part of
 * the URL fragment behind `?preset=`). Provides a one-click copy.
 */

import { useEffect, useMemo, useState } from "react";

import { CheckIcon, CopyIcon } from "lucide-react";
import * as ButtonPrimitives from "react-aria-components/Button";

import { useDesignSystem } from "./preset";
import { encodePreset } from "./preset/codec";

const DEFAULT_REGISTRY_HOST = "https://dotui.com";

function getRegistryHost(): string {
	if (typeof window === "undefined") return DEFAULT_REGISTRY_HOST;
	// Honour the deployed origin so local dev (http://localhost:4444) shows the
	// command pointing back at itself.
	const { origin } = window.location;
	if (origin === "null" || origin === "http://localhost" || origin.startsWith("file:")) {
		return DEFAULT_REGISTRY_HOST;
	}
	return origin;
}

export function InstallCommand() {
	const { designSystem } = useDesignSystem();
	const [host, setHost] = useState(DEFAULT_REGISTRY_HOST);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		setHost(getRegistryHost());
	}, []);

	const command = useMemo(() => {
		const encoded = encodePreset(designSystem);
		const url = encoded ? `${host}/r/init.json?preset=${encoded}` : `${host}/r/init.json`;
		// `shadcn add <url>` (not `init`) is the working invocation:
		//  - it works on any project that already has a components.json (from a
		//    prior `npx shadcn init`),
		//  - it installs `src/styles/dotui-base.css` and `src/lib/utils.ts`,
		//  - per-component `add` follows transitive deps as absolute URLs.
		return `npx shadcn add ${url}`;
	}, [designSystem, host]);

	async function copy() {
		try {
			await navigator.clipboard.writeText(command);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1500);
		} catch {
			/* no-op on clipboard failure */
		}
	}

	return (
		<ButtonPrimitives.Button
			onPress={copy}
			aria-label="Copy install command"
			className="group/install flex w-full items-start gap-2 rounded-md border bg-bg p-2 text-left font-mono text-[11px] leading-tight text-fg-muted hover:bg-neutral-hover"
		>
			<span className="flex-1 break-all">{command}</span>
			<span className="mt-0.5 text-fg-muted/60 group-hover/install:text-fg">
				{copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
			</span>
		</ButtonPrimitives.Button>
	);
}

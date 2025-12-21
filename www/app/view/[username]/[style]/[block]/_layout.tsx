"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { UNSAFE_PortalProvider as PortalProvider } from "react-aria";

import { StyleProvider } from "@dotui/core/react";
import { cn } from "@dotui/registry/lib/utils";
import type { StyleConfig } from "@dotui/core/schemas";

import { useMounted } from "@/hooks/use-mounted";
import { usePreferences } from "@/modules/preferences/preferences-atom";

// TODO: Fix style-editor types for new config schema
// import { useDraftStyle } from "@/modules/style-editor/draft-style-atom";

// Interface for style from DB
interface StyleFromDB {
	id?: string;
	name?: string;
	config: StyleConfig;
}

export const BlockViewLayout = ({
	style: styleProp,
	styleSlug: _styleSlug,
	children,
}: {
	style: StyleFromDB;
	styleSlug: string;
	children: React.ReactNode;
}) => {
	const overlayContainerRef = React.useRef(null);

	const searchParams = useSearchParams();
	const shouldUseActiveMode = Boolean(searchParams.get("mode"));
	const shouldUseLiveStyle = Boolean(searchParams.get("live"));
	const view = Boolean(searchParams.get("view"));

	const { activeMode } = usePreferences();
	const isMounted = useMounted();
	// TODO: Re-enable when style-editor is fixed for new config schema
	// const { draftStyle } = useDraftStyle(styleSlug);
	const { resolvedTheme } = useTheme();

	// Get config from style
	const config = React.useMemo((): StyleConfig | null => {
		// TODO: Re-enable live style when style-editor is fixed
		// if (shouldUseLiveStyle && draftStyle) {
		// 	return draftStyle as unknown as StyleConfig;
		// }
		void shouldUseLiveStyle; // Silence unused variable warning
		if (!styleProp?.config) return null;
		return styleProp.config;
	}, [styleProp, shouldUseLiveStyle]);

	const effectiveMode = shouldUseActiveMode ? activeMode : (resolvedTheme as "light" | "dark");

	React.useLayoutEffect(() => {
		if (effectiveMode && config) {
			document.documentElement.style.colorScheme = effectiveMode;
			if (effectiveMode === "light") {
				document.documentElement.classList.remove("dark");
			} else {
				document.documentElement.classList.add("dark");
			}

			// TODO: We should also update the body color
		}
	}, [effectiveMode, config]);

	if (!config || !effectiveMode || !isMounted) return null;

	return (
		<>
			<StyleProvider ref={overlayContainerRef} config={config} mode={effectiveMode} unstyled className="text-fg" />
			<PortalProvider getContainer={() => overlayContainerRef.current}>
				<StyleProvider
					config={config}
					mode={effectiveMode}
					className={cn("flex min-h-screen items-center justify-center", view && "p-4")}
				>
					{children}
				</StyleProvider>
			</PortalProvider>
		</>
	);
};

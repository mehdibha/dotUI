"use client";

import { useRef, useLayoutEffect } from "react";
import { UNSAFE_PortalProvider as PortalProvider } from "react-aria";
import { StyleProvider } from "@dotui/core/react";
import type { StyleConfig } from "@dotui/core/schemas";
import { cn } from "@dotui/registry/lib/utils";

interface BlockViewLayoutProps {
	config: StyleConfig | null;
	mode?: "light" | "dark";
	view?: boolean;
	children: React.ReactNode;
}

export function BlockViewLayout({
	config,
	mode,
	view,
	children,
}: BlockViewLayoutProps) {
	const overlayRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (mode) {
			document.documentElement.style.colorScheme = mode;
			document.documentElement.classList.toggle("dark", mode === "dark");
		}
	}, [mode]);

	if (!config) {
		return (
			<div className="flex h-screen items-center justify-center">
				<span className="text-fg-muted">Loading style...</span>
			</div>
		);
	}

	return (
		<>
			<StyleProvider
				ref={overlayRef}
				config={config}
				mode={mode}
				unstyled
				className="text-fg"
			/>
			<PortalProvider getContainer={() => overlayRef.current}>
				<StyleProvider
					config={config}
					mode={mode}
					className={cn(
						"flex min-h-screen items-center justify-center",
						view && "p-4",
					)}
				>
					{children}
				</StyleProvider>
			</PortalProvider>
		</>
	);
}

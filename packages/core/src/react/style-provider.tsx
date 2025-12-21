"use client";

import React from "react";

import type { StyleConfig } from "@dotui/core/schemas/style";
import { StyleContext } from "./context";

export interface StyleProviderProps extends Omit<React.ComponentProps<"div">, "style"> {
	config: StyleConfig;
	mode?: "light" | "dark";
	unstyled?: boolean;
	children?: React.ReactNode;
}

/**
 * Main style provider that injects CSS variables and provides style context.
 * Takes a StyleConfig and applies theme to all children.
 *
 * TODO: Implement in Phase 4:
 * - Generate CSS vars from config.theme.colors using createTheme()
 * - Inject CSS vars into DOM via inline style
 * - Handle mode prop (light/dark)
 * - Handle unstyled prop
 */
export function StyleProvider({
	config,
	mode: _mode,
	unstyled: _unstyled,
	children,
	...props
}: StyleProviderProps) {
	// TODO: Implement CSS vars generation and injection
	void _mode;
	void _unstyled;

	return (
		<StyleContext.Provider value={config}>
			<div {...props}>{children}</div>
		</StyleContext.Provider>
	);
}

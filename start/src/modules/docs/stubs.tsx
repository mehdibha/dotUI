/**
 * Stub components for docs module.
 * TODO: Implement properly when dependencies are ready.
 */

import type React from "react";

import { cn } from "@dotui/registry/lib/utils";

// =============================================================================
// InteractiveDemo (stub) - depends on References migration
// =============================================================================

export interface InteractiveDemoProps extends React.ComponentProps<"div"> {
	component: string;
}

export function InteractiveDemo({ className, component, ...props }: InteractiveDemoProps) {
	return (
		<div className={cn("rounded-lg border bg-muted/50 p-8 text-center text-fg-muted", className)} {...props}>
			<p className="text-sm">Interactive Demo: {component}</p>
			<p className="mt-1 text-xs">Coming soon</p>
		</div>
	);
}

// =============================================================================
// Examples (stub) - grid of examples
// =============================================================================

export interface ExamplesProps extends React.ComponentProps<"div"> {
	component: string;
}

export function Examples({ className, component, ...props }: ExamplesProps) {
	return (
		<div className={cn("rounded-lg border bg-muted/50 p-4 text-center text-fg-muted", className)} {...props}>
			<p className="text-sm">Examples for: {component}</p>
		</div>
	);
}

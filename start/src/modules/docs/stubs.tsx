/**
 * Stub components for docs module.
 * TODO: Implement properly when styles module is ready.
 */

import type React from "react";

import { cn } from "@dotui/registry/lib/utils";

// =============================================================================
// DEMO (stub)
// =============================================================================

// Demo - depends on styles module
export interface DemoProps extends React.ComponentProps<"div"> {
	component: string;
	variant?: string;
}

export function Demo({ className, component, variant, ...props }: DemoProps) {
	return (
		<div className={cn("rounded-lg border bg-muted/50 p-8 text-center text-fg-muted", className)} {...props}>
			<p className="text-sm">
				Demo: {component}
				{variant ? ` (${variant})` : ""}
			</p>
			<p className="mt-1 text-xs">Coming soon</p>
		</div>
	);
}

// InteractiveDemo - depends on styles module
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

// Example - single example display
export interface ExampleProps extends React.ComponentProps<"div"> {
	component: string;
	name: string;
}

export function Example({ className, component, name, ...props }: ExampleProps) {
	return (
		<div className={cn("rounded-lg border bg-muted/50 p-4 text-center text-fg-muted", className)} {...props}>
			<p className="text-sm">
				Example: {component}/{name}
			</p>
		</div>
	);
}

// Examples - grid of examples
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

// Reference - API props table
export interface ReferenceProps {
	name: string;
	className?: string;
}

export function Reference({ name, className }: ReferenceProps) {
	return (
		<div className={cn("rounded-lg border bg-muted/50 p-4 text-center text-fg-muted", className)}>
			<p className="text-sm">API Reference: {name}</p>
			<p className="mt-1 text-xs">Coming soon</p>
		</div>
	);
}

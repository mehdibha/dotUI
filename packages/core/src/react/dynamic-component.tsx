"use client";

import React, { createContext, useContext, useMemo } from "react";

import type { VariantsConfig } from "@dotui/core/schemas/variants";
import { VARIANTS } from "@dotui/core/__registry__/variants";
import { StyleContext } from "./context";

// ============================================================================
// Types
// ============================================================================

type VariantKey = keyof typeof VARIANTS;

export type VariantsMap<Props, _V extends string = string> = Record<
	string,
	React.LazyExoticComponent<React.ComponentType<Props>>
>;

export interface CreateDynamicComponentOptions {
	/** Disable skeleton fallback during loading */
	disableSkeleton?: boolean;
}

// ============================================================================
// DisableSuspense Context
// ============================================================================

/**
 * Context to prevent nested Suspense boundaries.
 * React Aria components use context, so if a child resolves before
 * its parent, it breaks. This context ensures only the top-level
 * component uses Suspense.
 */
const DisableSuspenseContext = createContext<boolean>(false);

export function DisableSuspense({ children }: { children: React.ReactNode }) {
	return <DisableSuspenseContext value>{children}</DisableSuspenseContext>;
}

function useDisableSuspense(): boolean {
	return useContext(DisableSuspenseContext);
}

// ============================================================================
// Default Variants Provider (for skeleton fallback)
// ============================================================================

const DefaultVariantsContext = createContext<VariantsConfig | null>(null);

function DefaultVariantsProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	// Provide empty variants during skeleton to prevent variant resolution
	const defaultVariants = useMemo(() => ({}), []);
	return (
		<DefaultVariantsContext value={defaultVariants}>
			{children}
		</DefaultVariantsContext>
	);
}

// ============================================================================
// Skeleton Component
// ============================================================================

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
	show?: boolean;
}

function Skeleton({ className, show = true, children, ...props }: SkeletonProps) {
	if (!show) return <>{children}</>;

	return (
		<div
			className={[
				"relative block animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800",
				children && "h-auto text-transparent *:invisible",
				className,
			]
				.filter(Boolean)
				.join(" ")}
			{...props}
		>
			{children}
		</div>
	);
}

// ============================================================================
// Error Fallback
// ============================================================================

interface ErrorFallbackProps {
	componentName: string;
	variantName: string;
}

function ErrorFallback({ componentName, variantName }: ErrorFallbackProps) {
	return (
		<div className="flex items-center justify-center rounded-md border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
			<div className="text-sm">
				<span className="font-bold">Error rendering component:</span>
				<ul className="mt-1 list-inside list-disc">
					<li>Component: {componentName}</li>
					<li>Variant: {variantName}</li>
				</ul>
			</div>
		</div>
	);
}

// ============================================================================
// Error Boundary
// ============================================================================

interface ErrorBoundaryProps {
	fallback: React.ReactNode;
	children: React.ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			return this.props.fallback;
		}
		return this.props.children;
	}
}

// ============================================================================
// createDynamicComponent
// ============================================================================

/**
 * Creates a dynamic component that switches between variants based on StyleProvider context.
 *
 * @param componentName - The component key (must match a key in VARIANTS)
 * @param displayName - Display name for the component (used in React DevTools)
 * @param DefaultComponent - The default component to render
 * @param variants - Map of variant names to lazy-loaded components
 * @param options - Additional options
 */
export function createDynamicComponent<Props extends object, V extends string = string>(
	componentName: VariantKey,
	displayName: string,
	DefaultComponent: React.ComponentType<Props>,
	variants: VariantsMap<Props, V>,
	options?: CreateDynamicComponentOptions,
): React.FC<Props> {
	const { disableSkeleton = false } = options ?? {};

	// Get default variant from registry
	const variantConfig = VARIANTS[componentName];
	const defaultVariant = variantConfig?.default ?? "basic";

	const Component: React.FC<Props> = (props) => {
		const styleConfig = useContext(StyleContext);
		const disableSuspense = useDisableSuspense();

		// Get variant from StyleProvider context, fallback to default
		const selectedVariant = styleConfig?.variants?.[componentName as keyof VariantsConfig];
		const variantName = selectedVariant ?? defaultVariant;

		// Get className for skeleton sizing (if props has className)
		const className =
			"className" in props && typeof props.className === "string"
				? props.className
				: undefined;

		// Check if we should use a lazy variant
		const LazyComponent = variantName !== defaultVariant ? variants[variantName] : null;

		// No lazy variant needed - render default component directly
		if (!LazyComponent) {
			return <DefaultComponent {...props} />;
		}

		// Render lazy variant with Suspense
		if (disableSuspense) {
			return <LazyComponent {...props} />;
		}

		return (
			<ErrorBoundary
				fallback={
					<ErrorFallback componentName={componentName} variantName={variantName} />
				}
			>
				<React.Suspense
					fallback={
						<Skeleton show={!disableSkeleton} className={className}>
							<DefaultVariantsProvider>
								<DefaultComponent {...props} />
							</DefaultVariantsProvider>
						</Skeleton>
					}
				>
					<DisableSuspense>
						<LazyComponent {...props} />
					</DisableSuspense>
				</React.Suspense>
			</ErrorBoundary>
		);
	};

	Component.displayName = `Dynamic(${displayName})`;

	return Component;
}

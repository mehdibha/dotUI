"use client";

import React, { createContext, useContext, useMemo } from "react";

import type { VariantsConfig } from "../schemas/variants";

interface VariantsContextValue {
	variants: VariantsConfig;
	getVariant: (componentName: string) => string | undefined;
}

const VariantsContext = createContext<VariantsContextValue | null>(null);

export interface VariantsProviderProps {
	variants: VariantsConfig;
	children: React.ReactNode;
}

export function VariantsProvider({ variants, children }: VariantsProviderProps) {
	const value = useMemo(
		() => ({
			variants,
			getVariant: (componentName: string) =>
				variants[componentName as keyof VariantsConfig],
		}),
		[variants],
	);

	return <VariantsContext value={value}>{children}</VariantsContext>;
}

export function useVariants(): VariantsContextValue {
	const context = useContext(VariantsContext);
	if (!context) {
		throw new Error("useVariants must be used within a VariantsProvider");
	}
	return context;
}

export function useVariant(componentName: string): string | undefined {
	const context = useContext(VariantsContext);
	// Return undefined if not in a provider (allows components to work standalone)
	return context?.getVariant(componentName);
}

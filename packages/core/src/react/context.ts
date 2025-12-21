import { createContext, useContext } from "react";
import type { StyleConfig } from "@dotui/core/schemas/style";

/**
 * Internal context for StyleProvider
 */
export const StyleContext = createContext<StyleConfig | null>(null);

/**
 * Hook to get the current StyleConfig from StyleProvider context.
 * Returns null if not within a StyleProvider.
 */
export function useStyleConfig(): StyleConfig | null {
	return useContext(StyleContext);
}

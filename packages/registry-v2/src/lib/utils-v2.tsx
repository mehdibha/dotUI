"use client";

import * as React from "react";
import { mergeProps } from "react-aria";
import { useSlottedContext } from "react-aria-components";

/**
 * Creates a variant context system for react-aria components.
 *
 * @param ariaContext - The react-aria context to wrap (e.g., ToggleButtonContext)
 * @returns A tuple of [Provider, useContextProps] hook
 *
 * @example
 * ```tsx
 * const [ToggleButtonProvider, useContextProps] =
 *   createVariantsContext<ToggleButtonVariants, ToggleButtonProps>(AriaToggleButtonContext);
 * ```
 */
export function createVariantsContext<
  TVariants extends Record<string, any>,
  TAriaProps extends Record<string, any> = Record<string, any>,
>(ariaContext: React.Context<any>) {
  // Create a context for our custom variant props
  const VariantsContext = React.createContext<Partial<TVariants>>({});

  // Provider component that wraps both contexts
  type ProviderProps = Partial<TVariants> &
    Partial<TAriaProps> & {
      children: React.ReactNode;
    };

  const Provider = ({ children, ...props }: ProviderProps) => {
    // Separate variant props from react-aria props
    const variantKeys = Object.keys(props).filter((key) => {
      // This is a simple heuristic - you might want to pass variant keys explicitly
      // For now, we assume all props that aren't standard HTML/React props are variants
      return !["children", "value"].includes(key);
    });

    const variantProps: Partial<TVariants> = {};
    const ariaProps: Record<string, any> = {};

    Object.entries(props).forEach(([key, value]) => {
      if (variantKeys.includes(key)) {
        variantProps[key as keyof TVariants] = value;
      } else {
        ariaProps[key] = value;
      }
    });

    return (
      <VariantsContext.Provider value={variantProps}>
        <ariaContext.Provider value={ariaProps}>
          {children}
        </ariaContext.Provider>
      </VariantsContext.Provider>
    );
  };

  // Hook to merge context variants with local props
  function useContextProps<TProps extends Partial<TVariants>>(
    localProps: TProps,
  ): TProps {
    const contextVariants = React.useContext(VariantsContext);
    const ariaProps = useSlottedContext(ariaContext, localProps.slot) || {};

    // Merge context with local props (local props win)
    return mergeProps(contextVariants, ariaProps, localProps) as TProps;
  }

  return [Provider, useContextProps] as const;
}

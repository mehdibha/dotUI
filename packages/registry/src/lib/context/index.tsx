import * as React from "react";
import { mergeProps } from "react-aria";
import { useSlottedContext } from "react-aria-components";

export interface CreateContextOptions {
  strict?: boolean;
  errorMessage?: string;
  name?: string;
}

export type CreateContextReturn<T> = [
  React.Provider<T>,
  (consumerName: string) => T,
  React.Context<T>,
];

/**
 * Creates a named context, provider, and hook.
 *
 * @param options create context options
 */
export function createContext<ContextType>(options: CreateContextOptions = {}) {
  const { name, strict = true } = options;

  const Context = React.createContext<ContextType | undefined>(undefined);

  Context.displayName = name;

  function useContext(consumerName?: string) {
    const context = React.useContext(Context);

    if (!context && strict) {
      const error = new Error(
        `\`${consumerName}\` must be used within \`${name}\``,
      );

      error.name = "ContextError";
      throw error;
    }

    return context;
  }

  return [
    Context.Provider,
    useContext,
    Context,
  ] as CreateContextReturn<ContextType>;
}

export function createScopedContext<ContextValueType extends object | null>(
  rootComponentName: string,
  defaultContext?: ContextValueType,
) {
  const Context = React.createContext<ContextValueType | undefined>(
    defaultContext,
  );

  const Provider: React.FC<ContextValueType & { children: React.ReactNode }> = (
    props,
  ) => {
    const { children, ...context } = props;
    const value = React.useMemo(
      () => context,
      // biome-ignore lint/correctness/useExhaustiveDependencies: we only want to memoize when the context values change
      Object.values(context),
    ) as ContextValueType;
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  Provider.displayName = `${rootComponentName}Provider`;

  function useContext(consumerName: string) {
    const context = React.useContext(Context);
    if (context) return context;
    if (defaultContext !== undefined) return defaultContext;
    // if a defaultContext wasn't specified, it's a required context.
    throw new Error(
      `\`${consumerName}\` must be used within \`${rootComponentName}\``,
    );
  }

  return [Provider, useContext] as const;
}

export function createOptionalScopedContext<
  ContextValueType extends object | null,
>(rootComponentName: string, defaultContext?: ContextValueType) {
  const Context = React.createContext<ContextValueType | undefined>(
    defaultContext,
  );

  const Provider: React.FC<ContextValueType & { children: React.ReactNode }> = (
    props,
  ) => {
    const { children, ...context } = props;
    // Only re-memoize when prop values change
    const value = React.useMemo(
      () => context,
      // biome-ignore lint/correctness/useExhaustiveDependencies: we only want to memoize when the context values change
      Object.values(context),
    ) as ContextValueType;
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  Provider.displayName = `${rootComponentName}Provider`;

  function useContext() {
    const context = React.useContext(Context);
    if (context) return context;
    if (defaultContext !== undefined) return defaultContext;
    // if a defaultContext wasn't specified, it's a required context.
    return {};
  }

  return [Provider, useContext] as const;
}

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

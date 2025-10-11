import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SlotsToClassNames<T extends (...args: any[]) => any> = Partial<
  Record<keyof ReturnType<T>, ClassValue>
>;

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

  function useContext(consumerName: string) {
    const context = React.useContext(Context);

    if (!context && strict) {
      const error = new Error(
        `\`${consumerName}\` must be used within \`${name}\``,
      );

      error.name = "ContextError";
      Error.captureStackTrace?.(error, useContext);
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
    // Only re-memoize when prop values change
    const value = React.useMemo(
      () => context,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(context),
    ) as ContextValueType;
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  Provider.displayName = rootComponentName + "Provider";

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(context),
    ) as ContextValueType;
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  Provider.displayName = rootComponentName + "Provider";

  function useContext() {
    const context = React.useContext(Context);
    if (context) return context;
    if (defaultContext !== undefined) return defaultContext;
    // if a defaultContext wasn't specified, it's a required context.
    return {};
  }

  return [Provider, useContext] as const;
}

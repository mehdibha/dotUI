import * as React from "react";
import { type ClassValue, clsx } from "clsx";
import { composeRenderProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  tailwind: string
): string | ((v: T) => string) {
  return composeRenderProps(className, (className) =>
    twMerge(tailwind, className)
  );
}

export function createScopedContext<ContextValueType extends object | null>(
  rootComponentName: string,
  defaultContext?: ContextValueType
) {
  const Context = React.createContext<ContextValueType | undefined>(
    defaultContext
  );

  const Provider: React.FC<ContextValueType & { children: React.ReactNode }> = (
    props
  ) => {
    const { children, ...context } = props;
    // Only re-memoize when prop values change
    const value = React.useMemo(
      () => context,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(context)
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
      `\`${consumerName}\` must be used within \`${rootComponentName}\``
    );
  }

  return [Provider, useContext] as const;
}

export function createOptionalScopedContext<
  ContextValueType extends object | null,
>(rootComponentName: string, defaultContext?: ContextValueType) {
  const Context = React.createContext<ContextValueType | undefined>(
    defaultContext
  );

  const Provider: React.FC<ContextValueType & { children: React.ReactNode }> = (
    props
  ) => {
    const { children, ...context } = props;
    // Only re-memoize when prop values change
    const value = React.useMemo(
      () => context,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(context)
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

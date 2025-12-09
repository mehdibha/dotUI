"use client";

import * as React from "react";

import { createVariants } from "../core";
import type { Variants, VariantsDefinition } from "../types";

const VariantsContext = React.createContext<Variants | null>(null);

export const VariantsProvider = ({
  children,
  variants: variantsDefinition,
}: {
  children: React.ReactNode;
  variants: VariantsDefinition;
}) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
  const variants = React.useMemo(
    () => createVariants(variantsDefinition),
    [JSON.stringify(variantsDefinition)],
  );

  return <VariantsContext value={variants}>{children}</VariantsContext>;
};

export const useVariant = <K extends keyof Variants>(
  componentName: K,
): Variants[K] | null => {
  const variants = React.useContext(VariantsContext);
  if (!variants) {
    return null;
  }
  return variants[componentName];
};

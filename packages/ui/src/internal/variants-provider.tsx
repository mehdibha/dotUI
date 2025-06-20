import React from "react";

import type { Variants } from "@dotui/style-engine/types";

const VariantsContext = React.createContext<Variants | null>(null);

export const VariantsProvider = ({
  children,
  variants,
}: {
  children: React.ReactNode;
  variants: Variants;
}) => {
  return <VariantsContext value={variants}>{children}</VariantsContext>;
};

export const useVariant = (componentName: keyof Variants) => {
  const variants = React.useContext(VariantsContext);
  if (!variants) {
    return null;
  }
  return variants[componentName];
};

import React from "react";

import { createVariants } from "@dotui/registry/_style-system/core";
import type {
  Variants,
  VariantsDefinition,
} from "@dotui/registry/_style-system/types";

const VariantsContext = React.createContext<Variants | null>(null);

export const VariantsProvider = ({
  children,
  variants: variantsDefinition,
}: {
  children: React.ReactNode;
  variants: VariantsDefinition;
}) => {
  const variants = React.useMemo(
    () => createVariants(variantsDefinition),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(variantsDefinition)],
  );

  return <VariantsContext value={variants}>{children}</VariantsContext>;
};

export const useVariant = (componentName: keyof Variants) => {
  const variants = React.useContext(VariantsContext);
  if (!variants) {
    return null;
  }
  return variants[componentName];
};

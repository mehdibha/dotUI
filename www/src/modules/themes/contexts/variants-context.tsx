import React from "react";
import { Variants } from "@/modules/themes/types";

const DEFAULT_VARIANTS: Variants = {
  global: "accent",
};

const VariantsContext = React.createContext<{
  variants: Variants;
}>({ variants: DEFAULT_VARIANTS });

export const VariantsProvider = ({
  variants,
  children,
}: {
  variants?: Partial<Variants>;
  children?: React.ReactNode;
}) => {
  return (
    <VariantsContext
      value={{ variants: { ...DEFAULT_VARIANTS, ...(variants ?? {}) } }}
    >
      {children}
    </VariantsContext>
  );
};

export const useLocalVariants = () => React.useContext(VariantsContext);

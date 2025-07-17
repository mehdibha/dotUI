import React from "react";

import { focusVariants } from "../lib/focus-styles";
import type { FocusVariant } from "../lib/focus-styles";

const FocusContext = React.createContext<FocusVariant>("default");

export const FocusProvider = ({
  children,
  focusVariant = "default",
}: {
  children: React.ReactNode;
  focusVariant?: FocusVariant;
}) => {
  return (
    <FocusContext.Provider value={focusVariant}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocusVariant = () => {
  return React.useContext(FocusContext);
};

export const useFocusStyles = () => {
  const variant = useFocusVariant();
  return focusVariants[variant];
};

export const useDynamicFocusRing = () => {
  const focusStyles = useFocusStyles();
  return focusStyles.ring;
};

export const useDynamicFocusGroup = () => {
  const focusStyles = useFocusStyles();
  return focusStyles.group;
};

export const useDynamicFocusInput = () => {
  const focusStyles = useFocusStyles();
  return focusStyles.input;
};

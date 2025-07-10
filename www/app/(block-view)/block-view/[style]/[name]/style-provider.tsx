"use client";

import { StyleProvider as _StyleProvider } from "@dotui/ui";
import type { Style } from "@dotui/style-engine/types";

import { usePreferences } from "@/modules/styles/atoms/preferences-atom";

export const StyleProvider = ({
  style,
  children,
}: {
  style: Style;
  children: React.ReactNode;
}) => {
  const { currentMode } = usePreferences();
  return (
    <_StyleProvider style={style} mode={currentMode}>
      {children}
    </_StyleProvider>
  );
};

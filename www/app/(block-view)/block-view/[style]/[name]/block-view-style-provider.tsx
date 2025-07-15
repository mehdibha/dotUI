"use client";

import React from "react";

import { StyleProvider } from "@dotui/ui";
import type { StyleDefinition } from "@dotui/style-engine/types";

import { usePreferences } from "@/modules/styles/atoms/preferences-atom";

export const BlockViewStyleProvider = ({
  style,
  children,
}: {
  style: StyleDefinition;
  children: React.ReactNode;
}) => {
  const { currentMode } = usePreferences();
  // const { liveStyle } = useLiveStyleConsumer(styleSlug);

  // if (!liveStyle) {
  //   return children;
  // }

  return (
    <StyleProvider style={style} mode={currentMode}>
      {children}
    </StyleProvider>
  );
};

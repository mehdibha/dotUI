"use client";

import React from "react";

import { StyleProvider } from "@dotui/ui";
import type { StyleDefinition } from "@dotui/style-engine/types";

import { useLiveStyleConsumer } from "@/modules/styles/atoms/live-style-atom";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";

export const BlockViewStyleProvider = ({
  style,
  children,
}: {
  style: StyleDefinition;
  children: React.ReactNode;
}) => {
  const { currentMode } = usePreferences();
  const { liveStyle } = useLiveStyleConsumer(style.slug);

  return (
    <StyleProvider style={liveStyle ?? style} mode={currentMode}>
      {children}
    </StyleProvider>
  );
};

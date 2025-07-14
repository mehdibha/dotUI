"use client";

import React from "react";
import { useParams } from "next/navigation";

import { StyleProvider as _StyleProvider } from "@dotui/ui";
import type { StyleDefinition } from "@dotui/style-engine/types-v2";

import { useLiveStyleConsumer } from "@/modules/styles/atoms/live-style-atom";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";

export const StyleProvider = ({
  style,
  children,
}: {
  style: StyleDefinition;
  children: React.ReactNode;
}) => {
  const { currentMode } = usePreferences();
  const { style: styleSlug } = useParams<{ style: string }>();
  const { liveStyle } = useLiveStyleConsumer(styleSlug);

  if (!liveStyle) {
    return children;
  }

  return (
    <_StyleProvider style={liveStyle} mode={currentMode}>
      {children}
    </_StyleProvider>
  );
};

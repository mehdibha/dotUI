"use client";

import React from "react";
import { useParams } from "next/navigation";

import { StyleProvider as _StyleProvider } from "@dotui/ui";
import type { Style } from "@dotui/style-engine/types";

import { useLiveStyleConsumer } from "@/modules/styles/atoms/live-style-atom";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";

export const StyleProvider = ({
  style,
  children,
}: {
  style: Style;
  children: React.ReactNode;
}) => {
  const { currentMode } = usePreferences();
  const { style: styleSlug } = useParams<{ style: string }>();
  const { liveStyle } = useLiveStyleConsumer(styleSlug);

  const activeStyle = React.useMemo(
    () => liveStyle ?? style,
    [style, liveStyle],
  );

  return (
    <_StyleProvider style={activeStyle} mode={currentMode}>
      {children}
    </_StyleProvider>
  );
};

"use client";

import React from "react";
import { UNSAFE_PortalProvider as PortalProvider } from "react-aria";

import { StyleProvider } from "@dotui/ui";
import type { StyleDefinition } from "@dotui/style-engine/types";

import { useLiveStyleConsumer } from "@/modules/styles/atoms/live-style-atom";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";

export const BlockProviders = ({
  style: styleProp,
  children,
}: {
  style: StyleDefinition;
  children: React.ReactNode;
}) => {
  const overlayContainerRef = React.useRef(null);

  const { currentMode } = usePreferences();
  const { liveStyle } = useLiveStyleConsumer(styleProp.slug);

  const style = React.useMemo(() => {
    return liveStyle ?? styleProp;
  }, [liveStyle, styleProp]);

  return (
    <>
      <StyleProvider
        ref={overlayContainerRef}
        style={style}
        mode={currentMode}
        unstyled
      />
      <PortalProvider getContainer={() => overlayContainerRef.current}>
        <StyleProvider
          style={style}
          mode={currentMode}
          className="min-h-screen"
        >
          {children}
        </StyleProvider>
      </PortalProvider>
    </>
  );
};

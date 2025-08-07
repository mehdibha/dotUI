"use client";

import React from "react";
import { UNSAFE_PortalProvider as PortalProvider } from "react-aria";

import { StyleProvider } from "@dotui/ui";
import { DisableSuspense } from "@dotui/ui/helpers/create-dynamic-component";
import type { StyleDefinition } from "@dotui/style-engine/types";

import { useMounted } from "@/hooks/use-mounted";
import { useLiveStyleConsumer } from "@/modules/styles/atoms/live-style-atom";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";

export const BlockProviders = ({
  style: styleProp,
  children,
}: {
  style: StyleDefinition & { id?: string };
  children: React.ReactNode;
}) => {
  const overlayContainerRef = React.useRef(null);

  const { activeMode } = usePreferences();
  const isMounted = useMounted();
  const { liveStyle } = useLiveStyleConsumer(styleProp.id || "default");

  const style = React.useMemo(() => {
    return liveStyle ?? styleProp;
  }, [liveStyle, styleProp]);

  if (!isMounted || !style) return null;

  return (
    <>
      <StyleProvider
        ref={overlayContainerRef}
        style={style}
        mode={activeMode}
        unstyled
        className="text-fg"
      />
      <PortalProvider getContainer={() => overlayContainerRef.current}>
        <StyleProvider
          style={style}
          mode={activeMode}
          className="min-h-screen"
        >
          {children}
        </StyleProvider>
      </PortalProvider>
    </>
  );
};

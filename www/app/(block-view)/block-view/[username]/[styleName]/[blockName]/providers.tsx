"use client";

import React from "react";
import { useTheme } from "next-themes";
import { UNSAFE_PortalProvider as PortalProvider } from "react-aria";

import { StyleProvider } from "@dotui/ui";
import { DisableSuspense } from "@dotui/ui/helpers/create-dynamic-component";
import type { StyleDefinition } from "@dotui/style-engine/types";

import { useMounted } from "@/hooks/use-mounted";
import { useLiveStyleConsumer } from "@/modules/styles/atoms/live-style-atom";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";

export const BlockProviders = ({
  style: styleProp,
  styleSlug,
  children,
  useActiveMode = false,
}: {
  style: StyleDefinition & { id?: string };
  styleSlug: string;
  children: React.ReactNode;
  useActiveMode?: boolean;
}) => {
  const overlayContainerRef = React.useRef(null);

  const { activeMode } = usePreferences();
  const isMounted = useMounted();
  const { liveStyle } = useLiveStyleConsumer(styleSlug);
  const { resolvedTheme } = useTheme();

  const style = React.useMemo(() => {
    return liveStyle ?? styleProp;
  }, [liveStyle, styleProp]);

  const mode = useActiveMode
    ? activeMode
    : (resolvedTheme as "light" | "dark" | undefined);

  if (!isMounted || !style) return null;

  return (
    <>
      <StyleProvider
        ref={overlayContainerRef}
        style={style}
        mode={mode}
        unstyled
        className="text-fg"
      />
      <PortalProvider getContainer={() => overlayContainerRef.current}>
        <StyleProvider
          style={style}
          mode={mode}
          className="flex min-h-screen items-center justify-center"
        >
          {children}
        </StyleProvider>
      </PortalProvider>
    </>
  );
};

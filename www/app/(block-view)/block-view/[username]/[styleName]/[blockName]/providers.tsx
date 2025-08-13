"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { UNSAFE_PortalProvider as PortalProvider } from "react-aria";

import { StyleProvider } from "@dotui/ui";
import type { StyleDefinition } from "@dotui/style-engine/types";

import { useMounted } from "@/hooks/use-mounted";
import { useLiveStyleConsumer } from "@/modules/styles/atoms/live-style-atom";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";

export const BlockProviders = ({
  style: styleProp,
  styleSlug,
  children,
}: {
  style: StyleDefinition & { id?: string };
  styleSlug: string;
  children: React.ReactNode;
}) => {
  const overlayContainerRef = React.useRef(null);

  const searchParams = useSearchParams();
  const shouldUseActiveMode = Boolean(searchParams.get("mode"));
  const shouldUseLiveStyle = Boolean(searchParams.get("live"));

  const { activeMode } = usePreferences();
  const isMounted = useMounted();
  const { liveStyle } = useLiveStyleConsumer(styleSlug);
  const { resolvedTheme } = useTheme();

  const style = React.useMemo(() => {
    return shouldUseLiveStyle ? (liveStyle ?? styleProp) : styleProp;
  }, [liveStyle, styleProp, shouldUseLiveStyle]);

  const effectiveMode = shouldUseActiveMode
    ? activeMode
    : resolvedTheme === "dark"
      ? "dark"
      : "light";

  if (!isMounted || !style) return null;

  return (
    <>
      <StyleProvider
        ref={overlayContainerRef}
        style={style}
        mode={effectiveMode}
        unstyled
        className="text-fg"
      />
      <PortalProvider getContainer={() => overlayContainerRef.current}>
        <StyleProvider
          style={style}
          mode={effectiveMode}
          className="flex min-h-screen items-center justify-center"
        >
          {children}
        </StyleProvider>
      </PortalProvider>
    </>
  );
};

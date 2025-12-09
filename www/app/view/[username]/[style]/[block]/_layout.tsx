"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { UNSAFE_PortalProvider as PortalProvider } from "react-aria";

import { cn } from "@dotui/registry/lib/utils";
import { StyleProvider } from "@dotui/registry/providers";
import type { StyleDefinition } from "@dotui/style-system/types";

import { useMounted } from "@/hooks/use-mounted";
import { usePreferences } from "@/modules/preferences/preferences-atom";
import { useDraftStyle } from "@/modules/style-editor/draft-style-atom";

export const BlockViewLayout = ({
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
  const view = Boolean(searchParams.get("view"));

  const { activeMode } = usePreferences();
  const isMounted = useMounted();
  const { draftStyle } = useDraftStyle(styleSlug);
  const { resolvedTheme } = useTheme();

  const style = React.useMemo(() => {
    return shouldUseLiveStyle ? (draftStyle ?? styleProp) : styleProp;
  }, [draftStyle, styleProp, shouldUseLiveStyle]);

  const effectiveMode = shouldUseActiveMode
    ? activeMode
    : (resolvedTheme as "light" | "dark");

  React.useLayoutEffect(() => {
    if (effectiveMode && style) {
      document.documentElement.style.colorScheme = effectiveMode;
      if (effectiveMode === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }

      // TODO: We should also update the body color
    }
  }, [effectiveMode, style]);

  if (!style || !effectiveMode || !isMounted) return null;

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
          className={cn(
            "flex min-h-screen items-center justify-center",
            view && "p-4",
          )}
        >
          {children}
        </StyleProvider>
      </PortalProvider>
    </>
  );
};

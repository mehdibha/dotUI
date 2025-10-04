"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { UNSAFE_PortalProvider as PortalProvider } from "react-aria";

import { StyleProvider } from "@dotui/registry";
import { cn } from "@dotui/registry/lib/utils";
import type { StyleDefinition } from "@dotui/registry/style-system/types";

import { useMounted } from "@/hooks/use-mounted";
import { useDraftStyle } from "@/modules/style-editor/atoms/draft-style-atom";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";

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
  }, [effectiveMode, style, resolvedTheme]);

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

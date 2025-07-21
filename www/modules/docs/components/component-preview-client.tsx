"use client";

import React from "react";

import { DEFAULT_THEME } from "@dotui/style-engine/constants";
import { useCurrentStyle } from "@dotui/ui";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { ThemeProvider } from "@dotui/ui/helpers/theme-provider";

import { ThemeModeSwitch } from "@/components/theme-mode-switch";
import { useHorizontalResize } from "@/hooks/use-horizontal-resize";
import { useMounted } from "@/hooks/use-mounted";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { StyleSelector } from "@/modules/styles/components/style-selector";

export const Loader = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return <Skeleton show={!isMounted}>{children}</Skeleton>;
};

export const ComponentWrapper = ({
  suspense,
  fallback = <Skeleton className="h-40" />,
  children,
}: {
  suspense?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) => {
  if (suspense) {
    return <React.Suspense fallback={fallback}>{children}</React.Suspense>;
  }
  return children;
};

export const ResizableContainer = ({
  children,
  resizable,
}: {
  children: React.ReactNode;
  resizable?: boolean;
}) => {
  const { containerRef, width, handleMouseDown } = useHorizontalResize({
    // minWidth: 100, // Optional custom minimum width
  });

  if (!resizable) return children;

  return (
    <div
      className="relative overflow-hidden"
      ref={containerRef}
      style={{ width: width !== null ? `${width}px` : undefined }}
    >
      <div
        onMouseDown={handleMouseDown}
        className="h-15 bg-bg-neutral hover:bg-bg-neutral-hover active:bg-bg-neutral-active absolute right-2 top-1/2 z-20 w-2 -translate-y-1/2 cursor-col-resize rounded-full shadow-sm"
      />
      {children}
    </div>
  );
};

export const ComponentPreviewHeader = () => {
  const { currentMode, setCurrentMode } = usePreferences();
  const style = useCurrentStyle();
  const isMounted = useMounted();

  return (
    <ThemeProvider
      theme={DEFAULT_THEME}
      mode={currentMode}
      className="absolute bg-transparent left-0 top-0 z-20 flex w-full items-center justify-between gap-2 p-2"
    >
      {isMounted && (
        <StyleSelector buttonProps={{ size: "sm", className: "text-xs" }} />
      )}
      {style && style.theme.colors.activeModes.length > 1 && isMounted && (
        <ThemeModeSwitch
          size="sm"
          shape="square"
          isSelected={currentMode === "dark"}
          onChange={(isSelected) =>
            setCurrentMode(isSelected ? "dark" : "light")
          }
        />
      )}
    </ThemeProvider>
  );
};

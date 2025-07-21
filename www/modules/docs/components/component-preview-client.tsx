"use client";

import React from "react";

import { DEFAULT_VARIANTS_DEFINITION } from "@dotui/style-engine/constants";
import { useCurrentStyle } from "@dotui/ui";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { VariantsProvider } from "@dotui/ui/helpers/variants-provider";

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
        className="absolute top-1/2 right-2 z-20 h-15 w-2 -translate-y-1/2 cursor-col-resize rounded-full bg-bg-neutral shadow-sm hover:bg-bg-neutral-hover active:bg-bg-neutral-active"
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
    <div className="absolute top-0 left-0 z-20 flex w-full items-start justify-between gap-2 p-2">
      <VariantsProvider variants={DEFAULT_VARIANTS_DEFINITION}>
        <StyleSelector buttonProps={{ size: "sm", className: "text-xs" }} />
      </VariantsProvider>
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
    </div>
  );
};

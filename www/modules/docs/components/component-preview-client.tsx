"use client";

import type React from "react";

import { useCurrentStyle, VariantsProvider } from "@dotui/registry";
import { DEFAULT_VARIANTS_DEFINITION } from "@dotui/registry/style-system/constants";

import { ThemeModeSwitch } from "@/components/ui/theme-mode-switch";
import { useHorizontalResize } from "@/hooks/use-horizontal-resize";
import { useMounted } from "@/hooks/use-mounted";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { ActiveStyleSelector } from "@/modules/styles/components/active-style-selector";

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
        className="absolute top-1/2 right-2 z-20 h-15 w-2 -translate-y-1/2 cursor-col-resize rounded-full bg-neutral shadow-sm hover:bg-neutral-hover active:bg-neutral-active"
      />
      {children}
    </div>
  );
};

export const ComponentPreviewHeader = () => {
  const { activeMode, setActiveMode } = usePreferences();
  const style = useCurrentStyle();
  const isMounted = useMounted();

  return (
    <div className="absolute top-0 left-0 z-20 flex w-full items-start justify-between gap-2 p-2">
      <VariantsProvider variants={DEFAULT_VARIANTS_DEFINITION}>
        <ActiveStyleSelector
          className="w-36"
          buttonProps={{ size: "md", className: "text-xs" }}
        />
      </VariantsProvider>
      {style && style.theme.colors.activeModes.length > 1 && isMounted && (
        <ThemeModeSwitch
          size="sm"
          shape="square"
          isSelected={activeMode === "dark"}
          onChange={(isSelected) =>
            setActiveMode(isSelected ? "dark" : "light")
          }
        />
      )}
    </div>
  );
};

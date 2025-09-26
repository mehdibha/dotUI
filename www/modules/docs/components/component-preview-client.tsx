"use client";

import React from "react";

import { DEFAULT_VARIANTS_DEFINITION } from "@dotui/style-engine/constants";
import { useCurrentStyle } from "@dotui/ui";
import { VariantsProvider } from "@dotui/ui/helpers/variants-provider";

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
        className="h-15 bg-neutral hover:bg-neutral-hover active:bg-neutral-active absolute right-2 top-1/2 z-20 w-2 -translate-y-1/2 cursor-col-resize rounded-full shadow-sm"
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
    <div className="absolute left-0 top-0 z-20 flex w-full items-start justify-between gap-2 p-2">
      <VariantsProvider variants={DEFAULT_VARIANTS_DEFINITION}>
        <ActiveStyleSelector
          buttonProps={{ size: "sm", className: "text-xs" }}
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

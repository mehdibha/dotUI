"use client";

import type React from "react";
import { MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";
import { ToggleButton } from "@dotui/registry/ui/toggle-button";

import { ThemeModeSwitch } from "@/components/ui/theme-mode-switch";
import { useHorizontalResize } from "@/hooks/use-horizontal-resize";
import { useMounted } from "@/hooks/use-mounted";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { ActiveStyleSelector } from "@/modules/styles/components/active-style-selector";
import { useActiveStyle } from "@/modules/styles/hooks/use-active-style";

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
      className="relative"
      ref={containerRef}
      style={{ width: width !== null ? `${width}px` : undefined }}
    >
      <div
        onMouseDown={handleMouseDown}
        className="absolute top-1/2 right-2 z-3 h-15 w-2 -translate-y-1/2 cursor-col-resize rounded-full bg-neutral shadow-sm hover:bg-neutral-hover active:bg-neutral-active"
      />
      {children}
    </div>
  );
};

export const ComponentPreviewHeader = () => {
  const { activeMode, setActiveMode } = usePreferences();
  const { data: style } = useActiveStyle();
  const isMounted = useMounted();

  return (
    <div className="z-3 flex items-center justify-between gap-2 p-2 pb-0 w-full absolute top-0 left-0 right-0">
      <ActiveStyleSelector
        buttonProps={{
          size: "sm",
          variant: "quiet",
          className: "text-xs h-7 border-0",
        }}
      />
      {style && style.theme.colors.activeModes.length > 1 && isMounted && (
        <Button
          size="sm"
          variant="quiet"
          className="size-7! border-0"
          onPress={() =>
            setActiveMode(activeMode === "dark" ? "light" : "dark")
          }
        >
          {activeMode === "dark" ? <MoonIcon /> : <SunIcon />}
        </Button>
      )}
    </div>
  );
};

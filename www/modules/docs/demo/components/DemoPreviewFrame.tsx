"use client";

import type React from "react";
import { MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";

import { useMounted } from "@/hooks/use-mounted";
import { usePreferences } from "@/modules/preferences/preferences-atom";
import { ActiveStyleSelector } from "@/modules/styles/active-style-selector";
import { useActiveStyle } from "@/modules/styles/use-active-style";

interface DemoPreviewFrameProps {
  children: React.ReactNode;
}

export const DemoPreviewFrame = ({ children }: DemoPreviewFrameProps) => {
  const { activeMode, setActiveMode } = usePreferences();
  const { data: style } = useActiveStyle();
  const isMounted = useMounted();

  const canToggleTheme =
    Boolean(style) &&
    Boolean(style?.theme.colors.activeModes.length && isMounted) &&
    (style?.theme.colors.activeModes.length ?? 0) > 1;

  return (
    <div className="relative z-1 flex flex-1 items-center justify-center rounded-t-lg border bg-bg pt-24 pb-20">
      <ActiveStyleSelector
        buttonProps={{
          size: "sm",
          variant: "quiet",
          className: "text-xs h-7 border-0 absolute left-1.5 top-1.5",
        }}
      />
      {canToggleTheme && (
        <Button
          size="sm"
          variant="quiet"
          className="absolute top-1.5 right-1.5 size-7! border-0"
          onPress={() =>
            setActiveMode(activeMode === "dark" ? "light" : "dark")
          }
        >
          {activeMode === "dark" ? <MoonIcon /> : <SunIcon />}
        </Button>
      )}
      {children}
    </div>
  );
};

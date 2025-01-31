"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { googleFonts } from "@/lib/fonts";
import { useMounted } from "@/hooks/use-mounted";
import { useThemes } from "@/hooks/use-themes";

interface ThemeOverrideProps extends React.ComponentProps<"div"> {
  children?: React.ReactNode;
  fallback?: ReactNode;
}

export const ThemeOverride = React.forwardRef<
  HTMLDivElement,
  ThemeOverrideProps
>(({ children, fallback, ...props }, ref) => {
  const { currentTheme, mode, fonts } = useThemes();
  const headingFont = googleFonts.find((f) => f.id === fonts.heading);
  const bodyFont = googleFonts.find((f) => f.id === fonts.body);
  const isMounted = useMounted();

  // fonts
  React.useEffect(() => {
    if (headingFont) {
      const head = document.head;
      const existingLink = head.querySelector("#heading-font");
      if (existingLink) {
        existingLink.remove();
      }
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = headingFont.url;
      link.id = "heading-font";
      head.appendChild(link);
    }
  }, [headingFont]);

  // colors
  const currentMode = currentTheme.colors[mode];

  const styles = Object.fromEntries(
    (["neutral", "success", "warning", "danger", "accent"] as const).flatMap(
      (color) => {
        const shades = currentMode[color].shades;
        return shades.map((shade, index) => {
          const [h, s, l] = shade.match(/\d+(\.\d+)?/g) || [];
          return [`--color-${color}-${(index + 1) * 100}`, shade];
        });
      }
    )
  );

  return (
    <div
      ref={ref}
      {...props}
      data-theme={currentTheme.id}
      style={
        {
          ...styles,
        } as React.CSSProperties
      }
      className={cn("bg-bg text-fg", props.className)}
    >
      {children}
    </div>
  );
});

ThemeOverride.displayName = "ThemeOverride";

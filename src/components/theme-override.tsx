"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useConfig } from "@/hooks/use-config";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useMounted } from "@/lib/hooks/use-mounted";
import { cn } from "@/lib/utils/classes";

interface ThemeOverrideProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

export function ThemeOverride(props: ThemeOverrideProps) {
  const { children } = props;
  const { type, mode, theme } = useConfig();
  const mounted = useMounted();
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const rootMode = resolvedTheme as "light" | "dark";
  const resolvedMode = type === "default" ? rootMode : mode;

  const shouldOverride = !!(mounted && pathname === "/themes" && theme);
  const debouncedShouldOverride = useDebounce(shouldOverride, 700);
  const styles = (
    shouldOverride
      ? {
          ...theme[resolvedMode],
          "--radius": `${theme.radius}rem`,
        }
      : {}
  ) as React.CSSProperties | undefined;

  return (
    <div
      className="bg-bg text-fg duration-150"
      // className={cn("", shouldOverride ? "duration-1000" : "duration-300")}
      style={styles}
    >
      {children}
    </div>
  );
}

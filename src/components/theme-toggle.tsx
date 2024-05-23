"use client";

import React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectPopover,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/core/default/select";
import { useMounted } from "@/lib/hooks/use-mounted";

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  if (!mounted) return null;
  return (
    <Select
      selectedKey={theme}
      onSelectionChange={(key) => setTheme(key as string)}
      aria-label="Change Theme"
      className={className}
    >
      <SelectTrigger className="flex size-8 items-center justify-center">
        <SelectValue>
          {resolvedTheme === "light" ? (
            <SunIcon className="size-5" />
          ) : (
            <MoonIcon className="size-5" />
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectPopover>
        <SelectContent aria-label="items">
          <SelectItem id="system">System</SelectItem>
          <SelectItem id="light">Light</SelectItem>
          <SelectItem id="dark">Dark</SelectItem>
        </SelectContent>
      </SelectPopover>
    </Select>
  );
};

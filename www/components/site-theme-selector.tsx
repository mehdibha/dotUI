"use client";

import type React from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Select, SelectContent, SelectItem, SelectTrigger } from "@dotui/registry/ui/select";

export const ThemeSwitcher = ({ children }: { children?: React.ReactNode }) => {
  const { theme, setTheme } = useTheme();

  return (
    <Select
      value={theme}
      onChange={(key) => setTheme(key as string)}
      aria-label="Change Theme"
      className="w-auto"
    >
      {children ?? (
        <SelectTrigger size="sm" variant="quiet" className="[&_svg]:size-[18px]">
          <SunIcon className="block dark:hidden" />
          <MoonIcon className="hidden dark:block" />
        </SelectTrigger>
      )}
      <SelectContent placement="bottom right">
        <SelectItem id="system">
          <MonitorIcon />
          System
        </SelectItem>
        <SelectItem id="light">
          <SunIcon />
          Light
        </SelectItem>
        <SelectItem id="dark">
          <MoonIcon />
          Dark
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

"use client";

import React from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ListBoxItem, ListBox } from "@/components/ui/list-box";
import { Popover } from "@/components/ui/popover";
import { SelectRoot } from "@/components/ui/select";

export const ThemeSwitcher = ({ children }: { children?: React.ReactNode }) => {
  const { theme, setTheme } = useTheme();

  return (
    <SelectRoot
      selectedKey={theme}
      onSelectionChange={(key) => setTheme(key as string)}
      aria-label="Change Theme"
      className="w-auto"
    >
      {children ?? (
        <Button
          size="sm"
          variant="quiet"
          shape="square"
          className="[&_svg]:size-[18px]"
        >
          <SunIcon className="block dark:hidden" />
          <MoonIcon className="hidden dark:block" />
        </Button>
      )}
      <Popover placement="bottom right">
        <ListBox>
          <ListBoxItem id="system" prefix={<MonitorIcon />}>
            System
          </ListBoxItem>
          <ListBoxItem id="light" prefix={<SunIcon />}>
            Light
          </ListBoxItem>
          <ListBoxItem id="dark" prefix={<MoonIcon />}>
            Dark
          </ListBoxItem>
        </ListBox>
      </Popover>
    </SelectRoot>
  );
};

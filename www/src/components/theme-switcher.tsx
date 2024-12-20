"use client";

import React from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/core/button";
import { Item, ListBox } from "@/components/core/list-box";
import { Overlay } from "@/components/core/overlay";
import { SelectRoot } from "@/components/core/select";

export const ThemeSwitcher = ({ children }: { children?: React.ReactNode }) => {
  const { theme, setTheme } = useTheme();

  return (
    <SelectRoot
      selectedKey={theme}
      onSelectionChange={(key) => setTheme(key as string)}
      aria-label="Change Theme"
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
      <Overlay placement="bottom right" type="popover">
        <ListBox>
          <Item id="system" prefix={<MonitorIcon />}>
            System
          </Item>
          <Item id="light" prefix={<SunIcon />}>
            Light
          </Item>
          <Item id="dark" prefix={<MoonIcon />}>
            Dark
          </Item>
        </ListBox>
      </Overlay>
    </SelectRoot>
  );
};

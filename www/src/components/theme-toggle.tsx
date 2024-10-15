"use client";

import React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/registry/ui/default/core/button";
import { Item, ListBox } from "@/registry/ui/default/core/list-box";
import { Overlay } from "@/registry/ui/default/core/overlay";
import { SelectRoot } from "@/registry/ui/default/core/select";

export const ThemeToggle = ({ children }: { children?: React.ReactNode }) => {
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
          <Item id="system">System</Item>
          <Item id="light">Light</Item>
          <Item id="dark">Dark</Item>
        </ListBox>
      </Overlay>
    </SelectRoot>
  );
};

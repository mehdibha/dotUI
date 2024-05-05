"use client";

import React from "react";
import { LogOutIcon, PlusIcon, Settings2Icon } from "lucide-react";
import { Avatar } from "@/lib/components/core/default/avatar";
import {
  MenuContent,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuRoot,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@/lib/components/core/default/menu";
import { cn } from "@/lib/utils/classes";

export default function MenuDemo() {
  const [theme, setTheme] = React.useState("system");

  return (
    <MenuRoot>
      {(isMobile) => (
        <>
          <MenuTrigger asChild>
            <button>
              <Avatar src="https://github.com/mehdibha.png" fallback="M" />
            </button>
          </MenuTrigger>
          <MenuContent align="end">
            <div className={cn("px-2 py-1.5 text-sm", isMobile && "text-md")}>
              <p className={cn("font-semibold")}>mehdi</p>
              <p className="text-fg-muted">hello@mehdibha.com</p>
            </div>
            <MenuItem suffix={<Settings2Icon />}>Account settings</MenuItem>
            <MenuItem suffix={<PlusIcon />}>Create team</MenuItem>
            <MenuSeparator />
            <MenuSub>
              <MenuItem shortcut="⌘+K">Command menu</MenuItem>
              <MenuSubTrigger>Theme</MenuSubTrigger>
              <MenuSubContent>
                <MenuRadioGroup
                  value={theme}
                  onValueChange={(newVal) => setTheme(newVal)}
                >
                  <MenuRadioItem value="system">System</MenuRadioItem>
                  <MenuRadioItem value="light">Light</MenuRadioItem>
                  <MenuRadioItem value="dark">Dark</MenuRadioItem>
                </MenuRadioGroup>
              </MenuSubContent>
            </MenuSub>
            <MenuSeparator />
            <MenuItem suffix={<LogOutIcon />}>Log out</MenuItem>
          </MenuContent>
        </>
      )}
    </MenuRoot>
  );
}

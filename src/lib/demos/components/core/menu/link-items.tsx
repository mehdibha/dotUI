import React from "react";
import { MenuIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/lib/components/core/default/menu";

export default function MenuDemo() {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button shape="square" variant="ghost" aria-label="menu">
          <MenuIcon />
        </Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem asChild>
          <a href="https://github.com/mehdibha/rcopy" target="_blank">
            GitHub
          </a>
        </MenuItem>
        <MenuItem asChild>
          <a href="https://twitter.com/mehdibha_" target="_blank">
            X
          </a>
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
}

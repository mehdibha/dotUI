import React from "react";
import { MenuIcon, ReceiptIcon } from "lucide-react";
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
        <MenuItem shortcut="⌘ E">Profile</MenuItem>
        <MenuItem suffix={<ReceiptIcon />}>Billing</MenuItem>
        <MenuItem>Settings</MenuItem>
      </MenuContent>
    </MenuRoot>
  );
}

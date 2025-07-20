import { MenuIcon } from "lucide-react";

import { StyleProvider } from "@dotui/ui";
import { Button } from "@dotui/ui/components/button";
import { Menu, MenuItem, MenuRoot } from "@dotui/ui/components/menu";

import { ComponentsOverview } from "@/components/components-overview";
import { caller } from "@/lib/trpc/server";

export default async function InternalPage() {
  const style = await caller.style.bySlug({ slug: "minimalist" });

  return (
    <div className="flex items-center justify-center p-10">
      <StyleProvider style={style}>
        <MenuRoot>
          <Button shape="square" aria-label="Open menu">
            <MenuIcon />
          </Button>
          <Menu>
            <MenuItem>Account settings</MenuItem>
            <MenuItem>Create team</MenuItem>
            <MenuItem>Command menu</MenuItem>
            <MenuItem>Log out</MenuItem>
          </Menu>
        </MenuRoot>
      </StyleProvider>
    </div>
  );
}

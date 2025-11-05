"use client";

import { LogOutIcon } from "lucide-react";
import { Button } from "react-aria-components";

import { focusRing } from "@dotui/registry/lib/focus-styles";
import { cn } from "@dotui/registry/lib/utils";
import { Avatar } from "@dotui/registry/ui/avatar";
import { Menu, MenuContent, MenuItem } from "@dotui/registry/ui/menu";
import { Overlay } from "@dotui/registry/ui/overlay";
import type { ButtonProps } from "@dotui/registry/ui/button";
import type { PopoverProps } from "@dotui/registry/ui/popover";

import { authClient } from "@/modules/auth/lib/client";

export function UserProfileMenu({
  placement = "bottom end",
  ...props
}: {
  placement?: PopoverProps["placement"];
} & ButtonProps) {
  const { data: session } = authClient.useSession();

  return (
    <Menu>
      <Button
        aria-label="User Profile"
        {...props}
        className={cn(
          focusRing(),
          "flex size-7.5 cursor-pointer items-center justify-center rounded-full outline-hidden",
          props.className,
        )}
      >
        <Avatar
          src={session?.user?.image ?? undefined}
          fallback={session?.user?.name?.charAt(0)}
          alt={session?.user?.name ?? undefined}
          className="size-full rounded-full"
        />
      </Button>
      <Overlay
        type="popover"
        mobileType="drawer"
        popoverProps={{
          placement,
          className: "w-48",
          containerPadding: 8,
        }}
      >
        <div className="px-4 pt-3 pb-1 text-sm">
          <p className="font-medium">{session?.user?.username}</p>
          <p className="text-fg-muted">{session?.user?.email}</p>
        </div>
        <MenuContent className="**:data-[slot=menu-item]:text-fg-muted [&_svg]:text-fg">
          <MenuItem href="/styles/my-styles">My styles</MenuItem>
          <MenuItem
            onAction={() => {
              authClient.signOut();
            }}
          >
            <LogOutIcon />
            Log out
          </MenuItem>
        </MenuContent>
      </Overlay>
    </Menu>
  );
}

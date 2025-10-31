"use client";

import { LogOutIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "react-aria-components";

import { focusRing } from "@dotui/registry/lib/focus-styles";
import { cn } from "@dotui/registry/lib/utils";
import { Avatar } from "@dotui/registry/ui/avatar";
import { Menu, MenuContent, MenuItem, MenuSub } from "@dotui/registry/ui/menu";
import { Overlay } from "@dotui/registry/ui/overlay";
import type { PopoverProps } from "@dotui/registry/ui/popover";

import { authClient } from "@/modules/auth/lib/client";

export function UserProfileMenu({
  placement = "bottom end",
  children,
}: {
  placement?: PopoverProps["placement"];
  children?: React.ReactNode;
}) {
  const { data: session } = authClient.useSession();
  const { theme, setTheme } = useTheme();

  return (
    <Menu>
      {children ?? (
        <Button
          className={cn(
            focusRing(),
            "flex size-7.5 cursor-pointer items-center justify-center rounded-full outline-hidden",
          )}
        >
          <Avatar
            src={session?.user?.image ?? undefined}
            fallback={session?.user?.name?.charAt(0)}
            className="size-full rounded-full"
          />
        </Button>
      )}
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
          <MenuSub>
            <MenuItem>Theme mode</MenuItem>
            <Overlay
              type="popover"
              popoverProps={{
                className: "w-32",
              }}
            >
              <MenuContent
                selectionMode="single"
                selectedKeys={theme ? [theme] : undefined}
                onSelectionChange={(key) => {
                  setTheme([...key][0] as string);
                }}
                className="**:data-[slot=menu-item]:text-fg-muted"
              >
                <MenuItem id="system">
                  <MonitorIcon className="text-fg" />
                  System
                </MenuItem>
                <MenuItem id="light">
                  <SunIcon className="text-fg" />
                  Light
                </MenuItem>
                <MenuItem id="dark">
                  <MoonIcon className="text-fg" />
                  Dark
                </MenuItem>
              </MenuContent>
            </Overlay>
          </MenuSub>
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

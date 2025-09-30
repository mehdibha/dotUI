"use client";

import { LogOutIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "react-aria-components";

import { focusRing } from "@dotui/registry/lib/focus-styles";
import { cn } from "@dotui/registry/lib/utils";
import { Avatar } from "@dotui/registry/ui/avatar";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuSub,
} from "@dotui/registry/ui/menu";
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
    <MenuRoot>
      {children ?? (
        <Button
          className={cn(
            focusRing(),
            "size-7.5 outline-hidden flex cursor-pointer items-center justify-center rounded-full",
          )}
        >
          <Avatar
            src={session?.user?.image ?? undefined}
            fallback={session?.user?.name?.charAt(0)}
            className="size-full"
            shape="circle"
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
        <div className="px-4 pb-1 pt-3 text-sm">
          <p className="font-medium">{session?.user?.username}</p>
          <p className="text-fg-muted">{session?.user?.email}</p>
        </div>
        <MenuContent className="[&_[data-slot=menu-item]]:text-fg-muted [&_svg]:text-fg">
          <MenuSub>
            <MenuItem>Theme mode</MenuItem>
            <Menu
              selectionMode="single"
              selectedKeys={theme ? [theme] : undefined}
              onSelectionChange={(key) => {
                setTheme([...key][0] as string);
              }}
              overlayProps={{
                popoverProps: {
                  className: "w-32",
                },
              }}
              className="[&_[data-slot=menu-item]]:text-fg-muted"
            >
              <MenuItem
                id="system"
                suffix={<MonitorIcon className="text-fg" />}
              >
                System
              </MenuItem>
              <MenuItem id="light" suffix={<SunIcon className="text-fg" />}>
                Light
              </MenuItem>
              <MenuItem id="dark" suffix={<MoonIcon className="text-fg" />}>
                Dark
              </MenuItem>
            </Menu>
          </MenuSub>
          <MenuItem
            suffix={<LogOutIcon />}
            onAction={() => {
              authClient.signOut();
            }}
          >
            Log out
          </MenuItem>
        </MenuContent>
      </Overlay>
    </MenuRoot>
  );
}

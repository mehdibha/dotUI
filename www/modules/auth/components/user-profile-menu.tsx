"use client";

import { LogOutIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "react-aria-components";

import { Avatar } from "@dotui/ui/components/avatar";
import { Menu, MenuItem, MenuRoot, MenuSub } from "@dotui/ui/components/menu";
import { focusRing } from "@dotui/ui/lib/focus-styles";
import { cn } from "@dotui/ui/lib/utils";

import { authClient } from "@/modules/auth/lib/client";

export function UserProfileMenu({ children }: { children?: React.ReactNode }) {
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
      <Menu
        overlayProps={{
          popoverProps: {
            placement: "bottom end",
            shouldFlip: false,
            className: "w-48",
          },
        }}
        className="[&_[data-slot=menu-item]]:text-fg-muted [&_svg]:text-fg"
      >
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
            <MenuItem id="system" suffix={<MonitorIcon className="text-fg" />}>
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
      </Menu>
    </MenuRoot>
  );
}

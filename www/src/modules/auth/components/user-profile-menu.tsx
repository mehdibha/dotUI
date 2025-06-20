import { GitHubIcon, TwitterIcon } from "@/components/icons";
import { siteConfig } from "@/config";
import { authClient } from "@/modules/auth/lib/client";
import {
  ContrastIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Avatar } from "@dotui/ui/components/avatar";
import { Button } from "@dotui/ui/components/button";
import { Menu, MenuItem, MenuRoot, MenuSub } from "@dotui/ui/components/menu";
import { Separator } from "@dotui/ui/components/separator";

export function UserProfileMenu() {
  const { data: session } = authClient.useSession();
  const { theme, setTheme } = useTheme();

  return (
    <MenuRoot>
      <Button shape="square" variant="quiet">
        <Avatar
          src={session?.user?.image ?? undefined}
          fallback={session?.user?.name?.charAt(0)}
          className="size-6"
          shape="circle"
        />
      </Button>
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
        <MenuItem
          suffix={<GitHubIcon />}
          href={siteConfig.links.github}
          target="_blank"
        >
          GitHub
        </MenuItem>
        <MenuItem
          suffix={<TwitterIcon />}
          href={siteConfig.links.twitter}
          target="_blank"
        >
          X
        </MenuItem>
        <Separator />
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

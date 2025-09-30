import { DiscordIcon } from "@dotui/registry/components/icons/discord";
import { GitHubIcon } from "@dotui/registry/components/icons/github";
import { TwitterIcon } from "@dotui/registry/components/icons/twitter";
import { Button } from "@dotui/registry/ui/button";
import { Menu, MenuItem, MenuRoot } from "@dotui/registry/ui/menu";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="default" size="sm">
        Social
      </Button>
      <Menu>
        <MenuItem
          prefix={<GitHubIcon />}
          href="https://github.com/mehdibha/dotUI"
          target="_blank"
        >
          Github
        </MenuItem>
        <MenuItem
          prefix={<TwitterIcon />}
          href="https://twitter.com/mehdibha_"
          target="_blank"
        >
          X
        </MenuItem>
        <MenuItem
          prefix={<DiscordIcon />}
          href="https://discord.com/invite/DXpj5V2fU8"
          target="_blank"
        >
          Discord
        </MenuItem>
      </Menu>
    </MenuRoot>
  );
}

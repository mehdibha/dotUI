import { Button } from "@/components/dynamic-ui/button";
import { Menu, MenuItem, MenuRoot } from "@/components/dynamic-ui/menu";
import { DiscordIcon, GitHubIcon, TwitterIcon } from "@/components/icons";

export default function Demo() {
  return (
    <MenuRoot>
      <Button variant="outline" size="sm">
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

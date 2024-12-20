import { ListBox, Item } from "@/components/dynamic-core/list-box";
import { DiscordIcon, GitHubIcon, TwitterIcon } from "@/components/icons";

export default function Demo() {
  return (
    <ListBox aria-label="Links" className="w-auto">
      <Item
        href="https://github.com/mehdibha"
        target="_blank"
        prefix={<GitHubIcon />}
      >
        GitHub
      </Item>
      <Item
        href="https://discord.com/invite/DXpj5V2fU8"
        target="_blank"
        prefix={<DiscordIcon />}
      >
        Discord
      </Item>
      <Item
        href="https://x.com/mehdibha_"
        target="_blank"
        prefix={<TwitterIcon />}
      >
        X
      </Item>
    </ListBox>
  );
}

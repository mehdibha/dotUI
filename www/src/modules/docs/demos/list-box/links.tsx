import { ListBox, ListBoxItem } from "@/components/dynamic-ui/list-box";
import { DiscordIcon, GitHubIcon, TwitterIcon } from "@/components/icons";

export default function Demo() {
  return (
    <ListBox aria-label="Links" className="w-auto">
      <ListBoxItem
        href="https://github.com/mehdibha"
        target="_blank"
        prefix={<GitHubIcon />}
      >
        GitHub
      </ListBoxItem>
      <ListBoxItem
        href="https://discord.com/invite/DXpj5V2fU8"
        target="_blank"
        prefix={<DiscordIcon />}
      >
        Discord
      </ListBoxItem>
      <ListBoxItem
        href="https://x.com/mehdibha_"
        target="_blank"
        prefix={<TwitterIcon />}
      >
        X
      </ListBoxItem>
    </ListBox>
  );
}

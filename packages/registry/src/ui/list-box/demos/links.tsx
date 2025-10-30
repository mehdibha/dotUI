import { DiscordIcon } from "@dotui/registry/components/icons/discord";
import { GitHubIcon } from "@dotui/registry/components/icons/github";
import { TwitterIcon } from "@dotui/registry/components/icons/twitter";
import { ListBox, ListBoxItem } from "@dotui/registry/ui/list-box";

export default function Demo() {
  return (
    <ListBox aria-label="Links" className="w-auto">
      <ListBoxItem href="https://github.com/mehdibha" target="_blank">
        <GitHubIcon />
        GitHub
      </ListBoxItem>
      <ListBoxItem href="https://discord.com/invite/DXpj5V2fU8" target="_blank">
        <DiscordIcon />
        Discord
      </ListBoxItem>
      <ListBoxItem href="https://x.com/mehdibha_" target="_blank">
        <TwitterIcon />X
      </ListBoxItem>
    </ListBox>
  );
}

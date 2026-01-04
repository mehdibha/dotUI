import { DiscordIcon } from "@dotui/registry/components/icons/discord";
import { GitHubIcon } from "@dotui/registry/components/icons/github";
import { TwitterIcon } from "@dotui/registry/components/icons/twitter";
import { Button } from "@dotui/registry/ui/button";
import { Menu, MenuContent, MenuItem } from "@dotui/registry/ui/menu";
import { Popover } from "@dotui/registry/ui/popover";

export default function Demo() {
	return (
		<Menu>
			<Button variant="default" size="sm">
				Social
			</Button>
			<Popover>
				<MenuContent>
					<MenuItem>
						<GitHubIcon />
						Github
					</MenuItem>
					<MenuItem href="https://twitter.com/mehdibha" target="_blank">
						<TwitterIcon />X
					</MenuItem>
					<MenuItem href="https://discord.com/invite/DXpj5V2fU8" target="_blank">
						<DiscordIcon />
						Discord
					</MenuItem>
				</MenuContent>
			</Popover>
		</Menu>
	);
}

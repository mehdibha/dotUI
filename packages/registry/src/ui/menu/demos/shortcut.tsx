import { MenuIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Kbd } from "@dotui/registry/ui/kbd";
import { Menu, MenuContent, MenuItem } from "@dotui/registry/ui/menu";
import { Popover } from "@dotui/registry/ui/popover";

export default function Demo() {
	return (
		<Menu>
			<Button variant="default" aspect="square">
				<MenuIcon />
			</Button>
			<Popover>
				<MenuContent>
					<MenuItem>
						New file
						<Kbd>⌘N</Kbd>
					</MenuItem>
					<MenuItem>
						Copy link
						<Kbd>⌘C</Kbd>
					</MenuItem>
					<MenuItem>
						Edit file
						<Kbd>⌘⇧E</Kbd>
					</MenuItem>
				</MenuContent>
			</Popover>
		</Menu>
	);
}

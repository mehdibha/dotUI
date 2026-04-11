import { MenuIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu";
import { Popover } from "@/registry/ui/popover";

export default function Demo() {
	return (
		<Menu trigger="longPress">
			<Button variant="default" size="icon">
				<MenuIcon />
			</Button>
			<Popover>
				<MenuContent>
					<MenuItem>Account settings</MenuItem>
					<MenuItem>Create team</MenuItem>
					<MenuItem>Log out</MenuItem>
				</MenuContent>
			</Popover>
		</Menu>
	);
}

import { MenuIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Menu, MenuContent, MenuItem } from "@dotui/registry/ui/menu";
import { Popover } from "@dotui/registry/ui/popover";

export default function Demo() {
	return (
		<Menu>
			<Button>
				<MenuIcon />
			</Button>
			<Popover>
				<MenuContent>
					<MenuItem>Account settings</MenuItem>
					<MenuItem>Create team</MenuItem>
					<MenuItem>Command menu</MenuItem>
					<MenuItem variant="danger">Delete</MenuItem>
				</MenuContent>
			</Popover>
		</Menu>
	);
}

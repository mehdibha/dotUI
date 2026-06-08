import { MenuIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu";
import { Popover } from "@/registry/ui/popover";

export function MenuDemo() {
	return (
		<Menu>
			<Button isIconOnly>
				<MenuIcon />
			</Button>
			<Popover placement="bottom end">
				<MenuContent>
					<MenuItem>Account settings</MenuItem>
					<MenuItem>Create team</MenuItem>
					<MenuItem>Command menu</MenuItem>
					<MenuItem>Log out</MenuItem>
				</MenuContent>
			</Popover>
		</Menu>
	);
}

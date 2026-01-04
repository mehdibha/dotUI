import { MenuIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";
import { Menu, MenuContent, MenuItem } from "@dotui/registry/ui/menu";
import { Popover } from "@dotui/registry/ui/popover";

export function MenuDemo() {
	return (
		<div className="flex h-46 w-36 items-start justify-end">
			<Menu>
				<Button>
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
		</div>
	);
}

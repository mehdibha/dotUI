import { Button } from "@dotui/registry/ui/button";
import { Menu, MenuContent, MenuItem } from "@dotui/registry/ui/menu";
import { Popover } from "@dotui/registry/ui/popover";

export default function Demo() {
	return (
		<Menu>
			<Button variant="default" size="sm">
				Panels
			</Button>
			<Popover>
				<MenuContent selectionMode="multiple" defaultSelectedKeys={["sidebar", "searchbar", "console"]}>
					<MenuItem id="sidebar">Sidebar</MenuItem>
					<MenuItem id="searchbar">Searchbar</MenuItem>
					<MenuItem id="tools">Tools</MenuItem>
					<MenuItem id="console">Console</MenuItem>
				</MenuContent>
			</Popover>
		</Menu>
	);
}

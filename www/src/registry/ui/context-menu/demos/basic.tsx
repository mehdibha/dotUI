import { ContextMenu } from "@/registry/ui/context-menu";
import { MenuContent, MenuItem } from "@/registry/ui/menu";
import { Popover } from "@/registry/ui/popover";

export default function Demo() {
	return (
		<ContextMenu
			data-testid="context-menu-basic"
			className="flex h-32 w-64 items-center justify-center rounded-md border border-dashed bg-bg-muted text-fg-muted text-sm"
		>
			Right click me
			<Popover>
				<MenuContent>
					<MenuItem>Account settings</MenuItem>
					<MenuItem>Create team</MenuItem>
					<MenuItem>Command menu</MenuItem>
					<MenuItem>Log out</MenuItem>
				</MenuContent>
			</Popover>
		</ContextMenu>
	);
}

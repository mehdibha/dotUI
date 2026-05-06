import { ContextMenu } from "@/registry/ui/context-menu";
import { MenuContent, MenuItem } from "@/registry/ui/menu";
import { Popover } from "@/registry/ui/popover";

export default function Demo() {
	return (
		<ContextMenu
			data-testid="context-menu-outer"
			className="flex h-40 w-72 items-center justify-center rounded-md border border-dashed bg-bg-muted p-4 text-fg-muted text-sm"
		>
			<div className="flex flex-col items-center gap-3">
				<span>Outer area</span>
				<ContextMenu
					data-testid="context-menu-inner"
					className="rounded-md border bg-bg px-4 py-2 text-fg text-sm shadow-xs"
				>
					Inner target
					<Popover>
						<MenuContent>
							<MenuItem>Inner action</MenuItem>
							<MenuItem>Inner settings</MenuItem>
						</MenuContent>
					</Popover>
				</ContextMenu>
			</div>
			<Popover>
				<MenuContent>
					<MenuItem>Outer action</MenuItem>
					<MenuItem>Outer settings</MenuItem>
				</MenuContent>
			</Popover>
		</ContextMenu>
	);
}

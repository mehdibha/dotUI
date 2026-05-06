import { ContextMenu } from "@/registry/ui/context-menu";
import { Kbd } from "@/registry/ui/kbd";
import { MenuContent, MenuItem, MenuSub } from "@/registry/ui/menu";
import { Popover } from "@/registry/ui/popover";
import { Separator } from "@/registry/ui/separator";

export default function Demo() {
	return (
		<ContextMenu
			data-testid="context-menu-submenu"
			className="flex h-32 w-64 items-center justify-center rounded-md border border-dashed bg-bg-muted text-fg-muted text-sm"
		>
			Right click for submenu
			<Popover>
				<MenuContent>
					<MenuItem>Team</MenuItem>
					<MenuSub>
						<MenuItem>Invite users</MenuItem>
						<Popover>
							<MenuContent>
								<MenuItem>Email</MenuItem>
								<MenuItem>Message</MenuItem>
								<Separator />
								<MenuItem>More...</MenuItem>
							</MenuContent>
						</Popover>
					</MenuSub>
					<MenuItem>
						New team
						<Kbd className="ml-auto">⌘T</Kbd>
					</MenuItem>
				</MenuContent>
			</Popover>
		</ContextMenu>
	);
}

import { Button } from "@/registry/ui/button";
import { Kbd } from "@/registry/ui/kbd";
import { Menu, MenuContent, MenuItem, MenuSub } from "@/registry/ui/menu";
import { Popover } from "@/registry/ui/popover";
import { Separator } from "@/registry/ui/separator";

export default function Demo() {
	return (
		<Menu>
			<Button variant="default" className="w-fit">
				Open
			</Button>
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
						New Team
						<Kbd className="ml-auto">⌘+T</Kbd>
					</MenuItem>
				</MenuContent>
			</Popover>
		</Menu>
	);
}

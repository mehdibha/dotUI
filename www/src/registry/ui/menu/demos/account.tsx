import { Button } from "@/registry/ui/button";
import { Menu, MenuContent, MenuItem, MenuSection, MenuSectionHeader } from "@/registry/ui/menu";
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
					<MenuSection>
						<MenuSectionHeader>My Account</MenuSectionHeader>
						<MenuItem>Profile</MenuItem>
						<MenuItem>Billing</MenuItem>
						<MenuItem>Settings</MenuItem>
					</MenuSection>
					<Separator />
					<MenuItem>GitHub</MenuItem>
					<MenuItem>Support</MenuItem>
					<MenuItem isDisabled>API</MenuItem>
				</MenuContent>
			</Popover>
		</Menu>
	);
}

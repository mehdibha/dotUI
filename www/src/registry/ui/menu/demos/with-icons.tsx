import { CreditCardIcon, LogOutIcon, SettingsIcon, UserIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu";
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
					<MenuItem>
						<UserIcon />
						Profile
					</MenuItem>
					<MenuItem>
						<CreditCardIcon />
						Billing
					</MenuItem>
					<MenuItem>
						<SettingsIcon />
						Settings
					</MenuItem>
					<Separator />
					<MenuItem variant="danger">
						<LogOutIcon />
						Log out
					</MenuItem>
				</MenuContent>
			</Popover>
		</Menu>
	);
}

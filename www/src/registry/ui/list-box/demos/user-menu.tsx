import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Separator } from "@/registry/ui/separator";

export default function Demo() {
	return (
		<div className="rounded-md border bg-card shadow-sm">
			<div className="flex items-start gap-2 p-2">
				<Avatar size="sm" className="mt-1">
					<AvatarImage src="https://i.pravatar.cc/150?u=jrgarciadev" />
					<AvatarFallback>JG</AvatarFallback>
				</Avatar>
				<div className="flex flex-col text-sm">
					<p>Junior Garcia</p>
					<p className="text-fg-muted text-xs">jrgarcia@example.com</p>
				</div>
			</div>
			<Separator />
			<ListBox aria-label="Account" onAction={() => console.log("action")}>
				<ListBoxItem id="profile">
					<UserIcon />
					Profile
				</ListBoxItem>
				<ListBoxItem id="settings">
					<SettingsIcon />
					Settings
				</ListBoxItem>
				<Separator />
				<ListBoxItem id="logout" variant="danger">
					<LogOutIcon />
					Log out
				</ListBoxItem>
			</ListBox>
		</div>
	);
}

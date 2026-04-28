import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar";
import { Description, FieldContent, Label } from "@/registry/ui/field";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Separator } from "@/registry/ui/separator";

export default function Demo() {
	return (
		<div className="rounded-md border bg-card shadow-sm">
			<ListBox aria-label="Account">
				<ListBoxItem id="account" textValue="Junior Garcia">
					<Avatar>
						<AvatarImage src="https://i.pravatar.cc/150?u=jrgarciadev" />
						<AvatarFallback>JG</AvatarFallback>
					</Avatar>
					<FieldContent>
						<Label>Junior Garcia</Label>
						<Description>jrgarcia@example.com</Description>
					</FieldContent>
				</ListBoxItem>
				<Separator />
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

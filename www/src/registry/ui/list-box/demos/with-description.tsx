import { GitBranchIcon, GlobeIcon, ShieldCheckIcon, UserIcon } from "lucide-react";

import { Description, FieldContent, Label } from "@/registry/ui/field";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";

export default function Demo() {
	return (
		<div className="w-80 rounded-md border bg-popover p-1 shadow-sm">
			<ListBox aria-label="Permissions" selectionMode="single" defaultSelectedKeys={["read"]}>
				<ListBoxItem id="read" textValue="Read">
					<UserIcon />
					<FieldContent>
						<Label>Read</Label>
						<Description>View files and discussions.</Description>
					</FieldContent>
				</ListBoxItem>
				<ListBoxItem id="write" textValue="Write">
					<GitBranchIcon />
					<FieldContent>
						<Label>Write</Label>
						<Description>Push branches and open pull requests.</Description>
					</FieldContent>
				</ListBoxItem>
				<ListBoxItem id="maintain" textValue="Maintain">
					<ShieldCheckIcon />
					<FieldContent>
						<Label>Maintain</Label>
						<Description>Manage the repository without admin access.</Description>
					</FieldContent>
				</ListBoxItem>
				<ListBoxItem id="admin" textValue="Admin">
					<GlobeIcon />
					<FieldContent>
						<Label>Admin</Label>
						<Description>Full access including settings and billing.</Description>
					</FieldContent>
				</ListBoxItem>
			</ListBox>
		</div>
	);
}

import { CopyIcon, MenuIcon, PlusSquareIcon, SquarePenIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { Description, Label } from "@dotui/registry/ui/field";
import { Menu, MenuContent, MenuItem } from "@dotui/registry/ui/menu";
import { Popover } from "@dotui/registry/ui/popover";

export default function Demo() {
	return (
		<Menu>
			<Button variant="default" aspect="square" size="sm">
				<MenuIcon />
			</Button>
			<Popover>
				<MenuContent>
					<MenuItem>
						<PlusSquareIcon />
						<Label>New file</Label>
						<Description>Create a new file</Description>
					</MenuItem>
					<MenuItem>
						<CopyIcon />
						<Label>Copy link</Label>
						<Description>Copy the file link</Description>
					</MenuItem>
					<MenuItem>
						<SquarePenIcon />
						<Label>Edit file</Label>
						<Description>Allows you to edit the file</Description>
					</MenuItem>
				</MenuContent>
			</Popover>
		</Menu>
	);
}

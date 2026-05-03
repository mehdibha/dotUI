import { ArchiveIcon, PencilIcon, ShareIcon, TrashIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu";
import { Popover } from "@/registry/ui/popover";
import { Separator } from "@/registry/ui/separator";

export default function Demo() {
	return (
		<Menu>
			<Button variant="default" className="w-fit">
				Actions
			</Button>
			<Popover>
				<MenuContent>
					<MenuItem>
						<PencilIcon />
						Edit
					</MenuItem>
					<MenuItem>
						<ShareIcon />
						Share
					</MenuItem>
					<Separator />
					<MenuItem>
						<ArchiveIcon />
						Archive
					</MenuItem>
					<MenuItem variant="danger">
						<TrashIcon />
						Delete
					</MenuItem>
				</MenuContent>
			</Popover>
		</Menu>
	);
}

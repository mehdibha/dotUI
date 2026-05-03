import { CopyIcon, DownloadIcon, PencilIcon, ShareIcon, TrashIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu";
import { Modal } from "@/registry/ui/modal";
import { Separator } from "@/registry/ui/separator";

export default function Demo() {
	return (
		<Menu>
			<Button variant="default" className="w-fit">
				Open modal menu
			</Button>
			<Modal>
				<MenuContent>
					<MenuItem>
						<PencilIcon />
						Rename
					</MenuItem>
					<MenuItem>
						<CopyIcon />
						Duplicate
					</MenuItem>
					<MenuItem>
						<ShareIcon />
						Share
					</MenuItem>
					<MenuItem>
						<DownloadIcon />
						Download
					</MenuItem>
					<Separator />
					<MenuItem variant="danger">
						<TrashIcon />
						Delete
					</MenuItem>
				</MenuContent>
			</Modal>
		</Menu>
	);
}

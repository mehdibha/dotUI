import { CopyIcon, ExternalLinkIcon, PencilIcon, Trash2Icon } from "lucide-react";

import { ListBox, ListBoxItem } from "@/registry/ui/list-box";

export default function Demo() {
	return (
		<div className="w-60 rounded-md border bg-popover p-1 shadow-sm">
			<ListBox aria-label="Project actions">
				<ListBoxItem id="rename">
					<PencilIcon />
					Rename project
				</ListBoxItem>
				<ListBoxItem id="duplicate">
					<CopyIcon />
					Duplicate
				</ListBoxItem>
				<ListBoxItem id="open">
					<ExternalLinkIcon />
					Open in new tab
				</ListBoxItem>
				<ListBoxItem id="delete" variant="danger">
					<Trash2Icon />
					Delete project
				</ListBoxItem>
			</ListBox>
		</div>
	);
}

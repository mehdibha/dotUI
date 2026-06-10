import { CopyIcon, ExternalLinkIcon, PencilIcon, Trash2Icon } from "lucide-react";

import { ListBox, ListBoxItem } from "@/registry/ui/list-box";

export default function Demo() {
	return (
		<div className="rounded-md border bg-card shadow-sm">
			<ListBox aria-label="Project actions" onAction={() => console.log("action")}>
				<ListBoxItem id="rename" textValue="Rename project">
					<PencilIcon />
					Rename project
				</ListBoxItem>
				<ListBoxItem id="duplicate" textValue="Duplicate">
					<CopyIcon />
					Duplicate
				</ListBoxItem>
				<ListBoxItem id="open" textValue="Open in new tab">
					<ExternalLinkIcon />
					Open in new tab
				</ListBoxItem>
				<ListBoxItem id="delete" variant="danger" textValue="Delete project">
					<Trash2Icon />
					Delete project
				</ListBoxItem>
			</ListBox>
		</div>
	);
}

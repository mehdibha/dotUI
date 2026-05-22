import { CopyIcon, PencilIcon, ShareIcon, StarIcon } from "lucide-react";

import { ListBox, ListBoxItem } from "@/registry/ui/list-box";

export default function Demo() {
	return (
		<div className="rounded-md border bg-card shadow-sm">
			<ListBox aria-label="Actions" selectionMode="single">
				<ListBoxItem id="edit">
					<PencilIcon />
					Edit
				</ListBoxItem>
				<ListBoxItem id="copy">
					<CopyIcon />
					Copy link
				</ListBoxItem>
				<ListBoxItem id="share">
					<ShareIcon />
					Share
				</ListBoxItem>
				<ListBoxItem id="favorite">
					<StarIcon />
					Add to favorites
				</ListBoxItem>
			</ListBox>
		</div>
	);
}

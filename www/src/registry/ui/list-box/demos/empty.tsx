import { SearchXIcon } from "lucide-react";

import { ListBox } from "@/registry/ui/list-box";

export default function Demo() {
	return (
		<div className="w-60 rounded-md border bg-popover p-1 shadow-sm">
			<ListBox
				aria-label="Search results"
				renderEmptyState={() => (
					<div className="flex flex-col items-center justify-center gap-2 py-8 text-fg-muted">
						<SearchXIcon className="size-5" />
						<span className="text-sm">No results found.</span>
					</div>
				)}
			>
				{[]}
			</ListBox>
		</div>
	);
}

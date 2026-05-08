import { ListBox } from "@/registry/ui/list-box";

export default function Demo() {
	return (
		<div className="rounded-md border bg-card shadow-sm">
			<ListBox
				aria-label="Search results"
				renderEmptyState={() => (
					<div className="flex flex-col items-center justify-center gap-2 py-8 text-fg-muted">
						<span className="text-sm">No results found.</span>
					</div>
				)}
			>
				{[]}
			</ListBox>
		</div>
	);
}

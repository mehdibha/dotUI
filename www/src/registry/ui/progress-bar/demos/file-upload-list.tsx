import { FileIcon } from "lucide-react";

import { ProgressBar } from "@/registry/ui/progress-bar";

const files = [
	{
		id: "1",
		name: "document.pdf",
		progress: 45,
		timeRemaining: "2m 30s",
	},
	{
		id: "2",
		name: "presentation.pptx",
		progress: 78,
		timeRemaining: "45s",
	},
	{
		id: "3",
		name: "spreadsheet.xlsx",
		progress: 12,
		timeRemaining: "5m 12s",
	},
	{
		id: "4",
		name: "image.jpg",
		progress: 100,
		timeRemaining: "Complete",
	},
] as const;

export default function Demo() {
	return (
		<ul className="w-full max-w-md divide-y rounded-lg border bg-card">
			{files.map((file) => (
				<li key={file.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-2">
					<span className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-muted text-fg-muted">
						<FileIcon className="size-4" />
					</span>
					<div className="min-w-0">
						<div className="truncate text-sm font-medium">{file.name}</div>
						<ProgressBar aria-label={`${file.name} upload progress`} value={file.progress} className="mt-2 w-full" />
					</div>
					<span className="w-16 text-right text-sm text-fg-muted">{file.timeRemaining}</span>
				</li>
			))}
		</ul>
	);
}

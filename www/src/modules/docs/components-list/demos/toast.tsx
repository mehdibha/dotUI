import { CircleCheckIcon } from "lucide-react";

// A static, presentational stand-in for a toast — the real component is
// triggered + portaled at runtime, which doesn't preview well in a static grid.
export function ToastDemo() {
	return (
		<div className="flex w-64 items-center gap-3 rounded-lg border bg-bg p-3 shadow-lg">
			<CircleCheckIcon className="size-5 shrink-0 text-fg-success" />
			<div className="flex min-w-0 flex-col">
				<span className="text-sm font-medium text-fg">Event has been created</span>
				<span className="truncate text-xs text-fg-muted">Sunday at 9:00 AM</span>
			</div>
		</div>
	);
}

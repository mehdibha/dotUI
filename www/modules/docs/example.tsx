import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { DemosIndex as Index } from "@dotui/registry/ui/demos";

import { ActiveStyleProvider } from "@/modules/styles/active-style-provider";

export interface ExampleProps {
	name: string;
	description?: string;
	className?: string;
}

export const Example = async ({ name, description, className }: ExampleProps) => {
	const demoItem = Index[name];

	if (!demoItem) return null;

	const Component = demoItem.component;

	return (
		<div className={cn("relative flex flex-col", className)}>
			<ActiveStyleProvider unstyled className="flex flex-1 items-center justify-center rounded-t-md border bg-bg p-10">
				<Component />
			</ActiveStyleProvider>
			<div className="flex items-center justify-between gap-4 rounded-b-lg border border-t-0 bg-card/50 p-1.5 pl-3">
				{description ? <p className="truncate text-fg-muted text-sm">{description}</p> : <span />}
				<Button size="sm" className="h-7">
					View code
				</Button>
			</div>
		</div>
	);
};

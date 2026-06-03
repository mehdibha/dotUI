"use client";

import { cn } from "@/registry/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/ui/card";
import { Kbd, KbdGroup } from "@/registry/ui/kbd";

const shortcuts = [
	{ action: "Open command palette", keys: ["⌘", "K"] },
	{ action: "Search", keys: ["/"] },
	{ action: "New file", keys: ["⌘", "N"] },
	{ action: "Toggle sidebar", keys: ["⌘", "B"] },
	{ action: "Save", keys: ["⌘", "S"] },
];

export function Shortcuts({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<Card className={cn(className)} {...props}>
			<CardHeader>
				<CardTitle>Keyboard shortcuts</CardTitle>
				<CardDescription>Speed up your workflow.</CardDescription>
			</CardHeader>
			<CardContent>
				<ul className="flex flex-col gap-1">
					{shortcuts.map((shortcut) => (
						<li
							key={shortcut.action}
							className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 hover:bg-muted"
						>
							<span className="min-w-0 truncate text-sm">{shortcut.action}</span>
							<KbdGroup className="shrink-0">
								{shortcut.keys.map((key) => (
									<Kbd key={key}>{key}</Kbd>
								))}
							</KbdGroup>
						</li>
					))}
				</ul>
			</CardContent>
			<CardFooter>
				<p className="text-sm text-fg-muted">
					Press{" "}
					<KbdGroup>
						<Kbd>⌘</Kbd>
						<Kbd>/</Kbd>
					</KbdGroup>{" "}
					to view all shortcuts.
				</p>
			</CardFooter>
		</Card>
	);
}

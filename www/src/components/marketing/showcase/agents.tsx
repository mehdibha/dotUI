"use client";

import { BookOpenIcon, FileTextIcon, GitPullRequestArrowIcon, TagIcon } from "lucide-react";

import { cn } from "@/registry/lib/utils";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/registry/ui/card";
import { Separator } from "@/registry/ui/separator";
import { Switch, SwitchControl } from "@/registry/ui/switch";

const agents = [
	{
		id: "pr-reviewer",
		icon: GitPullRequestArrowIcon,
		name: "PR Reviewer",
		detail: "Reviewed 12 pull requests today",
		enabled: true,
	},
	{
		id: "triage",
		icon: TagIcon,
		name: "Issue Triage",
		detail: "Labels and assigns new issues",
		enabled: true,
	},
	{
		id: "release-notes",
		icon: FileTextIcon,
		name: "Release Notes",
		detail: "Drafts changelogs on merge",
		badge: "Beta",
		enabled: false,
	},
	{
		id: "docs-sync",
		icon: BookOpenIcon,
		name: "Docs Sync",
		detail: "Flags out-of-date documentation",
		enabled: true,
	},
];

export function Agents({ className, ...props }: React.ComponentProps<"div">) {
	const activeCount = agents.filter((agent) => agent.enabled).length;

	return (
		<Card className={cn(className)} {...props}>
			<CardHeader>
				<CardTitle>Agents</CardTitle>
				<CardAction>
					<Button variant="quiet" size="sm">
						Manage
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent className="space-y-1">
				{agents.map((agent, index) => (
					<div key={agent.id}>
						{index > 0 && <Separator className="my-1" />}
						<div className="flex items-center gap-3">
							<div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-fg-muted">
								<agent.icon className="size-4" />
							</div>
							<div className="min-w-0 flex-1">
								<p className="flex items-center gap-1.5 text-sm font-medium">
									<span className="truncate">{agent.name}</span>
									{agent.badge && (
										<Badge appearance="subtle" variant="accent" size="sm">
											{agent.badge}
										</Badge>
									)}
								</p>
								<p className="truncate text-xs text-fg-muted">{agent.detail}</p>
							</div>
							<Switch aria-label={`Enable ${agent.name}`} defaultSelected={agent.enabled}>
								<SwitchControl />
							</Switch>
						</div>
					</div>
				))}
			</CardContent>
			<CardFooter className="justify-between">
				<p className="text-sm text-fg-muted">{activeCount} active</p>
				<p className="text-sm font-medium tabular-nums">1.2k runs this week</p>
			</CardFooter>
		</Card>
	);
}

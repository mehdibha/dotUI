import React from "react";

import { cn } from "@/registry/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/registry/ui/card";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Separator } from "@/registry/ui/separator";
import { Tab, TabList, Tabs } from "@/registry/ui/tabs";

type NotificationFilter = "all" | "unread" | "read";

export function Notifications({ className, ...props }: React.ComponentProps<"div">) {
	const [filter, setFilter] = React.useState<NotificationFilter>("all");
	const unreadCount = notifications.filter((notification) => !notification.read).length;
	const visibleNotifications = notifications.filter((notification) => {
		if (filter === "unread") return !notification.read;
		if (filter === "read") return notification.read;
		return true;
	});

	return (
		<Card className={cn("gap-2 pb-0", className)} {...props}>
			<CardHeader className="flex min-w-0 flex-wrap items-center justify-between gap-2">
				<CardTitle className="flex items-center gap-2">
					Notifications
					<Badge className="px-1.5">{unreadCount}</Badge>
				</CardTitle>
				<CardAction>
					<Button size="sm">
						<span className="truncate">Mark all as read</span>
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent className="flex min-h-0 flex-1 flex-col gap-3 px-0">
				<Tabs
					selectedKey={filter}
					onSelectionChange={(key) => setFilter(key as NotificationFilter)}
					className="shrink-0 px-4"
				>
					<TabList>
						<Tab id="all">All</Tab>
						<Tab id="unread">Unread</Tab>
						<Tab id="read">Read</Tab>
					</TabList>
				</Tabs>
				<div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto border-t">
					<ListBox
						aria-label="Notifications"
						className="max-h-none w-full rounded-none border-0 bg-transparent p-0 **:data-[slot=list-box-item]:rounded-none [&_.separator]:m-0"
					>
						{visibleNotifications.map((notification, index) => (
							<React.Fragment key={`${notification.user.name}-${notification.timestamp}-${notification.text}`}>
								{index > 0 && <Separator />}
								<ListBoxItem textValue={notification.text}>
									<div className="flex items-start gap-3 py-2">
										<Avatar size="md" className="shrink-0">
											<AvatarImage src={notification.user.avatar} alt={notification.user.name} />
											<AvatarFallback>
												{notification.user.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<div className="min-w-0 flex-1">
											<p className="text-sm break-words">
												<span className="font-medium">{notification.user.name}</span>{" "}
												{notification.content ? notification.content : <span>{notification.text}</span>}
											</p>
											<div className="mt-1 flex items-start justify-between gap-2">
												<p className="text-xs text-fg-muted">{notification.timestamp}</p>
												{notification.action && (
													<div className="mt-2 flex justify-end">
														<Button size="sm">{notification.action.label}</Button>
													</div>
												)}
											</div>
										</div>
									</div>
								</ListBoxItem>
							</React.Fragment>
						))}
					</ListBox>
				</div>
			</CardContent>
		</Card>
	);
}

const notifications = [
	{
		user: {
			name: "Guillermo Rauch",
			avatar: "https://avatars.githubusercontent.com/rauchg",
		},
		text: "starred your repository dotUI.",
		content: (
			<>
				starred <span className="font-semibold">mehdibha/dotUI</span>.
			</>
		),
		read: false,
		timestamp: "2 hours ago",
	},
	{
		user: {
			name: "Lee Robinson",
			avatar: "https://avatars.githubusercontent.com/leerob",
		},
		text: "invited you to the Vercel GitHub organization.",
		content: (
			<>
				invited you to join <span className="font-semibold">Cursor</span> on GitHub.
			</>
		),
		read: false,
		action: { label: "View invite" },
		timestamp: "7 hours ago",
	},
	{
		user: {
			name: "Tim Neutkens",
			avatar: "https://avatars.githubusercontent.com/timneutkens",
		},
		text: "published a new release v14.2.0-canary on vercel/next.js.",
		content: (
			<>
				published <span className="font-semibold">v14.2.0-canary</span> on
				<span className="font-semibold"> vercel/next.js</span>.
			</>
		),
		read: false,
		action: { label: "See release" },
		timestamp: "Yesterday",
	},
	{
		user: {
			name: "Steven Tey",
			avatar: "https://avatars.githubusercontent.com/steven-tey",
		},
		text: "opened a pull request: Improve docs.",
		content: (
			<>
				opened <span className="font-semibold">PR</span>:<span className="font-semibold"> Improve docs</span> in
				<span className="font-semibold"> mehdibha/dotUI</span>.
			</>
		),
		read: true,
		action: { label: "Review PR" },
		timestamp: "Yesterday",
	},
	{
		user: {
			name: "Shu Ding",
			avatar: "https://avatars.githubusercontent.com/shuding",
		},
		text: "starred your repository dotUI.",
		content: (
			<>
				starred <span className="font-semibold">mehdibha/dotUI</span>.
			</>
		),
		read: true,
		timestamp: "2 days ago",
	},
	{
		user: {
			name: "Delba de Oliveira",
			avatar: "https://avatars.githubusercontent.com/delbaoliveira",
		},
		text: "commented on issue: Add theme presets.",
		content: (
			<>
				commented on <span className="font-semibold">#128</span>:
				<span className="font-semibold"> Add theme presets</span>.
			</>
		),
		read: false,
		action: { label: "Reply" },
		timestamp: "3 days ago",
	},
];

import React from "react";
import { CheckIcon } from "lucide-react";

import { Avatar } from "@dotui/ui/components/avatar";
import { Badge } from "@dotui/ui/components/badge";
import { Button } from "@dotui/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@dotui/ui/components/card";
import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";
import { Separator } from "@dotui/ui/components/separator";
import { Tab, TabList, TabPanel, Tabs } from "@dotui/ui/components/tabs";
import { cn } from "@dotui/ui/lib/utils";

export function Notifications({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn("gap-2 pb-0", className)} {...props}>
      <CardHeader className="has-data-[slot=card-action]:grid-cols-[1fr_minmax(0,auto)] flex min-w-0 items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          Notifications
          <Badge size="sm" className="px-1.5">
            12
          </Badge>
        </CardTitle>
        <CardAction className="min-w-0">
          <Button size="sm">
            <span className="truncate">Mark all as read</span>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1 px-0">
        <Tabs className="h-full">
          <TabList className="pl-6">
            <Tab id="all">All</Tab>
            <Tab id="unread">Unread</Tab>
            <Tab id="read">Read</Tab>
          </TabList>
          <TabPanel id="all" className="h-full">
            <ListBox className="max-h-full w-full rounded-none border-0 bg-transparent p-0 [&_.separator]:my-0 [&_[data-slot=list-box-item]]:rounded-none">
              {notifications.map((notification, index) => (
                <React.Fragment key={index}>
                  <Separator />
                  <ListBoxItem>
                    <div className="flex items-start gap-3 py-2">
                      <Avatar
                        src={notification.user.avatar}
                        fallback={notification.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                        size="md"
                      />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">
                            {notification.user.name}
                          </span>{" "}
                          <span>{notification.text}</span>
                        </p>
                        <p className="text-fg-muted mt-1 text-xs">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                  </ListBoxItem>
                </React.Fragment>
              ))}
            </ListBox>
          </TabPanel>
        </Tabs>
      </CardContent>
    </Card>
  );
}

const notifications = [
  {
    user: {
      name: "Tony Reichert",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    },
    text: "requested to join your Acme organization.",
    timestamp: "2 hours ago",
  },
  {
    user: {
      name: "Ben Berman",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    },
    text: "modified the Brand logo file.",
    timestamp: "7 hours ago",
  },
  {
    user: {
      name: "Jane Doe",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    },
    text: "liked your post.",
    timestamp: "Yesterday",
  },
  {
    user: {
      name: "John Smith",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop&crop=face",
    },
    text: "started following you.",
    timestamp: "Yesterday",
  },
  {
    user: {
      name: "Jacob Jones",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
    },
    text: "mentioned you in a post.",
    timestamp: "2 days ago",
  },
];

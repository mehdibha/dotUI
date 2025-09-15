"use client";

import {
  BookIcon,
  ChevronRightIcon,
  ContrastIcon,
  LanguagesIcon,
  LogOutIcon,
  SettingsIcon,
  User2Icon,
  Users2Icon,
} from "lucide-react";

import { Avatar } from "@dotui/ui/components/avatar";
import { Card, CardContent, CardHeader } from "@dotui/ui/components/card";
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
} from "@dotui/ui/components/list-box";
import { Separator } from "@dotui/ui/components/separator";
import { cn } from "@dotui/ui/lib/utils";

export function AccountMenu({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn("min-w-56 gap-0 py-0", className)} {...props}>
      <CardHeader className="flex w-full items-center border-b !py-3 px-4">
        <Avatar src="https://github.com/mehdibha.png" size="sm" />
        <div className="w-full text-sm">
          <p className="font-semibold">mehdibha</p>
          <p className="text-fg-muted">
            <span className="truncate">hello@mehdibha.com</span>
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ListBox
          aria-label="Account Menu"
          className="h-full max-h-none w-full rounded-none border-0 bg-transparent [&_[data-slot='list-box-item']]:text-sm"
        >
          <ListBoxItem prefix={<User2Icon />}>Profile</ListBoxItem>
          <ListBoxItem prefix={<SettingsIcon />}>Settings</ListBoxItem>
          <ListBoxItem prefix={<BookIcon />}>Documentation</ListBoxItem>
          <ListBoxItem prefix={<Users2Icon />}>Community</ListBoxItem>
          <Separator />
          <ListBoxSection title="Preferences">
            <ListBoxItem
              prefix={<ContrastIcon />}
              suffix={<ChevronRightIcon />}
            >
              Theme
            </ListBoxItem>
            <ListBoxItem
              prefix={<LanguagesIcon />}
              suffix={<ChevronRightIcon />}
            >
              Language
            </ListBoxItem>
          </ListBoxSection>
          <Separator />
          <ListBoxItem suffix={<LogOutIcon />}>Log out </ListBoxItem>
        </ListBox>
      </CardContent>
    </Card>
  );
}

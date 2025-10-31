"use client";

import {
  BookIcon,
  ContrastIcon,
  LanguagesIcon,
  LogOutIcon,
  SettingsIcon,
  User2Icon,
  Users2Icon,
} from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";
import { Avatar } from "@dotui/registry/ui/avatar";
import { Card, CardContent, CardHeader } from "@dotui/registry/ui/card";
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@dotui/registry/ui/list-box";
import { Separator } from "@dotui/registry/ui/separator";

export function AccountMenu({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn("min-w-56 gap-0 py-0", className)} {...props}>
      <CardHeader className="flex w-full items-center border-b px-4 py-3">
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
          className="h-full max-h-none w-full rounded-none border-0 bg-transparent **:data-[slot='list-box-item']:text-sm"
        >
          <ListBoxItem>
            <User2Icon />
            Profile
          </ListBoxItem>
          <ListBoxItem>
            <SettingsIcon />
            Settings
          </ListBoxItem>
          <ListBoxItem>
            <BookIcon />
            Documentation
          </ListBoxItem>
          <ListBoxItem>
            <Users2Icon />
            Community
          </ListBoxItem>
          <Separator />
          <ListBoxSection>
            <ListBoxSectionHeader>Preferences</ListBoxSectionHeader>
            <ListBoxItem>
              <ContrastIcon />
              Theme
            </ListBoxItem>
            <ListBoxItem>
              <LanguagesIcon />
              Language
            </ListBoxItem>
          </ListBoxSection>
          <Separator />
          <ListBoxItem>
            <LogOutIcon />
            Log out
          </ListBoxItem>
        </ListBox>
      </CardContent>
    </Card>
  );
}

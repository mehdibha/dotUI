"use client";

import {
  ArrowRightIcon,
  BookIcon,
  ChevronRightIcon,
  ContrastIcon,
  LanguagesIcon,
  LogOutIcon,
  PlusCircleIcon,
  Settings2Icon,
  SettingsIcon,
  User2Icon,
  Users2Icon,
} from "lucide-react";

import { Avatar } from "@dotui/ui/components/avatar";
import { Badge } from "@dotui/ui/components/badge";
import { Button } from "@dotui/ui/components/button";
import { Card, CardContent, CardHeader } from "@dotui/ui/components/card";
import { Label } from "@dotui/ui/components/field";
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
} from "@dotui/ui/components/list-box";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuSection,
} from "@dotui/ui/components/menu";
import { Overlay } from "@dotui/ui/components/overlay";
import { Popover } from "@dotui/ui/components/popover";
import { Select, SelectItem, SelectRoot } from "@dotui/ui/components/select";
import { Separator } from "@dotui/ui/components/separator";
import { Switch } from "@dotui/ui/components/switch";
import { TextField } from "@dotui/ui/components/text-field";
import { ExternalLinkIcon } from "@dotui/ui/icons";
import { cn } from "@dotui/ui/lib/utils";

export function AccountMenu({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn("gap-0 py-0", className)} {...props}>
      <CardHeader className="flex items-center justify-between border-b !py-3 px-4">
        <div className="flex items-center gap-2">
          <Avatar src="https://github.com/mehdibha.png" size="sm" />
          <div className="text-sm">
            <div className="font-semibold">mehdibha</div>
            <div className="text-fg-muted">hello@mehdibha.com</div>
          </div>
        </div>
        {/* <Badge variant="accent-muted">Pro</Badge> */}
      </CardHeader>
      <CardContent className="p-0">
        <ListBox className="h-full max-h-none w-full rounded-none border-0 bg-transparent [&_[data-slot='list-box-item']]:text-sm">
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

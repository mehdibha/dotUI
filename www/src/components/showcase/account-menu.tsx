"use client"

import {
  BookIcon,
  ContrastIcon,
  LanguagesIcon,
  LogOutIcon,
  SettingsIcon,
  User2Icon,
  Users2Icon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar"
import { Card, CardContent, CardHeader } from "@/registry/ui/card"
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@/registry/ui/list-box"
import { Separator } from "@/registry/ui/separator"

// Row content sits on the card's padding line, under the user header.
const row = "px-3 roomy:px-5"

export function AccountMenu({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn("min-w-56 gap-0 py-0", className)} {...props}>
      <CardHeader className="flex w-full items-center border-b py-3">
        <Avatar size="sm">
          <AvatarImage src="https://github.com/mehdibha.png" alt="mehdibha" />
          <AvatarFallback>M</AvatarFallback>
        </Avatar>
        <div className="w-full text-sm compact:text-xs">
          <p className="font-semibold">mehdibha</p>
          <p className="text-fg-muted">
            <span className="truncate">hello@mehdibha.com</span>
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Showcase-only: items are actionable but intentionally lead nowhere. */}
        <ListBox
          aria-label="Account Menu"
          onAction={() => {}}
          className="h-full max-h-none w-full rounded-none border-0 bg-transparent px-1 **:data-separator:-mx-1"
        >
          <ListBoxItem textValue="Profile" className={row}>
            <User2Icon />
            Profile
          </ListBoxItem>
          <ListBoxItem textValue="Settings" className={row}>
            <SettingsIcon />
            Settings
          </ListBoxItem>
          <ListBoxItem textValue="Documentation" className={row}>
            <BookIcon />
            Documentation
          </ListBoxItem>
          <ListBoxItem textValue="Community" className={row}>
            <Users2Icon />
            Community
          </ListBoxItem>
          <Separator />
          <ListBoxSection>
            <ListBoxSectionHeader className={row}>
              Preferences
            </ListBoxSectionHeader>
            <ListBoxItem textValue="Theme" className={row}>
              <ContrastIcon />
              Theme
            </ListBoxItem>
            <ListBoxItem textValue="Language" className={row}>
              <LanguagesIcon />
              Language
            </ListBoxItem>
          </ListBoxSection>
          <Separator />
          <ListBoxItem textValue="Log out" className={row}>
            <LogOutIcon />
            Log out
          </ListBoxItem>
        </ListBox>
      </CardContent>
    </Card>
  )
}

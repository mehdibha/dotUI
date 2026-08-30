"use client"

import { SearchIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Kbd } from "@/registry/ui/kbd"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"
import { Separator } from "@/registry/ui/separator"

const people = [
  { name: "Marijn Haverbeke", handle: "marijnh" },
  { name: "Mark Dalgleish", handle: "markdalgleish" },
  { name: "Marcy Sutton", handle: "marcysutton" },
  { name: "Marvin Hagemeister", handle: "marvinhagemeister" },
]

export function AssignIssue({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>Assign issue</CardTitle>
        <CardDescription>DOT-312 · Checkout crash on iOS</CardDescription>
        <CardAction>
          <Kbd>A</Kbd>
        </CardAction>
      </CardHeader>
      <CardContent>
        {/* A closed RAC ComboBox gives an inline ListBox an empty collection, so
            the open state is composed statically: Input + standalone ListBox. */}
        <div className="space-y-2">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <Input
              aria-label="Change assignee"
              placeholder="Change assignee..."
              defaultValue="Mar"
            />
          </InputGroup>
          <div className="rounded-(--popover-radius) border border-border-elevated bg-popover shadow-[var(--shadow-overlay,var(--shadow-md))]">
            <ListBox
              aria-label="Assignee"
              items={people}
              selectionMode="single"
              defaultSelectedKeys={["markdalgleish"]}
            >
              {(person) => (
                <ListBoxItem
                  id={person.handle}
                  textValue={`${person.name} @${person.handle}`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2 py-0.5">
                    <Avatar size="sm" className="shrink-0">
                      <AvatarImage
                        src={`https://github.com/${person.handle}.png`}
                        alt={person.name}
                      />
                      <AvatarFallback>
                        {person.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{person.name}</p>
                      <p className="truncate text-xs text-fg-muted">
                        @{person.handle}
                      </p>
                    </div>
                  </div>
                </ListBoxItem>
              )}
            </ListBox>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex items-center gap-4 text-xs text-fg-muted">
        <span className="flex items-center gap-1.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          Navigate
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>↵</Kbd>
          Assign
        </span>
      </CardFooter>
    </Card>
  )
}

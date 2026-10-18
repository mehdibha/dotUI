"use client"

import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Description, Label } from "@/registry/ui/field"
import { Mention, type MentionProps } from "@/registry/ui/mention"
import { MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { TokenInput } from "@/registry/ui/token-field"

const people = [
  { id: "alexmiller", name: "Alex Miller" },
  { id: "sarahjones", name: "Sarah Jones" },
  { id: "davidkim", name: "David Kim" },
  { id: "emmawatson", name: "Emma Watson" },
  { id: "oliverliu", name: "Oliver Liu" },
  { id: "ellagreen", name: "Ella Green" },
  { id: "lucasbrown", name: "Lucas Brown" },
  { id: "amandarivera", name: "Amanda Rivera" },
]

export default function Demo({
  label = "Comment",
  placeholder = "Type @ to mention someone...",
  description = "",
  isDisabled = false,
  isReadOnly = false,
  placement = "bottom start",
}: {
  label?: string
  placeholder?: string
  description?: string
  isDisabled?: boolean
  isReadOnly?: boolean
  placement?: MentionProps["placement"]
} = {}) {
  return (
    <Mention
      allowsNewlines
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      placement={placement}
      className="w-[320px]"
    >
      {label && <Label>{label}</Label>}
      <TokenInput data-control-target placeholder={placeholder} />
      {description && <Description>{description}</Description>}
      <Popover>
        <MenuContent items={people} renderEmptyState={() => "No people found."}>
          {(person) => (
            <MenuItem id={person.id} textValue={person.id}>
              <Avatar size="sm">
                <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm">{person.name}</span>
                <span className="text-xs text-fg-muted">@{person.id}</span>
              </div>
            </MenuItem>
          )}
        </MenuContent>
      </Popover>
    </Mention>
  )
}

"use client"

import { List, ListItem, type ListProps } from "@/registry/ui/list"

export default function Demo({
  selectionMode = "single",
}: {
  selectionMode?: ListProps<object>["selectionMode"]
} = {}) {
  return (
    <List
      aria-label="Fruits"
      selectionMode={selectionMode}
      className="w-full max-w-sm"
    >
      <ListItem id="apple">Apple</ListItem>
      <ListItem id="banana">Banana</ListItem>
      <ListItem id="cherry">Cherry</ListItem>
    </List>
  )
}

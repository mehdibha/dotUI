"use client"

import {
  List,
  ListItem,
  ListItemDescription,
  ListItemLabel,
} from "@/registry/ui/list"

const plans = [
  { id: "free", name: "Free", description: "For trying things out" },
  { id: "pro", name: "Pro", description: "For everyday work" },
  { id: "team", name: "Team", description: "For growing teams" },
]

export default function Demo() {
  return (
    <List
      aria-label="Plan"
      items={plans}
      selectionMode="single"
      disallowEmptySelection
      defaultSelectedKeys={["pro"]}
      className="w-full max-w-sm"
    >
      {(plan) => (
        <ListItem textValue={plan.name}>
          <ListItemLabel>{plan.name}</ListItemLabel>
          <ListItemDescription>{plan.description}</ListItemDescription>
        </ListItem>
      )}
    </List>
  )
}

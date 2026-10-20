"use client"

import { useState } from "react"

import { Badge } from "@/registry/ui/badge"
import { Label } from "@/registry/ui/field"
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group"

import { Board, BoardSection, CAPTION } from "./board"

const STATUSES = [
  { variant: "neutral", label: "Neutral", text: "Draft" },
  { variant: "accent", label: "Accent", text: "Beta" },
  { variant: "success", label: "Success", text: "Live" },
  { variant: "warning", label: "Warning", text: "Paused" },
  { variant: "danger", label: "Danger", text: "Failed" },
] as const

const SIZES = ["lg", "md", "sm"] as const

const DEPLOYS = [
  { name: "acme-web", meta: "main · 2m ago", status: 2 },
  { name: "billing-api", meta: "fix/retry · 18m ago", status: 3 },
  { name: "docs", meta: "release/4.2 · 1h ago", status: 1 },
  { name: "mobile-sync", meta: "main · 3h ago", status: 4 },
] as const

const FILTERS = [
  { id: "open", name: "Status: Open" },
  { id: "me", name: "Assignee: Me" },
  { id: "bug", name: "Label: Bug" },
  { id: "high", name: "Priority: High" },
]

function Tags() {
  const [filters, setFilters] = useState(FILTERS)
  return (
    <>
      <TagGroup
        onRemove={(keys) => {
          const left = filters.filter((filter) => !keys.has(filter.id))
          setFilters(left.length ? left : FILTERS)
        }}
      >
        <Label>Filters</Label>
        <TagList items={filters}>
          {(filter) => <Tag>{filter.name}</Tag>}
        </TagList>
      </TagGroup>
      <TagGroup
        selectionMode="multiple"
        defaultSelectedKeys={["design", "research"]}
      >
        <Label>Teams</Label>
        <TagList>
          <Tag id="design">Design</Tag>
          <Tag id="engineering">Engineering</Tag>
          <Tag id="research">Research</Tag>
          <Tag id="support">Support</Tag>
        </TagList>
      </TagGroup>
    </>
  )
}

export default function BadgeBoard() {
  return (
    <Board id="badge">
      <BoardSection title="Variants" className="block">
        <div className="grid w-full gap-y-3 sm:grid-cols-5">
          {STATUSES.map(({ variant, label, text }) => (
            <div
              key={variant}
              className="grid grid-cols-[4.5rem_repeat(3,minmax(0,1fr))] items-center justify-items-start gap-x-3 sm:grid-cols-1 sm:justify-items-center sm:gap-y-3"
            >
              <span className={CAPTION}>{label}</span>
              {SIZES.map((size) => (
                <Badge key={size} variant={variant} size={size}>
                  {text}
                </Badge>
              ))}
            </div>
          ))}
        </div>
      </BoardSection>
      <div className="grid gap-8 lg:grid-cols-2">
        <BoardSection title="In context" className="flex-1">
          <ul className="w-full divide-y rounded-(--studio-radius-card) border bg-card">
            {DEPLOYS.map((deploy) => {
              const { variant, text } = STATUSES[deploy.status]
              return (
                <li
                  key={deploy.name}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium">
                      {deploy.name}
                    </span>
                    <span className="truncate text-xs text-fg-muted">
                      {deploy.meta}
                    </span>
                  </span>
                  <Badge variant={variant}>{text}</Badge>
                </li>
              )
            })}
          </ul>
        </BoardSection>
        <BoardSection
          title="Tag"
          className="flex-1 flex-col flex-nowrap items-stretch justify-center gap-6"
        >
          <Tags />
        </BoardSection>
      </div>
    </Board>
  )
}

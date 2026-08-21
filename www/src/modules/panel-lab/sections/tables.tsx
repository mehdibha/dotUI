"use client"

/* Tables — how a data grid separates its rows, and how loud its header row
   is. Two axes because real systems mix them freely. Separation: hairlines
   under every row is the modern default (shadcn, GitHub, Radix Themes);
   zebra striping survives in dense data tools and classic Bootstrap, where
   alternating fills carry the eye across wide rows without lines; plain
   drops both — the Linear list look, whitespace alone doing the work.
   Header: shadcn leaves it a bare muted-text line over the data, while Ant
   and Carbon paint a filled band (their gray-2/layer-accent) that anchors
   the columns before any row renders. The hero is one mini people table —
   the header wears the header axis, the body rows the separation axis, so
   every combination reads at a glance. */

import { cn } from "@/registry/lib/utils"
import { ControlGroup, SegmentedControlRow } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"

export const TABLE_DEFAULTS = {
  tableSeparation: "lines",
  tableHeader: "plain",
}

const HEADER_FAMILY = {
  plain: "border-b border-border/60 text-fg-muted",
  filled: "rounded-md bg-muted text-fg-muted",
}

const ROW_FAMILY = {
  lines: "not-last:border-b not-last:border-border/60",
  striped: "odd:bg-muted/40 rounded-md",
  plain: "",
}

const PEOPLE = [
  { name: "Ada", role: "Owner", status: "Active" },
  { name: "Lin", role: "Editor", status: "Active" },
  { name: "Sam", role: "Viewer", status: "Invited" },
]

const CELLS = "grid grid-cols-[1.1fr_1fr_auto] items-center gap-2 px-2"

function TablesHero({ state }: { state: LabState }) {
  return (
    <Hero className="gap-0 py-2.5">
      <div
        className={cn(
          CELLS,
          "h-6 text-[11px] font-medium",
          HEADER_FAMILY[state.tableHeader as keyof typeof HEADER_FAMILY],
        )}
      >
        <span className="truncate">Name</span>
        <span className="truncate">Role</span>
        <span>Status</span>
      </div>
      {PEOPLE.map((person) => (
        <div
          key={person.name}
          className={cn(
            CELLS,
            "h-8 text-xs tabular-nums",
            ROW_FAMILY[state.tableSeparation as keyof typeof ROW_FAMILY],
          )}
        >
          <span className="truncate font-medium text-fg">{person.name}</span>
          <span className="truncate text-fg-muted">{person.role}</span>
          <span className="flex items-center gap-1 rounded-full border border-border/60 px-1.5 py-px text-[10px] text-fg-muted">
            <span className="size-1 rounded-full bg-fg-muted" />
            {person.status}
          </span>
        </div>
      ))}
    </Hero>
  )
}

export function TablesSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <TablesHero state={state} />
      <SegmentedControlRow
        label="Separation"
        value={state.tableSeparation}
        onChange={set("tableSeparation")}
        options={[
          { value: "lines", label: "Lines" },
          { value: "striped", label: "Striped" },
          { value: "plain", label: "Plain" },
        ]}
      />
      <SegmentedControlRow
        label="Header"
        value={state.tableHeader}
        onChange={set("tableHeader")}
        options={[
          { value: "plain", label: "Plain" },
          { value: "filled", label: "Filled" },
        ]}
      />
    </ControlGroup>
  )
}

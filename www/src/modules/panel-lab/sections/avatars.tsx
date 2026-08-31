"use client"

/* Avatars — two axes. Shape: circle is the people-first default (GitHub
   users, Slack DMs, Google, Material) while the rounded square ≈ squircle
   marks entities — Slack workspaces, GitHub orgs, Notion pages, Linear
   teams — and some systems (Linear, Notion) run it for people too, so it's
   a real fork, not a per-instance prop. Fallback: what initials sit on when
   no image loads — a per-entity tinted wash (Radix Themes, Ant Design,
   Atlassian all hash the entity to a color, so adjacent avatars differ) vs
   one uniform gray (Geist, shadcn) that keeps fallbacks quiet at the cost
   of telling stacked strangers apart. The hero is where both axes earn
   their keep: an overlapping stack — the tinted wash separating neighbors
   or the gray fusing them — plus a standalone with a presence dot, whose
   corner the shape decides. */

import { cn } from "@/registry/lib/utils"

import { Hero } from "../hero"
import { ControlGroup, SegmentedControlRow } from "../rows"
import type { Lab, LabState } from "../state"

export const AVATAR_DEFAULTS = {
  avatarShape: "circle",
  avatarFallback: "tinted",
}

const SHAPE = {
  circle: "rounded-full",
  rounded: "rounded-lg",
}

/* Stand-ins for a per-entity hash: three intent-muted families, cycled. */
const TINTS = [
  "bg-accent-muted text-fg-accent",
  "bg-success-muted text-fg-success",
  "bg-warning-muted text-fg-warning",
]

export function LabAvatar({
  initials,
  index,
  state,
  className,
}: {
  initials: string
  /** Position in the entity list — what the tinted wash hashes on. */
  index: number
  state: LabState
  className?: string
}) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center text-[0.6875rem] font-medium",
        SHAPE[state.avatarShape as keyof typeof SHAPE],
        state.avatarFallback === "tinted"
          ? TINTS[index % TINTS.length]
          : "bg-muted text-fg-muted",
        className,
      )}
    >
      {initials}
    </span>
  )
}

export function AvatarsHero({ state }: { state: LabState }) {
  return (
    <Hero className="flex-row items-center justify-evenly py-6">
      <div className="flex -space-x-2">
        {["MB", "AK", "JL"].map((initials, i) => (
          <LabAvatar
            key={initials}
            initials={initials}
            index={i}
            state={state}
            className="ring-2 ring-bg"
          />
        ))}
      </div>
      <span className="relative">
        <LabAvatar initials="ES" index={0} state={state} />
        <span className="absolute right-0 bottom-0 size-2.5 rounded-full bg-success ring-2 ring-bg" />
      </span>
    </Hero>
  )
}

/** Collapsed-row summary: the avatar shape, and the fallback treatment. */
export function avatarsSummary(state: LabState): string {
  const shape = state.avatarShape === "rounded" ? "Rounded" : "Circle"
  const fallback = state.avatarFallback === "neutral" ? "Neutral" : "Tinted"
  return `${shape} · ${fallback} fallback`
}

export function AvatarsSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <AvatarsHero state={state} />
      <SegmentedControlRow
        label="Shape"
        value={state.avatarShape}
        onChange={set("avatarShape")}
        options={[
          { value: "circle", label: "Circle" },
          { value: "rounded", label: "Rounded" },
        ]}
      />
      <SegmentedControlRow
        label="Fallback"
        value={state.avatarFallback}
        onChange={set("avatarFallback")}
        options={[
          { value: "tinted", label: "Tinted" },
          { value: "neutral", label: "Neutral" },
        ]}
      />
    </ControlGroup>
  )
}

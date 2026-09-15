"use client"

/* Avatars — two axes. Shape: circle is the people-first default (GitHub
   users, Slack DMs, Google, Material) while the rounded square ≈ squircle
   marks entities — Slack workspaces, GitHub orgs, Notion pages, Linear
   teams — and some systems (Linear, Notion) run it for people too, so it's
   a real fork, not a per-instance prop. Fallback: what initials sit on when
   no image loads — a per-entity tinted wash (Radix Themes, Ant Design,
   Atlassian all hash the entity to a color, so adjacent avatars differ) vs
   one uniform gray (Geist, shadcn) that keeps fallbacks quiet at the cost
   of telling stacked strangers apart. */

import { FALLBACK_OPTIONS, SHAPE_OPTIONS } from "../axes/avatars"
import { ControlGroup, SegmentedControlRow } from "../rows"
import type { Studio } from "../state"

export function AvatarsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SegmentedControlRow
        label="Shape"
        value={state.avatarShape}
        onChange={set("avatarShape")}
        options={SHAPE_OPTIONS}
      />
      <SegmentedControlRow
        label="Fallback"
        value={state.avatarFallback}
        onChange={set("avatarFallback")}
        options={FALLBACK_OPTIONS}
      />
    </ControlGroup>
  )
}

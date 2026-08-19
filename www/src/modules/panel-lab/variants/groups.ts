/* The decision-weight grouping from docs/create-experience-spec.md: eight
   identity chapters that define ~90% of a system's read, then refinement
   families. Both layout variants (structured scroll, drill-in) consume this —
   the chapter list itself stays flat in state.ts. */

export const IDENTITY_IDS = [
  "color",
  "typography",
  "shape",
  "space",
  "surfaces",
  "buttons",
  "inputs",
  "focus",
]

export interface ChapterGroup {
  label: string
  ids: string[]
}

export const FAMILIES: ChapterGroup[] = [
  {
    label: "Foundations",
    ids: [
      "icons",
      "motion",
      "cursor",
      "selection",
      "scrollbars",
      "disabled",
      "links",
    ],
  },
  {
    label: "Actions",
    ids: ["button-groups", "toggles", "segmented-control", "kbd"],
  },
  {
    label: "Forms",
    ids: [
      "switch",
      "checkbox",
      "radio",
      "choice-cards",
      "input-groups",
      "number-field",
      "otp-field",
      "pickers",
      "calendar",
      "sliders",
    ],
  },
  { label: "Overlays", ids: ["menus", "dialogs", "popovers", "tooltips"] },
  { label: "Navigation", ids: ["tabs", "breadcrumbs", "pagination"] },
  { label: "Feedback", ids: ["notices", "skeleton", "spinner", "progress"] },
  { label: "Display", ids: ["badges", "avatars", "tables", "accordion"] },
]

/* Mehdi's drill-in verdict (Aug 2026): the index shows exactly two sections —
   Foundations, then Components — with a Templates section planned. Identity
   emphasis survives as ordering: the identity foundations open the list. */
export const SECTIONS: ChapterGroup[] = [
  {
    label: "Foundations",
    ids: [
      "color",
      "typography",
      "shape",
      "space",
      "surfaces",
      "focus",
      "icons",
      "motion",
      "cursor",
      "selection",
      "scrollbars",
      "disabled",
      "links",
    ],
  },
  {
    label: "Components",
    ids: [
      "buttons",
      "inputs",
      "button-groups",
      "toggles",
      "segmented-control",
      "kbd",
      "switch",
      "checkbox",
      "radio",
      "choice-cards",
      "input-groups",
      "number-field",
      "otp-field",
      "pickers",
      "calendar",
      "sliders",
      "menus",
      "dialogs",
      "popovers",
      "tooltips",
      "tabs",
      "breadcrumbs",
      "pagination",
      "notices",
      "skeleton",
      "spinner",
      "progress",
      "badges",
      "avatars",
      "tables",
      "accordion",
    ],
  },
]

import type { Chapter } from "../state"

/** Resolve a grouping's ids against the flat chapter list. */
export function resolveGroups(
  groups: ChapterGroup[],
  chapters: Chapter[],
): Array<{ label: string; chapters: Chapter[] }> {
  const byId = new Map(chapters.map((chapter) => [chapter.id, chapter]))
  return groups.map((group) => ({
    label: group.label,
    chapters: group.ids
      .map((id) => byId.get(id))
      .filter((chapter): chapter is Chapter => chapter !== undefined),
  }))
}

/** The flat chapter list reshaped by decision weight: Identity first, then
 *  the refinement families, each group in spec order. */
export function groupChapters(
  chapters: Chapter[],
): Array<{ label: string; chapters: Chapter[] }> {
  const byId = new Map(chapters.map((chapter) => [chapter.id, chapter]))
  return [{ label: "Identity", ids: IDENTITY_IDS }, ...FAMILIES].map(
    (group) => ({
      label: group.label,
      chapters: group.ids
        .map((id) => byId.get(id))
        .filter((chapter): chapter is Chapter => chapter !== undefined),
    }),
  )
}

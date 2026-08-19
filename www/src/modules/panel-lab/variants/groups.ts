/* The drill-in index grouping (docs/create-experience-spec.md): exactly two
   sections — Foundations, then Components — with a Templates section planned.
   Identity emphasis survives as ordering: the identity foundations open the
   list. The chapter list itself stays flat in state.ts. */

import type { Chapter } from "../state"

export interface ChapterGroup {
  label: string
  ids: string[]
}

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

/* The drill-in index taxonomy (docs/create-experience-spec.md, revised by the
   Aug 2026 taxonomy panel): two sections — Foundations, then Components
   (Templates planned) — built from COMPOSITE index chapters. A composite
   bundles one or more state.ts chapters into a single index card and chapter
   page: the first member is the host body, later members render as titled
   subsections, and the card's modified dot covers every member's axes. The
   flat chapter list in state.ts stays untouched. */

import type { Chapter, LabState } from "../state"

interface CompositeDef {
  id: string
  label?: string
  /** state.ts chapter ids; first is the host body (untitled on the page). */
  members: string[]
}

/* Merges Mehdi adopted from the panel (Aug 2026). Interaction is the one
   composite with no host chapter — every member renders titled. */
const COMPOSITES: CompositeDef[] = [
  {
    id: "interaction",
    label: "Interaction",
    members: ["cursor", "selection", "scrollbars", "disabled"],
  },
  {
    id: "buttons",
    members: ["buttons", "button-groups", "toggles", "segmented-control"],
  },
  {
    id: "inputs",
    members: ["inputs", "input-groups", "number-field", "otp-field"],
  },
]

export const SECTIONS: Array<{ label: string; ids: string[] }> = [
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
      "interaction",
    ],
  },
  {
    label: "Components",
    ids: [
      "buttons",
      "inputs",
      "links",
      "kbd",
      "switch",
      "checkbox",
      "radio",
      "choice-cards",
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

export interface IndexChapter {
  id: string
  label: string
  /** ≥1 chapters; the first is the host body, the rest render titled. */
  members: Chapter[]
  /** Union of every member's defaults — drives the modified dot. */
  defaults: Partial<LabState>
  /** Untitled host body, or all-titled for hostless composites. */
  hostless: boolean
}

/** Resolve the sections' ids (plain chapter ids or composite ids) against the
 *  flat chapter list. */
export function resolveIndex(
  chapters: Chapter[],
): Array<{ label: string; chapters: IndexChapter[] }> {
  const byId = new Map(chapters.map((chapter) => [chapter.id, chapter]))
  const toIndexChapter = (id: string): IndexChapter | undefined => {
    const composite = COMPOSITES.find((c) => c.id === id)
    if (!composite) {
      const chapter = byId.get(id)
      return chapter
        ? {
            id,
            label: chapter.label,
            members: [chapter],
            defaults: chapter.defaults,
            hostless: false,
          }
        : undefined
    }
    const members = composite.members
      .map((memberId) => byId.get(memberId))
      .filter((chapter): chapter is Chapter => chapter !== undefined)
    const host = byId.get(composite.id)
    return {
      id: composite.id,
      label: composite.label ?? host?.label ?? composite.id,
      members,
      defaults: Object.assign({}, ...members.map((m) => m.defaults)),
      hostless: !host,
    }
  }
  return SECTIONS.map((section) => ({
    label: section.label,
    chapters: section.ids
      .map(toIndexChapter)
      .filter((chapter): chapter is IndexChapter => chapter !== undefined),
  }))
}

/* The drill-in index taxonomy (docs/create-experience-spec.md, revised Aug
   2026): untitled family clusters — each renders as its own card, grouping
   alone carries the structure. Identity comes first; set-once axes (focus,
   icons, motion, interaction) sit in their own lesser-weight cluster. Built
   from COMPOSITE index chapters: a composite bundles one or more state.ts
   chapters into a single index card and chapter page — the first member is
   the host body, later members render as titled subsections, and the card's
   modified dot covers every member's axes. The flat chapter list in state.ts
   stays untouched. */

import type { Chapter, StudioState } from "./state"

interface CompositeDef {
  id: string
  label?: string
  /** state.ts chapter ids; first is the host body (untitled on the page). */
  members: string[]
}

/* Merges Mehdi adopted from the panel (Aug 2026). */
const COMPOSITES: CompositeDef[] = [
  {
    id: "buttons",
    members: ["buttons", "button-groups", "toggles", "segmented-control"],
  },
  {
    id: "inputs",
    members: ["inputs", "input-groups", "number-field", "otp-field"],
  },
]

export const GROUPS: string[][] = [
  // Identity — how the system reads at a glance.
  ["color", "typography", "icons", "shape", "space", "surfaces"],
  // Page chrome — the browser-level surface, set once.
  ["browser"],
  // Component states — cross-component treatments every control below wears.
  ["focus", "invalid", "disabled", "motion", "mobile"],
  // Component clusters — title + specimen, the demo carries the values.
  // Core components.
  ["buttons", "inputs"],
  // Selection controls.
  ["switch", "checkbox", "radio", "choice-cards"],
  // Fields.
  ["pickers", "calendar", "sliders"],
  // Overlays.
  ["menus", "dialogs", "popovers", "tooltips"],
  // Navigation.
  ["links", "tabs", "breadcrumbs", "pagination"],
  // Feedback.
  ["alert", "toast", "skeleton", "spinner", "progress"],
  // Display.
  ["badges", "kbd", "avatars", "tables", "accordion"],
  // Charts.
  ["charts"],
]

/* The panel is being rebuilt one chapter at a time (Sept 2026): only chapters
   validated in the new page show. Everything else keeps its axes and section
   (they still feed resolve()) but stays off the page and out of search until
   its turn. */
const VALIDATED = new Set([
  "color",
  "typography",
  "icons",
  "shape",
  "space",
  "surfaces",
  "browser",
])

export interface IndexChapter {
  id: string
  label: string
  /** ≥1 chapters; the first is the host body, the rest render titled. */
  members: Chapter[]
  /** Union of every member's defaults — drives the modified dot. */
  defaults: Partial<StudioState>
  /** The host member's live value, when its demo can't carry it. */
  summary?: (state: StudioState) => string
  /** Untitled host body, or all-titled for hostless composites. */
  hostless: boolean
}

/** Resolve the groups' ids (plain chapter ids or composite ids) against the
 *  flat chapter list. */
export function resolveIndex(chapters: Chapter[]): IndexChapter[] {
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
            summary: chapter.summary,
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
      summary: members[0]?.summary,
      hostless: !host,
    }
  }
  return GROUPS.flat()
    .filter((id) => VALIDATED.has(id))
    .map(toIndexChapter)
    .filter((chapter): chapter is IndexChapter => chapter !== undefined)
}

"use client"

/* The versions of the /create panel. Each version is the WHOLE panel — same
   chrome, its own chapter list — so they're read against each other end to
   end rather than section by section.

   Adding a version: copy the previous list, point the chapters you're
   changing at NEW body components, and append it below. Never edit a body an
   older version still names, or that version moves with the experiment and
   stops being a reference. */

import { IdealColorSectionBody } from "./color-ideal"
import { WorkingColorSectionBody } from "./color-working"
import {
  BUTTON_KEYS_V2,
  COLOR_KEYS,
  COMPONENT_KEYS,
  EFFECT_KEYS,
  EFFECT_KEYS_V2,
  FOCUS_KEYS_V2,
  ICON_KEYS,
  INPUT_KEYS_V2,
  SHAPE_KEYS,
  SHAPE_KEYS_V2,
  SPACE_KEYS_V2,
  SURFACE_KEYS_V2,
  TYPE_KEYS,
  WORKING_COLOR_KEYS,
} from "./data"
import {
  ButtonsSectionBody,
  ComponentsSectionBody,
  EffectsSectionBody,
  EffectsSectionBodyV2,
  FocusSectionBody,
  IconsSectionBody,
  IconsSectionBodyV2,
  InputsSectionBody,
  ShapeSectionBody,
  ShapeSectionBodyV2,
  SpaceSectionBody,
  TypographySectionBody,
  TypographySectionBodyV2,
} from "./sections"
import { SurfacesSectionBody } from "./surfaces"
import type { Chapter } from "./variants/chapter"

/* The v1 chapter list; v2 swaps bodies per section below. */
const SHARED_CHAPTERS: Chapter[] = [
  {
    id: "typography",
    label: "Type",
    keys: TYPE_KEYS,
    Body: TypographySectionBody,
  },
  {
    id: "icons",
    label: "Icons",
    keys: ICON_KEYS,
    Body: IconsSectionBody,
  },
  {
    id: "shape",
    label: "Shape & space",
    keys: SHAPE_KEYS,
    Body: ShapeSectionBody,
  },
  {
    id: "details",
    label: "Details",
    keys: EFFECT_KEYS,
    Body: EffectsSectionBody,
  },
  {
    id: "components",
    label: "Components",
    keys: COMPONENT_KEYS,
    Body: ComponentsSectionBody,
  },
]

export interface PanelVersion {
  id: string
  label: string
  /** One line on what this version changes — shown on its gallery card. */
  summary: string
  chapters: Chapter[]
}

export const PANEL_VERSIONS: PanelVersion[] = [
  {
    id: "v1",
    label: "v1",
    summary:
      "The baseline. Engine-true Color section with a fixed light/dark pair.",
    chapters: [
      {
        id: "color",
        label: "Color",
        keys: COLOR_KEYS,
        Body: IdealColorSectionBody,
      },
      ...SHARED_CHAPTERS,
    ],
  },
  {
    id: "v2",
    label: "v2 (wip)",
    summary:
      "Color modes become a user-defined set — one to many, with archetypes and per-mode contrast. Shape and Space split; radius speaks px (#575) with a nested-corner preview and a corner-shape axis. Surfaces lands as its own chapter (#590): a delineation recipe (hairline · adaptive · shadow · outline) that absorbs shadows and the overlay material. Every section opens on a hero following one contract (hero.tsx): shared stage, hover-peek/click-pin inspection, mono readout — Type gains a live role specimen, Icons a real-registry grid. Components splits into per-family sections — Buttons and Inputs first — each opening on working specimens. Focus is a dedicated chapter (six-system audit): one ring recipe — style · width · offset · color · field treatment — with category rules (fields, menu items) derived, never per-component.",
    chapters: [
      {
        id: "color",
        label: "Color",
        keys: WORKING_COLOR_KEYS,
        Body: WorkingColorSectionBody,
      },
      ...SHARED_CHAPTERS.flatMap((chapter) => {
        if (chapter.id === "typography")
          return [{ ...chapter, Body: TypographySectionBodyV2 }]
        if (chapter.id === "icons")
          return [{ ...chapter, Body: IconsSectionBodyV2 }]
        if (chapter.id === "shape")
          return [
            {
              id: "shape",
              label: "Shape",
              keys: SHAPE_KEYS_V2,
              Body: ShapeSectionBodyV2,
            },
            {
              id: "space",
              label: "Space",
              keys: SPACE_KEYS_V2,
              Body: SpaceSectionBody,
            },
          ]
        if (chapter.id === "details")
          return [
            {
              id: "surfaces",
              label: "Surfaces",
              keys: SURFACE_KEYS_V2,
              Body: SurfacesSectionBody,
            },
            {
              id: "focus",
              label: "Focus",
              keys: FOCUS_KEYS_V2,
              Body: FocusSectionBody,
            },
            {
              id: "cursor",
              label: "Cursor",
              keys: EFFECT_KEYS_V2,
              Body: EffectsSectionBodyV2,
            },
          ]
        if (chapter.id === "components")
          return [
            {
              id: "buttons",
              label: "Buttons",
              keys: BUTTON_KEYS_V2,
              Body: ButtonsSectionBody,
            },
            {
              id: "inputs",
              label: "Inputs",
              keys: INPUT_KEYS_V2,
              Body: InputsSectionBody,
            },
          ]
        return [chapter]
      }),
    ],
  },
]

export function findVersion(id: string): PanelVersion | undefined {
  return PANEL_VERSIONS.find((version) => version.id === id)
}

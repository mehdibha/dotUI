/* Segmented control — the container+chip archetype: how the chip reads
   against the track, and how the track is drawn.

   Engine: `selected` and `track` enum params on `segmented-control`. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const SEGMENTED_DEFAULTS = {
  segmentedSelected: "flat",
  segmentedTrack: "filled",
}

export const SELECTED_OPTIONS = [
  {
    value: "raised",
    label: "Raised",
    description:
      "A page-colored chip on a small shadow with a 1px hairline ring, full " +
      "text color.",
    seenIn: ["Radix Themes", "Primer", "Chakra UI", "Mantine"],
  },
  {
    value: "flat",
    label: "Flat",
    description:
      "A tone-on-tone gray chip (the neutral's selected step) with " +
      "full-contrast text and a faint shadow, no ring.",
    seenIn: ["Geist", "Material 3"],
  },
  {
    value: "inverse",
    label: "Inverse",
    description:
      "An inverse chip (near-black in light mode, near-white in dark) with " +
      "page-colored text.",
    seenIn: ["Carbon"],
  },
]

export const TRACK_OPTIONS = [
  {
    value: "filled",
    label: "Filled",
    description: "A muted gray well with 3px of padding around the segments.",
    seenIn: ["Radix Themes", "Primer", "Chakra UI", "Mantine"],
  },
  {
    value: "outline",
    label: "Outline",
    description:
      "A transparent track inside a 1px border; one padding pixel is traded " +
      "for the border so the control keeps its size.",
    seenIn: ["Geist", "Carbon", "Material 3"],
  },
]

const pick = (options: { value: string }[], value: string, fallback: string) =>
  options.some((o) => o.value === value) ? value : fallback

export function resolveSegmentedControl(state: StudioState): Resolved {
  return {
    params: {
      "segmented-control": {
        selected: pick(SELECTED_OPTIONS, state.segmentedSelected, "flat"),
        track: pick(TRACK_OPTIONS, state.segmentedTrack, "filled"),
      },
    },
  }
}

export const SEGMENTED_SPEC = {
  label: "Segmented control",
  description:
    "The single-select control whose selected segment is a chip sliding " +
    "along a track.",
  axes: {
    segmentedSelected: {
      label: "Selected",
      description: "How the selected segment's chip reads against the track.",
      value: { type: "enum", options: SELECTED_OPTIONS },
      guidance:
        "Of 7 checked, 4 lift a white chip off a gray well (Radix Themes, " +
        "Primer, Chakra UI, Mantine); Geist and Material 3 fill the chip " +
        "flat; Carbon's content switcher goes inverse. Raised pairs with a " +
        "Filled track, Flat and Inverse with either.",
    },
    segmentedTrack: {
      label: "Track",
      description: "The container the segments sit in.",
      value: { type: "enum", options: TRACK_OPTIONS },
      guidance:
        "Filled wells dominate the raised-chip school (Radix Themes, " +
        "Primer, Chakra UI, Mantine); Geist, Carbon and Material 3 outline " +
        "the track instead. Outline reads lighter on busy surfaces.",
    },
  },
} satisfies ChapterSpec<typeof SEGMENTED_DEFAULTS>

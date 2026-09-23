/* Badges — and Tags, one synced chip language: a tag is a badge that can be
   removed, so both wear the same style and shape. Style is how much intent
   color the chip carries; shape is pills vs small (sm-rung) corners.

   Engine: `style` is an enum param on both `badge` and `tag-group` (a synced
   group — one axis writes both). On the badge it sets the default of the
   `appearance` prop, which stays API for the products that mix chips, and
   inverse re-points the neutral palette's fill to the primary; on the tag it
   is the fill. Shape rides on the `--studio-badge-radius` / `--studio-tag-radius`
   surface vars (token-field tokens sit on `--studio-tag-radius` too), resolved to
   plain `rounded-*` on export. Pill is the registry default and emits
   nothing: badges are full-round, tags keep their `radius-control` corners. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const BADGE_DEFAULTS = {
  badgeStyle: "solid",
  badgeShape: "pill",
}

export const STYLE_OPTIONS = [
  {
    value: "solid",
    label: "Solid",
    description:
      "The intent's solid fill with its on-color text (accent, success, " +
      "danger…); the neutral badge is a light gray fill.",
    seenIn: ["shadcn/ui", "Spectrum 2", "Fluent 2"],
  },
  {
    value: "soft",
    label: "Soft",
    description:
      "A pale wash of the intent with intent-colored text, no border. The " +
      "neutral badge's wash is half the muted fill — barely visible on a " +
      "card, so neutral chips on cards want Outline or Soft outline.",
    seenIn: ["Radix Themes", "Chakra UI", "Fluent 2", "Spectrum 2"],
    caution:
      "On cards the neutral chip's gray wash all but vanishes, so it reads " +
      "as plain text; Soft outline adds a border.",
  },
  {
    value: "outline",
    label: "Outline",
    description:
      "A 1px intent-colored border and intent-colored text on no fill.",
    seenIn: ["Primer", "Spectrum 2", "Fluent 2", "shadcn/ui"],
  },
  {
    value: "soft-outline",
    label: "Soft outline",
    description: "The soft wash plus a 1px intent-colored border.",
    seenIn: ["Ant Design", "Radix Themes"],
  },
  {
    value: "inverse",
    label: "Inverse",
    description:
      "Solid intent fills, but the neutral badge and tags take the Buttons " +
      "primary fill with its on-color: near-black by default, the brand " +
      "color when buttons are brand.",
    seenIn: ["shadcn/ui", "Geist", "Chakra UI"],
  },
]

export const SHAPE_OPTIONS = [
  {
    value: "pill",
    label: "Pill",
    description:
      "Fully rounded badges; tags and tokens keep the Controls radius.",
    seenIn: ["shadcn/ui", "Primer", "Fluent 2"],
  },
  {
    value: "rounded",
    label: "Rounded",
    description:
      "The sm rung (half the base radius, 5px at the default) on badges, " +
      "tags and tokens alike.",
    seenIn: ["Ant Design", "Radix Themes"],
  },
]

const SHAPE_TOKENS: Record<string, string> = {
  rounded: "var(--radius-sm)",
}

const pick = (options: { value: string }[], value: string, fallback: string) =>
  options.some((o) => o.value === value) ? value : fallback

export function resolveBadges(state: StudioState): Resolved {
  const style = pick(STYLE_OPTIONS, state.badgeStyle, "solid")
  const tokens: Record<string, string> = {}
  const radius = SHAPE_TOKENS[state.badgeShape]
  if (radius) {
    tokens["--studio-badge-radius"] = radius
    tokens["--studio-tag-radius"] = radius
  }
  return {
    tokens,
    params: { badge: { style }, "tag-group": { style } },
  }
}

export const BADGE_SPEC = {
  label: "Badges",
  description:
    "One chip language for badges and tags: how much intent color a chip " +
    "carries and the shape of its corners. A tag is a removable badge, so " +
    "both always match.",
  axes: {
    badgeStyle: {
      label: "Style",
      description:
        "The default fill treatment of badges and tags. On badges it sets " +
        "the default of the `appearance` prop, so a product can still mix " +
        "styles (inverse also moves the neutral badge's solid fill to the " +
        "primary); on tags it is the fill.",
      value: { type: "enum", options: STYLE_OPTIONS },
      guidance:
        "Systems split on the default: Spectrum 2 and Fluent 2 fill solid; " +
        "shadcn's default badge is inverse (the primary's near-black); " +
        "Radix Themes and Chakra default to soft; Primer outlines; Ant tags " +
        "wash and outline. Most ship several as variants. Soft keeps dense " +
        "tables readable; solid and inverse suit sparse, high-signal status.",
    },
    badgeShape: {
      label: "Shape",
      description: "The corner shape of badges, tags and token-field tokens.",
      value: { type: "enum", options: SHAPE_OPTIONS },
      guidance:
        "shadcn, Primer and Fluent 2 default to pills; Ant tags and Radix " +
        "Themes badges use small theme-scaled corners. Rounded reads as " +
        "data (labels, statuses); pill reads as friendlier and pairs with " +
        "pill buttons.",
    },
  },
} satisfies ChapterSpec<typeof BADGE_DEFAULTS>

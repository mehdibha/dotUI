/* Guidance — how an agent should build product UI with the system: its copy,
   its hierarchy, its patterns. Nothing here renders: the choices ride in the
   preset and become rules in the exported agent docs (export/agent-docs.ts).
   Each axis is a place real systems disagree (Sept 2026 survey — Atlassian,
   Material, Polaris, GOV.UK, Vercel, Linear, Apple); practice they share is
   fixed in the docs, not offered here. */

import type { StudioState } from "./index"

export const GUIDANCE_DEFAULTS = {
  guideCasing: "sentence",
  guideVoice: "warm",
  guideCopy: "explanatory",
  guideEmoji: "never",
  guideActions: "one",
  guideColor: "sparing",
  guideEyebrows: "never",
  guideForms: "grouped",
  guideChoices: "visible",
  guideData: "tables",
  guideIcons: "labeled",
}

type GuidanceKey = keyof typeof GUIDANCE_DEFAULTS

export interface GuidanceOption {
  value: string
  label: string
  /** The rules this choice writes into the agent docs. */
  rules: string[]
}

export interface GuidanceAxis {
  group: "Copy" | "Hierarchy" | "Patterns"
  /** The first option is the fallback for an off-list value. */
  options: [GuidanceOption, ...GuidanceOption[]]
}

export const GUIDANCE_AXES: Record<GuidanceKey, GuidanceAxis> = {
  guideCasing: {
    group: "Copy",
    options: [
      {
        value: "sentence",
        label: "Sentence",
        rules: [
          "Use sentence case for every heading, label, button, tab and menu item: “Create project”, not “Create Project”.",
        ],
      },
      {
        value: "title",
        label: "Title",
        rules: [
          "Use Title Case for headings, buttons, tabs and menu items: “Create Project”.",
          "Keep sentence case for descriptions, helper text, toasts and error messages.",
        ],
      },
    ],
  },
  guideVoice: {
    group: "Copy",
    options: [
      {
        value: "plain",
        label: "Plain",
        rules: [
          "Write plain, neutral copy: no exclamation marks, jokes or personality. Say what happened and what to do next.",
        ],
      },
      {
        value: "warm",
        label: "Warm",
        rules: [
          "Stay neutral in the flow. A little warmth is allowed in empty states and success messages only.",
          "Never be playful in errors, warnings or destructive confirmations.",
        ],
      },
      {
        value: "playful",
        label: "Playful",
        rules: [
          "The product has a personality: friendly, conversational copy is welcome in empty states, onboarding and success messages.",
          "Errors, warnings and destructive confirmations stay plain and specific.",
        ],
      },
    ],
  },
  guideCopy: {
    group: "Copy",
    options: [
      {
        value: "terse",
        label: "Terse",
        rules: [
          "Keep copy minimal: labels over sentences. No description under page titles; helper text only when a field is genuinely ambiguous.",
        ],
      },
      {
        value: "explanatory",
        label: "Guided",
        rules: [
          "Explain as you go: give each page a one-line description and give a field a `Description` whenever its format or consequence isn't obvious.",
        ],
      },
    ],
  },
  guideEmoji: {
    group: "Copy",
    options: [
      {
        value: "never",
        label: "Never",
        rules: ["Never use emoji in UI copy."],
      },
      {
        value: "celebrate",
        label: "Moments",
        rules: [
          "Emoji only in celebratory moments (a first success, a finished onboarding) — never in labels, navigation or errors.",
        ],
      },
    ],
  },
  guideActions: {
    group: "Hierarchy",
    options: [
      {
        value: "one",
        label: "One",
        rules: [
          'At most one `variant="primary"` button per view (page, dialog, card). Every other action is `secondary` or `quiet`.',
        ],
      },
      {
        value: "two",
        label: "Up to two",
        rules: [
          'At most two prominent actions per view; when there are two, one is `variant="primary"` and the other `secondary`.',
        ],
      },
      {
        value: "free",
        label: "Per section",
        rules: [
          "A primary button may repeat when each marks the main action of its own section (pricing tiers, marketing blocks) — never twice in one section.",
        ],
      },
    ],
  },
  guideColor: {
    group: "Hierarchy",
    options: [
      {
        value: "sparing",
        label: "Sparing",
        rules: [
          "Keep screens neutral: color marks the primary action, focus, selection and status — nothing else.",
          "Don't tint backgrounds, headings or icons for decoration.",
        ],
      },
      {
        value: "expressive",
        label: "Expressive",
        rules: [
          "Color may carry emphasis beyond status: `bg-accent-muted` to highlight featured content, `text-fg-accent` icons to aid scanning.",
        ],
      },
    ],
  },
  guideEyebrows: {
    group: "Hierarchy",
    options: [
      {
        value: "never",
        label: "Never",
        rules: [
          "No eyebrow labels (small text above a heading) and no all-caps text.",
        ],
      },
      {
        value: "allowed",
        label: "Allowed",
        rules: [
          "An eyebrow (small muted text above a heading) is allowed on page and marketing section headers — at most one per section.",
        ],
      },
    ],
  },
  guideForms: {
    group: "Patterns",
    options: [
      {
        value: "grouped",
        label: "Grouped",
        rules: [
          "Keep related fields on one page: group them with `Fieldset` + `Legend`, stack them in `FieldGroup`, and end with one primary submit.",
        ],
      },
      {
        value: "stepped",
        label: "Stepped",
        rules: [
          "Split forms longer than ~7 fields into steps with visible progress; each step ends with one primary “Continue”.",
        ],
      },
      {
        value: "single",
        label: "One per page",
        rules: [
          "Ask one question per screen, with a single primary “Continue”.",
          "Before the final submit, show a summary the user can edit.",
        ],
      },
    ],
  },
  guideChoices: {
    group: "Patterns",
    options: [
      {
        value: "visible",
        label: "Visible",
        rules: [
          "Show options when there are few: 2–5 exclusive options → `RadioGroup` (`SegmentedControl` for switching views); 6+ → `Select`; long or searchable lists → `Combobox`.",
        ],
      },
      {
        value: "compact",
        label: "Compact",
        rules: [
          "Prefer compact controls: exclusive options → `Select`, searchable lists → `Combobox`. Use `RadioGroup` only when each option needs a description.",
        ],
      },
    ],
  },
  guideData: {
    group: "Patterns",
    options: [
      {
        value: "tables",
        label: "Tables",
        rules: [
          "Show collections as a `Table` by default — comparing rows is the job. Cards only for visual content (images, previews).",
        ],
      },
      {
        value: "cards",
        label: "Cards",
        rules: [
          "Show collections as a grid of `Card`s or a list by default; use a `Table` when users compare values across rows.",
        ],
      },
    ],
  },
  guideIcons: {
    group: "Patterns",
    options: [
      {
        value: "labeled",
        label: "Labeled",
        rules: [
          "Icons accompany text, they don't replace it. Icon-only buttons belong in toolbars and dense rows only.",
        ],
      },
      {
        value: "forward",
        label: "Iconic",
        rules: [
          "Use icons generously to aid scanning: navigation, list items, section headers and icon-only toolbar actions.",
        ],
      },
    ],
  },
}

export type { GuidanceKey }

export function guidanceOption(key: GuidanceKey, state: StudioState) {
  const { options } = GUIDANCE_AXES[key]
  return options.find((o) => o.value === state[key]) ?? options[0]
}

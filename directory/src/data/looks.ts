import { z } from "zod"

/* systems/<slug>/looks.json: what a capture read off a real product, one
   file per system. www's `scripts/system-looks.ts` writes it from a preset's
   pack and census; nobody edits it by hand. build:data validates every file
   against this schema, and each system page imports only its own. */

export const MODES = ["light", "dark"] as const
export const STATES = [
  "rest",
  "hover",
  "pressed",
  "focus",
  "selected",
  "disabled",
  "open",
] as const
export const COLOR_ROLES = [
  "canvas",
  "surface",
  "raised",
  "overlay",
  "ink",
  "inkMuted",
  "border",
  "accent",
  "onAccent",
  "link",
  "focus",
  "danger",
  "success",
  "warning",
] as const

/** The registry components every captured system is expected to show. One
 *  with no looks shows as an empty slot. */
export const CORE_COMPONENTS = [
  "button",
  "toggle-button",
  "link",
  "badge",
  "tabs",
  "segmented-control",
  "text-field",
  "select",
  "combobox",
  "checkbox",
  "radio-group",
  "switch",
  "slider",
  "menu",
  "list-box",
  "dialog",
  "popover",
  "tooltip",
  "toast",
  "table",
  "card",
  "avatar",
  "progress-bar",
  "separator",
  "kbd",
  "breadcrumbs",
  "pagination",
]

export type Mode = (typeof MODES)[number]
export type State = (typeof STATES)[number]

/** Where a value comes from, strongest first. "inferred": no capture backs it. */
const source = z.enum(["token", "census", "probe", "pixel", "inferred"])
const count = z.object({ px: z.number(), count: z.number() })
const swatch = z.object({
  color: z.string(),
  l: z.number(),
  c: z.number(),
  h: z.number(),
  count: z.number(),
  uses: z.array(z.string()),
})
const values = z.record(z.string(), z.string())
const byMode = <T extends z.ZodType>(schema: T) =>
  z.object({ light: schema.optional(), dark: schema.optional() })

const reading = z.object({
  /** At rest, the full value set. In any other state, only what changes. */
  values,
  /** The custom property behind each value, where one was found. */
  vars: values.optional(),
  source,
  /** The frozen copy and the crop, as paths under the system's refs folder. */
  copy: z.string().optional(),
  crop: z.string().optional(),
})

const look = z.object({
  /** The census look id: "button.1". */
  id: z.string(),
  count: z.number(),
  /** Indexes into capture.pages. */
  pages: z.array(z.number()),
  /** A look found only in this state, with no rest look of its shape: its
   *  rest values are that state's. */
  is: z.enum(["disabled", "selected", "open"]).optional(),
  /** The probe part that measures this look on both sides. */
  part: z.string().optional(),
  states: z.partialRecord(z.enum(STATES), byMode(reading)),
  /** Where the preset misses this look. */
  off: z
    .array(
      z.object({
        prop: z.string(),
        mode: z.enum(MODES),
        state: z.enum(STATES),
        theirs: z.string(),
        ours: z.string(),
      }),
    )
    .optional(),
})

export const looksFileSchema = z.object({
  version: z.literal(1),
  slug: z.string(),
  preset: z.string(),
  capture: z.object({
    probe: z.string(),
    date: z.string(),
    pages: z.array(
      z.object({
        key: z.string(),
        modes: z.array(z.enum(MODES)),
        signedIn: z.boolean(),
        how: z.enum(["headless", "local", "harness"]),
      }),
    ),
    /** What the capture can't read yet: those sections show as empty slots. */
    missing: z.array(z.string()),
  }),
  color: z.object({
    modes: byMode(
      z.object({
        neutrals: z.array(swatch),
        accents: z.array(
          z.object({
            hue: z.number(),
            count: z.number(),
            steps: z.array(swatch),
          }),
        ),
        neutralHue: z.number().optional(),
        roles: z
          .partialRecord(
            z.enum(COLOR_ROLES),
            z.object({ color: z.string(), source }),
          )
          .optional(),
      }),
    ),
    tokens: z.array(
      z.object({
        name: z.string(),
        count: z.number(),
        feeds: z.array(z.string()),
        light: z.string().optional(),
        dark: z.string().optional(),
      }),
    ),
  }),
  type: z.object({
    families: z.array(z.object({ family: z.string(), count: z.number() })),
    styles: z.array(
      z.object({
        fontSize: z.string(),
        fontWeight: z.string(),
        lineHeight: z.string().optional(),
        letterSpacing: z.string().optional(),
        fontFamily: z.string().optional(),
        textTransform: z.string().optional(),
        count: z.number(),
        groups: z.array(z.string()),
      }),
    ),
  }),
  shape: z.object({
    radius: z.array(count.extend({ groups: z.array(z.string()) })),
    pills: z.array(z.string()),
  }),
  spacing: z.object({
    grid: z.number(),
    steps: z.array(count),
    heights: z.record(z.string(), z.array(count)),
  }),
  elevation: z.object({
    shadows: z.array(
      z.object({
        value: z.string(),
        count: z.number(),
        groups: z.array(z.string()),
      }),
    ),
  }),
  /** Keyed by registry component; census groups with none go under "other". */
  components: z.record(
    z.string(),
    z.object({
      groups: z.array(z.string()),
      /** How many looks the census found in these groups. */
      found: z.number(),
      /** The most used ones, plus every look a probe part reads. */
      looks: z.array(look),
    }),
  ),
  /** Looks no axis covers, from the preset's gaps.json. */
  gaps: z.array(
    z.object({
      look: z.string(),
      title: z.string(),
      note: z.string().optional(),
      standin: z.string().optional(),
      source: z.string(),
    }),
  ),
})

export type LooksFile = z.infer<typeof looksFileSchema>
export type Look = z.infer<typeof look>
export type Reading = z.infer<typeof reading>

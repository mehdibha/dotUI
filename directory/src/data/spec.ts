import { z } from "zod"

import { STATES } from "./looks"

/* systems/<slug>/spec.json: each component's census looks as a grid of
   variants × sizes, with the states read on each cell. `presets:spec`
   (packages/capture/scripts/spec.ts) writes it from a capture's census;
   nobody edits it by hand. Names here are only what the capture read (a
   data attribute, a class token, a Storybook story's args): docs.json adds
   and corrects them, keyed by component, group and variant or size key. */

const values = z.record(z.string(), z.string())
const byMode = <T extends z.ZodType>(schema: T) =>
  z.object({ light: schema.optional(), dark: schema.optional() })

const name = z.object({
  value: z.string(),
  from: z.enum(["attribute", "class", "storybook"]),
  /** "data-variant", "class.size", "args.variant"… */
  key: z.string(),
})

/** The name's value as a slug ("primary"), else a prefix ("v-", "s-") and a
 *  hash of its values: stable across captures. */
const axis = {
  key: z.string(),
  name: name.optional(),
  count: z.number(),
}

const grid = z.object({
  /** The census group: "button", "segment"… */
  group: z.string(),
  /** Most used first. Each one's fill, ink, edge, shadow and weight. */
  variants: z.array(z.object({ ...axis, values: byMode(values) })),
  /** Most used first. Height, padding, font and icon size. */
  sizes: z.array(z.object({ ...axis, values })),
  cells: z.array(
    z.object({
      variant: z.string(),
      size: z.string(),
      /** The census look id of the cell's most used look. */
      look: z.string(),
      count: z.number(),
      /** Other looks in the same cell, most used first. */
      also: z.array(z.string()).optional(),
      /** What the look adds to its variant's and size's values. */
      values: byMode(values).optional(),
      states: byMode(z.array(z.enum(STATES))),
      forced: z.array(z.enum(["disabled", "invalid", "selected"])).optional(),
      /** Frozen copies, as paths under the system's refs folder. */
      copies: z.partialRecord(z.enum(STATES), byMode(z.string())).optional(),
    }),
  ),
  /** Looks found only disabled, invalid, selected or open. */
  unplaced: z
    .array(
      z.object({
        look: z.string(),
        is: z.enum(["disabled", "invalid", "selected", "open"]),
      }),
    )
    .optional(),
})

export const specFileSchema = z.object({
  version: z.literal(1),
  slug: z.string(),
  capture: z.object({
    probe: z.string(),
    /** The census version that read it. */
    census: z.string(),
    date: z.string(),
  }),
  /** Keyed by registry component, as in looks.json. */
  components: z.record(
    z.string(),
    z.object({
      /** What the product calls its parts (data-component, data-slot). */
      names: z.array(name).optional(),
      grids: z.array(grid),
    }),
  ),
})

export type SpecFile = z.infer<typeof specFileSchema>
export type SpecGrid = z.infer<typeof grid>

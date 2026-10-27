import { z } from "zod"

import { MODES } from "./looks"
import { provenanceSchema } from "./schema"

/* systems/<slug>/blocks.json: composed pieces of the real product (a card,
   a dialog, a page header) frozen whole, and the regions of the pages they
   sit on. `presets:blocks` writes it from the pack's picks; nobody edits it
   by hand. docs.json names and explains them, keyed by block name and page
   key. */

/** Page coordinates: x, y, width, height. */
const box = z.tuple([z.number(), z.number(), z.number(), z.number()])

export const blocksFileSchema = z.object({
  version: z.literal(1),
  slug: z.string(),
  provenance: provenanceSchema,
  capture: z.object({
    /** The capture kit version that froze them. */
    census: z.string(),
    date: z.string(),
  }),
  blocks: z.array(
    z.object({
      /** Kebab-case, unique in the system. */
      name: z.string(),
      /** The pack's page key it was frozen on. */
      page: z.string(),
      /** The steps that opened it, a dialog or a menu ({ click: selector },
       *  { press: "Enter" }…). Absent at rest. */
      pass: z.array(z.record(z.string(), z.string())).optional(),
      /** On the page, or on the viewport when it was opened. */
      box,
      /** Frozen copies, as paths under the system's folder. */
      copies: z.partialRecord(z.enum(MODES), z.string()),
      /** Text the product doesn't ship swapped for placeholder text, and
       *  images turned to gray boxes. */
      redacted: z.boolean().optional(),
    }),
  ),
  pages: z.array(
    z.object({
      key: z.string(),
      modes: z.array(z.enum(MODES)),
      viewport: z.object({ width: z.number(), height: z.number() }),
      /** The full page's height. */
      height: z.number(),
      /** Its landmarks at rest: banner, navigation, main, complementary,
       *  contentinfo, search, form. */
      regions: z.array(z.object({ role: z.string(), box })),
    }),
  ),
})

export type BlocksFile = z.infer<typeof blocksFileSchema>
export type Block = BlocksFile["blocks"][number]
export type BlocksPage = BlocksFile["pages"][number]

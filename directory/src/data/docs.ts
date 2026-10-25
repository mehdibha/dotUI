import { z } from "zod"

import { provenanceSchema } from "./schema"

/* systems/<slug>/docs.json: the written layer of a system's docs. An AI pass
   over the capture's full-page shots and copies writes it, a person checks
   it; looks.json, spec.json and blocks.json stay machine output.
   - sections: one per foundation id or component key. Entries name, explain
     or leave out spec.json's variants and sizes, keyed by grid group, then
     by variant or size key.
   - blocks and pages: the Blocks tab, keyed by blocks.json's block names and
     page keys. */

const entry = z.object({
  /** Its name, where the product gives none or a wrong one. "ai": named by
   *  the AI pass; "docs": the product's own docs name it. */
  name: z
    .object({ value: z.string(), from: z.enum(["ai", "docs"]) })
    .optional(),
  /** What it is for, when the name alone doesn't say. */
  note: z.string().optional(),
  /** Why it is left out: another component's look, or noise. */
  hide: z.string().optional(),
})

export const docsFileSchema = z.object({
  version: z.literal(1),
  slug: z.string(),
  provenance: provenanceSchema,
  sections: z.record(
    z.string(),
    z.object({
      status: z.enum(["reviewed", "checked"]),
      // The product's names for it, when the capture's list is off.
      called: z.array(z.string()).optional(),
      summary: z.string().optional(),
      groups: z
        .record(
          z.string(),
          z.object({
            variants: z.record(z.string(), entry).optional(),
            sizes: z.record(z.string(), entry).optional(),
          }),
        )
        .optional(),
      /** How the product uses it, one short sentence each. */
      usage: z.array(z.string()).optional(),
      /** What the section still lacks: a pass for the next capture. */
      missing: z.array(z.string()).optional(),
    }),
  ),
  /** What each page is, and how it is laid out. */
  pages: z
    .record(
      z.string(),
      z.object({
        title: z.string(),
        summary: z.string(),
        /** Measured off its regions and block boxes, one fact each. */
        layout: z.array(z.string()).optional(),
      }),
    )
    .optional(),
  blocks: z
    .record(
      z.string(),
      z.object({
        title: z.string(),
        note: z.string().optional(),
        /** The components it is built from, as component keys. */
        uses: z.array(z.string()).optional(),
        /** Why it is left out: another block holds all of it. */
        hide: z.string().optional(),
      }),
    )
    .optional(),
})

export type DocsFile = z.infer<typeof docsFileSchema>
export type DocsSection = DocsFile["sections"][string]
export type DocsEntry = z.infer<typeof entry>

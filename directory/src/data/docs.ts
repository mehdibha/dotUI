import { z } from "zod"

/* systems/<slug>/docs.json: the written layer of a system's docs, one entry
   per block (a foundation id or a component key). An AI pass over the
   capture's full-page shots and copies writes it, a person checks it;
   looks.json and spec.json stay machine output. Entries here name, explain
   or leave out spec.json's variants and sizes, keyed by grid group, then by
   variant or size key. */

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
  blocks: z.record(
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
      /** What the block still lacks: a pass for the next capture. */
      missing: z.array(z.string()).optional(),
    }),
  ),
})

export type DocsFile = z.infer<typeof docsFileSchema>
export type DocsBlock = DocsFile["blocks"][string]
export type DocsEntry = z.infer<typeof entry>

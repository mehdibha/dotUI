/**
 * End-to-end test of the codeOptions seam: custom code options are encoded
 * into an export query, decoded back, fed to the publisher, and formatted —
 * proving the choices a user makes in /studio reach the exported source. Exercises codec ↔ publish ↔ oxfmt together (the parts the unit
 * specs cover in isolation).
 */

import { format } from "oxfmt"
import { describe, expect, test } from "vitest"

import { buttonPublishable } from "@/publisher/__fixtures__/button-publishable"
import { DEFAULT_CODE_OPTIONS } from "@/publisher/code-options"
import { publish } from "@/publisher/publish"
import { DEFAULTS } from "@/modules/studio/axes"
import { resolveDesignSystem } from "@/modules/studio/resolve"

import { decode, encodeQuery, readParams } from "./codec"

// Mirrors the fixed baseline the /r/$name route uses (formatting isn't a
// codeOptions axis — the consumer reformats with their own rules).
const OUTPUT_FORMAT = { printWidth: 80 } as const

async function exportButton(codeOptions: typeof DEFAULT_CODE_OPTIONS) {
  // 1. Encode the export query, code options included.
  const query = encodeQuery(DEFAULTS, { codeOptions })
  expect(query, "non-default code options must reach the query").toContain(
    "&code=",
  )

  // 2. Decode it back the way a /r/* route does.
  const decoded = decode(readParams(new URLSearchParams(query)))
  if (!decoded.ok) throw new Error(decoded.reason)
  const ds = resolveDesignSystem(decoded.state)

  // 3. Publish + format exactly like routes/r/$name.tsx.
  const { rawContent } = publish({
    publishable: buttonPublishable,
    preset: {
      density: ds.density,
      componentParams: ds.componentParams,
      codeOptions: decoded.codeOptions,
    },
  })
  const { code } = await format("button.tsx", rawContent, OUTPUT_FORMAT)
  return { decoded: decoded.codeOptions, code }
}

describe("codeOptions end-to-end (preset → publish → format)", () => {
  test("classArrays:true keeps grouped tv class lists in the exported file", async () => {
    const { decoded, code } = await exportButton({
      ...DEFAULT_CODE_OPTIONS,
      classArrays: true,
    })

    // codec round-trip preserved the option
    expect(decoded?.classArrays).toBe(true)

    // base groups stay separate array elements
    expect(code).toContain('"focus-reset focus-visible:focus-ring",')
  })

  test("sectionComments survives the codec round-trip", async () => {
    const { decoded } = await exportButton({
      ...DEFAULT_CODE_OPTIONS,
      sectionComments: false,
    })
    expect(decoded?.sectionComments).toBe(false)
  })
})

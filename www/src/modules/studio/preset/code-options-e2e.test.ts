/**
 * End-to-end test of the codeOptions seam: a DesignSystem with custom code
 * options is encoded to a preset, decoded back, fed to the publisher, and
 * formatted — proving the choices a user makes in /create reach the exported
 * source. Exercises codec ↔ publish ↔ oxfmt together (the parts the unit
 * specs cover in isolation).
 */

import { format } from "oxfmt"
import { describe, expect, test } from "vitest"

import { buttonPublishable } from "@/publisher/__fixtures__/button-publishable"
import { DEFAULT_CODE_OPTIONS } from "@/publisher/code-options"
import { publish } from "@/publisher/publish"
import { DEFAULTS } from "@/modules/studio/axes"
import { resolveDesignSystem } from "@/modules/studio/resolve"

import { decodePreset, encodePreset } from "./codec"

// Mirrors the fixed baseline the /r/$name route uses (formatting isn't a
// codeOptions axis — the consumer reformats with their own rules).
const OUTPUT_FORMAT = { printWidth: 80 } as const

async function exportButton(codeOptions: typeof DEFAULT_CODE_OPTIONS) {
  // 1. Encode the user's design system (with code options) to a preset blob.
  const encoded = encodePreset({ state: DEFAULTS, codeOptions })
  expect(encoded, "non-default code options must produce a preset").toBeTruthy()

  // 2. Decode it back the way a /r/* route does.
  const decoded = decodePreset(encoded as string)
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

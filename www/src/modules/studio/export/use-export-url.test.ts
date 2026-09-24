import { describe, expect, it } from "vitest"

import { buildInitCommands } from "@/modules/docs/install-commands"
import { ORIGIN, PRESETS } from "@/modules/presets/presets-data"
import { decodePreset, encodeState } from "@/modules/studio/preset/codec"

import { createPresetUrl } from "./use-export-url"

const HOST = "https://dotui.org"

describe("createPresetUrl", () => {
  it("never echoes a raw ?preset= param into the shell command", () => {
    const raw = decodeURIComponent(
      "x%22%3Btouch%20%2Ftmp%2Fpwned-dotui%3Becho%20%22",
    )
    const url = createPresetUrl(HOST, decodePreset(raw))("/r/init")

    expect(url).toBe(`${HOST}/r/init`)
    expect(buildInitCommands(url).npm).toBe(
      `npx shadcn@latest init "${HOST}/r/init"`,
    )
  })

  it("carries a real preset as its canonical base64url encoding", () => {
    const spotify = PRESETS.find((p) => p.id === "spotify")
    const encoded = spotify && encodeState(spotify.state)
    const url = createPresetUrl(HOST, decodePreset(encoded ?? ""))("/r/init")

    expect(url).toBe(`${HOST}/r/init?preset=${encoded}`)
    expect(encoded).toMatch(/^[\w-]+$/)
  })

  it("leaves Origin, the defaults, on the plain URL", () => {
    expect(createPresetUrl(HOST, { state: ORIGIN.state })("/r/init")).toBe(
      `${HOST}/r/init`,
    )
  })
})

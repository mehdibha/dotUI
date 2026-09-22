import { describe, expect, it } from "vitest"

import { DEFAULTS } from "../axes"
import { decodePreset, encodeState } from "../preset/codec"
import { buildAgentDocs } from "./agent-docs"

const file = (docs: ReturnType<typeof buildAgentDocs>, path: string) =>
  docs.find((doc) => doc.path.endsWith(path))?.content ?? ""

describe("buildAgentDocs", () => {
  it("ships DESIGN.md, the skill and the rule pointers", () => {
    expect(buildAgentDocs({ state: DEFAULTS }).map((d) => d.path)).toEqual([
      "DESIGN.md",
      ".agents/skills/design-system/SKILL.md",
      ".agents/skills/design-system/references/components.md",
      ".agents/skills/design-system/references/patterns.md",
      ".claude/rules/design-system.md",
      ".cursor/rules/design-system.mdc",
    ])
  })

  it("writes Stitch front matter with resolved colors", () => {
    const design = file(
      buildAgentDocs({ state: DEFAULTS, name: "Acme" }),
      "DESIGN.md",
    )
    expect(design).toMatch(/^---\nversion: alpha\nname: "Acme"\n/)
    expect(design).toMatch(/\n {2}primary: "oklch\(/)
  })

  it("turns guidance choices into rules and example copy", () => {
    const state = { ...DEFAULTS, guideCasing: "title", guideData: "cards" }
    const docs = buildAgentDocs({ state })
    expect(file(docs, "DESIGN.md")).toContain("Use Title Case")
    expect(file(docs, "patterns.md")).toContain("New Project")
    expect(file(docs, "patterns.md")).toContain("<Card>")
    expect(file(docs, "patterns.md")).not.toContain("<TableContainer>")
  })

  it("imports icons from the chosen library", () => {
    const docs = buildAgentDocs({
      state: { ...DEFAULTS, iconLibrary: "tabler" },
    })
    expect(file(docs, "patterns.md")).toContain('from "@tabler/icons-react"')
  })

  it("round-trips guidance through the preset codec", () => {
    const state = { ...DEFAULTS, guideVoice: "playful" }
    const encoded = encodeState(state)
    expect(encoded).toBeDefined()
    expect(decodePreset(encoded ?? "").state.guideVoice).toBe("playful")
  })
})

import { deflateRaw } from "pako"
import { describe, expect, it } from "vitest"

import { invalidPresetResponse, resolveRequestPreset } from "./registry-preset"

function encodeRaw(payload: unknown): string {
  const compressed = deflateRaw(JSON.stringify(payload), { level: 9 })
  const binary = String.fromCharCode(...compressed)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

describe("invalid ?preset= response", () => {
  it("bounds the echoed issues", async () => {
    const s: Record<string, number> = { ["x".repeat(5_000)]: 1 }
    for (let i = 0; i < 600; i++) s[`k${i}`] = 1
    const resolved = await resolveRequestPreset(encodeRaw({ v: 4, s }))
    if (resolved.ok) throw new Error("expected invalid")
    expect(resolved.issues.length).toBeGreaterThan(20)

    const response = invalidPresetResponse(resolved.issues)
    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.issues).toHaveLength(20)
    expect(body.issues[0].key).toBe(`${"x".repeat(64)}…`)
    expect(body.omitted).toBe(resolved.issues.length - 20)
    expect(JSON.stringify(body).length).toBeLessThan(2_000)
  })
})

import { readFileSync, writeFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

import { SCHEMA } from "@/modules/studio/axes"
import type { AxisSpec } from "@/modules/studio/axes/schema"

import { VERSION } from "./migrations"

const SNAPSHOT = new URL("./schema-snapshot.json", import.meta.url)

const HOW = `Stored strings still hold the old value. Bump the codec version: append
a MIGRATIONS step in preset/migrations.ts that maps the old values onto their
successors (or names them in \`dropped\`), then pin the new schema:
  UPDATE_SCHEMA_SNAPSHOT=1 pnpm vitest run schema-compat && pnpm check:fix`

/** What `now` no longer accepts that `pinned` did. */
function narrowed(pinned: AxisSpec, now: AxisSpec | undefined): string[] {
  if (!now) return ["removed"]
  if (now.kind !== pinned.kind) return [`${pinned.kind} → ${now.kind}`]
  switch (pinned.kind) {
    case "enum":
      return pinned.options
        .filter((option) => !(now as typeof pinned).options.includes(option))
        .map((option) => `option "${option}" removed`)
    case "number": {
      const next = now as typeof pinned
      return [
        ...(next.min > pinned.min || next.max < pinned.max
          ? [`range ${pinned.min}–${pinned.max} → ${next.min}–${next.max}`]
          : []),
        ...(pinned.nullable && !next.nullable
          ? ["null no longer allowed"]
          : []),
      ]
    }
    case "color":
    case "font":
      return pinned.auto && !(now as typeof pinned).auto
        ? ["Auto ('') no longer allowed"]
        : []
    case "modes":
      return Object.entries(pinned.bg).flatMap(([polarity, { min, max }]) => {
        const next = (now as typeof pinned).bg[polarity as "light" | "dark"]
        return !next || next.min > min || next.max < max
          ? [`${polarity} bg range narrowed`]
          : []
      })
    case "boolean":
      return []
  }
}

describe("schema compatibility", () => {
  const snapshot = JSON.parse(readFileSync(SNAPSHOT, "utf8")) as {
    version: number
    schema: Record<string, AxisSpec>
  }
  const problems = Object.entries(snapshot.schema).flatMap(([key, spec]) =>
    narrowed(spec, SCHEMA[key as keyof typeof SCHEMA]).map(
      (problem) => `${key}: ${problem}`,
    ),
  )

  it("still accepts every value the pinned schema did", () => {
    if (process.env.UPDATE_SCHEMA_SNAPSHOT) {
      if (snapshot.version === VERSION && problems.length > 0)
        throw new Error(`${problems.join("\n")}\n\n${HOW}`)
      writeFileSync(
        SNAPSHOT,
        `${JSON.stringify({ version: VERSION, schema: SCHEMA }, null, 2)}\n`,
      )
      return
    }
    expect(problems, `\n${problems.join("\n")}\n\n${HOW}\n`).toEqual([])
    expect(
      snapshot.version,
      `The snapshot pins v${snapshot.version}; pin v${VERSION}:\n  UPDATE_SCHEMA_SNAPSHOT=1 pnpm vitest run schema-compat`,
    ).toBe(VERSION)
  })

  it("flags a removed key or option", () => {
    const pinned: AxisSpec = { kind: "enum", options: ["a", "b"] }
    expect(narrowed(pinned, undefined)).toEqual(["removed"])
    expect(narrowed(pinned, { kind: "enum", options: ["a"] })).toEqual([
      'option "b" removed',
    ])
    expect(
      narrowed(pinned, { kind: "enum", options: ["a", "b", "c"] }),
    ).toEqual([])
    expect(
      narrowed(
        { kind: "number", min: 0, max: 2, nullable: true },
        { kind: "number", min: 0, max: 1 },
      ),
    ).toEqual(["range 0–2 → 0–1", "null no longer allowed"])
  })
})

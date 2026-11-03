import { describe, expect, test } from "vitest"

import { classesOf, lookOf } from "./button-look"

const params = {
  style: "flat",
  secondary: "flat",
  linkColor: "accent",
  linkUnderline: "never",
}

const labels = (classes: string, mode: "light" | "dark" = "light") =>
  lookOf(classes, mode).map(({ label, value }) => `${label}: ${value}`)

describe("lookOf", () => {
  test("reads a flat primary's fill and ink, no states", () => {
    expect(labels(classesOf("primary", params))).toEqual([
      "Background: primary",
      "Text: fg-on-primary",
    ])
  })

  test("splits shadows into inner and drop layers", () => {
    const look = labels(classesOf("primary", { ...params, style: "rim-light" }))
    expect(look.filter((l) => l.startsWith("Inner shadow"))).toHaveLength(3)
    expect(look.filter((l) => l.startsWith("Drop shadow"))).toHaveLength(2)
    expect(look).toContain("Overlay border: 1px white/14")
  })

  test("resolves a plate var and lets dark win in dark", () => {
    const classes = classesOf("secondary", { ...params, secondary: "raised" })
    expect(labels(classes)).toContain("Background: card")
    expect(labels(classes, "dark")).toContain("Background: neutral")
    expect(labels(classes)).toContain("Border: 1px border-control")
  })
})

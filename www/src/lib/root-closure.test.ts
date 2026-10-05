import { describe, expect, it } from "vitest"

import { parseRootClosure } from "./root-closure"

describe("parseRootClosure", () => {
  it("reads past escaped quotes in selectors", () => {
    const css = [
      ":root { --a: 1; }",
      ".font-features-\\[\\'calt\\'\\] { font-feature-settings: 'calt'; }",
      ":root { --b: var(--a); }",
      ".dark { --c: 2; }",
    ].join("\n")
    expect(parseRootClosure(css)).toEqual({
      light: "\t--a: 1;\n\t--b: var(--a);",
      dark: "\t--c: 2;",
    })
  })
})

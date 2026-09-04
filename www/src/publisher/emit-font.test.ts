import { describe, expect, test } from "vitest"

import {
  emitFontItem,
  fontItemNamesForTokens,
  parseFontItemName,
} from "./emit-font"

type FontItem = {
  type: string
  title?: string
  font: {
    family: string
    provider: string
    import: string
    variable: string
    subsets?: string[]
    dependency?: string
  }
}

describe("emitFontItem", () => {
  test("body face: --font-sans, fontsource variable package, next/font import", () => {
    const item = emitFontItem("font-figtree") as unknown as FontItem
    expect(item.type).toBe("registry:font")
    expect(item.title).toBe("Figtree")
    expect(item.font).toMatchObject({
      provider: "google",
      import: "Figtree",
      variable: "--font-sans",
      subsets: ["latin"],
      dependency: "@fontsource-variable/figtree",
    })
    // fontsource registers the variable face under "<Family> Variable".
    expect(item.font.family).toMatch(/^'Figtree Variable', /)
  })

  test("heading and mono prefixes, multi-word families", () => {
    const heading = emitFontItem(
      "font-heading-source-sans-3",
    ) as unknown as FontItem
    expect(heading.title).toBe("Source Sans 3 (Heading)")
    expect(heading.font.variable).toBe("--font-heading")
    expect(heading.font.import).toBe("Source_Sans_3")
    expect(heading.font.dependency).toBe("@fontsource-variable/source-sans-3")

    const mono = emitFontItem("font-mono-jetbrains-mono") as unknown as FontItem
    expect(mono.font.variable).toBe("--font-mono")
    expect(mono.font.family).toMatch(/^'JetBrains Mono Variable', /)
  })

  test("unknown families and non-font names are not items", () => {
    expect(emitFontItem("font-not-a-real-face")).toBeUndefined()
    expect(emitFontItem("button")).toBeUndefined()
    expect(parseFontItemName("font-heading-nope")).toBeUndefined()
  })
})

describe("fontItemNamesForTokens", () => {
  test("one item per font token, in token order, skipping unknown families", () => {
    expect(
      fontItemNamesForTokens({
        "--font-mono": "'JetBrains Mono', ui-monospace, 'SF Mono', monospace",
        "--font-sans": "'Figtree', ui-sans-serif, system-ui, sans-serif",
        "--font-heading": "'Figtree', ui-sans-serif, system-ui, sans-serif",
        "--radius": "1rem",
      }),
    ).toEqual([
      "font-figtree",
      "font-heading-figtree",
      "font-mono-jetbrains-mono",
    ])
    expect(
      fontItemNamesForTokens({ "--font-sans": "'Comic Sans MS', cursive" }),
    ).toEqual([])
  })
})

import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

import { lstarOf, toOklch } from "@dotui/colors"

import { SCHEMA, validate } from "../axes"
import type { StudioState } from "../axes"
import { SOLID_LEAVES } from "../axes/color"
import { roleRung } from "../axes/shape"
import {
  cleanImportName,
  fitDensity,
  fitRadius,
  impliedTint,
  importDesignMd,
} from "./index"
import type { DesignMdImport, ImportItem } from "./index"
import {
  box,
  dim,
  isRecord,
  parseDesignMd,
  proseFonts,
  REF_BUDGET_WARNING,
  shadows,
  shadowStrength,
} from "./parse"
import { resolveFamily } from "./typography"

const fixture = (name: string) =>
  readFileSync(new URL(`./fixtures/${name}.md`, import.meta.url), "utf8")

const md = (frontmatter: string, body = "") =>
  `---\n${frontmatter.trim()}\n---\n\n# Fixture Inline\n\n${body}`

const FIXTURES = [
  "light-full",
  "dark-only",
  "achromatic-primary",
  "stitch-minimal",
  "prose-only",
  "broken-yaml",
  "refs",
  "square",
  "pill",
  "fonts",
  "empty",
]

const items = (result: DesignMdImport): ImportItem[] => [
  ...result.report.mapped,
  ...result.report.approximated,
  ...result.report.unmapped,
]
const statusOf = (result: DesignMdImport, id: string) =>
  (["mapped", "approximated", "unmapped"] as const).find((status) =>
    result.report[status].some((item) => item.id === id),
  )
const itemOf = (result: DesignMdImport, id: string) =>
  items(result).find((item) => item.id === id)

function fullState(result: DesignMdImport): StudioState {
  const valid = validate(result.state)
  if (!valid.ok) throw new Error("invalid state")
  return valid.state
}

const ROLE_KEYS = {
  control: "roleControl",
  card: "roleCard",
  surface: "roleSurface",
  panel: "rolePanel",
} as const

// Every reported rung is the rung the state renders.
function expectRungsRendered(result: DesignMdImport) {
  const state = fullState(result)
  for (const role of ["control", "card", "surface", "panel"] as const) {
    const item = result.report.mapped
      .concat(result.report.approximated)
      .find((i) => i.id === `radius:${role}`)
    if (!item?.result || item.result === "Pill" || item.result === "None")
      continue
    expect(roleRung(state, ROLE_KEYS[role])).toBe(item.result)
  }
}

const FIXED_IDS = new Set([
  "brand",
  "button-source",
  "neutral-hue",
  "neutral-tint",
  "gradient",
  "type-scale",
  "type-weights",
  "type-tracking",
  "font-features",
  "button-radius",
  "density",
  "spacing-unit",
  "spacing-scale",
  "surface-layers",
  "surface-edge",
  "surface-shadow",
  "surface-glass",
  "shadow-values",
  "shadow-tint",
  "inset-shadow",
  "backdrop-blur",
  "input-style",
  "icon-library",
  "iconography",
  "link-underline",
  "layout-grid",
  "breakpoints",
  "motion",
  "focus-ring",
  "imagery",
])
const PARAM_IDS =
  /^(page:(light|dark)|mode-derived:(light|dark)|status:(success|warning|danger)|font:(heading|body|mono)|radius:(base|control|card|surface|panel)|(color-role|exact-role-color|radius-token|component-recipe):[a-z0-9-]+)$/

function expectInvariants(result: DesignMdImport) {
  expect(validate(result.state).ok).toBe(true)
  const reported = new Set(items(result).flatMap((item) => item.keys ?? []))
  for (const key of Object.keys(result.state)) {
    expect(Object.hasOwn(SCHEMA, key)).toBe(true)
    expect([...reported]).toContain(key)
  }
  for (const item of items(result)) {
    expect(item.id).toMatch(/^[a-z-]+(:[a-z0-9-]+)?$/)
    expect(FIXED_IDS.has(item.id) || PARAM_IDS.test(item.id)).toBe(true)
  }
  expectRungsRendered(result)
}

describe("invariants over every fixture", () => {
  it.each(FIXTURES)("%s", async (name) => {
    const text = fixture(name)
    const result = await importDesignMd(text)
    expectInvariants(result)
    expect(JSON.stringify(await importDesignMd(text))).toBe(
      JSON.stringify(result),
    )
  })
})

describe("fixtures", () => {
  it("light-full: brand, page, neutral, fonts, shape, space, surfaces", async () => {
    const r = await importDesignMd(fixture("light-full"))
    const s = r.state
    expect(r.source).toBe("frontmatter")
    expect(r.name).toBe("Fixture Light Full")
    expect(s.brand).toBe("#3b5bdb")
    expect(s.preserveSeed).toBe(true)
    expect(statusOf(r, "brand")).toBe("mapped")
    const canvas = toOklch("#faf8f3")
    expect(s.lightBg).toBe(Math.round(lstarOf(canvas) * 2) / 2)
    expect(Math.abs((s.neutralHue ?? 0) - canvas.h)).toBeLessThanOrEqual(15)
    expect(s.neutralTint).toBeGreaterThan(1)
    expect([s.successSeed, s.warningSeed, s.dangerSeed]).toEqual([
      "#2f9e44",
      "#f08c00",
      "#e03131",
    ])
    expect(s.bodyFont).toBe("Inter")
    expect(s.headingFont).toBe("EB Garamond")
    expect(s.radiusPx).toBe(8)
    expect(s.roleControl).toBe("lg")
    // Card xl is one rung below the derived 2xl panel: auto.
    expect([s.rolePanel, s.roleCard]).toEqual(["2xl", "auto"])
    expect([s.density, s.spacingUnit]).toEqual(["comfortable", 4])
    expect(statusOf(r, "density")).toBe("mapped")
    expect(s.surfaceShadow).toBe("low")
    expect(itemOf(r, "surface-shadow")?.value).toBe("0 1px 3px rgba(0,0,0,0.1)")
    expect(s.surfaceEdge).toBe("line")
    expect(s.surfaceLayers).toBe("same")
    expect(statusOf(r, "type-scale")).toBe("unmapped")
  })

  it("dark-only: dark page from the canvas, light derived", async () => {
    const r = await importDesignMd(fixture("dark-only"))
    const l = lstarOf(toOklch("#08090a"))
    expect(r.state.darkBg).toBe(Math.round(l * 2) / 2)
    expect(r.state.lightBg).toBeUndefined()
    expect(statusOf(r, "page:dark")).toBe("mapped")
    expect(statusOf(r, "mode-derived:light")).toBe("approximated")
    expect(r.state.brand).toBe("#6e56cf")
  })

  it("achromatic-primary: brand from the link, solids neutral", async () => {
    const text = fixture("achromatic-primary")
    const r = await importDesignMd(text)
    expect(r.state.brand).toBe("#0070f3")
    for (const leaf of SOLID_LEAVES) expect(r.state[leaf]).toBe("neutral")
    expect(r.state.linkColor).toBeUndefined()
    expect(r.state.focusColor).toBeUndefined()
    expect(r.state.tabsColor).toBeUndefined()
    expect(statusOf(r, "button-source")).toBe("mapped")
    // The brand isn't the button's: a candidate, so approximated.
    expect(statusOf(r, "brand")).toBe("approximated")

    const gray = await importDesignMd(text.replace(/^\s+link: .*\n/m, ""))
    expect(gray.state.brand).toBe("#111111")
    expect(gray.state.buttonColor).toBe("neutral")
    expect(statusOf(gray, "brand")).toBe("mapped")
  })

  it("stitch-minimal: page from neutral, guessed source, scale radius", async () => {
    const r = await importDesignMd(fixture("stitch-minimal"))
    const l = lstarOf(toOklch("#f7f5f2"))
    expect(r.state.lightBg).toBe(Math.round(l * 2) / 2)
    expect(r.state.brand).toBe("#b8422e")
    expect(r.state.buttonColor).toBe("neutral")
    expect(statusOf(r, "button-source")).toBe("approximated")
    for (const id of ["radius:base", "radius:control", "radius:card"])
      expect(statusOf(r, id)).toBe("approximated")
    expect([r.state.radiusPx, r.state.roleControl]).toEqual([8, "lg"])
  })

  it("prose-only: colors and fonts from prose, all approximated", async () => {
    const r = await importDesignMd(fixture("prose-only"))
    expect(r.source).toBe("prose")
    expect(r.report.mapped).toEqual([])
    expect(r.report.approximated.length).toBeGreaterThan(0)
    expect(r.warnings).toContain(
      "No frontmatter — read colors, fonts and elevation from prose only.",
    )
    expect(r.state.brand).toBe("#2f6b4f")
    expect(r.state.lightBg).toBe(
      Math.round(lstarOf(toOklch("#f7f4ed")) * 2) / 2,
    )
    expect(r.state.bodyFont).toBe("Inter")
    expect(r.state.headingFont).toBe("Playfair Display")
    expect(r.name).toBe("Fixture Prose Only")
  })

  it("broken-yaml: recovers the other blocks", async () => {
    const r = await importDesignMd(fixture("broken-yaml"))
    expect(r.warnings).toContain(
      "frontmatter block 'description' is invalid YAML — skipped",
    )
    expect(r.state.brand).toBe("#e8590c")
    expect(r.name).toBe("Fixture Broken Yaml")
  })

  it("refs: nested, embedded, cyclic and unquoted values", async () => {
    const text = fixture("refs")
    const doc = await parseDesignMd(text)
    const colors = doc.tokens?.colors
    const components = doc.tokens?.components
    const button = isRecord(components) ? components["button-primary"] : {}
    expect(isRecord(colors) && colors.primary).toBe("#abcdef")
    expect(isRecord(colors) && colors.ink).toBe("#222222")
    expect(button).toMatchObject({
      padding: "0.5rem 1rem",
      border: "1px solid #e0e0e0",
      typography: {
        fontFamily: "Inter",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
      },
    })
    expect(doc.warnings.some((w) => w.startsWith("unresolved reference"))).toBe(
      true,
    )
    const r = await importDesignMd(text)
    expect(r.state.brand).toBe("#abcdef")
    expect(r.state.buttonRadius).toBe("pill")
    expect(r.state.roleControl).not.toBe("full")
  })

  it("square: every target 0 picks the square vector", async () => {
    const r = await importDesignMd(fixture("square"))
    expect(r.state).toMatchObject({
      roleControl: "none",
      roleItem: "none",
      roleSurface: "none",
      rolePanel: "none",
      roleCard: "auto",
    })
    expect(r.state.radiusPx).toBeUndefined()
  })

  it("pill: pill controls, or pill buttons only", async () => {
    const both = await importDesignMd(fixture("pill"))
    expect(both.state.roleControl).toBe("full")
    expect(both.state.buttonRadius).toBeUndefined()
    const buttons = await importDesignMd(
      fixture("pill").replace(
        /(text-input:\n\s+rounded: )"\{rounded\.pill\}"/,
        '$1"{rounded.md}"',
      ),
    )
    expect(buttons.state.roleControl).not.toBe("full")
    expect(buttons.state.buttonRadius).toBe("pill")
  })

  it("fonts: catalog, aliases, substitutes and defaults", async () => {
    const r = await importDesignMd(fixture("fonts"))
    expect(r.state.bodyFont).toBe("Inter")
    expect(r.state.headingFont).toBe("EB Garamond")
    expect(r.state.monoFont).toBe("JetBrains Mono")
    const prose =
      "For Copernicus, **EB Garamond** is the closest open substitute."
    const rows: [string, "body" | "heading" | "mono", string, boolean][] = [
      ["sohne-var, 'SF Pro Display', system-ui", "body", "Inter", false],
      ["Inter Variable", "body", "Inter", true],
      ["jetbrains-mono", "mono", "JetBrains Mono", true],
      ["Copernicus, serif", "heading", "EB Garamond", false],
      ["Acme Grotesk, sans-serif", "body", "Geist", false],
      ["Acme Sans, Inter, sans-serif", "body", "Inter", false],
      ["GeistMono", "mono", "Geist Mono", true],
    ]
    for (const [stack, role, family, exact] of rows)
      expect(resolveFamily(stack, role, prose)).toMatchObject({
        family,
        exact,
      })
  })

  it("empty and garbage: nothing to import", async () => {
    expect((await importDesignMd(fixture("empty"))).source).toBe("none")
    const garbage = await importDesignMd("\u0000\u0001 }{ ::: ---")
    expect(garbage.source).toBe("none")
    expect(garbage.state).toEqual({})
    const huge = await importDesignMd("x".repeat(600 * 1024))
    expect(huge.warnings).toContain("File too large")
  })
})

describe("hostile input", () => {
  const spacingFile = (spacing: string, layout = "") =>
    md(
      `
name: Fixture Spacing
colors:
  primary: "#3b5bdb"
  canvas: "#ffffff"
spacing:
${spacing}
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    height: 36px
`,
      `## Layout\n\n${layout}\n`,
    )

  it.each([
    ["a 0px grid", spacingFile("  sm: 8px", "A 0px grid for icons.")],
    ["a 0px base unit", spacingFile("  sm: 8px", "The base unit is 0px.")],
    ["a 0.1px spacing", spacingFile("  hair: 0.1px")],
    ["a 0.01rem spacing", spacingFile("  hair: 0.01rem")],
    [
      "a 400-digit grid",
      spacingFile("  sm: 8px", `A ${"9".repeat(400)}px grid.`),
    ],
  ])("%s ends", { timeout: 2000 }, async (_, text) => {
    const r = await importDesignMd(text)
    expectInvariants(r)
    expect(r.state.spacingUnit ?? 4).toBeGreaterThanOrEqual(3)
  })

  it("reference fan-out stops at the budget", { timeout: 5000 }, async () => {
    const levels = Array.from({ length: 8 }, (_, level) => {
      const next = level + 1
      const refs = Array.from(
        { length: 12 },
        (_, i) => `    k${i}: "{fan.l${next}}"`,
      ).join("\n")
      return `  l${level}:\n${refs}`
    }).join("\n")
    const text = md(`
name: Fixture Fan
colors:
  primary: "#3b5bdb"
fan:
${levels}
  l8: "#ffffff"
`)
    const start = Date.now()
    const r = await importDesignMd(text)
    expect(Date.now() - start).toBeLessThan(3000)
    expect(r.warnings).toContain(REF_BUDGET_WARNING)
    expect(r.state.brand).toBe("#3b5bdb")
  })

  it("non-ASCII token names keep distinct, valid ids", async () => {
    const r = await importDesignMd(
      md(`
name: Fixture Unicode
colors:
  primary: "#3b5bdb"
  canvas: "#ffffff"
  主色: "#ff00aa"
  辅色: "#00aaff"
rounded:
  md: 8px
  圆角: 13px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    rounded: 8px
  卡片:
    rounded: 13px
  组件:
    rounded: 13px
`),
    )
    expectInvariants(r)
    const colorIds = items(r)
      .map((i) => i.id)
      .filter((id) => id.startsWith("exact-role-color:"))
    expect(new Set(colorIds).size).toBe(2)
    expect(
      items(r).filter((i) => i.id.startsWith("component-recipe:")),
    ).toHaveLength(2)
  })
})

describe("mapping", () => {
  it("a 3xl card renders at 3xl", async () => {
    const r = await importDesignMd(
      md(`
name: Fixture Big Card
colors:
  primary: "#3b5bdb"
  canvas: "#ffffff"
rounded:
  md: 0.5rem
  card: 1.5rem
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.md}"
  card:
    rounded: "{rounded.card}"
`),
    )
    expect(itemOf(r, "radius:card")?.result).toBe("3xl")
    expect(roleRung(fullState(r), "roleCard")).toBe("3xl")
    expectInvariants(r)
  })

  it("finite pill tokens, and no pill from a zero height", async () => {
    const pill = await importDesignMd(
      md(`
name: Fixture Finite Pill
colors:
  primary: "#3b5bdb"
  canvas: "#ffffff"
rounded:
  md: 8px
  pill: 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.pill}"
  text-input:
    rounded: "{rounded.md}"
`),
    )
    expect(pill.state.buttonRadius).toBe("pill")
    expect(pill.state.roleControl).not.toBe("full")

    const zero = await importDesignMd(
      md(`
name: Fixture Zero Height
colors:
  primary: "#3b5bdb"
  canvas: "#ffffff"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    rounded: 0
    height: 0
`),
    )
    expect(zero.state.roleControl).toBe("none")
    expect(itemOf(zero, "radius:control")?.result).not.toBe("Pill")
  })

  it("every target a pill: no fitted base, dropped pills reported", async () => {
    const r = await importDesignMd(
      md(`
name: Fixture All Pill
colors:
  primary: "#3b5bdb"
  canvas: "#ffffff"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    rounded: 9999px
  text-input:
    rounded: 9999px
  card:
    rounded: 9999px
  modal:
    rounded: 9999px
  menu:
    rounded: 9999px
`),
    )
    expect(r.state.radiusPx).toBeUndefined()
    expect(statusOf(r, "radius:base")).toBeUndefined()
    expect(r.state.roleControl).toBe("full")
    for (const role of ["card", "panel", "surface"])
      expect(statusOf(r, `radius:${role}`)).toBe("unmapped")

    const scale = await importDesignMd(
      md(`
name: Fixture Pill Scale
colors:
  primary: "#3b5bdb"
rounded:
  md: 8px
  lg: 9999px
`),
    )
    expect(scale.state.radiusPx).toBe(10.5)
    expect(statusOf(scale, "radius:card")).toBe("unmapped")
  })

  it("mono: a sans in a *-mono entry doesn't become the mono font", async () => {
    const r = await importDesignMd(
      md(`
name: Fixture Mono
colors:
  primary: "#3b5bdb"
typography:
  body:
    fontFamily: Inter
  eyebrow-mono:
    fontFamily: "Inter, sans-serif"
  caption-mono:
    fontFamily: "Inter, sans-serif"
  code:
    fontFamily: "SFMono-Regular, Menlo, monospace"
`),
    )
    expect(r.state.monoFont).toBeUndefined()
    expect(resolveFamily("Inter, sans-serif", "mono", "").family).toBe(
      "Geist Mono",
    )
  })

  it("brand: link names, not status accents; candidates approximated", async () => {
    const r = await importDesignMd(
      md(`
name: Fixture Expo-like
colors:
  primary: "#000000"
  canvas: "#ffffff"
  accent-warning: "#ab6400"
  text-link: "#0d74ce"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
`),
    )
    expect(r.state.brand).toBe("#0d74ce")
    expect(statusOf(r, "brand")).toBe("approximated")

    const unnamed = await importDesignMd(
      md(`
name: Fixture Unnamed Hue
colors:
  primary: "#ffffff"
  canvas: "#000000"
  m-blue: "#0066b1"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
`),
    )
    expect(unnamed.state.brand).toBe("#0066b1")
    expect(statusOf(unnamed, "brand")).toBe("approximated")
  })

  it("near-black button with a named accent: buttons ink, brand approximated", async () => {
    const r = await importDesignMd(
      md(`
name: Fixture Ink
colors:
  primary: "#150f23"
  canvas: "#ffffff"
  accent-violet: "#6a5fc1"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
`),
    )
    expect(r.state.brand).toBe("#6a5fc1")
    expect(r.state.buttonColor).toBe("neutral")
    expect(statusOf(r, "brand")).toBe("approximated")
  })

  it("prose: a dark default canvas makes a dark file", async () => {
    const r = await importDesignMd(`# Fixture Prose Dark

## Colors

- **Green** (\`#1ed760\`): Primary brand accent, CTAs
- **Near Black** (\`#121212\`): Deepest background surface
- **Silver** (\`#b3b3b3\`): Secondary text
`)
    expect(r.state.lightBg).toBeUndefined()
    expect(r.state.darkBg).toBe(Math.round(lstarOf(toOklch("#121212")) * 2) / 2)
    expect(statusOf(r, "mode-derived:light")).toBe("approximated")
  })

  it("surface-shadow names a card's shadow prop as its source", async () => {
    const r = await importDesignMd(
      md(`
name: Fixture Card Shadow
colors:
  primary: "#3b5bdb"
  canvas: "#ffffff"
components:
  card:
    shadow: "0 1px 3px rgba(0,0,0,0.1)"
`),
    )
    expect(itemOf(r, "surface-shadow")?.source).toBe("components.card.shadow")
  })

  it("edge: a card ring shadow is a hairline", async () => {
    const r = await importDesignMd(
      md(
        `
name: Fixture Ring
colors:
  primary: "#3b5bdb"
  canvas: "#ffffff"
components:
  text-input:
    border: "1px solid #eeeeee"
  card:
    backgroundColor: "{colors.canvas}"
`,
        "## Elevation & Depth\n\n| Level | Treatment | Use |\n|---|---|---|\n| 1 | `0 0 0 1px #00000014` | Default card chrome |\n",
      ),
    )
    expect(r.state.surfaceEdge).toBe("line")
    expect(r.state.surfaceShadow).toBe("flat")
  })

  it("link underline: whole-word links, hover on press", async () => {
    const tab = await importDesignMd(
      md(
        'name: Fixture Tab\ncolors:\n  primary: "#3b5bdb"',
        "## Components\n\n**tab-active** — label in `{typography.nav-link}`, 2px underline rule.\n",
      ),
    )
    expect(tab.state.linkUnderline).toBeUndefined()
    const press = await importDesignMd(
      md(
        'name: Fixture Press\ncolors:\n  primary: "#3b5bdb"',
        "## Components\n\n**text-link** — Inline body links in coral. Underlined on press.\n",
      ),
    )
    expect(press.state.linkUnderline).toBe("hover")
  })

  it("fonts: serif bodies and per-face substitutes", () => {
    const wired = [
      "1. **WiredDisplay** — the proprietary high-contrast serif for display headlines.",
      "Inter is loaded as a fourth fallback face for utility pages.",
      "### Note on Font Substitutes",
      "- **WiredDisplay** — *Playfair Display* at large sizes.",
      "- **BreveText** — *Lora* at 16px.",
    ].join("\n")
    const faces = ["WiredDisplay", "BreveText"]
    expect(
      resolveFamily(
        'BreveText, Georgia, "Times New Roman", serif',
        "body",
        wired,
        faces,
      ).family,
    ).toBe("Lora")
    expect(resolveFamily("WiredDisplay", "heading", wired, faces).family).toBe(
      "Playfair Display",
    )

    const resend = [
      "- **Domaine Display** — proprietary editorial serif for hero headlines.",
      "- **ABC Favorit** — proprietary humanist sans-serif for body copy.",
      "When proprietary families cannot be licensed, **Söhne** or **Tiempos Headline** stand in for Domaine Display, and **Geist** or **Inter Tight** can replace ABC Favorit.",
    ].join("\n")
    const pair = ["Domaine Display", "ABC Favorit"]
    expect(
      resolveFamily("Domaine Display", "heading", resend, pair).family,
    ).not.toBe("Geist")
    expect(resolveFamily("ABC Favorit", "body", resend, pair).family).toBe(
      "Geist",
    )
  })

  it("status seeds the engine moves are approximated", async () => {
    const full = await importDesignMd(fixture("light-full"))
    expect(statusOf(full, "status:warning")).toBe("approximated")
    expect(itemOf(full, "status:warning")?.delta).toMatch(/^ΔE 0\.0[3-9]/)
    const r = await importDesignMd(
      md(`
name: Fixture Dark Status
colors:
  primary: "#3b5bdb"
  canvas: "#ffffff"
  success: "#052e16"
  warning: "#ffff00"
  error: "#450a0a"
`),
    )
    expectInvariants(r)
    for (const name of ["success", "warning", "danger"])
      expect(statusOf(r, `status:${name}`)).toBe("approximated")
  })

  it("a mode-qualified dark canvas keeps a light file light", async () => {
    for (const [colors, lightHex] of [
      [
        `
  canvas: "#ffffff"
  canvas-dark: "#0b0b0c"
  ink: "#111111"`,
        "#ffffff",
      ],
      [
        `
  background: "#fafafa"
  background-dark: "#09090b"`,
        "#fafafa",
      ],
    ] as const) {
      const notes = colors.includes("canvas-dark")
        ? "- **Canvas** (`{colors.canvas}`): Main canvas in light mode.\n- **Canvas Dark** (`{colors.canvas-dark}`): Main canvas in dark mode.\n"
        : "- **Background Dark** (`{colors.background-dark}`): Primary background for dark mode.\n"
      const r = await importDesignMd(
        md(
          `name: Fixture Two Modes\ncolors:\n  primary: "#3b5bdb"${colors}`,
          `## Colors\n\n${notes}`,
        ),
      )
      expectInvariants(r)
      expect(statusOf(r, "page:light")).toBeDefined()
      expect(itemOf(r, "page:light")?.value).toBe(lightHex)
      expect(statusOf(r, "page:dark")).toBe("approximated")
      expect(statusOf(r, "mode-derived:light")).toBeUndefined()
      expect(itemOf(r, "color-role:ink")?.result ?? "").not.toMatch(/ 50$/)
    }
    const fafafa = await importDesignMd(
      md(
        'name: F\ncolors:\n  background: "#fafafa"\n  background-dark: "#09090b"',
      ),
    )
    expect(fafafa.state.lightBg).toBe(
      Math.round(lstarOf(toOklch("#fafafa")) * 2) / 2,
    )
  })

  it("a dark default canvas keeps the light page for lightBg", async () => {
    const r = await importDesignMd(
      md(
        'name: Fixture Dark First\ncolors:\n  primary: "#3b5bdb"\n  canvas: "#f5f5f5"\n  canvas-dark: "#0b0b0c"',
        "## Colors\n\n- **Canvas Dark** (`{colors.canvas-dark}`): The default canvas; the site is dark-first.\n",
      ),
    )
    expectInvariants(r)
    expect(statusOf(r, "page:dark")).toBe("mapped")
    expect(r.state.lightBg).toBe(
      Math.round(lstarOf(toOklch("#f5f5f5")) * 2) / 2,
    )
    expect(statusOf(r, "mode-derived:light")).toBeUndefined()
  })

  it("a derived panel rung is listed on the card row", async () => {
    const full = await importDesignMd(fixture("light-full"))
    expect(itemOf(full, "radius:card")?.keys).toContain("rolePanel")
    const r = await importDesignMd(
      md(`
name: Fixture Card Only
colors:
  primary: "#3b5bdb"
  canvas: "#ffffff"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    rounded: 6px
  card:
    rounded: 0px
`),
    )
    expectInvariants(r)
    expect(r.state.rolePanel).toBe("none")
    expect(itemOf(r, "radius:card")?.keys).toContain("rolePanel")
  })

  it("a nested primary palette is the brand, at its mid step", async () => {
    const r = await importDesignMd(
      md(`
name: Fixture Nested
colors:
  canvas: "#ffffff"
  red:
    500: "#e03131"
  primary:
    600: "#4c4fd6"
    500: "#5b5ee8"
  blue:
    500: "#1c7ed6"
`),
    )
    expectInvariants(r)
    expect(r.state.brand).toBe("#5b5ee8")
    expect(statusOf(r, "exact-role-color:primary-600")).toBeUndefined()
  })

  it("an unparseable card row shadow is not an exact flat", async () => {
    const r = await importDesignMd(
      md(
        'name: Fixture Bad Shadow\ncolors:\n  primary: "#3b5bdb"\n  canvas: "#ffffff"',
        "## Elevation & Depth\n\n| Level | Treatment | Use |\n|---|---|---|\n| 1 | `0 1px NaNpx rgba(0,0,0,1e9)` | Cards |\n",
      ),
    )
    expect(statusOf(r, "surface-shadow")).not.toBe("mapped")
    const none = await importDesignMd(
      md(
        'name: Fixture No Shadow\ncolors:\n  primary: "#3b5bdb"\n  canvas: "#ffffff"',
        "## Elevation & Depth\n\n| Level | Treatment | Use |\n|---|---|---|\n| 0 | none | Cards |\n",
      ),
    )
    expect(itemOf(none, "surface-shadow")?.result).toBe("flat")
  })

  it("a prose brand guess clears the chroma and L* floor", async () => {
    const r = await importDesignMd(`# Fixture Prose Ink

## Colors

- **Abyss** (\`#001115\`): Primary button fill
- **Paper** (\`#ffffff\`): Page background
- **Teal** (\`#0f9fb5\`): Links and highlights
`)
    expect(r.state.brand).not.toBe("#001115")
  })

  it("font rows name the role", async () => {
    const r = await importDesignMd(fixture("light-full"))
    expect(itemOf(r, "font:body")?.label).toMatch(/^Body font/)
    expect(itemOf(r, "font:heading")?.label).toMatch(/^Heading font/)
  })

  it("proseFonts: the formats prose-only files use", () => {
    expect(
      proseFonts(
        [
          "- **Display & UI**: `LamboType`, Roboto, Helvetica Neue — custom face",
          "- **Fallback/UI**: `Open Sans` — system fallback",
          "- **Code / Technical**: `IBM Plex Mono`, fallback: `ui-monospace`",
        ].join("\n"),
      ),
    ).toEqual({
      heading: "LamboType, Roboto, Helvetica Neue",
      body: "LamboType, Roboto, Helvetica Neue",
      mono: "IBM Plex Mono, ui-monospace",
    })
    expect(
      proseFonts(
        [
          "- **Manuka** (Klim) — fallback: Impact, Helvetica. The signature display face.",
          "- **PolySans** — fallback: Helvetica, Arial. The UI and body workhorse.",
          "- **PolySans is the workhorse.** Mono is used for labels, tags, and buttons.",
          "**Primary:** `SoDoSans, Arial, sans-serif` — the corporate face",
        ].join("\n"),
      ),
    ).toEqual({
      heading: "Manuka, Impact, Helvetica",
      body: "PolySans, Helvetica, Arial",
    })
  })
})

describe("primitives", () => {
  it("dim", () => {
    expect(dim("12px")).toBe(12)
    expect(dim("0.5rem")).toBe(8)
    expect(dim("1.5em")).toBe(24)
    expect(dim(10)).toBe(10)
    expect(dim("10")).toBe(10)
    expect(dim("-3.0px")).toBe(-3)
    expect(dim("50%")).toBeUndefined()
    expect(dim("auto")).toBeUndefined()
    expect(dim(`${"9".repeat(400)}px`)).toBeUndefined()
  })

  it("box", () => {
    expect(box("8px")).toEqual({ top: 8, right: 8, bottom: 8, left: 8 })
    expect(box("8px 14px")).toEqual({ top: 8, right: 14, bottom: 8, left: 14 })
    expect(box("1px 2px 3px")).toEqual({ top: 1, right: 2, bottom: 3, left: 2 })
    expect(box("0.5rem 1rem 0 2px")).toEqual({
      top: 8,
      right: 16,
      bottom: 0,
      left: 2,
    })
    expect(box("8px auto")).toBeUndefined()
  })

  it("shadows", () => {
    const [rgbaFirst, ...noMore] = shadows(
      "rgba(15, 15, 15, 0.08) 0px 4px 12px 0px",
    )
    expect(noMore).toHaveLength(0)
    expect(rgbaFirst).toMatchObject({ x: 0, y: 4, blur: 12, spread: 0 })
    expect(rgbaFirst && shadowStrength(rgbaFirst)).toBeCloseTo(1.28)

    const [first, second] = shadows(
      "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px #0000001a",
    )
    expect(first && shadowStrength(first)).toBeCloseTo(0.4)
    expect(second?.alpha).toBeCloseTo(0x1a / 255)
    expect(second?.spread).toBe(-1)

    const [ring] = shadows("0 0 0 1px #00000014 inset")
    expect(ring).toMatchObject({ inset: true, spread: 1, blur: 0 })
    expect(ring?.alpha).toBeCloseTo(0x14 / 255)

    expect(shadows("box-shadow: rgba(0,55,112,0.08) 0 1px 3px;")).toHaveLength(
      1,
    )
    expect(shadows("No shadow, no border")).toEqual([])
  })

  it("fitRadius", () => {
    expect(fitRadius({ control: 8, card: 12 })).toEqual({
      radius: 8,
      rungs: { control: "lg", card: "xl" },
    })
    expect(fitRadius({ control: 6, card: 12 })).toEqual({
      radius: 8,
      rungs: { control: "md", card: "xl" },
    })
    expect(fitRadius({ control: 2, card: 2 }).radius).toBe(2)
  })

  it("fitDensity", () => {
    expect(fitDensity(36, 4)).toMatchObject({ density: "comfortable", unit: 4 })
    expect(fitDensity(32, 4)).toMatchObject({ density: "default", unit: 4 })
    expect(fitDensity(40, 4)).toMatchObject({
      density: "comfortable",
      unit: 4,
      control: 36,
    })
    expect(fitDensity(28)).toMatchObject({ density: "compact", unit: 4 })
  })

  it("impliedTint", () => {
    const steps = [99, 98, 95, 92, 88, 84, 77, 69, 53, 48, 42, 12]
    // Nearest step 25: shape 0.13 at peak 0.016.
    expect(impliedTint(0.016 * 0.13, 99.2, "light", steps)).toBeCloseTo(1)
    expect(impliedTint(0.016 * 0.97 * 2, 54, "light", steps)).toBeCloseTo(2)
    expect(impliedTint(0, 50, "dark", steps)).toBe(0)
  })

  it("cleanImportName", () => {
    expect(cleanImportName("Linear-design-analysis")).toBe("Linear")
    expect(cleanImportName("Stripe-Inspired-design-analysis")).toBe("Stripe")
    expect(cleanImportName("Design System Inspired by Notion")).toBe("Notion")
    expect(cleanImportName("Dell 1996 Inspired")).toBe("Dell 1996")
    expect(cleanImportName("Together-AI-design-analysis")).toBe("Together AI")
    expect(cleanImportName("Nintendo.com (2001) Analysis")).toBe(
      "Nintendo.com (2001)",
    )
    expect(cleanImportName("design-analysis")).toBe("Imported design system")
  })
})

import { describe, expect, test } from "vitest"

import { lstarOf, mixOklab, toOklch } from "@dotui/colors"
import type { Mode as EngineMode, Oklch, StepName } from "@dotui/colors"

import { baseRegistryCss } from "@/registry/__generated__/base-css"
import { publishables } from "@/registry/__generated__/publishables"
import {
  DEFAULT_COLOR_CONFIG,
  resolveColorConfig,
  semanticsFor,
} from "@/registry/theme"
import type { SemanticTarget } from "@/registry/theme"
import { emitInitItem } from "@/publisher/emit-theme"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"

import { designSystemOf } from "../resolve"
import { buildColorConfig } from "./color"
import { GROUPED_PAGE } from "./color"
import {
  DEFAULT_EFFECTIVE,
  DEFAULT_STATE,
  DEFAULTS,
  effective,
  parseState,
} from "./index"
import {
  NO_SHADOW,
  shadowCss,
  surfaceColorCss,
  surfaceRecipe,
} from "./surfaces"
import type { Mode, PerMode, SurfaceColor } from "./surfaces"
import {
  EDGE_OPTIONS,
  LAYERS_OPTIONS,
  SHADOW_OPTIONS,
  SHELL_OPTIONS,
  SURFACE_STYLES,
  styleScore,
  surfaceStyle,
} from "./surfaces.meta"

const SURFACE_TOKENS = [
  "--card-border",
  "--overlay-border",
  "--shadow-card",
  "--shadow-popover",
  "--shadow-modal",
  "--color-card",
  "--color-popover",
  "--popover-alpha",
  "--popover-backdrop-filter",
]

/* Tailwind's sm / md / lg. */
const SHADOW_SM =
  "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
const SHADOW_MD =
  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
const SHADOW_LG =
  "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
const HALF = "color-mix(in oklab, var(--neutral-50) 50%, var(--neutral-100))"
const QUARTER = "color-mix(in oklab, var(--neutral-50) 75%, var(--neutral-100))"
const WHITE = "oklch(1 0 0)"

const tokensFor = (overrides: Partial<typeof DEFAULTS>) =>
  designSystemOf(parseState({ ...overrides })).tokens

const resolved = (values: Partial<typeof DEFAULTS>) =>
  effective(parseState({ ...values }))

const PALETTE = {
  step: (s: string) => `var(--neutral-${s})`,
  hairline: "var(--color-border)",
}

/** A registry semantic target as the CSS `base/colors.css` declares. */
function targetCss(target: SemanticTarget): string {
  if ("ref" in target) return `var(--${target.ref.palette}-${target.ref.step})`
  if ("on" in target) return `var(--on-${target.on.palette}-${target.on.step})`
  if ("value" in target) return target.value
  const [a, weight, b] = target.mix
  return `color-mix(in oklab, ${targetCss(a)} ${weight}%, ${targetCss(b)})`
}

const registryColor = (token: string, mode: Mode) => {
  const target = semanticsFor(DEFAULT_COLOR_CONFIG)[token]?.target
  if (!target) throw new Error(`no registry token ${token}`)
  return targetCss("light" in target ? target[mode] : target)
}

const combos = LAYERS_OPTIONS.flatMap((l) =>
  EDGE_OPTIONS.flatMap((e) =>
    SHADOW_OPTIONS.map((s) => ({
      surfaceLayers: l.value,
      surfaceEdge: e.value,
      surfaceShadow: s.value,
    })),
  ),
)

describe("surfaces", () => {
  test("defaults emit no surface tokens", () => {
    const tokens = tokensFor({})
    for (const name of SURFACE_TOKENS) expect(tokens).not.toHaveProperty(name)
  })

  test.each(["light", "dark"] as const)(
    "the default recipe is the registry's look in %s",
    (mode) => {
      const { card, popover, modalShadow } = surfaceRecipe(DEFAULT_EFFECTIVE)
      const css = (pair: PerMode<SurfaceColor>) =>
        surfaceColorCss(pair[mode], PALETTE)
      expect(css(card.bg)).toBe(registryColor("color-card", mode))
      expect(css(popover.bg)).toBe(registryColor("color-popover", mode))
      expect(css(card.edge)).toBe(PALETTE.hairline)
      expect(css(popover.edge)).toBe(PALETTE.hairline)
      expect(shadowCss(card.shadow, css)).toBe(NO_SHADOW)
      expect(shadowCss(popover.shadow, css)).toBe(SHADOW_MD)
      expect(shadowCss(modalShadow, css)).toBe(SHADOW_LG)
    },
  )

  test("Outlined is the default, and every style reads back as itself", () => {
    expect(surfaceStyle(DEFAULT_STATE)).toMatchObject({
      style: { id: "outlined" },
      exact: true,
    })
    for (const s of SURFACE_STYLES) {
      const state = parseState(s.values)
      expect(surfaceStyle(state)).toEqual({ style: s, exact: true })
      expect(effective(state).values.surfaceShadow).toBe(s.values.surfaceShadow)
    }
  })

  test("every combination names one closest style, without ties", () => {
    for (const values of combos) {
      const state = parseState(values)
      const scores = SURFACE_STYLES.map((s) => styleScore(state, s))
      const best = Math.max(...scores)
      expect(
        scores.filter((n) => n === best),
        JSON.stringify(values),
      ).toHaveLength(1)
    }
    const named = (values: Partial<typeof DEFAULTS>) =>
      surfaceStyle(parseState(values)).style.id
    expect(named({ surfaceShadow: "medium" })).toBe("soft")
    expect(named({ surfaceEdge: "none", surfaceShadow: "high" })).toBe(
      "elevated",
    )
    expect(named({ surfaceLayers: "grouped", surfaceEdge: "line" })).toBe(
      "grouped",
    )
    expect(named({ surfaceLayers: "tonal", surfaceShadow: "low" })).toBe(
      "tonal",
    )
  })

  test("flat cards with no edge on the page render Low, saved Flat kept", () => {
    const { values, explain } = resolved({ surfaceEdge: "none" })
    expect(values.surfaceShadow).toBe("low")
    expect(explain.surfaceShadow).toMatchObject({
      saved: "flat",
      rule: "surfaces/flat-needs-separation",
    })
    expect(
      resolved({ surfaceEdge: "none", surfaceLayers: "tonal" }).values,
    ).toMatchObject({ surfaceShadow: "flat" })
  })

  test("Grouped's page is Auto: gray under Grouped, an explicit page kept", () => {
    expect(DEFAULT_EFFECTIVE.lightBg).toBe(99)
    expect(resolved({ surfaceLayers: "grouped" }).values.lightBg).toBe(
      GROUPED_PAGE,
    )
    const white = { lightBg: 100 }
    expect(
      resolved({ ...white, surfaceLayers: "grouped" }).values.lightBg,
    ).toBe(100)
    expect(resolved(white).values.lightBg).toBe(100)
  })

  test("grouped, edgeless flat cards clamp a lighter page to gray", () => {
    const flat = {
      surfaceLayers: "grouped",
      surfaceEdge: "none",
      surfaceShadow: "flat",
    }
    const { values, explain } = resolved({ ...flat, lightBg: 100 })
    expect(values).toMatchObject({
      lightBg: GROUPED_PAGE,
      surfaceShadow: "flat",
    })
    expect(explain.lightBg?.rule).toBe("color/grouped-page")
    expect(resolved({ ...flat, lightBg: 94 }).values.lightBg).toBe(94)
    expect(surfaceRecipe(values).card.shadow).toEqual([])
  })

  test("shadow moves every role together", () => {
    const low = tokensFor({ surfaceShadow: "low" })
    expect(low["--shadow-card"]).toBe(SHADOW_SM)
    expect(low).not.toHaveProperty("--shadow-popover")
    const medium = tokensFor({ surfaceShadow: "medium" })
    expect(medium["--shadow-card"]).toBe(SHADOW_MD)
    expect(medium["--shadow-popover"]).toBe(SHADOW_LG)
  })

  test("an edgeless system rings its overlays and doubles its shadows in dark", () => {
    const tokens = tokensFor({ surfaceEdge: "none", surfaceShadow: "low" })
    expect(tokens["--card-border"]).toBe("transparent")
    expect(tokens["--overlay-border"]).toBe(
      "light-dark(transparent, var(--color-border))",
    )
    expect(tokens["--shadow-card"]).toBe(
      "0 0 2px 0 light-dark(rgb(0 0 0 / 0.12), rgb(0 0 0 / 0.24)), 0 1px 3px 0 light-dark(rgb(0 0 0 / 0.1), rgb(0 0 0 / 0.2)), 0 1px 2px -1px light-dark(rgb(0 0 0 / 0.1), rgb(0 0 0 / 0.2))",
    )
    expect(tokens["--color-card"]).toBe(
      `light-dark(var(--neutral-25), ${QUARTER})`,
    )
  })

  test("an edgeless tonal system keeps its dark overlays edgeless", () => {
    const tokens = tokensFor({
      surfaceEdge: "none",
      surfaceLayers: "tonal",
      surfaceShadow: "low",
    })
    expect(tokens["--overlay-border"]).toBe("transparent")
    expect(tokens["--card-border"]).toBe("transparent")
  })

  test("grouped puts white cards and overlays on the page in light", () => {
    const tokens = tokensFor({ surfaceLayers: "grouped" })
    expect(tokens["--color-card"]).toBe(
      `light-dark(${WHITE}, var(--neutral-50))`,
    )
    expect(tokens["--color-popover"]).toBe(`light-dark(${WHITE}, ${HALF})`)
  })

  test("tonal shades cards below the page, above it in dark", () => {
    const tokens = tokensFor({ surfaceLayers: "tonal" })
    expect(tokens["--color-card"]).toBe(`light-dark(${HALF}, ${QUARTER})`)
    expect(tokens["--color-popover"]).toBe(
      `light-dark(var(--neutral-50), ${HALF})`,
    )
  })

  test("glass turns the floating tier translucent; solid is the default", () => {
    const tokens = tokensFor({ surfaceGlass: true })
    expect(tokens["--popover-alpha"]).toBe("70%")
    expect(tokens["--popover-backdrop-filter"]).toBe(
      "blur(40px) saturate(150%)",
    )
    expect(
      Object.keys(tokens).filter((k) => SURFACE_TOKENS.includes(k)),
    ).toEqual(["--popover-alpha", "--popover-backdrop-filter"])
  })
})

/* Every allowed combination, painted with the default engine at its extreme
   pages: cards must stand off the page and popovers off cards, by an edge, a
   shadow or tone — and dark overlays must stay under the field rung, so
   fields and separators inside them still read. */
describe("surfaces stay legible", () => {
  const MIN_TONE = 1.5

  const pages = [
    { lightBg: 99, darkBg: 2 },
    { lightBg: 100, darkBg: 0 },
    { lightBg: 96, darkBg: 16 },
  ]

  const lstarFor = (page: (typeof pages)[number]) => {
    const theme = resolveColorConfig(
      buildColorConfig(effective(parseState(page)).values),
    )
    return (color: SurfaceColor, mode: EngineMode): number => {
      if (color.kind === "white") return 100
      const ramp: Partial<Record<StepName, string>> =
        theme[mode].scales.neutral ?? {}
      const at = (s: string) => toOklch(ramp[s as StepName] ?? "")
      const oklch = (c: SurfaceColor): Oklch =>
        c.kind === "step"
          ? at(c.step)
          : c.kind === "mix"
            ? mixOklab(at(c.a), c.weight, at(c.b))
            : at("25")
      return lstarOf(oklch(color))
    }
  }

  const lstarAt = new Map<string, ReturnType<typeof lstarFor>>()
  const PAGE: SurfaceColor = { kind: "step", step: "25" }

  for (const page of pages) {
    test.each(combos)(`page ${page.lightBg}/${page.darkBg}: %o`, (values) => {
      const state = resolved({ ...values, ...page }).values
      // A rule may move the page (grouped, edgeless flat cards).
      const at = { lightBg: state.lightBg, darkBg: state.darkBg }
      const id = JSON.stringify(at)
      const lstar = lstarAt.get(id) ?? lstarFor(at)
      lstarAt.set(id, lstar)
      const recipe = surfaceRecipe(state)
      const tones = (mode: EngineMode) => ({
        page: lstar(PAGE, mode),
        card: lstar(recipe.card.bg[mode], mode),
        popover: lstar(recipe.popover.bg[mode], mode),
      })
      for (const mode of ["light", "dark"] as const) {
        const { page, card } = tones(mode)
        const cardStandsOut =
          recipe.card.edge[mode].kind !== "none" ||
          recipe.card.shadow.length > 0 ||
          Math.abs(card - page) >= MIN_TONE
        expect(cardStandsOut, `${mode} card`).toBe(true)
        expect(
          recipe.popover.edge[mode].kind !== "none" ||
            recipe.popover.shadow.length > 0,
          `${mode} popover`,
        ).toBe(true)
      }
      const dark = tones("dark")
      expect(dark.card).toBeGreaterThan(dark.page)
      expect(dark.popover).toBeGreaterThan(dark.card)
      expect(dark.popover).toBeLessThan(
        lstar({ kind: "step", step: "100" }, "dark"),
      )
    })
  }

  test("in light, Same sits on the page and Tonal and Grouped read apart", () => {
    const at = (values: Partial<typeof DEFAULTS>) => {
      const state = resolved(values).values
      const lstar = lstarFor({ lightBg: state.lightBg, darkBg: state.darkBg })
      const recipe = surfaceRecipe(state)
      return (
        lstar(recipe.card.bg.light, "light") -
        lstar({ kind: "step", step: "25" }, "light")
      )
    }
    expect(at({})).toBe(0)
    expect(at({ surfaceLayers: "tonal" })).toBeLessThan(-2)
    expect(at({ surfaceLayers: "grouped" })).toBeGreaterThan(3.5)
  })
})

describe("app shell", () => {
  const presetOf = (state: Partial<typeof DEFAULTS>): PublishPreset => {
    const ds = designSystemOf(parseState(state))
    return {
      density: ds.density,
      componentParams: ds.componentParams,
      tokens: ds.tokens,
      color: ds.color,
      icons: ds.icons,
    }
  }
  const shippedSidebar = async (state: Partial<typeof DEFAULTS>) => {
    const preset = presetOf(state)
    const { item } = publish({
      publishable: selectPublishable(await publishables.sidebar!(), preset),
      preset,
    })
    return (item.files ?? []).map((f) => f.content).join("\n")
  }
  const shipped = (state: Partial<typeof DEFAULTS>, mode: "light" | "dark") => {
    const vars = emitInitItem({
      baseRegistryCss,
      preset: presetOf(state),
      itemUrl: (name) => name,
    }).cssVars![mode]!
    return (name: string) => toOklch(vars[name]!).l
  }

  test("Subtle is Origin: no sidebar token, the default param", () => {
    expect(DEFAULTS.shellTone).toBe("subtle")
    expect(Object.keys(tokensFor({}))).not.toContain("--color-sidebar")
    expect(designSystemOf(DEFAULT_STATE).componentParams.sidebar).toMatchObject(
      { shell: "subtle" },
    )
  })

  test("Page puts the sidebar on the page tone", () => {
    expect(tokensFor({ shellTone: "page" })["--color-sidebar"]).toBe(
      "var(--color-bg)",
    )
  })

  test("Recessed sits below the page at any page tone, dark no deeper than light", () => {
    for (const state of [{}, { lightBg: 96 }, { darkBg: 8 }]) {
      const light = shipped({ ...state, shellTone: "recessed" }, "light")
      const dark = shipped({ ...state, shellTone: "recessed" }, "dark")
      const lightDepth = light("background") - light("sidebar")
      const darkDepth = dark("background") - dark("sidebar")
      expect(lightDepth, JSON.stringify(state)).toBeGreaterThan(0.015)
      expect(darkDepth, JSON.stringify(state)).toBeGreaterThan(0.005)
      expect(darkDepth, JSON.stringify(state)).toBeLessThanOrEqual(lightDepth)
    }
  })

  test.each(SHELL_OPTIONS.map((o) => o.value))(
    "%s ships one inset shadow and whole classes",
    async (shellTone) => {
      const code = await shippedSidebar({ shellTone })
      const inset = /inset: "([^"]*)"/.exec(code)?.[1] ?? ""
      const shadows = inset
        .split(/\s+/)
        .filter((c) => c.startsWith("md:peer-data-[variant=inset]:shadow-"))
      const recessed = shellTone === "recessed"
      expect(shadows).toEqual([
        recessed
          ? "md:peer-data-[variant=inset]:shadow-(--shadow-card,0_0_#0000)"
          : "md:peer-data-[variant=inset]:shadow-sm",
      ])
      expect(inset.includes("border-(--card-border)")).toBe(recessed)
      expect(code).not.toContain("--studio-")
    },
  )
})

describe("drawn edges", () => {
  const shippedItem = async (name: string, state: Partial<typeof DEFAULTS>) => {
    const ds = designSystemOf(parseState(state))
    const preset: PublishPreset = {
      density: ds.density,
      componentParams: ds.componentParams,
      tokens: ds.tokens,
      color: ds.color,
      icons: ds.icons,
    }
    const { item } = publish({
      publishable: selectPublishable(await publishables[name]!(), preset),
      preset,
    })
    const code = (item.files ?? []).map((f) => f.content).join("\n")
    expect(code, name).not.toContain("--studio-")
    return code
  }

  test("Bevel trades the border for Polaris's inset rim, light and dark", () => {
    const tokens = tokensFor({ surfaceEdge: "bevel" })
    const rim =
      "inset 1px 0 0 0 light-dark(rgb(0 0 0 / 0.13), rgb(204 204 204 / 0.08)), inset -1px 0 0 0 light-dark(rgb(0 0 0 / 0.13), rgb(204 204 204 / 0.08)), inset 0 -1px 0 0 light-dark(rgb(0 0 0 / 0.17), rgb(204 204 204 / 0.08)), inset 0 1px 0 0 light-dark(rgb(204 204 204 / 0.5), rgb(204 204 204 / 0.16))"
    expect(tokens).toMatchObject({
      "--card-border": "transparent",
      "--overlay-border": "transparent",
      "--shadow-card": rim,
      "--shadow-popover": `${rim}, ${SHADOW_MD}`,
      "--studio-card-stroke": "0px",
      "--studio-overlay-stroke": "0px",
    })
    expect(tokens).not.toHaveProperty("--studio-tile-stroke")
    expect(tokens).not.toHaveProperty("--shadow-modal")
  })

  test("Ledge draws the control stroke with a 2px lip under cards and tiles", () => {
    const regular = tokensFor({ surfaceEdge: "ledge" })
    expect(regular).toMatchObject({
      "--studio-card-stroke": "1px 1px 3px",
      "--studio-tile-stroke": "1px 1px 3px",
    })
    expect(regular).not.toHaveProperty("--studio-overlay-stroke")
    expect(regular).not.toHaveProperty("--card-border")
    expect(
      tokensFor({ surfaceEdge: "ledge", controlStroke: "bold" }),
    ).toMatchObject({
      "--studio-card-stroke": "2px 2px 4px",
      "--studio-tile-stroke": "2px 2px 4px",
      "--studio-overlay-stroke": "2px",
    })
  })

  test("Origin ships its 1px borders unchanged", async () => {
    expect(await shippedItem("card", {})).toContain(
      "border border-(--card-border)",
    )
    expect(await shippedItem("popover", {})).toContain(
      "border border-(--overlay-border)",
    )
  })

  test.each([
    ["ledge", "border-[2px_2px_4px]", "border-2"],
    ["bevel", "border-0", "border-0"],
  ])("%s ships whole border classes", async (surfaceEdge, card, overlay) => {
    const state = { surfaceEdge, controlStroke: "bold" }
    expect(await shippedItem("card", state)).toContain(
      `${card} border-(--card-border)`,
    )
    expect(await shippedItem("popover", state)).toContain(
      `${overlay} border-(--overlay-border)`,
    )
    expect(
      await shippedItem("tooltip", { ...state, tooltipStyle: "surface" }),
    ).toContain(`${overlay} border-(--overlay-border)`)
  })

  test("checkbox, radio and switch cards share one tile edge", async () => {
    const state = { surfaceEdge: "ledge", controlStroke: "bold" }
    const shell =
      "has-data-label:w-full has-data-label:border-[2px_2px_4px] has-data-label:p-2.5"
    for (const name of ["checkbox", "radio-group", "switch"])
      expect(await shippedItem(name, state), name).toContain(shell)
    expect(await shippedItem("checkbox", { surfaceEdge: "bevel" })).toContain(
      "has-data-label:w-full has-data-label:border has-data-label:p-2.5",
    )
  })

  test("a pressed or disabled ledge tile sinks into its lip", async () => {
    const sink =
      "has-data-label:pressed:mt-[2px] has-data-label:pressed:border-b-2 has-data-label:disabled:mt-[2px] has-data-label:disabled:border-b-2"
    const state = { surfaceEdge: "ledge", controlStroke: "bold" }
    for (const name of ["checkbox", "radio-group", "switch"]) {
      expect(
        designSystemOf(parseState(state)).componentParams[name],
      ).toMatchObject({ "card-press": "sink" })
      expect(await shippedItem(name, state), name).toContain(sink)
      const origin = await shippedItem(name, {})
      expect(origin, name).not.toContain("pressed:mt-")
      expect(origin, name).not.toContain("disabled:border-b")
    }
    expect(tokensFor({ surfaceEdge: "ledge" })["--studio-tile-lip"]).toBe("2px")
  })

  test("under Ledge, popovers and dialogs drop their shadow", () => {
    const tokens = tokensFor({ surfaceEdge: "ledge", surfaceShadow: "high" })
    expect(tokens["--shadow-popover"]).toBe(NO_SHADOW)
    expect(tokens["--shadow-modal"]).toBe(NO_SHADOW)
    expect(tokens["--shadow-card"]).not.toBe(NO_SHADOW)
  })

  test("the overlay arrow follows the overlay stroke", async () => {
    const origin = await shippedItem("popover", {})
    expect(origin).toContain("[&>svg]:stroke-1")
    expect(origin).toContain("placement-top:-mt-px")
    const ledge = await shippedItem("popover", {
      surfaceEdge: "ledge",
      controlStroke: "bold",
    })
    expect(ledge).toContain("[&>svg]:stroke-2")
    expect(ledge).toContain("placement-top:-mt-[2px]")
    expect(
      await shippedItem("tooltip", {
        surfaceEdge: "ledge",
        controlStroke: "bold",
        tooltipStyle: "surface",
      }),
    ).toContain("placement-bottom:-mb-[2px]")
    const bevel = await shippedItem("tooltip", {
      surfaceEdge: "bevel",
      tooltipStyle: "surface",
    })
    expect(bevel).not.toMatch(/-m[tblr]-\[0px\]/)
  })
})

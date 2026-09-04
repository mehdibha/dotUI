import { describe, expect, test } from "vitest"

import type { RegistryItem } from "@/registry/types"

import { emitInitItem, mergePresetCssFields } from "./emit-theme"

type InitItemConfig = {
  config?: {
    tailwind?: { cssVariables?: boolean }
    registries?: Record<string, unknown>
  }
}

const baseRegistryCss = {
  css: {
    '@import "tw-animate-css"': {},
    "@utility focus-ring": {
      "@apply ring-2 ring-border-focus": {},
    },
  },
  cssVars: {
    theme: {
      "--radius-lg": "var(--radius)",
    },
  },
} as const satisfies Pick<RegistryItem, "css" | "cssVars">

const OKLCH = /^oklch\([\d.]+ [\d.]+ [\d.]+\)$/

/** The OKLCH hue of a literal. */
function hueOf(value: string | undefined): number {
  return Number(value?.match(/oklch\([\d.]+ [\d.]+ ([\d.]+)\)/)?.[1])
}

describe("emitInitItem", () => {
  test("emits base CSS through registry fields instead of a CSS file", () => {
    const item = emitInitItem({
      baseRegistryCss,
      preset: { density: "default", componentParams: {} },
      registryRoot: "https://dotui.com",
    })

    expect(item.type).toBe("registry:base")
    // Base CSS passes through untouched: no palette blocks ride in `css`.
    expect(item.css).toEqual(baseRegistryCss.css)
    expect(item.dependencies).not.toContain("tailwindcss-autocontrast")
    expect((item as InitItemConfig).config?.tailwind?.cssVariables).toBe(true)
    expect((item as InitItemConfig).config?.registries?.["@dotui"]).toBe(
      "https://dotui.com/r/{name}?preset=",
    )
    expect(item.files?.map((file) => file.target)).toEqual(["src/lib/utils.ts"])
    expect(JSON.stringify(item)).not.toContain("dotui-base.css")
  })

  test("ships semantic tokens as per-mode literals in the shadcn shape", () => {
    const item = emitInitItem({
      baseRegistryCss,
      preset: { density: "default", componentParams: {} },
      registryRoot: "https://dotui.com",
    })
    const { theme, light, dark } = item.cssVars ?? {}

    // `@theme inline` aliases the vocabulary onto `:root` names …
    expect(theme).toMatchObject({
      "--radius-lg": "var(--radius)",
      "--color-bg": "var(--bg)",
      "--color-fg-on-primary": "var(--fg-on-primary)",
      "--color-border-focus-muted": "var(--border-focus-muted)",
    })
    // … and every name resolves to a literal in both modes.
    for (const name of Object.keys(theme ?? {}).filter((n) =>
      n.startsWith("--color-"),
    )) {
      const root = name.replace("--color-", "")
      expect(light?.[root], root).toMatch(OKLCH)
      expect(dark?.[root], root).toMatch(OKLCH)
    }
    expect(
      Object.keys({ ...light, ...dark }).some((k) => k.startsWith("--")),
    ).toBe(false)
    expect(light).toMatchObject({ radius: "0.625rem" })
    // A neutral primary is the inverse surface: dark text in light mode …
    expect(light?.["primary"]).toBe(light?.["fg"])
    // … and light in dark mode.
    expect(dark?.["primary"]).toBe(dark?.["fg"])
    // Recipes flatten to literals — no `color-mix()` or `var()` escapes.
    expect(light?.["primary-hover"]).toMatch(OKLCH)
    expect(dark?.["border"]).toMatch(OKLCH)
    expect(JSON.stringify([light, dark])).not.toMatch(
      /var\(--(neutral|accent)-/,
    )
    // Chart slots ride along per mode.
    expect(light?.["chart-1"]).toMatch(OKLCH)
    expect(dark?.["chart-8"]).toMatch(OKLCH)
  })

  test("writes the preset into the @dotui registry URL string", () => {
    const item = emitInitItem({
      baseRegistryCss,
      preset: { density: "default", componentParams: {} },
      encodedPreset: "abc123",
      registryRoot: "https://dotui.com",
    })

    expect((item as InitItemConfig).config?.registries?.["@dotui"]).toBe(
      "https://dotui.com/r/{name}?preset=abc123",
    )
  })

  test("adds non-default density as a root css var without mutating the base fields", () => {
    const item = emitInitItem({
      baseRegistryCss,
      preset: { density: "compact", componentParams: {} },
      registryRoot: "https://dotui.com",
    })

    expect(item.css?.[":root"]).toMatchObject({ "--dotui-density": "compact" })
    expect(baseRegistryCss.css).not.toHaveProperty(":root")
  })

  test("emits preset tokens as :root vars, wrapping token refs in var()", () => {
    const item = emitInitItem({
      baseRegistryCss,
      preset: {
        density: "default",
        componentParams: {},
        tokens: {
          "--radius": "0.5rem",
          "--btn-radius": "--radius-md",
        },
      },
      registryRoot: "https://dotui.com",
    })

    // Radius rides with the colors; other tokens stay in a plain `:root`
    // rule, out of reach of shadcn's theme updater.
    expect(item.cssVars?.light).toMatchObject({ radius: "0.5rem" })
    expect(item.css?.[":root"]).toEqual({ "--btn-radius": "var(--radius-md)" })
  })

  test("font tokens become registry:font deps, not a Google Fonts @import", () => {
    const preset = {
      density: "default" as const,
      componentParams: {},
      tokens: {
        "--font-sans": "'Figtree', ui-sans-serif, system-ui, sans-serif",
        "--font-heading": "'Figtree', ui-sans-serif, system-ui, sans-serif",
      },
    }
    const item = emitInitItem({
      baseRegistryCss,
      preset,
      registryRoot: "https://dotui.com",
    })

    expect(item.registryDependencies).toEqual([
      "https://dotui.com/r/font-figtree",
      "https://dotui.com/r/font-heading-figtree",
    ])
    // shadcn would place a CSS import after `@import "tailwindcss"`, where
    // bundlers drop it — the faces travel as font items instead.
    expect(
      Object.keys(item.css ?? {}).some((key) => key.startsWith("@import url(")),
    ).toBe(false)
    // The `@theme` vocabulary still points at the family for the stack.
    expect(item.cssVars?.theme?.["--font-sans"]).toMatch(/^'Figtree'/)

    // The v0 export renders a real stylesheet and hoists imports, so it asks
    // for the Google import explicitly.
    const v0 = mergePresetCssFields(baseRegistryCss, preset, {
      googleFontsImport: true,
    })
    expect(
      Object.keys(v0.css ?? {}).find((key) => key.startsWith("@import url(")),
    ).toMatch(/fonts\.googleapis\.com.*Figtree/)
  })

  test("a custom color recipe re-solves every literal in both modes", () => {
    const item = emitInitItem({
      baseRegistryCss,
      preset: {
        density: "compact",
        componentParams: {},
        color: { v: 2, seeds: { accent: "#ef4444" } },
      },
      registryRoot: "https://dotui.com",
    })

    const light = item.cssVars?.light ?? {}
    const dark = item.cssVars?.dark ?? {}
    // #ef4444 is red — hue far from the default blue (~250).
    expect(hueOf(light["accent"])).toBeGreaterThan(0)
    expect(hueOf(light["accent"])).toBeLessThan(60)
    expect(hueOf(dark["accent-muted"])).toBeLessThan(60)
    expect(light["accent-muted"]).not.toBe(dark["accent-muted"])
    // Per-mode chart palettes: at least one slot differs (slot 1 may
    // legitimately match when the accent's lightness snaps to the same rung).
    const chartSlots = Array.from({ length: 8 }, (_, i) => `chart-${i + 1}`)
    expect(chartSlots.some((slot) => dark[slot] !== light[slot])).toBe(true)
  })

  test("an accent-sourced primary draws the primary cluster from the accent", () => {
    const item = emitInitItem({
      baseRegistryCss,
      preset: {
        density: "default",
        componentParams: {},
        color: { v: 2, seeds: { accent: "#3ecf8e" }, primary: "accent" },
      },
      registryRoot: "https://dotui.com",
    })

    const light = item.cssVars?.light ?? {}
    expect(light["primary"]).toBe(light["accent"])
    expect(light["primary-hover"]).toBe(light["accent-hover"])
    expect(light["primary-muted"]).toBe(light["accent-muted"])
    expect(light["fg-on-primary"]).toBe(light["fg-on-accent"])
    // The base fixture stays untouched.
    expect(baseRegistryCss.cssVars.theme).toEqual({
      "--radius-lg": "var(--radius)",
    })
  })
})

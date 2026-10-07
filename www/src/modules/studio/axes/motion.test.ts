import { describe, expect, test } from "vitest"

import { baseRegistryCss } from "@/registry/__generated__/base-css"
import { publishables } from "@/registry/__generated__/publishables"
import { STYLE_VAR_DEFAULTS } from "@/registry/__generated__/style-var-defaults"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"
import { PRESETS } from "@/modules/presets"

import { DEFAULT_STATE, effective, parseState } from "."
import type { StudioState } from "."
import { designSystemOf } from "../resolve"
import {
  bezierCss,
  FAMILY_MOTION_KEYS,
  legTiming,
  motionVars,
  springProgress,
  tableOf,
} from "./motion"
import { MOTION_OPTIONS } from "./motion.meta"

const MOTION_SUFFIX =
  /-(state-duration|state-ease|color-duration|color-ease|enter-duration|exit-duration|exit-ease|ease)$/
const MOTION_VAR = new RegExp(`^--studio-.+${MOTION_SUFFIX.source}`)

describe("timing", () => {
  test("beziers print as CSS, the linear one by keyword", () => {
    expect(bezierCss([0.25, 0.1, 0.25, 1])).toBe(
      "cubic-bezier(0.25, 0.1, 0.25, 1)",
    )
    expect(bezierCss([0, 0, 1, 1])).toBe("linear")
  })

  test("a spring runs as linear() for its settle time", () => {
    const travel = legTiming(tableOf("expressive").travel.enter)
    expect(travel.ease).toMatch(/^linear\(0, .+, 1\)$/)
    expect(travel.ms % 10).toBe(0)
    // Spatial springs overshoot; effects springs never do.
    const peak = (ease: string) =>
      Math.max(...(ease.match(/\d\.\d+(?= )/g) ?? ["0"]).map(Number))
    expect(peak(travel.ease)).toBeGreaterThan(1)
    const micro = tableOf("expressive").micro.enter.curve
    if (micro.type !== "physics") throw new Error("expected a spring")
    for (let t = 0; t < 0.5; t += 0.01)
      expect(springProgress(t, micro)).toBeLessThanOrEqual(1)
  })
})

describe("role tables", () => {
  test("styles.css declares Standard, and every timing var is a member's", () => {
    const standard = motionVars(() => tableOf("standard"))
    const declared = Object.fromEntries(
      Object.entries(STYLE_VAR_DEFAULTS).filter(([name]) =>
        MOTION_VAR.test(name),
      ),
    )
    expect(declared).toEqual(standard)
  })

  test("every option times every member", () => {
    const names = Object.keys(motionVars(() => tableOf("standard"))).sort()
    for (const { value } of MOTION_OPTIONS)
      expect(
        Object.keys(motionVars(() => tableOf(value))).sort(),
        value,
      ).toEqual(names)
  })

  test("None is instant everywhere", () => {
    const durations = Object.entries(motionVars(() => tableOf("none"))).filter(
      ([name]) => name.endsWith("duration"),
    )
    expect(durations.length).toBeGreaterThan(0)
    for (const [name, value] of durations) expect(value, name).toBe("0ms")
  })
})

describe("resolve", () => {
  test("Origin writes nothing and the registry's default patterns", () => {
    const ds = designSystemOf(DEFAULT_STATE)
    expect(ds.tokens).toEqual({})
    expect(ds.componentParams.popover).toMatchObject({ motion: "scale" })
    expect(ds.componentParams.tooltip).toMatchObject({ motion: "scale" })
    expect(ds.componentParams.modal).toMatchObject({ motion: "scale" })
    expect(ds.componentParams.toast).toMatchObject({ motion: "slide" })
    expect(ds.componentParams.accordion).toMatchObject({ motion: "expand" })
    expect(ds.componentParams.collapsible).toEqual({ motion: "expand" })
  })

  test("an option writes member vars only, and only what leaves Standard", () => {
    for (const motion of ["smooth", "expressive", "none"]) {
      const { tokens, componentParams } = designSystemOf(parseState({ motion }))
      expect(Object.keys(tokens).length, motion).toBeGreaterThan(0)
      for (const name of Object.keys(tokens))
        expect(name, motion).toMatch(MOTION_VAR)
      if (motion !== "none")
        expect(componentParams).toEqual(
          designSystemOf(DEFAULT_STATE).componentParams,
        )
    }
  })

  test("one entrance moves popover and tooltip together", () => {
    for (const [entrance, param] of [
      ["slide", "slide"],
      ["fade", "fade"],
    ]) {
      const ds = designSystemOf(parseState({ motionEntrance: entrance }))
      expect(ds.componentParams.popover).toMatchObject({ motion: param })
      expect(ds.componentParams.tooltip).toMatchObject({ motion: param })
      expect(ds.tokens).toEqual({})
    }
  })

  test("the dialog entrance is its own pattern on the same timing", () => {
    for (const dialogEntrance of ["rise", "drop"]) {
      const ds = designSystemOf(parseState({ dialogEntrance }))
      expect(ds.componentParams.modal).toMatchObject({
        motion: dialogEntrance,
      })
      expect(ds.componentParams.popover).toMatchObject({ motion: "scale" })
    }
  })

  test("None stops every pattern and pins the entrance rows", () => {
    const state = parseState({
      motion: "none",
      motionEntrance: "fade",
      dialogEntrance: "drop",
    })
    const { componentParams } = designSystemOf(state)
    for (const name of ["popover", "tooltip", "modal", "toast", "chart"])
      expect(componentParams[name], name).toMatchObject({ motion: "none" })
    for (const name of ["accordion", "collapsible"])
      expect(componentParams[name], name).toMatchObject({ motion: "none" })
    const { explain } = effective(state)
    expect(explain.motionEntrance?.lock).toMatchObject({
      kind: "pin",
      cause: "menuMotion",
    })
    expect(explain.dialogEntrance?.lock).toMatchObject({
      kind: "pin",
      cause: "dialogMotion",
    })
  })
})

describe("per-family motion", () => {
  // Members with their own vars; radio, toggle-button, token-field and collapsible ride a sibling's.
  const TIMED: Record<string, string[]> = {
    buttonMotion: ["button", "segmented-control"],
    inputMotion: ["input"],
    selectionMotion: ["checkbox", "slider", "switch"],
    menuMotion: ["popover", "tooltip"],
    dialogMotion: ["drawer", "modal"],
    navMotion: ["breadcrumbs", "link", "sidebar", "tabs"],
    displayMotion: ["accordion", "table"],
    dateMotion: ["calendar", "time-picker"],
    feedbackMotion: ["progress", "tag", "toast", "toast-swipe"],
  }
  const STOPPED: Record<string, string[]> = {
    menuMotion: ["popover", "tooltip"],
    dialogMotion: ["modal"],
    displayMotion: ["accordion", "collapsible"],
    feedbackMotion: ["toast"],
  }
  const members = (tokens: Record<string, string>) =>
    [
      ...new Set(
        Object.keys(tokens).map((name) =>
          name.replace(/^--studio-/, "").replace(MOTION_SUFFIX, ""),
        ),
      ),
    ].sort()
  const origin = designSystemOf(DEFAULT_STATE).componentParams

  test("covers every family key", () => {
    expect(Object.keys(TIMED).sort()).toEqual([...FAMILY_MOTION_KEYS].sort())
  })

  test("a family's own Motion times and stops only its members", () => {
    for (const key of FAMILY_MOTION_KEYS) {
      const { tokens, componentParams } = designSystemOf(
        parseState({ [key]: "none" }),
      )
      expect(members(tokens), key).toEqual(TIMED[key])
      const stopped = Object.keys(componentParams).filter(
        (name) => componentParams[name] !== origin[name],
      )
      expect(stopped.sort(), key).toEqual(STOPPED[key] ?? [])
      for (const name of stopped)
        expect(componentParams[name], `${key}: ${name}`).toMatchObject({
          motion: "none",
        })
    }
  })

  test("a family kept on Standard sits out a global change", () => {
    const { tokens, componentParams } = designSystemOf(
      parseState({ motion: "none", menuMotion: "standard" }),
    )
    expect(members(tokens)).not.toContain("popover")
    expect(members(tokens)).toContain("button")
    expect(componentParams.popover).toBe(origin.popover)
    expect(componentParams.modal).toMatchObject({ motion: "none" })
  })

  test("members outside every family ride the global Motion", () => {
    const pinned = Object.fromEntries(
      FAMILY_MOTION_KEYS.map((key) => [key, "standard"]),
    )
    const { tokens } = designSystemOf(parseState({ motion: "none", ...pinned }))
    expect(members(tokens)).toEqual([
      "color-swatch-picker",
      "message-scroller",
      "questionnaire",
    ])
  })

  test("Same as Motion ships what picking the global's value ships", () => {
    for (const motion of ["none", "smooth", "expressive"]) {
      const own = Object.fromEntries(
        FAMILY_MOTION_KEYS.map((key) => [key, motion]),
      )
      expect(designSystemOf(parseState({ motion, ...own })), motion).toEqual(
        designSystemOf(parseState({ motion })),
      )
    }
  })
})

/* What users install: every publishable item, shipped from a state. */
async function shipAll(state: StudioState) {
  const ds = designSystemOf(state)
  const preset: PublishPreset = {
    density: ds.density,
    componentParams: ds.componentParams,
    tokens: ds.tokens,
    color: ds.color,
    icons: ds.icons,
  }
  const shipped: Record<string, string> = {}
  for (const [name, load] of Object.entries(publishables)) {
    const { item } = publish({
      publishable: selectPublishable(await load(), preset),
      preset,
    })
    shipped[name] = (item.files ?? []).map((f) => f.content).join("\n")
  }
  return shipped
}

/* The removed theme tokens and the utilities they made. */
const THEME_MOTION =
  /--ease-enter|--ease-fluid-out|--transition-duration-(enter|exit)|--default-transition-duration|\b(duration|ease)-(enter|exit)\b|\bease-fluid-out\b/

describe("shipped motion", () => {
  test("the theme ships no motion tokens", () => {
    expect(JSON.stringify(baseRegistryCss)).not.toMatch(THEME_MOTION)
  })

  test("Standard ships shadcn's classes", async () => {
    const shipped = await shipAll(DEFAULT_STATE)
    expect(
      Object.entries(shipped)
        .filter(([, c]) => c.includes("--studio-") || THEME_MOTION.test(c))
        .map(([name]) => name),
    ).toEqual([])
    // Tailwind's 150ms default ships no class.
    expect(shipped.button).toContain(
      "transition-[background-color,border-color,color,box-shadow,filter,scale,translate] select-ui",
    )
    expect(shipped["segmented-control"]).toContain(
      "transition-[translate,width,height] motion-reduce:transition-none",
    )
    // shadcn's tooltip sets no duration: tw-animate's 150ms on `ease`.
    expect(shipped.tooltip).toContain(
      "transition-[transform,opacity,scale] ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change",
    )
    expect(shipped.popover).toContain("duration-100")
    expect(shipped.modal).toContain(
      "transition-opacity duration-100 ease-[cubic-bezier(0.25,0.1,0.25,1)] motion-reduce:transition-none",
    )
    expect(shipped.drawer).toContain(
      "duration-450 ease-[cubic-bezier(0.22,1,0.36,1)]",
    )
    expect(shipped.drawer).toContain(
      "data-ending-style:duration-[calc(400ms*var(--drawer-swipe-strength,1))]",
    )
    expect(shipped.sidebar).toContain(
      "transition-[width] duration-200 ease-linear",
    )
    expect(shipped.toast).toContain(
      "duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)] data-ending-style:data-swipe-direction:duration-200 data-ending-style:data-swipe-direction:ease-out",
    )
  })

  test("every option ships plain classes, no studio vars", async () => {
    const survivors: string[] = []
    for (const { value } of MOTION_OPTIONS) {
      const shipped = await shipAll(parseState({ motion: value }))
      for (const [name, content] of Object.entries(shipped))
        if (content.includes("--studio-")) survivors.push(`${value}: ${name}`)
    }
    expect(survivors).toEqual([])
  })

  test("Expressive springs enters as linear(); exits keep a bezier", async () => {
    const shipped = await shipAll(parseState({ motion: "expressive" }))
    const sprung = [
      "button",
      "switch",
      "popover",
      "tooltip",
      "modal",
      "drawer",
      "toast",
      "accordion",
      "collapsible",
    ].filter(
      (name) => !/ease-\[linear\(0,[^\s\]]+,1\)\]/.test(shipped[name] ?? ""),
    )
    expect(sprung).toEqual([])
    expect(shipped.popover).toContain(
      "exiting:ease-[cubic-bezier(0.3,0,0.8,0.15)]",
    )
  })

  test("Expressive overshoots what glides, never a color", async () => {
    const vars = motionVars(() => tableOf("expressive"))
    const peak = (ease = "") =>
      Math.max(...(ease.match(/\d\.\d+(?= )/g) ?? ["0"]).map(Number))
    for (const id of ["switch", "segmented-control", "tabs"]) {
      expect(peak(vars[`--studio-${id}-state-ease`]), id).toBeGreaterThan(1)
      expect(peak(vars[`--studio-${id}-color-ease`]), id).toBeLessThanOrEqual(1)
    }
  })

  test("Smooth exits shorter than it enters", async () => {
    const shipped = await shipAll(parseState({ motion: "smooth" }))
    expect(shipped.popover).toContain(
      "duration-160 ease-[cubic-bezier(0.16,1,0.3,1)]",
    )
    expect(shipped.popover).toContain("exiting:duration-100")
    // Radix Themes' tooltip: 140ms in, no exit animation.
    expect(shipped.tooltip).toContain(
      "duration-140 ease-[cubic-bezier(0.16,1,0.3,1)]",
    )
    expect(shipped.tooltip).toContain("exiting:duration-0")
  })
})

describe("presets", () => {
  test("Origin rides Standard; Material 3 and Radix take their own tables", () => {
    const motion = Object.fromEntries(
      PRESETS.map((p) => [p.id, p.state.motion]),
    )
    expect(motion.origin).toBe("standard")
    expect(motion.material3).toBe("expressive")
    expect(motion.radix).toBe("smooth")
  })
})

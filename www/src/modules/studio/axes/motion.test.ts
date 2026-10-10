import { describe, expect, test } from "vitest"

import { baseRegistryCss } from "@/registry/__generated__/base-css"
import { publishables } from "@/registry/__generated__/publishables"
import { STYLE_VAR_DEFAULTS } from "@/registry/__generated__/style-var-defaults"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"
import { PRESETS } from "@/modules/presets"

import { DEFAULT_STATE, effective, followersOf, parseState } from "."
import type { StudioState } from "."
import { designSystemOf } from "../resolve"
import {
  bezierCss,
  COMPONENT_MOTION_KEYS,
  legTiming,
  motionVars,
  springProgress,
  tableOf,
} from "./motion"
import { COMPONENT_MOTION_OPTIONS } from "./motion.meta"

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
    for (const { value } of COMPONENT_MOTION_OPTIONS)
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

  test("a tempo writes member vars only, and only what leaves Standard", () => {
    for (const motion of ["smooth", "expressive"]) {
      const { tokens, componentParams } = designSystemOf(parseState({ motion }))
      expect(Object.keys(tokens).length, motion).toBeGreaterThan(0)
      for (const name of Object.keys(tokens))
        expect(name, motion).toMatch(MOTION_VAR)
      expect(componentParams).toEqual(
        designSystemOf(DEFAULT_STATE).componentParams,
      )
    }
  })

  test("each entrance moves its own pattern", () => {
    for (const [entrance, param] of [
      ["slide", "slide"],
      ["fade", "fade"],
    ]) {
      const popover = designSystemOf(parseState({ popoverEntrance: entrance }))
      expect(popover.componentParams.popover).toMatchObject({ motion: param })
      expect(popover.componentParams.tooltip).toMatchObject({ motion: "scale" })
      expect(popover.tokens).toEqual({})
      const tooltip = designSystemOf(parseState({ tooltipEntrance: entrance }))
      expect(tooltip.componentParams.tooltip).toMatchObject({ motion: param })
      expect(tooltip.componentParams.popover).toMatchObject({ motion: "scale" })
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

  test("a component's None stops its pattern and pins its entrance row", () => {
    for (const [key, entrance, param] of [
      ["popoverMotion", "popoverEntrance", "popover"],
      ["tooltipMotion", "tooltipEntrance", "tooltip"],
      ["dialogMotion", "dialogEntrance", "modal"],
    ] as const) {
      const state = parseState({
        [key]: "none",
        popoverEntrance: "fade",
        tooltipEntrance: "fade",
        dialogEntrance: "drop",
      })
      expect(designSystemOf(state).componentParams[param], key).toMatchObject({
        motion: "none",
      })
      expect(effective(state).explain[entrance]?.lock, key).toMatchObject({
        kind: "pin",
        cause: key,
      })
    }
  })
})

describe("per-component motion", () => {
  // Members with their own vars; toggle-button, token-field, radio and collapsible ride a sibling's.
  const TIMED: Record<string, string[]> = {
    buttonMotion: ["button", "tag"],
    segmentedMotion: ["segmented-control"],
    fieldMotion: ["input"],
    checkboxMotion: ["checkbox", "color-swatch-picker", "questionnaire"],
    switchMotion: ["switch"],
    sliderMotion: ["slider"],
    popoverMotion: ["popover"],
    tooltipMotion: ["tooltip"],
    dialogMotion: ["modal"],
    sheetMotion: ["drawer"],
    tabsMotion: ["tabs"],
    sidebarMotion: ["sidebar"],
    linkMotion: ["breadcrumbs", "link"],
    tableMotion: ["table"],
    accordionMotion: ["accordion"],
    calendarMotion: ["calendar", "time-picker"],
    toastMotion: ["message-scroller", "toast", "toast-swipe"],
    progressMotion: ["progress"],
  }
  const STOPPED: Record<string, string[]> = {
    popoverMotion: ["popover"],
    tooltipMotion: ["tooltip"],
    dialogMotion: ["modal"],
    accordionMotion: ["accordion", "collapsible"],
    toastMotion: ["toast"],
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

  test("covers every component key, each following Motion by default", () => {
    expect(Object.keys(TIMED).sort()).toEqual([...COMPONENT_MOTION_KEYS].sort())
    for (const key of COMPONENT_MOTION_KEYS)
      expect(DEFAULT_STATE[key], key).toBe("same")
    expect(followersOf(DEFAULT_STATE, "motion")).toEqual([])
  })

  test("a component's own Motion times and stops only its members", () => {
    for (const key of COMPONENT_MOTION_KEYS) {
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
      expect(
        members(designSystemOf(parseState({ [key]: "expressive" })).tokens),
        key,
      ).toEqual(TIMED[key])
    }
  })

  test("a component's own Motion wins over the global", () => {
    const next = parseState({
      motion: "expressive",
      buttonMotion: "none",
      popoverMotion: "smooth",
    })
    expect(followersOf(next, "motion")).toEqual([
      "buttonMotion",
      "popoverMotion",
    ])
    const { tokens } = designSystemOf(next)
    expect(tokens["--studio-button-state-duration"]).toBe("0ms")
    expect(tokens["--studio-popover-enter-duration"]).toBe("160ms")
    expect(tokens["--studio-switch-state-ease"]).toMatch(/^linear\(/)
  })

  test("a component kept on Standard sits out a global change", () => {
    const { tokens, componentParams } = designSystemOf(
      parseState({ motion: "smooth", popoverMotion: "standard" }),
    )
    expect(members(tokens)).not.toContain("popover")
    expect(members(tokens)).toContain("tooltip")
    expect(componentParams.popover).toEqual(origin.popover)
  })

  test("every member is some component's", () => {
    const pinned = Object.fromEntries(
      COMPONENT_MOTION_KEYS.map((key) => [key, "standard"]),
    )
    const { tokens } = designSystemOf(
      parseState({ motion: "smooth", ...pinned }),
    )
    expect(members(tokens)).toEqual([])
  })

  test("Same as motion ships what picking the global's value ships", () => {
    for (const motion of ["smooth", "expressive"]) {
      const own = Object.fromEntries(
        COMPONENT_MOTION_KEYS.map((key) => [key, motion]),
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
    for (const { value } of COMPONENT_MOTION_OPTIONS) {
      // The global covers the members no component Motion times.
      const shipped = await shipAll(
        parseState({
          ...(value === "none" ? {} : { motion: value }),
          ...Object.fromEntries(
            COMPONENT_MOTION_KEYS.map((key) => [key, value]),
          ),
        }),
      )
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

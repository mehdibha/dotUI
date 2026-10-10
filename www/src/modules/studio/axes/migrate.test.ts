import { describe, expect, it } from "vitest"

import { PRESETS } from "@/modules/presets"

import { designSystemOf } from "../resolve"
import main from "./__fixtures__/main-states.json"
import type { Explained } from "./core/types"
import {
  checkKey,
  DEFAULT_STATE,
  effective,
  FOLLOWS,
  formatIssues,
  SCHEMA as TODAY,
  validate,
} from "./index"
import type { StudioState } from "./index"
import { migrate } from "./migrate"
import { COMPONENT_MOTION_KEYS, motionVars, tableOf } from "./motion"
import { stamp } from "./version"

type Raw = Record<string, unknown>

const SCHEMA = main.schema as Record<string, Raw>

const MAIN_DEFAULTS: Raw = Object.fromEntries(
  Object.entries(SCHEMA).map(([key, { default: value }]) => [key, value]),
)

const mainState = (diff: Raw = {}) => ({ ...MAIN_DEFAULTS, ...diff })

function load(raw: unknown): StudioState {
  const result = validate(migrate(raw))
  if (!result.ok) throw new Error(formatIssues(result.issues))
  return result.state
}

const cross = (axes: Record<string, readonly unknown[]>): Raw[] =>
  Object.entries(axes).reduce<Raw[]>(
    (states, [key, values]) =>
      states.flatMap((state) => values.map((v) => ({ ...state, [key]: v }))),
    [{}],
  )

const choices = (key: string) => SCHEMA[key]!.values as unknown[]

/* What main drew, in today's names, where the name changed. */
const RENAMED: Record<string, Raw> = {
  inputStyle: { line: "underline", "filled-line-bottom": "indicator" },
  inputHover: { border: "edge" },
  otpStyle: { group: "attached", boxes: "separate" },
  segmentedSelected: { flat: "tone" },
  toggleSelected: { fill: "tone" },
  sliderThumb: { circle: "knob", outline: "ring", bar: "handle" },
}

/* Rules that draw a main pick differently today; the pick stays saved and
   comes back when the rule lets go. */
const RULED: Record<string, string> = {
  // Attached cells' underlines merged into one line on main.
  "otp-field/underline-separates-cells": "otpStyle",
  // Ledge groups never attach, so no seam is drawn.
  "button-groups/ledge-gaps-groups": "groupSeparator",
  // Flat cards with no edge get a tone or a shadow apart from the page.
  "color/grouped-page": "lightBg",
  "surfaces/flat-needs-separation": "surfaceShadow",
  // Main's tonal layers win over a button style Tonal excludes.
  "style/buttonStyle-tonal": "buttonStyle",
}

/** Every key main drew that still draws a value of its own: today's
 *  effective value is the one main showed, or a rule in RULED changed it
 *  with main's pick kept saved. */
function expectMainLook(diff: Raw, ruled = new Set<string>()) {
  const before = mainState(diff)
  const state = load(before)
  const { values, explain: explained } = effective(state)
  const explain: Record<string, Explained | undefined> = explained
  for (const [key, value] of Object.entries(before)) {
    const drawn =
      key === "headingFont" && value === ""
        ? before.bodyFont
        : (RENAMED[key]?.[String(value)] ?? value)
    const follows = FOLLOWS[key]?.some((follow) => follow.id === drawn)
    // Gone, renamed past recognition, or a follow.
    if (!Object.hasOwn(TODAY, key) || checkKey(key, drawn) || follows) continue
    const actual = values[key as keyof typeof values]
    const rule = explain[key]?.lock?.rule ?? explain[key]?.rule
    if (actual !== drawn && rule && RULED[rule] === key) {
      expect(state[key as keyof StudioState], `${key} kept`).toBe(drawn)
      ruled.add(rule)
      continue
    }
    // A hidden key draws nothing of its own.
    if (explain[key]?.lock?.kind === "hide") continue
    expect(
      actual,
      `${key}=${value} in ${JSON.stringify(diff)} via ${rule}`,
    ).toBe(drawn)
  }
}

const DROPPED_KEYS = [
  "accordionMarker",
  "addonDivider",
  "addonLayout",
  "breadcrumbsMotion",
  "cardControl",
  "colorSwatchPickerMotion",
  "cursorDragging",
  "cursorPending",
  "focusGap",
  "focusInputStrength",
  "loaderMotion",
  "messageScrollerMotion",
  "popoverHeader",
  "progressIndeterminate",
  "questionnaireMotion",
  "skeletonMotion",
  "spacingUnit",
  "tableSeparation",
  "tagMotion",
  "timePickerMotion",
  "toastSwipeMotion",
]

const DROPPED_VALUES = [
  "accordionMotion=fade",
  "buttonRadius=round",
  "buttonRadius=sharp",
  "calendarDayShape=square",
  "calendarToday=none",
  "chartMotion=stiff",
  "chartMotion=wobbly",
  "checkCorner=circle",
  "focusOffset=flush",
  // Drawn as Auto draws flat buttons.
  "groupSeparator=none",
  "inputError=bar",
  "kbdTreatment=text",
  "modalMotion=fade",
  "otpStyle=underline",
  "tabStyle=enclosed",
  "toastMotion=fade",
  "toggleSelected=chip",
]

const CONTEXT: Record<string, Raw> = {
  focusHaloStrength: { focusStyle: "halo" },
  focusInputBorderWidth: { focusInputStyle: "border" },
}

/** A main key's default, then the values it could hold besides, by name. */
function values(key: string): [string, unknown][] {
  const { default: value, values, max, motion, patterns, type } = SCHEMA[key]!
  const others = (): [string, unknown][] => {
    if (Array.isArray(values))
      return values.filter((v) => v !== value).map((v) => [String(v), v])
    if (typeof max === "number") return [[String(max), max]]
    if (typeof value === "boolean") return [[String(!value), !value]]
    if (type === "color") return [["#ff0000", "#ff0000"]]
    if (type === "font") return [["Inter", "Inter"]]
    const base = value as Raw
    if (motion === "loop") return [["slow", { ...base, cycle: 4000 }]]
    if (motion !== "entrance") return [["off", { ...base, duration: 0 }]]
    return [
      ["off", { ...base, enter: 0 }],
      ...(patterns as string[])
        .filter((p) => p !== base.pattern)
        .map((p): [string, unknown] => [p, { ...base, pattern: p }]),
    ]
  }
  return [[String(value), value], ...others()]
}

/* Main's presets, its motion presets, and its component styles crossed. */
const CORPUS: Raw[] = [
  ...Object.values(main.presets),
  ...cross({
    buttonStyle: choices("buttonStyle"),
    inputStyle: choices("inputStyle"),
    inputHover: choices("inputHover"),
    segmentedSelected: choices("segmentedSelected"),
  }),
  ...cross({
    buttonStyle: choices("buttonStyle"),
    sliderThumb: choices("sliderThumb"),
    sliderTrack: choices("sliderTrack"),
  }),
  ...cross({
    iconLibrary: choices("iconLibrary"),
    iconStroke: [1, 2, 3],
  }),
  ...cross({
    focusStyle: choices("focusStyle"),
    focusWidth: [1, 2, 3, 4],
  }),
  ...cross({
    surfaceLayers: choices("surfaceLayers"),
    surfaceEdge: choices("surfaceEdge"),
    lightBg: [95, 99, 100],
  }),
  ...cross({
    buttonStyle: choices("buttonStyle"),
    surfaceLayers: choices("surfaceLayers"),
    groupSeparator: choices("groupSeparator"),
  }),
  ...cross({
    inputStyle: choices("inputStyle"),
    otpStyle: choices("otpStyle"),
  }),
  ...cross({
    buttonStyle: choices("buttonStyle"),
    motion: Object.values(main.motion),
  }).map(({ motion, ...rest }) => ({ ...rest, ...(motion as Raw) })),
]

describe("migrate", () => {
  it("passes a stamped state through unchanged", () => {
    expect(migrate(stamp(DEFAULT_STATE))).toEqual(DEFAULT_STATE)
    for (const diff of CORPUS) {
      const state = load(mainState(diff))
      expect(migrate(stamp(state))).toEqual(state)
    }
  })

  it("reads an unversioned state without main's keys as current", () => {
    for (const state of [
      DEFAULT_STATE,
      ...PRESETS.map((preset) => preset.state),
      { surfaceLayers: "tonal" },
      { buttonMotion: "smooth" },
      { dialogMotion: "none" },
      { surfaceEdge: "bevel" },
      { inputHover: "none", inputStyle: "outline", iconStroke: 2 },
      { lightBg: 99, sliderTrack: "thin", focusWidth: 2 },
    ])
      expect(migrate({ ...state })).toEqual(state)
  })

  it("reads a version out of range as unversioned, in bounded time", () => {
    for (const version of [-1e300, -2e6, 1.5, 1e300, Number.NaN, "2"]) {
      expect(migrate({ version, ...DEFAULT_STATE })).toEqual(DEFAULT_STATE)
      expect(load({ version, ...mainState({ inputStyle: "line" }) })).toEqual(
        load(mainState({ inputStyle: "line" })),
      )
    }
  })

  it("reads an object only on main's motion keys as main's", () => {
    expect(migrate({ style: "tactile", radiusPx: {} })).toEqual({
      style: "tactile",
      radiusPx: {},
    })
  })

  it("returns anything but an object as is", () => {
    for (const raw of [null, 3, "state", [1]]) expect(migrate(raw)).toBe(raw)
  })

  it("keeps every main choice that has a home, and drops the rest", () => {
    const dropped: string[] = []
    for (const key of Object.keys(SCHEMA)) {
      const context = CONTEXT[key] ?? {}
      const landings = new Map<string, string[]>()
      for (const [name, value] of values(key)) {
        const state = JSON.stringify(
          load(mainState({ ...context, [key]: value })),
        )
        landings.set(state, [...(landings.get(state) ?? []), name])
      }
      // A value lost lands with the default; the default can be lost too.
      const [state, names] = [...landings][0]!
      const kept = String((JSON.parse(state) as Raw)[key])
      const survivor = names.includes(kept) ? kept : names[0]
      if (landings.size === 1) dropped.push(key)
      else
        for (const name of names)
          if (name !== survivor) dropped.push(`${key}=${name}`)
    }
    expect(dropped.sort()).toEqual([...DROPPED_KEYS, ...DROPPED_VALUES].sort())
  })
})

describe("main → v3", () => {
  const preset = (id: keyof typeof main.presets) =>
    load(mainState(main.presets[id]))

  it("brings main's Origin to today's", () => {
    expect(load(mainState())).toEqual(DEFAULT_STATE)
  })

  it("draws every main state as main did, once", () => {
    const ruled = new Set<string>()
    for (const diff of CORPUS) {
      expectMainLook(diff, ruled)
      const once = migrate(mainState(diff))
      expect(migrate(once)).toEqual(once)
    }
    expect([...ruled].sort()).toEqual(Object.keys(RULED).sort())
  })

  it("keeps component styles, renamed where they were", () => {
    const github = preset("github")
    expect(github.buttonStyle).toBe("hairline")
    expect(github.inputStyle).toBe("outline")
    expect(github.segmentedSelected).toBe("raised")
    expect(github.focusStyle).toBe("inset")
    expect(github.focusInputWeight).toBe("thick")
    expect(github.popoverEntrance).toBe("fade")
    const airbnb = preset("airbnb")
    expect(airbnb.sliderThumb).toBe("ring")
    expect(airbnb.checkCorner).toBe("sharp")
    expect(airbnb.paginationCurrent).toBe("primary")
    expect(airbnb.dialogEntrance).toBe("rise")
    expect(airbnb.menuInset).toBe("full-bleed")
    expect(preset("notion").accordionMarker).toBe("leading-caret")
    const supabase = preset("supabase")
    expect(supabase.sectionLabels).toBe("caps")
    expect(supabase.dialogBackdropStrength).toBe("light")
    expect(supabase.inputHover).toBe("edge")
    expect(supabase.segmentedSelected).toBe("tone")
  })

  it("pins what a follow would draw differently, and follows the rest", () => {
    const hairline = load(mainState({ buttonStyle: "hairline" }))
    expect(hairline).toMatchObject({
      style: "flat",
      buttonStyle: "hairline",
      inputStyle: "outline",
      inputHover: "auto",
      segmentedSelected: "tone",
    })
    expect(load(mainState({ inputStyle: "line" }))).toMatchObject({
      inputStyle: "underline",
      inputHover: "none",
    })
    expect(
      load(mainState({ inputStyle: "line", inputHover: "border" })),
    ).toMatchObject({ inputStyle: "underline", inputHover: "auto" })
    expect(load(mainState({ sliderThumb: "bar" }))).toMatchObject({
      sliderThumb: "handle",
      sliderTrack: "thin",
    })
  })

  it("keeps a pick a rule changes, for when the rule lets go", () => {
    const after = (diff: Raw, change: Raw, key: string) =>
      (
        effective({ ...load(mainState(diff)), ...change } as StudioState)
          .values as Raw
      )[key]
    expect(
      after(
        { iconLibrary: "remix", iconStroke: 1.25 },
        { iconLibrary: "lucide" },
        "iconStroke",
      ),
    ).toBe(1.25)
    expect(
      after(
        { buttonStyle: "ledge", groupSeparator: "divider" },
        { style: "flat", buttonStyle: "flat" },
        "groupSeparator",
      ),
    ).toBe("divider")
    expect(
      after(
        { surfaceLayers: "grouped", surfaceEdge: "none", lightBg: 99 },
        { surfaceEdge: "line" },
        "lightBg",
      ),
    ).toBe(99)
    expect(
      after(
        { inputStyle: "line", otpStyle: "group" },
        { inputStyle: "outline" },
        "otpStyle",
      ),
    ).toBe("attached")
  })

  it("keeps main's tonal layers over a button style Tonal excludes", () => {
    for (const buttonStyle of ["hairline", "gloss", "rim-light", "bevel"]) {
      const state = load(mainState({ buttonStyle, surfaceLayers: "tonal" }))
      expect(state.style, buttonStyle).toBe("tonal")
      expect(effective(state).values.surfaceLayers).toBe("tonal")
      // Saved, so a Style that allows it draws it again.
      expect(state.buttonStyle).toBe(buttonStyle)
    }
  })

  it("picks Flat unless a pick is another Style's", () => {
    const spotify = preset("spotify")
    expect(spotify.style).toBe("tonal")
    expect(spotify.surfaceLayers).toBe("style")
    expect(spotify.surfaceEdge).toBe("style")
    expect(spotify.toggleSelected).toBe("inverse")
    expect(spotify.inputStyle).toBe("filled")
    expect(spotify.surfaceShadow).toBe("flat")
    expect(spotify.menuInset).toBe("inset")

    const bevel = load(mainState({ buttonStyle: "bevel" }))
    expect(bevel.style).toBe("tactile")
    expect(bevel.buttonStyle).toBe("style")
    expect(bevel.surfaceEdge).toBe("line")
    expect(bevel.inputStyle).toBe("outline")
    expect(bevel.segmentedSelected).toBe("tone")
    expect(load(mainState({ buttonStyle: "gloss" })).style).toBe("soft")
    const { spotify: _, ...flat } = main.presets
    for (const diff of Object.values(flat))
      expect(load(mainState(diff)).style).toBe("flat")
  })

  it("turns main's motion presets into the global tempo", () => {
    const motion = (id: keyof typeof main.motion) =>
      load(mainState(main.motion[id]))
    expect(motion("smooth").motion).toBe("smooth")
    expect(motion("snappy").motion).toBe("smooth")
    expect(motion("expressive")).toMatchObject({
      motion: "expressive",
      buttonMotion: "same",
      sheetMotion: "same",
    })
    const off = motion("off")
    expect(off.motion).toBe("standard")
    for (const key of COMPONENT_MOTION_KEYS) expect(off[key], key).toBe("none")
  })

  it("stops every member under main's Off", () => {
    const { tokens } = designSystemOf(load(mainState(main.motion.off)))
    const durations = Object.keys(motionVars(() => tableOf("standard"))).filter(
      (name) => name.endsWith("duration"),
    )
    for (const name of durations) expect(tokens[name], name).toBe("0ms")
  })

  it("keeps a component's own timing apart from the rest", () => {
    const slow = load(
      mainState({
        tooltipMotion: {
          pattern: "slide",
          enter: 400,
          curve: { type: "easing", ease: [0, 0, 0.2, 1] },
        },
        switchMotion: { duration: 300, ease: [0.05, 0.7, 0.1, 1] },
      }),
    )
    expect(slow).toMatchObject({
      motion: "standard",
      tooltipMotion: "smooth",
      tooltipEntrance: "slide",
      switchMotion: "expressive",
      buttonMotion: "same",
    })
  })
})

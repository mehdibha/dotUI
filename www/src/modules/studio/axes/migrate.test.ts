import { describe, expect, it } from "vitest"

import main from "./__fixtures__/main-states.json"
import { DEFAULT_STATE, formatIssues, validate } from "./index"
import type { StudioState } from "./index"
import { migrate, STATE_VERSION, stamp } from "./migrate"

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

describe("migrate", () => {
  it("passes a current state through unchanged", () => {
    expect(migrate(stamp(DEFAULT_STATE))).toEqual(DEFAULT_STATE)
    for (const diff of Object.values(main.presets)) {
      const state = load(mainState(diff))
      expect(migrate(stamp(state))).toEqual(state)
    }
  })

  it("reads an unversioned state with a Style as current", () => {
    expect(migrate({ ...DEFAULT_STATE })).toEqual(DEFAULT_STATE)
  })

  it("stamps the current version", () => {
    expect(stamp(DEFAULT_STATE).version).toBe(STATE_VERSION)
  })

  it("brings main's Origin to today's", () => {
    expect(load(mainState())).toEqual(DEFAULT_STATE)
  })

  it("brings every main preset and motion preset to a valid state", () => {
    for (const diff of [
      ...Object.values(main.presets),
      ...Object.values(main.motion),
    ])
      expect(() => load(mainState(diff))).not.toThrow()
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

  it("keeps component styles, renamed where they were", () => {
    const github = preset("github")
    expect(github.buttonStyle).toBe("hairline")
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
  })

  it("picks the Style that keeps the saved picks, the rest pinned", () => {
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
    expect(load(mainState({ buttonStyle: "gloss" })).style).toBe("soft")
    expect(load(mainState({ buttonStyle: "hairline" })).style).toBe("flat")
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
    expect(off.popoverMotion).toBe("none")
    expect(off.progressMotion).toBe("none")
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

  it("reads #889's family motion and entrance", () => {
    const state = load({
      motion: "smooth",
      motionEntrance: "fade",
      menuMotion: "none",
      selectionMotion: "expressive",
    })
    expect(state).toMatchObject({
      motion: "smooth",
      popoverEntrance: "fade",
      tooltipEntrance: "fade",
      popoverMotion: "none",
      tooltipMotion: "none",
      checkboxMotion: "expressive",
      sliderMotion: "expressive",
    })
  })
})

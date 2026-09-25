import { describe, expect, test } from "vitest"

import { baseRegistryCss } from "@/registry/__generated__/base-css"
import { publishables } from "@/registry/__generated__/publishables"
import { STYLE_VAR_DEFAULTS } from "@/registry/__generated__/style-var-defaults"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"

import { DEFAULTS } from "."
import type { StudioState } from "."
import { resolveDesignSystem } from "../resolve"
import {
  bezierCss,
  curveTiming,
  entranceVars,
  loopVars,
  resolveEntrance,
  stateChangeVars,
} from "./motion"
import type { Entrance, Loop, StateChange } from "./motion"

const ENTRANCE: Entrance = {
  pattern: "scale",
  enter: 200,
  curve: { type: "easing", ease: [0, 0, 0.2, 1] },
  exit: 150,
  exitEase: [0, 0, 0.2, 1],
}
const PATTERNS = [{ value: "scale" }, { value: "fade" }]

describe("motion vocabulary", () => {
  test("beziers print as CSS, the linear one by keyword", () => {
    expect(bezierCss([0.25, 0.1, 0.25, 1])).toBe(
      "cubic-bezier(0.25, 0.1, 0.25, 1)",
    )
    expect(bezierCss([0, 0, 1, 1])).toBe("linear")
  })

  test("a spring runs as linear() for its settle time", () => {
    const time = curveTiming({ type: "spring", bounce: 0.35 }, 300)
    expect(time.ease).toMatch(/^linear\(0, .+, 1\)$/)
    expect(time.ms).toBeGreaterThan(300)
    expect(time.ms % 10).toBe(0)
    // Past 1: the overshoot made it into the stops.
    expect(
      Math.max(...(time.ease.match(/\d\.\d+(?= )/g) ?? []).map(Number)),
    ).toBeGreaterThan(1)
    const physics = curveTiming(
      { type: "physics", stiffness: 400, damping: 30, mass: 1 },
      0,
    )
    expect(physics.ms).toBeGreaterThan(0)
  })

  test("an entrance writes only what leaves its defaults", () => {
    expect(resolveEntrance("x", ENTRANCE, ENTRANCE, PATTERNS)).toEqual({
      tokens: {},
      pattern: "scale",
    })
    expect(
      resolveEntrance(
        "x",
        { ...ENTRANCE, enter: 300, pattern: "fade" },
        ENTRANCE,
        PATTERNS,
      ),
    ).toEqual({
      tokens: { "--studio-x-enter-duration": "300ms" },
      pattern: "fade",
    })
    const spring = resolveEntrance(
      "x",
      { ...ENTRANCE, curve: { type: "spring", bounce: 0.2 } },
      ENTRANCE,
      PATTERNS,
    ).tokens
    expect(Object.keys(spring)).toEqual([
      "--studio-x-enter-duration",
      "--studio-x-ease",
    ])
  })

  test("a malformed stored value falls back field by field", () => {
    const stored = {
      pattern: "spin",
      enter: "fast",
      curve: { type: "easing", ease: [1, 2] },
      exit: 90,
    } as unknown as Entrance
    expect(resolveEntrance("x", stored, ENTRANCE, PATTERNS)).toEqual({
      tokens: { "--studio-x-exit-duration": "90ms" },
      pattern: "scale",
    })
  })
})

/* A `<name>Motion` state key owns the `--studio-<name>-*` vars. */
const idOf = (key: string) =>
  key.replace(/Motion$/, "").replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)
/* The var-backed timings; a param-backed motion (the chart's named
   transition) is its axis's own business. */
const MOTION_KEYS = Object.keys(DEFAULTS).filter(
  (key) =>
    key.endsWith("Motion") &&
    typeof DEFAULTS[key as keyof StudioState] === "object",
) as (keyof StudioState)[]
const isEntrance = (value: unknown): value is Entrance =>
  typeof value === "object" && value !== null && "pattern" in value
const isLoop = (value: unknown): value is Loop =>
  typeof value === "object" && value !== null && "cycle" in value
const varsOf = (key: keyof StudioState, value: unknown) =>
  isEntrance(value)
    ? entranceVars(idOf(key), value)
    : isLoop(value)
      ? loopVars(idOf(key), value)
      : stateChangeVars(idOf(key), value as StateChange)

/* Each component's motion vars live twice: the `:root` defaults in its
   styles.css (what the publisher resolves) and its axis's state defaults
   (what the panel starts from). */
describe("component motion", () => {
  const declared = (id: string, names: string[]) =>
    Object.fromEntries(
      names
        .map((name) => `--studio-${id}-${name}`)
        .filter((name) => name in STYLE_VAR_DEFAULTS)
        .map((name) => [name, STYLE_VAR_DEFAULTS[name]]),
    )
  const ids = (suffix: string) =>
    Object.keys(STYLE_VAR_DEFAULTS).flatMap((name) => {
      const id = new RegExp(`^--studio-(.+)-${suffix}$`).exec(name)?.[1]
      return id ? [id] : []
    })
  const state = DEFAULTS as Record<string, unknown>
  const camel = (id: string) =>
    id.replace(/-(\w)/g, (_, c: string) => c.toUpperCase())

  test.each(ids("enter-duration"))(
    "%s: styles.css agrees with the entrance defaults",
    (id) => {
      const value = state[`${camel(id)}Motion`] as Entrance
      expect(value).toBeDefined()
      expect(
        declared(id, ["enter-duration", "ease", "exit-duration", "exit-ease"]),
      ).toEqual(entranceVars(id, value))
    },
  )

  test.each(ids("state-duration"))(
    "%s: styles.css agrees with the state-change defaults",
    (id) => {
      const value = state[`${camel(id)}Motion`] as StateChange
      expect(value).toBeDefined()
      expect(declared(id, ["state-duration", "state-ease"])).toEqual(
        stateChangeVars(id, value),
      )
    },
  )

  test.each(ids("loop-duration"))(
    "%s: styles.css agrees with the loop defaults",
    (id) => {
      const value = state[`${camel(id)}Motion`] as Loop
      expect(value).toBeDefined()
      expect(declared(id, ["loop-duration", "loop-ease"])).toEqual(
        loopVars(id, value),
      )
    },
  )

  test.each(MOTION_KEYS)("%s writes its own component's vars only", (key) => {
    const value = DEFAULTS[key] as Entrance | StateChange | Loop
    const retimed = isEntrance(value)
      ? { ...value, enter: value.enter + 50 }
      : isLoop(value)
        ? { ...value, cycle: value.cycle + 50 }
        : { ...value, duration: value.duration + 50 }
    const ds = resolveDesignSystem({ ...DEFAULTS, [key]: retimed })
    expect(Object.keys(ds.tokens).length).toBeGreaterThan(0)
    expect(Object.keys(varsOf(key, retimed))).toEqual(
      expect.arrayContaining(Object.keys(ds.tokens)),
    )
    expect(ds.componentParams).toEqual(
      resolveDesignSystem(DEFAULTS).componentParams,
    )
  })
})

/* What users install: every publishable item, shipped from a state. */
async function shipAll(state: StudioState) {
  const ds = resolveDesignSystem(state)
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
  test("the defaults write no motion tokens", () => {
    const { tokens } = resolveDesignSystem(DEFAULTS)
    expect(
      Object.keys(tokens).filter((name) => /-(duration|ease)$/.test(name)),
    ).toEqual([])
  })

  test("the theme ships no motion tokens", () => {
    expect(JSON.stringify(baseRegistryCss)).not.toMatch(THEME_MOTION)
  })

  test("the defaults ship plain classes, no studio vars", async () => {
    const shipped = Object.entries(await shipAll(DEFAULTS))
    expect(
      shipped.filter(
        ([, content]) =>
          content.includes("--studio-") || THEME_MOTION.test(content),
      ),
    ).toEqual([])
  })

  test("a spring entrance ships linear(); exits keep their bezier", async () => {
    const springs = Object.fromEntries(
      MOTION_KEYS.flatMap((key) => {
        const value = DEFAULTS[key]
        return isEntrance(value)
          ? [[key, { ...value, curve: { type: "spring", bounce: 0.2 } }]]
          : []
      }),
    )
    const shipped = await shipAll({ ...DEFAULTS, ...springs })
    const sprung = [
      "popover",
      "tooltip",
      "modal",
      "drawer",
      "toast",
      "accordion",
      "collapsible",
    ].filter((name) =>
      /ease-\[linear\(0,[^\s\]]+,1\)\]/.test(shipped[name] ?? ""),
    )
    expect(sprung).toHaveLength(7)
    expect(
      Object.values(shipped).filter((content) => content.includes("--studio-")),
    ).toEqual([])
    // The popover's exit stays on its bezier, now that it differs from the enter.
    expect(shipped.popover).toContain(
      "exiting:ease-[cubic-bezier(0.25,0.1,0.25,1)]",
    )
  })
})

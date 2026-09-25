import { describe, expect, test } from "vitest"

import { defaultPreset } from "@/lib/registry-preset"
import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

describe("calendar + pickers axes", () => {
  test("defaults resolve to the registry defaults and no tokens", () => {
    const ds = resolveDesignSystem(DEFAULTS)
    expect(ds.componentParams.calendar).toEqual({
      dayShape: "rounded",
      today: "none",
      weekdays: "single",
    })
    expect(ds.componentParams.select).toEqual({ caret: "chevron" })
    expect(ds.tokens).toEqual({})
  })

  test("selections land on the calendar and select params", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      calendarDayShape: "circle",
      calendarToday: "ring",
      calendarWeekdays: "double",
      pickerCaret: "double",
    })
    expect(ds.componentParams.calendar).toEqual({
      dayShape: "circle",
      today: "ring",
      weekdays: "double",
    })
    expect(ds.componentParams.select).toEqual({ caret: "double" })
  })

  test("unknown values fall back to the defaults", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      calendarDayShape: "hexagon",
      pickerCaret: "triangle",
    })
    expect(ds.componentParams.calendar?.dayShape).toBe("rounded")
    expect(ds.componentParams.select?.caret).toBe("chevron")
  })
})

const shipped = async (name: string, tokens: Record<string, string> = {}) => {
  const preset = defaultPreset()
  const mod = await publishables[name]?.()
  if (!mod) throw new Error(`${name} is not publishable`)
  const { item } = publish({
    publishable: selectPublishable(mod, preset),
    preset: { ...preset, tokens: { ...preset.tokens, ...tokens } },
  })
  return item.files?.[0]?.content ?? ""
}

describe("calendar motion", () => {
  test("ships shadcn's default timing: no duration or ease class", async () => {
    const content = await shipped("calendar")
    expect(content).toContain(
      "transition-shadow in-data-calendar:hover:bg-accent-muted",
    )
    expect(content).not.toMatch(/ (duration|ease)-/)
    expect(content).not.toContain("--studio-")
  })

  test("a tweak times the day's focus ring", async () => {
    const { tokens } = resolveDesignSystem({
      ...DEFAULTS,
      calendarMotion: { duration: 200, ease: [0, 0, 0.2, 1] },
    })
    expect(await shipped("calendar", tokens)).toContain(
      "transition-shadow duration-200 ease-out in-data-calendar:hover:bg-accent-muted",
    )
  })
})

describe("picker motion", () => {
  test("ships today's timing: no class for the time column, 100ms for the swatch ring", async () => {
    const time = await shipped("time-picker")
    expect(time).toContain(
      "outline-hidden transition-colors hover:bg-accent-muted",
    )
    expect(time).not.toContain("--studio-")
    const swatch = await shipped("color-swatch-picker")
    expect(swatch).toContain(
      "before:transition-[opacity,scale] before:duration-100 before:content-['']",
    )
    expect(swatch).not.toMatch(/ease-/)
    expect(swatch).not.toContain("--studio-")
  })

  test("a tweak times each picker on its own", async () => {
    const { tokens } = resolveDesignSystem({
      ...DEFAULTS,
      timePickerMotion: { duration: 200, ease: [0, 0, 0.2, 1] },
      colorSwatchPickerMotion: { duration: 150, ease: [0, 0, 0.2, 1] },
    })
    expect(tokens).toEqual({
      "--studio-time-picker-state-duration": "200ms",
      "--studio-time-picker-state-ease": "cubic-bezier(0, 0, 0.2, 1)",
      "--studio-color-swatch-picker-state-duration": "150ms",
      "--studio-color-swatch-picker-state-ease": "cubic-bezier(0, 0, 0.2, 1)",
    })
    expect(await shipped("time-picker", tokens)).toContain(
      "transition-colors duration-200 ease-out hover:bg-accent-muted",
    )
    expect(await shipped("color-swatch-picker", tokens)).toContain(
      "before:transition-[opacity,scale] before:ease-out before:content-['']",
    )
  })
})

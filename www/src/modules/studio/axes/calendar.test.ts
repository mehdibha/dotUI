import { describe, expect, test } from "vitest"

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

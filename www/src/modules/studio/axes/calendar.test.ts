import { describe, expect, test } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import calendarMeta from "@/registry/ui/calendar/meta"
import { calendarStyles, DATE_CELLS } from "@/registry/ui/calendar/styles"
import { timePickerStyles } from "@/registry/ui/time-picker/styles"
import { flatten } from "@/publisher/flatten"
import type { ClassValue } from "@/publisher/types"

import { designSystemOf } from "../resolve"
import {
  TODAY_COLOR_OPTIONS,
  TODAY_OPTIONS,
  WEEKDAY_OPTIONS,
} from "./calendar.meta"
import { DEFAULT_STATE, parseState } from "./index"

const classes = (value: string) => new Set(value.split(/\s+/))
const tokens = (value: ClassValue | undefined): string[] =>
  Array.isArray(value)
    ? value.flatMap(tokens)
    : typeof value === "string"
      ? value.split(/\s+/).filter(Boolean)
      : []

async function published(name: string) {
  const { publishable } = await publishables[name]!()
  return flatten({
    stylesConfig: publishable.stylesConfig,
    meta: publishable.meta,
    density: "default",
    paramSelections: {},
  })
}
const dateCells = DATE_CELLS.split(/\s+/)

/** Range-end fills with no outside-month guard: RAC flags an outside-month
 *  range end selection-start/end but never selected, and it draws no band. */
const unguardedRangeEnds = (classList: string[]) =>
  classList.filter((token) => {
    const parts = token.split(":")
    const utility = parts.at(-1) ?? ""
    return (
      /^(in-)?selection-(start|end)$/.test(
        parts.find((p) => /selection-(start|end)$/.test(p)) ?? "",
      ) &&
      /^(bg|text)-/.test(utility) &&
      !parts.some((p) => /^not-(in-)?outside-month$/.test(p))
    )
  })

describe("date & time axes", () => {
  test("Origin resolves to the registry defaults and no tokens", () => {
    const ds = designSystemOf(DEFAULT_STATE)
    expect(ds.componentParams.calendar).toEqual({
      dayShape: "same",
      today: "fill",
      weekdays: "single",
    })
    expect(ds.tokens).toEqual({})
    expect(ds.color?.scopes).toBeUndefined()
  })

  test("today's marker and color fold into one registry param", () => {
    const values = calendarMeta.params.today.values as readonly string[]
    for (const { value: marker } of TODAY_OPTIONS)
      for (const { value: color } of TODAY_COLOR_OPTIONS) {
        const ds = designSystemOf(
          parseState({ calendarToday: marker, calendarTodayColor: color }),
        )
        const today = ds.componentParams.calendar!.today!
        expect(today).toBe(
          color === "selection" ? `${marker}-selection` : marker,
        )
        expect(values).toContain(today)
      }
  })

  test("weekday labels land on the param the source swap reads", () => {
    for (const { value } of WEEKDAY_OPTIONS)
      expect(
        designSystemOf(parseState({ calendarWeekdays: value })).componentParams
          .calendar!.weekdays,
      ).toBe(value)
  })

  test("a Checked color off the selection leaf scopes onto every date-cell host", () => {
    const { color } = designSystemOf(parseState({ checkboxColor: "neutral" }))
    expect(color?.scopes).toEqual({
      checkbox: "neutral",
      calendar: "neutral",
      "range-calendar": "neutral",
      "time-picker-columns": "neutral",
      "choice-card": "neutral",
    })
  })

  test("the day cell and the time-picker cell paint one date-cell recipe", () => {
    const day = classes(calendarStyles({ range: false }).cell())
    const time = classes(timePickerStyles().item())
    for (const token of dateCells) {
      expect(day, token).toContain(token)
      expect(time, token).toContain(token)
    }
  })

  test("range cells draw the band, never the single day's chip", () => {
    const band = classes(calendarStyles({ range: true }).cell())
    for (const token of dateCells) expect(band, token).not.toContain(token)
    expect(band).toContain("selected:bg-selection-muted")
  })

  test("range ends paint only inside the month", async () => {
    expect(unguardedRangeEnds(["in-selection-end:bg-selection"])).toHaveLength(
      1,
    )
    expect(
      unguardedRangeEnds([
        "in-selection-end:not-in-outside-month:bg-selection",
      ]),
    ).toHaveLength(0)
    const { publishable } = await publishables.calendar!()
    for (const today of calendarMeta.params.today.values)
      for (const dayShape of calendarMeta.params.dayShape.values) {
        const shipped = flatten({
          stylesConfig: publishable.stylesConfig,
          meta: publishable.meta,
          density: "default",
          paramSelections: { today, dayShape },
        })
        const range = shipped.variants?.range as
          | Record<string, Record<string, ClassValue>>
          | undefined
        const classList = [
          ...Object.values(shipped.slots ?? {}).flatMap(tokens),
          ...Object.values(range?.true ?? {}).flatMap(tokens),
        ]
        expect(unguardedRangeEnds(classList), `${today} ${dayShape}`).toEqual(
          [],
        )
      }
  })

  test("the shipped day and time cells carry the date-cell recipe", async () => {
    const calendar = await published("calendar")
    const time = await published("time-picker")
    const range = calendar.variants?.range as
      | Record<string, Record<string, ClassValue>>
      | undefined
    const day = new Set(tokens(range?.false?.cell))
    const item = new Set(tokens(time.slots?.item))
    for (const token of dateCells) {
      expect(day, token).toContain(token)
      expect(item, token).toContain(token)
    }
  })
})

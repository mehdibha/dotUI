"use client"

/* Date & time — the calendar's month grid: the day cell's shape, how today
   is marked, the weekday labels. Its fields come from Inputs. */

import { cn } from "@/registry/lib/utils"

import {
  DAY_SHAPE_OPTIONS,
  TODAY_OPTIONS,
  WEEKDAY_OPTIONS,
} from "../axes/calendar"
import {
  DialGap,
  DialGlyph,
  DialList,
  DialSegmented,
  DialSelect,
} from "../dial"
import { FamilyHero, HeroMember, More, UsesRow } from "../family-page"
import type { Effective, Studio } from "../state"

/* -------------------------------- Specimens -------------------------------- */

const DAY_RADIUS: Record<string, string> = {
  rounded: "rounded-[3px]",
  circle: "rounded-full",
  square: "rounded-none",
}

/** A week of cells with one day selected in the shape. */
function WeekGlyph({ shape }: { shape: string }) {
  return (
    <span className="grid w-14 shrink-0 grid-cols-5 gap-0.5">
      {Array.from({ length: 10 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "aspect-square w-full",
            DAY_RADIUS[shape],
            i === 6 ? "bg-primary" : "bg-fg/10",
          )}
        />
      ))}
    </span>
  )
}

function TodayGlyph({ marker }: { marker: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {marker === "ring" && (
        <circle
          cx="12"
          cy="12"
          r="7.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      )}
      {marker === "fill" && (
        <circle cx="12" cy="12" r="8" fill="currentColor" opacity=".22" />
      )}
      <text
        x="12"
        y="12.5"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="9"
        fontWeight={marker === "numeral" ? 650 : 500}
        fill="currentColor"
        className={marker === "numeral" ? "text-fg-accent" : undefined}
      >
        17
      </text>
    </svg>
  )
}

/* --------------------------------- Section --------------------------------- */

export function DatesPreview({ state }: { state: Effective }) {
  return (
    <span
      className={cn(
        "size-3.5 shrink-0 bg-primary",
        DAY_RADIUS[state.calendarDayShape],
      )}
    />
  )
}

export function DatesSection({ studio }: { studio: Studio }) {
  const { effective } = studio
  return (
    <>
      <FamilyHero>
        <HeroMember name="Calendar">
          <WeekGlyph shape={effective.calendarDayShape} />
        </HeroMember>
        <HeroMember name="Today">
          <DialGlyph>
            <TodayGlyph marker={effective.calendarToday} />
          </DialGlyph>
        </HeroMember>
      </FamilyHero>
      <DialList
        axis="calendarDayShape"
        label="Day shape"
        options={DAY_SHAPE_OPTIONS.map((option) => ({
          ...option,
          preview: <WeekGlyph shape={option.value} />,
        }))}
      />
      <DialGap />
      <DialSelect
        axis="calendarToday"
        label="Today"
        options={TODAY_OPTIONS.map((option) => ({
          ...option,
          preview: (
            <DialGlyph>
              <TodayGlyph marker={option.value} />
            </DialGlyph>
          ),
        }))}
      />
      <UsesRow axis="inputStyle" label="Fields" />
      <More keys={["calendarWeekdays"]}>
        <DialSegmented
          axis="calendarWeekdays"
          label="Weekday labels"
          options={WEEKDAY_OPTIONS}
        />
      </More>
    </>
  )
}

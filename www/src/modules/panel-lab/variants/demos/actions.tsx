"use client"

/* Card demo strips for the action and selection chapters — inert, span-based
   specimens (the card itself is the pressable) driven by each chapter's own
   state keys, cropped by the strip's right-edge fade. */

import { StarIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

import { buttonRadiusPx, styleLook } from "../../sections/buttons"
import {
  checkboxCorner,
  DemoCheckbox,
  fillOf,
  HERO_ROW,
} from "../../sections/checkbox"
import { SELECTED as CARD_SELECTED } from "../../sections/choice-cards"
import { LabKbd } from "../../sections/kbd"
import { DemoRadio } from "../../sections/radio"
import { SELECTED_FX, TRACK_SHELL } from "../../sections/segmented-control"
import { DemoSwitch } from "../../sections/switch"
import { selectedFx } from "../../sections/toggles"
import type { LabState } from "../../state"

const ROW = cn(HERO_ROW, "shrink-0 whitespace-nowrap")

/** Span rebuild of the sections' AttachedShell (a div, so unusable inside the
 *  card button): one container, square segments, the separator axis. */
function AttachedStrip({
  state,
  radius,
  className,
  segments,
}: {
  state: LabState
  radius: number
  className?: string
  segments: React.ReactNode[]
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center overflow-hidden",
        state.groupSeparator === "auto" && "divide-x divide-border-field",
        className,
      )}
      style={{ borderRadius: radius }}
    >
      {segments.map((seg, i) => (
        <span key={i} className="flex items-stretch">
          {state.groupSeparator === "divider" && i > 0 && (
            <span className="my-1.5 w-px bg-border-field" />
          )}
          {seg}
        </span>
      ))}
    </span>
  )
}

/** Cut/Copy/Paste as one attached control wearing the separator axis. */
export function ButtonGroupsDemo({ state }: { state: LabState }) {
  return (
    <AttachedStrip
      state={state}
      radius={buttonRadiusPx(state)}
      className={styleLook(state).secondary}
      segments={["Cut", "Copy", "Paste"].map((label) => (
        <span
          key={label}
          className="flex h-8 items-center px-3 text-[0.8125rem] font-medium"
        >
          {label}
        </span>
      ))}
    />
  )
}

/** A selected and an idle toggle button, then the attached group fading out. */
export function TogglesDemo({ state }: { state: LabState }) {
  const radius = buttonRadiusPx(state)
  const selected = selectedFx(state)
  const star = (on: boolean) => (
    <span
      className={cn(
        "flex size-7 shrink-0 items-center justify-center",
        on ? selected : "text-fg-muted",
      )}
      style={{ borderRadius: radius }}
    >
      <StarIcon className={cn("size-3.5", on && "fill-current")} />
    </span>
  )
  return (
    <>
      {star(true)}
      {star(false)}
      <AttachedStrip
        state={state}
        radius={radius}
        className={styleLook(state).secondary}
        segments={["List", "Grid", "Board"].map((label, i) => (
          <span
            key={label}
            className={cn(
              "flex h-7 items-center px-3 text-xs font-medium",
              i === 0 ? selected : "text-fg-muted",
            )}
          >
            {label}
          </span>
        ))}
      />
    </>
  )
}

/** Day/Week/Month in the track shell, Week wearing the chip treatment. */
export function SegmentedControlDemo({ state }: { state: LabState }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center rounded-lg p-[3px]",
        TRACK_SHELL[state.segmentedTrack as keyof typeof TRACK_SHELL],
      )}
    >
      {["Day", "Week", "Month"].map((label, i) => (
        <span
          key={label}
          className={cn(
            "flex h-7 items-center rounded-md px-3 text-[0.8125rem] font-medium",
            i === 1
              ? SELECTED_FX[state.segmentedSelected as keyof typeof SELECTED_FX]
              : "text-fg-muted",
          )}
        >
          {label}
        </span>
      ))}
    </span>
  )
}

/** Shortcut hints wearing the treatment: the ⌘K pair, then combined chords. */
export function KbdDemo({ state }: { state: LabState }) {
  const treatment = state.kbdTreatment
  return (
    <>
      <span className="flex shrink-0 items-center gap-1">
        <LabKbd treatment={treatment}>⌘</LabKbd>
        <LabKbd treatment={treatment}>K</LabKbd>
      </span>
      <LabKbd treatment={treatment} className="shrink-0">
        ⌘D
      </LabKbd>
      <LabKbd treatment={treatment} className="shrink-0">
        Esc
      </LabKbd>
    </>
  )
}

/** On + off switch at true size, wearing the family fill. */
export function SwitchDemo({ state }: { state: LabState }) {
  const fill = fillOf(state)
  return (
    <>
      <span className={ROW}>
        <DemoSwitch fill={fill} />
        Auto-save
      </span>
      <span className={ROW}>
        <DemoSwitch on={false} fill={fill} />
        Analytics
      </span>
    </>
  )
}

/** Checked + unchecked box wearing the family fill and the corner geometry. */
export function CheckboxDemo({ state }: { state: LabState }) {
  const fill = fillOf(state)
  const corner = checkboxCorner(state)
  return (
    <>
      <span className={ROW}>
        <DemoCheckbox checked fill={fill} corner={corner} />
        Terms
      </span>
      <span className={ROW}>
        <DemoCheckbox fill={fill} corner={corner} />
        Newsletter
      </span>
    </>
  )
}

/** Selected + idle radio wearing the family fill. */
export function RadioDemo({ state }: { state: LabState }) {
  const fill = fillOf(state)
  return (
    <>
      <span className={ROW}>
        <DemoRadio selected fill={fill} />
        PNG
      </span>
      <span className={ROW}>
        <DemoRadio fill={fill} />
        SVG
      </span>
    </>
  )
}

/** Two compact radio cards, the first selected, wearing the selected
 *  treatment and the control placement. */
export function ChoiceCardsDemo({ state }: { state: LabState }) {
  const fill = fillOf(state)
  const school = CARD_SELECTED[state.checkFill as keyof typeof CARD_SELECTED]
  const card = (selected: boolean, title: string, desc: string) => {
    const control = <DemoRadio selected={selected} fill={fill} />
    return (
      <span
        className={cn(
          "flex w-40 shrink-0 items-start gap-2.5 rounded-lg border bg-card p-2.5",
          selected
            ? school[state.cardSelected as keyof typeof school]
            : "border-border/60",
        )}
      >
        {state.cardControl === "start" && (
          <span className="mt-0.5">{control}</span>
        )}
        <span className="flex flex-1 flex-col gap-0.5">
          <span className="text-[0.8125rem] font-medium text-fg">{title}</span>
          <span className="text-xs whitespace-nowrap text-fg-muted">
            {desc}
          </span>
        </span>
        {state.cardControl === "end" && (
          <span className="mt-0.5">{control}</span>
        )}
      </span>
    )
  }
  return (
    <>
      {card(true, "Hobby", "Personal projects")}
      {card(false, "Pro", "Team features")}
    </>
  )
}

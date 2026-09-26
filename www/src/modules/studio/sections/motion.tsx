"use client"

/* Motion — one row opening one panel: a preset sets every component at
   once; below it, each animated component drills into its own controls in
   place, marked where it leaves the preset. */

import { useLayoutEffect, useMemo, useRef, useState } from "react"

import { motionBase, MOTION_PRESETS } from "../axes/motion-presets"
import { DialGlyph, DialPopover, DialTrigger, ModifiedDot } from "../dial"
import { CurveGlyph } from "../dial-motion"
import {
  differs,
  MOTION,
  MotionDetail,
  MotionRow,
  tempo,
} from "../motion-controls"
import { CardGrid } from "../patterns"
import type { Studio, StudioState } from "../state"

/* The UI's tempo: loops cycle for seconds, and charts animate data. */
const TIMED = MOTION.filter(
  (entry) => entry.kind === "entrance" || entry.kind === "state",
)
const ROWS = [...MOTION].sort((a, b) => a.label.localeCompare(b.label))

const useBase = (state: StudioState) =>
  useMemo(() => motionBase(state), [state])

function MotionPresets({ studio }: { studio: Studio }) {
  const { state, setState } = studio
  const { preset: base, exact } = useBase(state)
  const changed = MOTION.filter((entry) => differs(entry, state, base)).length
  return (
    <CardGrid
      label="Preset"
      value={exact ? base.id : undefined}
      onChange={(id) => {
        const next = MOTION_PRESETS.find((p) => p.id === id)
        if (next) setState({ ...state, ...next.values })
      }}
      options={MOTION_PRESETS.map((p) => ({
        id: p.id,
        label: p.label,
        children: (
          <span className="flex items-center justify-between gap-2 font-mono text-xs text-fg/50">
            {p === base && !exact ? (
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <ModifiedDot />
                {changed} changed
              </span>
            ) : (
              <span className="truncate">
                {tempo(TIMED, { ...state, ...p.values })}
              </span>
            )}
            {p.values.popoverMotion.pattern !== "none" && (
              <DialGlyph>
                <CurveGlyph curve={p.values.popoverMotion.curve} />
              </DialGlyph>
            )}
          </span>
        ),
      }))}
    />
  )
}

function scrollParent(el: HTMLElement | null) {
  for (let p = el?.parentElement; p; p = p.parentElement) {
    const { overflowY } = getComputedStyle(p)
    if (overflowY === "auto" || overflowY === "scroll") return p
  }
  return null
}

/** The panel: presets and every component, or one component's controls. */
function MotionPanel({ studio }: { studio: Studio }) {
  const { state } = studio
  const { preset: base } = useBase(state)
  const [openId, setOpenId] = useState<string | null>(null)
  const [focusId, setFocusId] = useState<string | null>(null)
  const anchor = useRef<HTMLSpanElement>(null)
  // A swap keeps the scroller's offset: open at the top, come back to the row.
  useLayoutEffect(() => {
    const scroller = scrollParent(anchor.current)
    if (!scroller) return
    if (openId) scroller.scrollTop = 0
    else
      scroller
        .querySelector(`[data-motion-row="${focusId}"]`)
        ?.scrollIntoView({ block: "nearest" })
  }, [openId, focusId])
  const open = MOTION.find((entry) => entry.id === openId)
  if (open)
    return (
      <>
        <span ref={anchor} hidden />
        <MotionDetail
          entry={open}
          studio={studio}
          base={base}
          onBack={() => {
            setFocusId(open.id)
            setOpenId(null)
          }}
        />
      </>
    )
  return (
    <>
      <span ref={anchor} hidden />
      <MotionPresets studio={studio} />
      <div className="h-1" />
      {ROWS.map((entry) => (
        <MotionRow
          key={entry.id}
          entry={entry}
          state={state}
          base={base}
          autoFocus={entry.id === focusId}
          onOpen={() => setOpenId(entry.id)}
        />
      ))}
    </>
  )
}

export function MotionSection({ studio }: { studio: Studio }) {
  const { preset, exact } = useBase(studio.state)
  return (
    <DialTrigger
      label="Preset"
      value={
        <>
          {!exact && <ModifiedDot />}
          <span className="truncate">
            {exact ? preset.label : `${preset.label}, edited`}
          </span>
        </>
      }
    >
      <DialPopover className="w-80">
        <MotionPanel studio={studio} />
      </DialPopover>
    </DialTrigger>
  )
}

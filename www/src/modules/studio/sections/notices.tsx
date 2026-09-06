"use client"

/* Notices — the toast and the inline alert (axes/notices.ts). The hero is
   the app viewport: the alert sits in the page, the toast floats over it at
   the chosen corner — top placements overlap the alert the way a real toast
   overlays real UI. */

import type * as React from "react"
import { CircleCheckIcon, InfoIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

import {
  ALERT_OPTIONS,
  POSITION_OPTIONS,
  syncedAlert,
  syncedToast,
  TOAST_OPTIONS,
} from "../axes/notices"
import { Hero } from "../hero"
import { ControlGroup, SelectRow, SwitchRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio, StudioState } from "../state"

export const TOAST_FAMILY = {
  surface: "border bg-card text-fg **:[svg]:text-fg-success",
  inverted: "bg-tooltip text-fg-on-tooltip",
  filled: "bg-success text-fg-on-success",
  "accent-bar":
    "rounded-l-none border border-l-[3px] border-l-success bg-card text-fg **:[svg]:text-fg-success",
}

export const ALERT_FAMILY = {
  neutral: "border bg-card",
  tinted: "bg-info-muted",
  "tinted-border": "border border-border-info bg-info-muted",
  "accent-bar": "rounded-l-none border-l-[3px] border-l-info bg-info-muted/60",
}

const TOAST_POSITION = {
  "top-left": "top-2.5 left-2.5",
  "top-center": "top-2.5 left-1/2 -translate-x-1/2",
  "top-right": "top-2.5 right-2.5",
  "bottom-left": "bottom-2.5 left-2.5",
  "bottom-center": "bottom-2.5 left-1/2 -translate-x-1/2",
  "bottom-right": "right-2.5 bottom-2.5",
}

/* ------------------------------ Option glyphs ------------------------------ */

/** Notice card reduced to its fill treatment; monochrome, like all glyphs. */
function NoticeGlyph({
  fill,
  stroke,
  bar,
}: {
  fill?: number
  stroke?: boolean
  bar?: boolean
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="7"
        width="16"
        height="10"
        rx="2"
        fill={fill ? "currentColor" : "none"}
        fillOpacity={fill}
        stroke={stroke ? "currentColor" : "none"}
        strokeWidth="1.5"
      />
      {bar && (
        <path d="M5.25 7.4v9.2" stroke="currentColor" strokeWidth="2.5" />
      )}
    </svg>
  )
}

function PositionGlyph({ position }: { position: string }) {
  const [y, x] = position.split("-")
  const cx = { left: 8, center: 12, right: 16 }[x as "left"]
  const cy = y === "top" ? 9 : 15
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".45"
      />
      <rect
        x={cx - 2.5}
        y={cy - 1.5}
        width="5"
        height="3"
        rx="1"
        fill="currentColor"
      />
    </svg>
  )
}

/* --------------------------------- Options --------------------------------- */

const TOAST_GLYPHS: Record<string, React.ReactNode> = {
  surface: <NoticeGlyph stroke />,
  inverted: <NoticeGlyph fill={1} />,
  filled: <NoticeGlyph fill={0.45} />,
  "accent-bar": <NoticeGlyph stroke bar />,
}

const ALERT_GLYPHS: Record<string, React.ReactNode> = {
  neutral: <NoticeGlyph stroke />,
  tinted: <NoticeGlyph fill={0.25} />,
  "tinted-border": <NoticeGlyph fill={0.25} stroke />,
  "accent-bar": <NoticeGlyph fill={0.2} bar />,
}

const illustrated = (
  options: { value: string; label: string }[],
  glyphs: Record<string, React.ReactNode>,
): SelectRowOption[] =>
  options.map((option) => ({ ...option, illustration: glyphs[option.value] }))

const toastOptions = illustrated(TOAST_OPTIONS, TOAST_GLYPHS)
const alertOptions = illustrated(ALERT_OPTIONS, ALERT_GLYPHS)
const positionOptions: SelectRowOption[] = POSITION_OPTIONS.map((option) => ({
  ...option,
  illustration: <PositionGlyph position={option.value} />,
}))

/* ---------------------------------- Hero ----------------------------------- */

export function NoticesHero({ state }: { state: StudioState }) {
  return (
    <Hero inset={false} className="relative h-44">
      <div className="p-2.5">
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2.5",
            ALERT_FAMILY[state.noticeAlert as keyof typeof ALERT_FAMILY],
          )}
        >
          <InfoIcon className="size-3.5 shrink-0 text-fg-info" />
          <span className="truncate text-[0.8125rem] font-medium text-fg-info">
            A new version is available
          </span>
        </div>
      </div>
      <div
        className={cn(
          "absolute flex w-fit max-w-[85%] items-center gap-2 rounded-lg px-3 py-2.5 shadow-lg",
          TOAST_FAMILY[state.noticeToast as keyof typeof TOAST_FAMILY],
          TOAST_POSITION[
            state.noticeToastPosition as keyof typeof TOAST_POSITION
          ],
        )}
      >
        <CircleCheckIcon className="size-3.5 shrink-0" />
        <span className="truncate text-[0.8125rem] font-medium">
          Changes saved
        </span>
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the toast style, and the alert style. */
export function noticesSummary(state: StudioState): string {
  const toast =
    TOAST_OPTIONS.find((o) => o.value === state.noticeToast)?.label ??
    state.noticeToast
  const alert =
    ALERT_OPTIONS.find((o) => o.value === state.noticeAlert)?.label ??
    state.noticeAlert
  return `${toast} toast · ${alert} alert`
}

export function NoticesSection({ studio }: { studio: Studio }) {
  const { state, set } = studio

  const setToast = (value: string) => {
    set("noticeToast")(value)
    if (state.noticeSynced) set("noticeAlert")(syncedAlert(value))
  }
  const setAlert = (value: string) => {
    set("noticeAlert")(value)
    if (state.noticeSynced) set("noticeToast")(syncedToast(value))
  }
  const setSynced = (value: boolean) => {
    set("noticeSynced")(value)
    if (value) set("noticeAlert")(syncedAlert(state.noticeToast))
  }

  return (
    <ControlGroup>
      <NoticesHero state={state} />
      <SelectRow
        label="Toast"
        value={state.noticeToast}
        onChange={setToast}
        options={toastOptions}
        layout="grid"
      />
      <SelectRow
        label="Position"
        value={state.noticeToastPosition}
        onChange={set("noticeToastPosition")}
        options={positionOptions}
        layout="grid"
      />
      <SelectRow
        label="Alert"
        value={state.noticeAlert}
        onChange={setAlert}
        options={alertOptions}
        layout="grid"
      />
      <SwitchRow
        label="Sync styles"
        description="Alert and toast move together; unlink to fork them."
        value={state.noticeSynced}
        onChange={setSynced}
      />
    </ControlGroup>
  )
}

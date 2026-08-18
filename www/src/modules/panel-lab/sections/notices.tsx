"use client"

/* Notices — how the system announces events: the toast and the inline alert,
   the section's one related pair. Both answer "how much intent color does a
   notice surface carry?" but they stay two axes: Ant pairs tinted alerts
   with neutral toasts and Material an inverse snackbar with neutral banners,
   so a single axis would make both unreachable. The Sync switch is the
   Button ⇄ ToggleButton model instead: on, either row drags the other to
   its nearest counterpart; off, they fork. The hero is the app viewport:
   the alert sits in the page, the toast floats over it at the chosen
   corner — top placements overlap the alert the way a real toast overlays
   real UI. */

import { CircleCheckIcon, InfoIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { ControlGroup, SelectRow, SwitchRow } from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"

export const NOTICE_DEFAULTS = {
  noticeToast: "surface",
  noticeToastPosition: "bottom-right",
  noticeAlert: "neutral",
  noticeSynced: true,
}

/* Nearest counterpart, not identity: the vocabularies only partly overlap
   (no inverted alert exists in the wild, no tinted toast). */
const TOAST_TO_ALERT = {
  surface: "neutral",
  inverted: "neutral",
  filled: "tinted",
  "accent-bar": "accent-bar",
}
const ALERT_TO_TOAST = {
  neutral: "surface",
  tinted: "filled",
  "tinted-border": "surface",
  "accent-bar": "accent-bar",
}

const TOAST_FAMILY = {
  surface: "border bg-card text-fg **:[svg]:text-fg-success",
  inverted: "bg-tooltip text-fg-on-tooltip",
  filled: "bg-success text-fg-on-success",
  "accent-bar":
    "rounded-l-none border border-l-[3px] border-l-success bg-card text-fg **:[svg]:text-fg-success",
}

const ALERT_FAMILY = {
  neutral: "border bg-card",
  tinted: "bg-info-muted",
  "tinted-border": "border border-border-info bg-info-muted",
  "accent-bar": "rounded-l-none border-l-[3px] border-l-info bg-info-muted/60",
}

const TOAST_POSITION = {
  "bottom-right": "right-2.5 bottom-2.5",
  "bottom-center": "bottom-2.5 left-1/2 -translate-x-1/2",
  "bottom-left": "bottom-2.5 left-2.5",
  "top-right": "top-2.5 right-2.5",
  "top-center": "top-2.5 left-1/2 -translate-x-1/2",
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

const TOAST_OPTIONS: SelectRowOption[] = [
  { value: "surface", label: "Surface", illustration: <NoticeGlyph stroke /> },
  {
    value: "inverted",
    label: "Inverted",
    illustration: <NoticeGlyph fill={1} />,
  },
  {
    value: "filled",
    label: "Filled",
    illustration: <NoticeGlyph fill={0.45} />,
  },
  {
    value: "accent-bar",
    label: "Accent bar",
    illustration: <NoticeGlyph stroke bar />,
  },
]

const POSITION_OPTIONS: SelectRowOption[] = [
  { value: "bottom-right", label: "Bottom right" },
  { value: "bottom-center", label: "Bottom center" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "top-right", label: "Top right" },
  { value: "top-center", label: "Top center" },
].map((option) => ({
  ...option,
  illustration: <PositionGlyph position={option.value} />,
}))

const ALERT_OPTIONS: SelectRowOption[] = [
  { value: "neutral", label: "Neutral", illustration: <NoticeGlyph stroke /> },
  {
    value: "tinted",
    label: "Tinted",
    illustration: <NoticeGlyph fill={0.25} />,
  },
  {
    value: "tinted-border",
    label: "Tinted border",
    illustration: <NoticeGlyph fill={0.25} stroke />,
  },
  {
    value: "accent-bar",
    label: "Accent bar",
    illustration: <NoticeGlyph fill={0.2} bar />,
  },
]

/* ---------------------------------- Hero ----------------------------------- */

export function NoticesHero({ state }: { state: LabState }) {
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
export function noticesSummary(state: LabState): string {
  const toast =
    TOAST_OPTIONS.find((o) => o.value === state.noticeToast)?.label ??
    state.noticeToast
  const alert =
    ALERT_OPTIONS.find((o) => o.value === state.noticeAlert)?.label ??
    state.noticeAlert
  return `${toast} toast · ${alert} alert`
}

export function NoticesSection({ lab }: { lab: Lab }) {
  const { state, set } = lab

  const setToast = (value: string) => {
    set("noticeToast")(value)
    if (state.noticeSynced)
      set("noticeAlert")(TOAST_TO_ALERT[value as keyof typeof TOAST_TO_ALERT])
  }
  const setAlert = (value: string) => {
    set("noticeAlert")(value)
    if (state.noticeSynced)
      set("noticeToast")(ALERT_TO_TOAST[value as keyof typeof ALERT_TO_TOAST])
  }
  const setSynced = (value: boolean) => {
    set("noticeSynced")(value)
    if (value)
      set("noticeAlert")(
        TOAST_TO_ALERT[state.noticeToast as keyof typeof TOAST_TO_ALERT],
      )
  }

  return (
    <ControlGroup>
      <NoticesHero state={state} />
      <SelectRow
        label="Toast"
        value={state.noticeToast}
        onChange={setToast}
        options={TOAST_OPTIONS}
        layout="grid"
      />
      <SelectRow
        label="Position"
        value={state.noticeToastPosition}
        onChange={set("noticeToastPosition")}
        options={POSITION_OPTIONS}
        layout="grid"
      />
      <SelectRow
        label="Alert"
        value={state.noticeAlert}
        onChange={setAlert}
        options={ALERT_OPTIONS}
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

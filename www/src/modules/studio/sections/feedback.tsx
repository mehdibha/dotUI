"use client"

/* Feedback: badges, alert, toast and the loading indicators. */

import { useMemo } from "react"

import { DesignSystemContext } from "@/lib/styles"
import { cn } from "@/registry/lib/utils"
import { useStyles as useAlertStyles } from "@/registry/ui/alert/styles"
import { useStyles as useBadgeStyles } from "@/registry/ui/badge/styles"
import { Loader as BladesLoader } from "@/registry/ui/loader/base.blades"
import { Loader as DotsLoader } from "@/registry/ui/loader/base.dots"
import { Loader as RingLoader } from "@/registry/ui/loader/base.ring"
import { Loader as RingTrackLoader } from "@/registry/ui/loader/base.ring-track"
import { useStyles as useProgressStyles } from "@/registry/ui/progress-bar/styles"
import type { DesignSystem } from "@/modules/studio/preset/types"

import { parseState } from "../axes"
import type { StudioState } from "../axes"
import { STYLE_OPTIONS as ALERT_OPTIONS } from "../axes/alert.meta"
import {
  CASE_OPTIONS,
  SHAPE_OPTIONS,
  STYLE_OPTIONS as BADGE_OPTIONS,
} from "../axes/badges.meta"
import {
  COLOR_OPTIONS,
  TRACK_OPTIONS,
  TRACK_STYLE_OPTIONS,
} from "../axes/progress.meta"
import { ANIMATION_OPTIONS } from "../axes/skeleton.meta"
import { STYLE_OPTIONS as SPINNER_OPTIONS } from "../axes/spinner.meta"
import {
  STATUS_OPTIONS,
  STYLE_OPTIONS as TOAST_OPTIONS,
} from "../axes/toast.meta"
import { DialGap, DialGlyph, DialSelect } from "../dial"
import type { DialSelectOption } from "../dial"
import { MemberSection, Row } from "../family-page"
import type { RowMap } from "../family-page"
import { designSystemOf } from "../resolve"
import type { Effective, Studio } from "../state"
import { useStudio } from "../use-studio"

/* -------------------------------- Specimens -------------------------------- */

/* The vars a pick writes (Rounded badges, the progress fill). */
const LOCAL_VARS = ["--studio-badge-radius", "--studio-progress-fill-color"]

/** Specimens drawn by the registry's own recipes in one design system. */
function System({
  ds,
  children,
}: {
  ds: DesignSystem
  children: React.ReactNode
}) {
  const value = useMemo(
    () => ({ params: ds.componentParams, density: "default" as const }),
    [ds],
  )
  const style = Object.fromEntries(
    LOCAL_VARS.flatMap((name) =>
      ds.tokens[name] ? [[name, ds.tokens[name]]] : [],
    ),
  ) as React.CSSProperties
  return (
    <DesignSystemContext.Provider value={value}>
      <span className="flex items-center gap-1.5" style={style}>
        {children}
      </span>
    </DesignSystemContext.Provider>
  )
}

/** One design system per option of `key`, over the current picks. */
function useSystems(
  state: StudioState,
  key: keyof StudioState,
  options: readonly { value: string }[],
) {
  return useMemo(
    () =>
      Object.fromEntries(
        options.map(({ value }) => [
          value,
          designSystemOf({ ...state, [key]: value } as StudioState),
        ]),
      ),
    [state, key, options],
  )
}

function Badge({ danger }: { danger?: boolean }) {
  const styles = useBadgeStyles()
  return (
    <span
      className={styles({ variant: danger ? "danger" : "neutral", size: "sm" })}
    >
      {danger ? "Error" : "New"}
    </span>
  )
}

/** A danger alert shrunk to its fill, edge and inks. */
function AlertSpecimen() {
  const { root } = useAlertStyles()()
  return (
    <span
      className={root({
        variant: "danger",
        className:
          "flex h-4 w-8 items-center gap-1 rounded-[4px] px-1 py-0 *:[svg]:size-1.5 *:[svg]:translate-y-0",
      })}
    >
      <svg
        viewBox="0 0 8 8"
        aria-hidden
        // Inline: a list row sizes every svg inside it.
        style={{ width: 6, height: 6, flexShrink: 0 }}
      >
        <circle cx="4" cy="4" r="4" fill="currentColor" />
      </svg>
      <span className="h-0.5 w-3 rounded-full bg-current opacity-60" />
    </span>
  )
}

const TOAST_SURFACE: Record<string, string> = {
  surface: "border border-border bg-popover",
  inverse: "bg-inverse",
}

/** A toast on its surface; `status` paints a danger toast. */
function ToastGlyph({ surface, status }: { surface: string; status?: string }) {
  const inverse = surface === "inverse"
  const box =
    status === "bold"
      ? "bg-danger"
      : status === "soft"
        ? "border border-border-danger bg-danger-muted"
        : TOAST_SURFACE[surface]
  const ink =
    status === "bold"
      ? "bg-fg-on-danger"
      : status === "soft"
        ? "bg-fg-danger"
        : inverse
          ? "bg-fg-inverse"
          : "bg-fg"
  const dot = status === "icon" ? (inverse ? "bg-danger" : "bg-fg-danger") : ink
  return (
    <span
      className={cn(
        "flex h-3.5 w-9 shrink-0 items-center gap-1 rounded-[3px] px-1 shadow-xs",
        box,
      )}
    >
      {status && <span className={cn("size-1.5 rounded-full", dot)} />}
      <span className={cn("h-0.5 w-4 rounded-full opacity-60", ink)} />
    </span>
  )
}

function SkeletonGlyph({ animation }: { animation: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {animation === "none" ? (
        <rect
          x="4"
          y="9"
          width="16"
          height="6"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity=".6"
        />
      ) : (
        <rect
          x={animation === "pulse" ? 6.5 : 4}
          y="9"
          width={animation === "pulse" ? 11 : 16}
          height="6"
          rx="2"
          fill="currentColor"
          opacity={animation === "pulse" ? 0.45 : 0.3}
        />
      )}
      {animation === "shimmer" && (
        <path
          d="M12.5 9l-3 6"
          stroke="currentColor"
          strokeWidth="2"
          opacity=".8"
        />
      )}
      {animation === "pulse" && (
        <path
          d="M4 8.5c-1.2 2-1.2 5 0 7M20 8.5c1.2 2 1.2 5 0 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity=".5"
        />
      )}
    </svg>
  )
}

const LOADERS: Record<string, typeof RingLoader> = {
  ring: RingLoader,
  "ring-track": RingTrackLoader,
  blades: BladesLoader,
  dots: DotsLoader,
}

function ProgressSpecimen() {
  const { track, fill } = useProgressStyles()()
  return (
    <span className={track({ className: "w-16" })}>
      <span className={fill()} style={{ width: "60%" }} />
    </span>
  )
}

/* ---------------------------------- Rows ---------------------------------- */

function BadgeStyleRow() {
  const { state } = useStudio()
  const styles = useSystems(state, "badgeStyle", BADGE_OPTIONS)
  return (
    <DialSelect
      axis="badgeStyle"
      label="Badge style"
      options={BADGE_OPTIONS.map((option) => ({
        ...option,
        preview: (
          <System ds={styles[option.value]!}>
            <Badge danger />
          </System>
        ),
      }))}
    />
  )
}

function BadgeShapeRow() {
  const { state } = useStudio()
  const shapes = useSystems(state, "badgeShape", SHAPE_OPTIONS)
  return (
    <DialSelect
      axis="badgeShape"
      label="Badge shape"
      options={SHAPE_OPTIONS.map((option) => ({
        ...option,
        preview: (
          <System ds={shapes[option.value]!}>
            <Badge danger />
          </System>
        ),
      }))}
    />
  )
}

function BadgeCaseRow() {
  const { state } = useStudio()
  const cases = useSystems(state, "badgeCase", CASE_OPTIONS)
  return (
    <DialSelect
      axis="badgeCase"
      label="Badge case"
      options={CASE_OPTIONS.map((option) => ({
        ...option,
        preview: (
          <System ds={cases[option.value]!}>
            <Badge danger />
          </System>
        ),
      }))}
    />
  )
}

function AlertStyleRow() {
  const { state } = useStudio()
  const alerts = useSystems(state, "alertStyle", ALERT_OPTIONS)
  return (
    <DialSelect
      axis="alertStyle"
      label="Alert style"
      options={ALERT_OPTIONS.map((option) => ({
        ...option,
        preview: (
          <System ds={alerts[option.value]!}>
            <AlertSpecimen />
          </System>
        ),
      }))}
    />
  )
}

function ToastStyleRow() {
  const { effective } = useStudio()
  return (
    <DialSelect
      axis="toastStyle"
      label="Toast style"
      options={TOAST_OPTIONS.map((option) => ({
        ...option,
        preview: (
          <ToastGlyph surface={option.value} status={effective.toastStatus} />
        ),
      }))}
    />
  )
}

function ToastStatusRow() {
  const { effective } = useStudio()
  return (
    <DialSelect
      axis="toastStatus"
      label="Status toasts"
      options={STATUS_OPTIONS.map((option) => ({
        ...option,
        preview: (
          <ToastGlyph surface={effective.toastStyle} status={option.value} />
        ),
      }))}
    />
  )
}

function SpinnerStyleRow() {
  return (
    <DialSelect
      axis="spinnerStyle"
      label="Spinner"
      options={SPINNER_OPTIONS.map((option) => {
        const Loader = LOADERS[option.value] ?? RingLoader
        return { ...option, preview: <Loader className="size-4" /> }
      })}
    />
  )
}

function SkeletonAnimationRow() {
  return (
    <DialSelect
      axis="skeletonAnimation"
      label="Skeleton"
      options={ANIMATION_OPTIONS.map((option) => ({
        ...option,
        preview: (
          <DialGlyph>
            <SkeletonGlyph animation={option.value} />
          </DialGlyph>
        ),
      }))}
    />
  )
}

/** A progress key's row: each option's bar in its own system. */
function ProgressRow({
  axis,
  label,
  options,
}: {
  axis: "progressTrack" | "progressTrackStyle" | "progressColor"
  label: string
  options: readonly DialSelectOption[]
}) {
  const { state } = useStudio()
  const systems = useSystems(state, axis, options)
  return (
    <DialSelect
      axis={axis}
      label={label}
      rowPreview={false}
      options={options.map((option) => ({
        ...option,
        preview: (
          <System ds={systems[option.value]!}>
            <ProgressSpecimen />
          </System>
        ),
      }))}
    />
  )
}

function ProgressTrackRow() {
  return (
    <ProgressRow
      axis="progressTrack"
      label="Progress thickness"
      options={TRACK_OPTIONS}
    />
  )
}

function ProgressTrackStyleRow() {
  return (
    <ProgressRow
      axis="progressTrackStyle"
      label="Progress track"
      options={TRACK_STYLE_OPTIONS}
    />
  )
}

function ProgressColorRow() {
  return (
    <ProgressRow
      axis="progressColor"
      label="Progress fill"
      options={COLOR_OPTIONS}
    />
  )
}

export const ROWS: RowMap = {
  badgeStyle: BadgeStyleRow,
  badgeShape: BadgeShapeRow,
  badgeCase: BadgeCaseRow,
  alertStyle: AlertStyleRow,
  toastStyle: ToastStyleRow,
  toastStatus: ToastStatusRow,
  spinnerStyle: SpinnerStyleRow,
  skeletonAnimation: SkeletonAnimationRow,
  progressTrack: ProgressTrackRow,
  progressTrackStyle: ProgressTrackStyleRow,
  progressColor: ProgressColorRow,
}

/* --------------------------------- Section --------------------------------- */

export function FeedbackPreview({ state }: { state: Effective }) {
  const ds = useMemo(
    () =>
      designSystemOf(
        parseState({
          badgeStyle: state.badgeStyle,
          badgeShape: state.badgeShape,
        }),
      ),
    [state.badgeStyle, state.badgeShape],
  )
  return (
    <System ds={ds}>
      <Badge />
    </System>
  )
}

export function FeedbackSection(_: { studio: Studio }) {
  return (
    <>
      <Row axis="badgeStyle" />
      <Row axis="badgeShape" />
      <Row axis="badgeCase" />
      <DialGap />
      <Row axis="dangerSeed" />
      <Row axis="surfaceGlass" />
      <Row axis="feedbackMotion" />
      <MemberSection id="alert" title="Alert">
        <Row axis="alertStyle" />
      </MemberSection>
      <MemberSection id="toast" title="Toast">
        <Row axis="toastStyle" />
        <Row axis="toastStatus" />
      </MemberSection>
      <MemberSection id="loading" title="Loading">
        <Row axis="spinnerStyle" />
        <Row axis="skeletonAnimation" />
        <Row axis="progressTrack" />
        <Row axis="progressTrackStyle" />
        <Row axis="progressColor" />
      </MemberSection>
    </>
  )
}

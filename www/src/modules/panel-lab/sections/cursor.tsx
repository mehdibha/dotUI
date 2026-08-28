"use client"

/* Cursor — what the pointer becomes over each kind of control: enabled,
   pending, disabled, draggable. Links are not an axis: every system keeps
   the pointer on links, even the ones that put the arrow on buttons. Text
   isn't either — the arrow-on-text decision belongs to the Selection
   section, whose switch it rides along with. Each control offers only the
   cursors a design system would actually pick for it, drawn as cards, with
   real specimens above wearing the current choices. */

import { GripVerticalIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { ControlGroup, SelectRow } from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"

export const CURSOR_DEFAULTS = {
  cursorControls: "default",
  cursorPending: "default",
  cursorDragging: "inherit",
  cursorDisabled: "not-allowed",
}

/* macOS cursor drawings — literal black/white/blue like the real cursors,
   which never theme; the white casing keeps them readable on dark cards.
   Hand, not-allowed, I-beam, open-hand and busy geometry is extracted
   verbatim from the system cursor PDFs (HIServices.framework cursors/); the
   default arrow ships only as a compiled SkyLight asset, so its path is
   traced from an NSCursor.arrow bitmap dump. Only the outer fit-to-24-box
   transforms are ours. */
const ARROW_PATH =
  "M5.32 5 L13 12.7 C13.45 13.15 13.4 13.5 12.95 13.7 L10.45 13.88 C10.05 13.92 9.95 14.05 10 14.35 L11.7 18.9 C11.65 19.55 9.95 19.65 9.8 18.95 L8.15 14.95 C8.05 14.6 7.85 14.55 7.65 14.75 L5.55 16.63 C5.2 16.95 5 16.85 5 16.3 V5.3 C5 4.85 5.12 4.75 5.32 5 Z"

export function ArrowCursor() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <g transform="translate(1.03 -2.52) scale(1.19)">
        <path
          d={ARROW_PATH}
          fill="#fff"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d={ARROW_PATH} fill="#000" />
      </g>
    </svg>
  )
}

/* Extracted from macOS 27's cursors/macos27/pointinghand/cursor.pdf; only the
   outer translate (centering the 32-tile content in the 24 box) is ours. */
function HandCursor() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <g transform="translate(-3.15 -4.72)">
        <path
          transform="matrix(1,0,0,-1,21.4728,14.341999)"
          d="M0 0C-.396 0-.702-.125-.933-.334-1.125 .667-1.761 1.273-2.729 1.273-3.208 1.273-3.596 1.091-3.863 .795-4.175 1.526-4.787 1.95-5.631 1.95-6.068 1.95-6.429 1.808-6.705 1.58L-7.385 5.55C-7.614 6.88-8.405 7.293-9.266 7.328-10.688 7.374-11.594 6.353-11.364 4.977L-10.025-3.195C-10.362-2.811-10.695-2.467-11.089-2.121-11.949-1.376-12.981-1.147-13.795-1.823-14.632-2.5-14.667-3.578-14.025-4.518L-12.236-7.11C-10.126-10.16-8.13-12.167-4.725-12.167-.585-12.167 2.053-9.288 2.053-4.082 2.053-1.043 1.158 0 0 0"
          fill="#000"
        />
        <path
          transform="matrix(1,0,0,-1,22.4706,18.3326)"
          d="M0 0C0 2.018-.367 2.981-1.044 2.981-1.422 2.981-1.629 2.706-1.686 2.236-1.72 1.961-1.869 1.755-2.19 1.755-2.454 1.755-2.615 1.926-2.672 2.236L-2.878 3.383C-2.97 3.888-3.245 4.255-3.75 4.255-4.495 4.255-4.587 3.704-4.518 3.188L-4.438 2.557C-4.392 2.236-4.564 1.972-4.92 1.984-5.183 1.996-5.355 2.156-5.413 2.466L-5.665 3.968C-5.768 4.564-6.032 4.931-6.594 4.931-7.156 4.931-7.442 4.564-7.442 4.025-7.442 3.945-7.431 3.853-7.419 3.761L-7.259 2.684C-7.213 2.351-7.408 2.087-7.752 2.099-8.016 2.11-8.188 2.282-8.245 2.592L-9.392 9.243C-9.518 9.977-9.862 10.263-10.355 10.286-11.078 10.309-11.421 9.736-11.307 9.036L-9.724-.734C-9.656-1.169-9.896-1.433-10.229-1.422-10.401-1.422-10.527-1.342-10.676-1.158-11.479-.16-12.155 .574-12.821 1.147-13.337 1.605-13.795 1.675-14.151 1.388-14.529 1.09-14.552 .585-14.174 .035L-12.385-2.58C-10.412-5.447-8.83-7.144-5.734-7.144-2.03-7.144 0-4.736 0 0"
          fill="#fff"
        />
        <g opacity=".18" fill="#000">
          <path
            transform="matrix(1,0,0,-1,15.0625,22.3116)"
            d="M0 0-.459 3.383C-.493 3.612-.355 3.853-.08 3.887 .149 3.922 .367 3.773 .402 3.532L.849 .126C.872-.115 .757-.333 .516-.367 .253-.401 .035-.252 0 0"
          />
          <path
            transform="matrix(1,0,0,-1,17.0465,22.139801)"
            d="M0 0-.034 3.521C-.046 3.773 .126 3.956 .39 3.956 .631 3.968 .826 3.773 .826 3.521L.872-.011C.872-.264 .688-.435 .447-.435 .183-.447 .012-.252 0 0"
          />
          <path
            transform="matrix(1,0,0,-1,19.0531,22.1511)"
            d="M0 0 .367 3.417C.39 3.658 .585 3.818 .849 3.784 1.101 3.761 1.25 3.543 1.216 3.291L.849-.103C.826-.356 .642-.516 .367-.482 .092-.447-.034-.218 0 0"
          />
        </g>
      </g>
    </svg>
  )
}

/* Extracted from cursors/ibeamhorizontal/cursor.pdf. */
export function IBeamCursor() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <g transform="translate(0.5 1)">
        <path
          transform="matrix(1,0,0,-1,15.3282,3.1945)"
          d="M0 0C0-.744-.556-1.384-1.292-1.489-1.884-1.574-2.331-2.091-2.331-2.691L-2.331-12.921C-2.331-13.522-1.885-14.039-1.294-14.124-.559-14.228-.003-14.869-.003-15.613-.006-16.056-.197-16.469-.528-16.752-.857-17.035-1.294-17.163-1.725-17.099-2.508-16.987-3.237-16.656-3.834-16.154-4.432-16.656-5.161-16.987-5.948-17.1-6.375-17.163-6.811-17.036-7.142-16.752-7.473-16.465-7.662-16.053-7.665-15.62-7.665-14.869-7.109-14.228-6.373-14.123-5.779-14.038-5.331-13.521-5.331-12.921L-5.331-2.691C-5.331-2.091-5.778-1.574-6.371-1.489-7.106-1.384-7.661-.744-7.661 0-7.66 .44-7.469 .854-7.138 1.139-6.868 1.372-6.519 1.503-6.157 1.503L-6.076 1.503-5.925 1.484C-5.151 1.373-4.426 1.043-3.831 .541-3.232 1.043-2.503 1.375-1.717 1.487-1.302 1.554-.86 1.428-.523 1.139-.192 .852-.003 .44 0 .007L0 .003Z"
          fill="#fff"
        />
        <path
          transform="matrix(1,0,0,-1,9.0999,3.6933)"
          d="M0 0C1.082-.155 1.898-1.098 1.898-2.192L1.898-12.422C1.898-13.516 1.08-14.459-.004-14.614-.251-14.649-.437-14.864-.437-15.114-.436-15.26-.373-15.398-.263-15.494-.152-15.588-.007-15.632 .139-15.611 1.061-15.479 1.891-14.94 2.394-14.157 2.898-14.94 3.727-15.479 4.65-15.611 4.792-15.632 4.94-15.588 5.05-15.493 5.161-15.398 5.224-15.26 5.225-15.114 5.225-14.864 5.039-14.649 4.792-14.614 3.712-14.459 2.898-13.517 2.898-12.422L2.898-2.192C2.898-1.098 3.714-.155 4.796 0 5.043 .035 5.229 .25 5.229 .5 5.228 .645 5.164 .784 5.054 .88 4.943 .974 4.798 1.02 4.653 .997 3.731 .864 2.901 .326 2.397-.457 1.893 .326 1.064 .864 .142 .997 .119 1 .095 1.002 .071 1.002-.049 1.002-.166 .959-.258 .88-.369 .784-.432 .646-.433 .499-.433 .25-.247 .035 0 0"
          fill="#000"
        />
      </g>
    </svg>
  )
}

/* Extracted from cursors/macos27/openhand/cursor.pdf; the knuckle creases
   live in a form XObject the extraction skips. */
function OpenHandCursor() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <g transform="translate(-2.45 -4.1)">
        <path
          transform="matrix(1,0,0,-1,20.9752,9.8732)"
          d="M0 0C-.33 .013-.608-.052-.848-.197-.803 1.008-1.557 1.869-2.804 1.919-3.305 1.932-3.701 1.801-3.993 1.562-4.094 2.614-4.781 3.359-5.971 3.406-7.272 3.445-7.912 2.62-8.015 1.649-8.324 1.903-8.707 2.025-9.15 2.032-10.569 2.055-11.307 .999-11.137-.295L-10.28-6.896C-10.616-6.512-10.949-6.169-11.341-5.824-12.193-5.086-13.214-4.859-14.021-5.529-14.849-6.198-14.883-7.266-14.248-8.196L-12.477-10.762C-10.252-13.986-8.356-15.655-5.325-15.757-1.487-15.894 1.453-13.419 1.589-8.877L1.794-2.089C1.828-.897 1.158-.034 0 0"
          fill="#000"
        />
        <path
          transform="matrix(1,0,0,-1,21.5202,18.7168)"
          d="M0 0L.204 6.687C.227 7.425-.102 7.811-.636 7.822-1.124 7.845-1.499 7.538-1.51 6.766L-1.578 3.531C-1.589 3.201-1.794 3.02-2.066 3.02-2.373 3.02-2.554 3.224-2.554 3.519L-2.464 8.56C-2.452 9.298-2.782 9.718-3.383 9.741-3.951 9.763-4.405 9.423-4.394 8.651L-4.303 3.644C-4.291 3.315-4.507 3.133-4.78 3.133-5.086 3.133-5.268 3.338-5.279 3.633L-5.574 10.115C-5.608 10.83-5.971 11.205-6.539 11.228-7.141 11.25-7.561 10.876-7.504 10.058L-7.096 3.758C-7.073 3.428-7.3 3.247-7.572 3.247-7.879 3.247-8.049 3.451-8.083 3.746L-8.73 8.821C-8.821 9.559-9.162 9.843-9.672 9.854-10.399 9.877-10.728 9.309-10.638 8.616L-9.57 .443C-9.513 .012-9.718-.25-10.047-.239-10.217-.239-10.342-.159-10.501 .023-11.285 1.011-11.954 1.737-12.613 2.304-13.135 2.759-13.578 2.815-13.93 2.543-14.304 2.248-14.327 1.748-13.952 1.203L-12.182-1.385C-10.081-4.439-8.583-5.801-5.824-5.892-2.509-6.017-.125-4.166 0 0"
          fill="#fff"
        />
      </g>
    </svg>
  )
}

/* The small arrow the badge cursors share — the not-allowed and busy assets
   draw the identical arrow before their disc. */
function BadgeArrow() {
  return (
    <>
      <path
        transform="matrix(1,0,0,-1,5.5015,3.7415009)"
        d="M0 0 8.383-8.401C9.436-9.457 8.689-11.259 7.198-11.259L3.751-11.258 1.283-13.443C.202-14.399-1.501-13.632-1.501-12.188V-.621C-1.501 .163-.554 .555 0 0"
        fill="#fff"
      />
      <path
        transform="matrix(1,0,0,-1,5,5.010601)"
        d="M0 0V-10.897C0-11.487 .697-11.801 1.139-11.41L3.874-8.989 7.674-8.99C8.284-8.99 8.59-8.253 8.159-7.821L.251 .104C.159 .197 0 .131 0 0"
        fill="#000"
      />
    </>
  )
}

/* The spinning disc from cursors/busybutclickable/cursor.pdf, frame 1 of its
   15-frame strip; the blues are the asset's literal colors. */
function SpinnerDisc() {
  return (
    <>
      <circle cx="14" cy="26" r="9" fill="#00C0ED" />
      <path
        transform="matrix(1,0,0,-1,9.0012,23.4717)"
        d="M0 0C2.165 .049 4.245-1.296 5.001-2.528 6.233-1.772 7.532-.364 7.532 2.123 7.532 4.611 5.762 6.389 5.001 6.472 .031 6.472-3.999 2.442-3.999-2.528-3.915-1.767-2.165-.049 0 0"
        fill="#0098F6"
      />
      <path
        transform="matrix(1,0,0,-1,19.0037,28.5283)"
        d="M0 0C-2.165-.049-4.245 1.296-5.001 2.528-6.233 1.772-7.532 .364-7.532-2.123-7.532-4.611-5.762-6.389-5.001-6.472-.031-6.472 3.999-2.442 3.999 2.528 3.915 1.767 2.165 .049 0 0"
        fill="#00C0ED"
      />
    </>
  )
}

/* Arrow + gray disc holding a white prohibition sign; the gradient replaces
   the asset's raster disc fill. */
function NotAllowedCursor() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <defs>
        <linearGradient
          id="cursor-na-disc"
          x1="14"
          y1="17"
          x2="14"
          y2="35"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#AEAEB1" />
          <stop offset="1" stopColor="#A7A7AB" />
        </linearGradient>
      </defs>
      <g transform="translate(1.81 -2.42) scale(0.755)">
        <circle cx="14" cy="26" r="9" fill="url(#cursor-na-disc)" />
        <BadgeArrow />
        <path
          transform="matrix(1,0,0,-1,14,30.498299)"
          d="M0 0C-2.484 0-4.498 2.014-4.498 4.498-4.498 6.983-2.484 8.997 0 8.997 2.484 8.997 4.498 6.983 4.498 4.498 4.498 2.014 2.484 0 0 0M0 10.498C-3.314 10.498-6 7.812-6 4.498-6 1.185-3.314-1.502 0-1.502 3.314-1.502 6 1.185 6 4.498 6 7.812 3.314 10.498 0 10.498"
          fill="#fff"
          fillRule="evenodd"
        />
        <path
          transform="matrix(1,0,0,-1,17.3781,30.621899)"
          d="M0 0-8 8-6.756 9.244 1.244 1.244Z"
          fill="#fff"
        />
      </g>
    </svg>
  )
}

/** Arrow + spinning disc — busy but clickable, what `progress` renders as. */
function ProgressCursor() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <g transform="translate(1.81 -2.42) scale(0.755)">
        <BadgeArrow />
        <SpinnerDisc />
      </g>
    </svg>
  )
}

/** The busy disc without the arrow — busy and blocked, what `wait` means. */
function WaitCursor() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <g transform="translate(-2 -14)">
        <SpinnerDisc />
      </g>
    </svg>
  )
}

const CONTROL_OPTIONS: SelectRowOption[] = [
  { value: "default", label: "Default", illustration: <ArrowCursor /> },
  { value: "pointer", label: "Pointer", illustration: <HandCursor /> },
]

const PENDING_OPTIONS: SelectRowOption[] = [
  { value: "default", label: "Default", illustration: <ArrowCursor /> },
  { value: "progress", label: "Progress", illustration: <ProgressCursor /> },
  { value: "wait", label: "Wait", illustration: <WaitCursor /> },
]

const DRAGGING_OPTIONS: SelectRowOption[] = [
  { value: "inherit", label: "Inherit", illustration: <ArrowCursor /> },
  { value: "grab", label: "Grab", illustration: <OpenHandCursor /> },
]

const DISABLED_OPTIONS: SelectRowOption[] = [
  { value: "default", label: "Default", illustration: <ArrowCursor /> },
  {
    value: "not-allowed",
    label: "Not allowed",
    illustration: <NotAllowedCursor />,
  },
]

const illustration = (options: SelectRowOption[], value: string) =>
  options.find((o) => o.value === value)?.illustration

/** The drawn cursor pinned to a specimen's corner — keeps the answer visible
 *  without a mouse; hovering the specimen shows the real thing. */
export function GlyphBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute right-0 bottom-0 translate-x-1/3 translate-y-1/3 **:[svg]:size-5"
    >
      {children}
    </span>
  )
}

/* One specimen per axis, each wearing the cursor its selection maps to,
   ordered like the rows read: enabled, disabled, pending, dragging. */
export function CursorHero({ state }: { state: LabState }) {
  const controls = state.cursorControls
  const grab = state.cursorDragging === "grab"
  return (
    <Hero className="flex-row flex-wrap items-center justify-evenly gap-x-4 gap-y-5 py-6">
      <div className="relative" style={{ cursor: controls }}>
        <Button variant="secondary" style={{ cursor: controls }}>
          Button
        </Button>
        <GlyphBadge>{illustration(CONTROL_OPTIONS, controls)}</GlyphBadge>
      </div>
      <div className="relative" style={{ cursor: state.cursorDisabled }}>
        <Button
          variant="secondary"
          isDisabled
          style={{ cursor: state.cursorDisabled }}
        >
          Button
        </Button>
        <GlyphBadge>
          {illustration(DISABLED_OPTIONS, state.cursorDisabled)}
        </GlyphBadge>
      </div>
      <div className="relative" style={{ cursor: state.cursorPending }}>
        <Button
          variant="secondary"
          isPending
          style={{ cursor: state.cursorPending }}
        >
          Button
        </Button>
        <GlyphBadge>
          {illustration(PENDING_OPTIONS, state.cursorPending)}
        </GlyphBadge>
      </div>
      <div
        className={cn(
          "relative flex h-8 items-center rounded-md border border-border px-1 text-fg-muted",
          grab && "cursor-grab active:cursor-grabbing",
        )}
        style={grab ? undefined : { cursor: controls }}
      >
        <GripVerticalIcon className="size-4" />
        <GlyphBadge>
          {grab ? <OpenHandCursor /> : illustration(CONTROL_OPTIONS, controls)}
        </GlyphBadge>
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the controls cursor alone. */
export function cursorSummary(state: LabState): string {
  return (
    CONTROL_OPTIONS.find((o) => o.value === state.cursorControls)?.label ??
    state.cursorControls
  )
}

export function CursorSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <CursorHero state={state} />
      <SelectRow
        label="Controls"
        value={state.cursorControls}
        onChange={set("cursorControls")}
        options={CONTROL_OPTIONS}
        layout="grid"
      />
      <SelectRow
        label="Pending"
        value={state.cursorPending}
        onChange={set("cursorPending")}
        options={PENDING_OPTIONS}
        layout="grid"
      />
      <SelectRow
        label="Dragging"
        value={state.cursorDragging}
        onChange={set("cursorDragging")}
        options={DRAGGING_OPTIONS}
        layout="grid"
      />
      <SelectRow
        label="Disabled"
        value={state.cursorDisabled}
        onChange={set("cursorDisabled")}
        options={DISABLED_OPTIONS}
        layout="grid"
      />
    </ControlGroup>
  )
}

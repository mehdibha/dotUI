"use client"

/* Cursor — what interactive and disabled controls point with. Each control
   offers only the cursors a design system would actually pick for it, drawn as
   cards, with two real buttons above wearing the current choice. */

import { Button } from "@/registry/ui/button"
import { ControlGroup, SelectRow } from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"

export const CURSOR_DEFAULTS = {
  cursorInteractive: "default",
  cursorDisabled: "not-allowed",
}

/* macOS cursor drawings — literal black/white like the real cursors, which
   never theme; the white casing keeps them readable on dark cards. Hand and
   not-allowed geometry is extracted verbatim from the system cursor PDFs
   (HIServices.framework cursors/); the default arrow ships only as a compiled
   SkyLight asset, so its path is traced from an NSCursor.arrow bitmap dump.
   Only the outer fit-to-24-box transforms are ours. */
const ARROW_PATH =
  "M5.32 5 L13 12.7 C13.45 13.15 13.4 13.5 12.95 13.7 L10.45 13.88 C10.05 13.92 9.95 14.05 10 14.35 L11.7 18.9 C11.65 19.55 9.95 19.65 9.8 18.95 L8.15 14.95 C8.05 14.6 7.85 14.55 7.65 14.75 L5.55 16.63 C5.2 16.95 5 16.85 5 16.3 V5.3 C5 4.85 5.12 4.75 5.32 5 Z"

function ArrowCursor() {
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

const INTERACTIVE_OPTIONS: SelectRowOption[] = [
  { value: "default", label: "Default", illustration: <ArrowCursor /> },
  { value: "pointer", label: "Pointer", illustration: <HandCursor /> },
]

const DISABLED_OPTIONS: SelectRowOption[] = [
  { value: "default", label: "Default", illustration: <ArrowCursor /> },
  {
    value: "not-allowed",
    label: "Not allowed",
    illustration: <NotAllowedCursor />,
  },
]

/* Two real buttons — one enabled, one disabled — each wearing the cursor the
   current selection maps to. Hovering them shows the real thing; the drawn
   cursor keeps the answer visible without a mouse. */
function CursorHero({ state }: { state: LabState }) {
  const specimens = [
    {
      label: "Interactive",
      cursor: state.cursorInteractive,
      glyph: INTERACTIVE_OPTIONS.find(
        (o) => o.value === state.cursorInteractive,
      )?.illustration,
      isDisabled: false,
    },
    {
      label: "Disabled",
      cursor: state.cursorDisabled,
      glyph: DISABLED_OPTIONS.find((o) => o.value === state.cursorDisabled)
        ?.illustration,
      isDisabled: true,
    },
  ]
  return (
    <Hero className="flex-row items-center justify-evenly py-6">
      {specimens.map(({ label, cursor, glyph, isDisabled }) => (
        <div key={label} className="relative" style={{ cursor }}>
          <Button
            variant="secondary"
            isDisabled={isDisabled}
            style={{ cursor }}
          >
            Button
          </Button>
          <span
            aria-hidden
            className="pointer-events-none absolute right-0 bottom-0 translate-x-1/3 translate-y-1/3 **:[svg]:size-5"
          >
            {glyph}
          </span>
        </div>
      ))}
    </Hero>
  )
}

export function CursorSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <CursorHero state={state} />
      <ControlGroup>
        <SelectRow
          label="Interactive"
          value={state.cursorInteractive}
          onChange={set("cursorInteractive")}
          options={INTERACTIVE_OPTIONS}
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
    </>
  )
}

import type { ReactNode } from "react"

/**
 * Component-card illustrations, batch 5 (skeleton → tooltip).
 * See part-1.tsx for the shared spec.
 */
export const illustrationsPart5: Record<string, ReactNode> = {
  skeleton: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="48"
        y="26"
        width="104"
        height="68"
        rx="8"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <circle cx="70" cy="46" r="9" className="fill-muted" />
      <rect
        x="86"
        y="39"
        width="52"
        height="5"
        rx="2.5"
        className="fill-muted"
      />
      <rect x="86" y="49" width="36" height="4" rx="2" className="fill-muted" />
      <rect x="61" y="64" width="78" height="4" rx="2" className="fill-muted" />
      <rect x="61" y="74" width="60" height="4" rx="2" className="fill-muted" />
    </svg>
  ),
  slider: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="40"
        y="58"
        width="120"
        height="4"
        rx="2"
        className="fill-muted"
      />
      <rect
        x="40"
        y="58"
        width="72"
        height="4"
        rx="2"
        className="fill-primary"
      />
      <circle
        cx="112"
        cy="60"
        r="8"
        className="fill-bg stroke-fg-muted"
        strokeWidth="1.5"
      />
    </svg>
  ),
  switch: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="76"
        y="46"
        width="48"
        height="28"
        rx="14"
        className="fill-primary"
      />
      <circle cx="110" cy="60" r="10" className="fill-bg" />
    </svg>
  ),
  table: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="40"
        y="22"
        width="120"
        height="76"
        rx="6"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <path
        d="M40 28 A6 6 0 0 1 46 22 L154 22 A6 6 0 0 1 160 28 L160 42 L40 42 Z"
        className="fill-muted"
      />
      <rect
        x="50"
        y="30"
        width="24"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="90"
        y="30"
        width="24"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="130"
        y="30"
        width="20"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <line
        x1="40"
        y1="61"
        x2="160"
        y2="61"
        className="stroke-border"
        strokeWidth="1.5"
      />
      <line
        x1="40"
        y1="80"
        x2="160"
        y2="80"
        className="stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="50"
        y="50"
        width="24"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="90"
        y="50"
        width="30"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="50"
        y="69"
        width="24"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="90"
        y="69"
        width="30"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="50"
        y="87"
        width="24"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="90"
        y="87"
        width="30"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
    </svg>
  ),
  tabs: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="40"
        y="44"
        width="28"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect x="82" y="44" width="28" height="4" rx="2" className="fill-muted" />
      <rect
        x="124"
        y="44"
        width="28"
        height="4"
        rx="2"
        className="fill-muted"
      />
      <line
        x1="36"
        y1="58"
        x2="164"
        y2="58"
        className="stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="38"
        y="56"
        width="32"
        height="2.5"
        rx="1.25"
        className="fill-primary"
      />
      <rect
        x="40"
        y="70"
        width="112"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="40"
        y="78"
        width="84"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
    </svg>
  ),
  "text-input": (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="40"
        y="36"
        width="36"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="40"
        y="48"
        width="120"
        height="28"
        rx="7"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect x="52" y="60" width="48" height="4" rx="2" className="fill-muted" />
      <line
        x1="104"
        y1="55"
        x2="104"
        y2="69"
        className="stroke-fg-muted"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  textarea: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="40"
        y="24"
        width="36"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="40"
        y="36"
        width="120"
        height="58"
        rx="7"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="52"
        y="48"
        width="88"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="52"
        y="57"
        width="72"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="52"
        y="66"
        width="44"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <path
        d="M152 88 L156 84 M148 88 L156 80"
        className="stroke-fg-muted"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  timeline: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <line
        x1="70"
        y1="24"
        x2="70"
        y2="96"
        className="stroke-border"
        strokeWidth="1.5"
      />
      <circle cx="70" cy="30" r="5" className="fill-primary" />
      <rect
        x="84"
        y="27"
        width="44"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="84"
        y="36"
        width="60"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <circle
        cx="70"
        cy="60"
        r="5"
        className="fill-bg stroke-fg-muted"
        strokeWidth="1.5"
      />
      <rect
        x="84"
        y="57"
        width="36"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="84"
        y="66"
        width="52"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <circle
        cx="70"
        cy="90"
        r="5"
        className="fill-bg stroke-fg-muted"
        strokeWidth="1.5"
      />
      <rect
        x="84"
        y="87"
        width="40"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
    </svg>
  ),
  toast: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="44"
        y="26"
        width="112"
        height="30"
        rx="8"
        className="fill-muted"
        opacity="0.5"
      />
      <rect
        x="40"
        y="46"
        width="120"
        height="36"
        rx="8"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <circle cx="58" cy="64" r="7" className="fill-success" />
      <path
        d="M55 64 L57.5 66.5 L61.5 61.5"
        className="stroke-bg"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="74"
        y="57"
        width="52"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="74"
        y="67"
        width="68"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
    </svg>
  ),
  tooltip: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="64"
        y="30"
        width="72"
        height="24"
        rx="6"
        className="fill-primary"
      />
      <rect x="76" y="40" width="48" height="4" rx="2" className="fill-bg" />
      <path d="M94 54 L100 61 L106 54 Z" className="fill-primary" />
      <rect
        x="72"
        y="70"
        width="56"
        height="22"
        rx="6"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="86"
        y="79"
        width="28"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
    </svg>
  ),
}

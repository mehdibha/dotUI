import type { ReactNode } from "react"

/**
 * Component-card illustrations, batch 4 (pagination → select).
 *
 * Shared spec (see part-1.tsx):
 * - viewBox "0 0 200 120", aria-hidden, className "h-auto w-full".
 * - Theme-token classes only: fill-bg / fill-muted / fill-primary /
 *   fill-fg-muted / fill-bg (on primary), stroke-border / stroke-fg-muted.
 * - Text is always an abstract bar: rounded rect (h 4, rx 2).
 * - strokeWidth 1.5 for outlines, generous whitespace, composition centered.
 */
export const illustrationsPart4: Record<string, ReactNode> = {
  pagination: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <path
        d="M48 55 L43 60 L48 65"
        className="stroke-fg-muted"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="62"
        y="50"
        width="20"
        height="20"
        rx="6"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="70"
        y="58"
        width="4"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="90"
        y="50"
        width="20"
        height="20"
        rx="6"
        className="fill-primary"
      />
      <rect x="98" y="58" width="4" height="4" rx="2" className="fill-bg" />
      <rect
        x="118"
        y="50"
        width="20"
        height="20"
        rx="6"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="126"
        y="58"
        width="4"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <path
        d="M152 55 L157 60 L152 65"
        className="stroke-fg-muted"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  popover: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="52"
        y="20"
        width="96"
        height="50"
        rx="8"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="64"
        y="32"
        width="40"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="64"
        y="44"
        width="72"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="64"
        y="52"
        width="56"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <path
        d="M93 70 L100 78 L107 70"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="80"
        y="86"
        width="40"
        height="16"
        rx="5"
        className="fill-muted"
      />
      <rect
        x="90"
        y="92"
        width="20"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
    </svg>
  ),
  "progress-bar": (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="40"
        y="42"
        width="32"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="144"
        y="42"
        width="16"
        height="4"
        rx="2"
        className="fill-muted"
      />
      <rect
        x="40"
        y="58"
        width="120"
        height="8"
        rx="4"
        className="fill-muted"
      />
      <rect
        x="40"
        y="58"
        width="76"
        height="8"
        rx="4"
        className="fill-primary"
      />
    </svg>
  ),
  "progress-steps": (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="55"
        y="59"
        width="38"
        height="2"
        rx="1"
        className="fill-primary"
      />
      <rect
        x="107"
        y="59"
        width="38"
        height="2"
        rx="1"
        className="fill-muted"
      />
      <circle cx="48" cy="60" r="8" className="fill-primary" />
      <path
        d="M44.5 60 L47 62.5 L51.5 57.5"
        className="stroke-bg"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="100" cy="60" r="8" className="fill-primary" />
      <circle cx="100" cy="60" r="3" className="fill-bg" />
      <circle
        cx="152"
        cy="60"
        r="8"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="38"
        y="78"
        width="20"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="90"
        y="78"
        width="20"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="142"
        y="78"
        width="20"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
    </svg>
  ),
  radio: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <circle cx="72" cy="48" r="8" className="fill-primary" />
      <circle cx="72" cy="48" r="3" className="fill-bg" />
      <rect
        x="90"
        y="46"
        width="44"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <circle
        cx="72"
        cy="74"
        r="8"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect x="90" y="72" width="36" height="4" rx="2" className="fill-muted" />
    </svg>
  ),
  rating: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d="M0 -9 L2.35 -3.24 L8.56 -2.78 L3.8 1.24 L5.29 7.28 L0 4 L-5.29 7.28 L-3.8 1.24 L-8.56 -2.78 L-2.35 -3.24 Z"
          transform={`translate(${52 + i * 24} 60)`}
          className={i < 3 ? "fill-primary" : "fill-muted"}
        />
      ))}
    </svg>
  ),
  "search-input": (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="40"
        y="47"
        width="120"
        height="26"
        rx="13"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <circle
        cx="58"
        cy="59"
        r="5"
        className="stroke-fg-muted"
        strokeWidth="1.5"
        fill="none"
      />
      <line
        x1="61.8"
        y1="62.8"
        x2="65.5"
        y2="66.5"
        className="stroke-fg-muted"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect x="74" y="58" width="48" height="4" rx="2" className="fill-muted" />
    </svg>
  ),
  "segmented-control": (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="40"
        y="47"
        width="120"
        height="26"
        rx="8"
        className="fill-muted"
      />
      <rect
        x="44"
        y="51"
        width="37"
        height="18"
        rx="6"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="52"
        y="58"
        width="20"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="92"
        y="58"
        width="20"
        height="4"
        rx="2"
        className="fill-fg-muted"
        opacity="0.45"
      />
      <rect
        x="130"
        y="58"
        width="20"
        height="4"
        rx="2"
        className="fill-fg-muted"
        opacity="0.45"
      />
    </svg>
  ),
  select: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="56"
        y="18"
        width="88"
        height="24"
        rx="7"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="66"
        y="28"
        width="36"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <path
        d="M128 28 L132 33 L136 28"
        className="stroke-fg-muted"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="56"
        y="50"
        width="88"
        height="50"
        rx="7"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="60"
        y="55"
        width="80"
        height="14"
        rx="4"
        className="fill-muted"
      />
      <rect
        x="68"
        y="60"
        width="36"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="68"
        y="76"
        width="44"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="68"
        y="88"
        width="32"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
    </svg>
  ),
}

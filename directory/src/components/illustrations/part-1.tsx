import type { ReactNode } from "react"

/**
 * Component-card illustrations, batch 1 (accordion → card).
 *
 * Shared spec (all batches follow this):
 * - viewBox "0 0 200 120", aria-hidden, className "h-auto w-full".
 * - Theme-token classes only: fill-bg / fill-muted / fill-primary /
 *   fill-fg-muted / fill-bg (on primary), stroke-border / stroke-fg-muted.
 * - Text is always an abstract bar: rounded rect (h 4, rx 2).
 * - strokeWidth 1.5 for outlines, generous whitespace, composition centered.
 */
export const illustrationsPart1: Record<string, ReactNode> = {
  accordion: (
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
      <rect
        x="52"
        y="34"
        width="44"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <path
        d="M144 33 L148 38 L152 33"
        className="stroke-fg-muted"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="52"
        y="46"
        width="96"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="52"
        y="54"
        width="72"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <line
        x1="40"
        y1="64"
        x2="160"
        y2="64"
        className="stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="52"
        y="72"
        width="36"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <path
        d="M144 76 L148 71 L152 76"
        className="stroke-fg-muted"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="40"
        y1="84"
        x2="160"
        y2="84"
        className="stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="52"
        y="89"
        width="40"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="36"
        y="40"
        width="128"
        height="40"
        rx="8"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <circle cx="54" cy="60" r="7" className="fill-muted" />
      <line
        x1="54"
        y1="56.5"
        x2="54"
        y2="61"
        className="stroke-fg-muted"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="54" cy="64" r="0.9" className="fill-fg-muted" />
      <rect
        x="70"
        y="52"
        width="56"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="70"
        y="63"
        width="80"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
    </svg>
  ),
  avatar: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <circle
        cx="100"
        cy="60"
        r="24"
        className="fill-muted stroke-border"
        strokeWidth="1.5"
      />
      <circle cx="100" cy="53" r="7.5" className="fill-fg-muted" />
      <path
        d="M84 76 A18 18 0 0 1 116 76 A24 24 0 0 1 84 76 Z"
        className="fill-fg-muted"
      />
      <circle
        cx="118"
        cy="76"
        r="5.5"
        className="fill-success stroke-bg"
        strokeWidth="2"
      />
    </svg>
  ),
  badge: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="42"
        y="50"
        width="52"
        height="20"
        rx="10"
        className="fill-primary"
      />
      <rect x="54" y="58" width="28" height="4" rx="2" className="fill-bg" />
      <rect
        x="104"
        y="50"
        width="52"
        height="20"
        rx="10"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="116"
        y="58"
        width="28"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
    </svg>
  ),
  breadcrumbs: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect x="36" y="58" width="28" height="4" rx="2" className="fill-muted" />
      <path
        d="M73 55 L78 60 L73 65"
        className="stroke-fg-muted"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="87" y="58" width="28" height="4" rx="2" className="fill-muted" />
      <path
        d="M124 55 L129 60 L124 65"
        className="stroke-fg-muted"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="138"
        y="58"
        width="28"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
    </svg>
  ),
  button: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="60"
        y="47"
        width="80"
        height="26"
        rx="7"
        className="fill-primary"
      />
      <rect x="79" y="58" width="42" height="4" rx="2" className="fill-bg" />
    </svg>
  ),
  "button-group": (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="40"
        y="47"
        width="120"
        height="26"
        rx="7"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <path
        d="M47 47 L80 47 L80 73 L47 73 A7 7 0 0 1 40 66 L40 54 A7 7 0 0 1 47 47 Z"
        className="fill-muted"
      />
      <line
        x1="80"
        y1="47"
        x2="80"
        y2="73"
        className="stroke-border"
        strokeWidth="1.5"
      />
      <line
        x1="120"
        y1="47"
        x2="120"
        y2="73"
        className="stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="50"
        y="58"
        width="20"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="90"
        y="58"
        width="20"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="130"
        y="58"
        width="20"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="56"
        y="20"
        width="88"
        height="80"
        rx="8"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="68"
        y="31"
        width="30"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <path
        d="M124 30 L121 33.5 L124 37"
        className="stroke-fg-muted"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M131 30 L134 33.5 L131 37"
        className="stroke-fg-muted"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="56"
        y1="44"
        x2="144"
        y2="44"
        className="stroke-border"
        strokeWidth="1.5"
      />
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3, 4].map((col) => {
          const selected = row === 1 && col === 3
          return (
            <circle
              key={`${row}-${col}`}
              cx={72 + col * 14}
              cy={55 + row * 12}
              r={selected ? 5 : 2}
              className={selected ? "fill-primary" : "fill-muted"}
            />
          )
        }),
      )}
    </svg>
  ),
  card: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="56"
        y="18"
        width="88"
        height="84"
        rx="8"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <path
        d="M56 26 A8 8 0 0 1 64 18 L136 18 A8 8 0 0 1 144 26 L144 56 L56 56 Z"
        className="fill-muted"
      />
      <rect
        x="66"
        y="66"
        width="48"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="66"
        y="77"
        width="66"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="66"
        y="85"
        width="52"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
    </svg>
  ),
}

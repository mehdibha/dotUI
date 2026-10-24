import type { ReactNode } from "react"

/**
 * Component-card illustrations, batch 3 (file-upload → loading).
 * See part-1.tsx for the shared spec.
 */
export const illustrationsPart3: Record<string, ReactNode> = {
  "file-upload": (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="48"
        y="26"
        width="104"
        height="68"
        rx="8"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
        strokeDasharray="5 5"
      />
      <line
        x1="100"
        y1="66"
        x2="100"
        y2="46"
        className="stroke-fg-muted"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M93 53 L100 45 L107 53"
        className="stroke-fg-muted"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="76" y="74" width="48" height="4" rx="2" className="fill-muted" />
    </svg>
  ),
  footer: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <line
        x1="32"
        y1="38"
        x2="168"
        y2="38"
        className="stroke-border"
        strokeWidth="1.5"
      />
      <circle cx="48" cy="56" r="6" className="fill-fg-muted" />
      <rect
        x="90"
        y="52"
        width="26"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="90"
        y="63"
        width="34"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="90"
        y="71"
        width="28"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="138"
        y="52"
        width="26"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="138"
        y="63"
        width="30"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="138"
        y="71"
        width="24"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="40"
        y="78"
        width="44"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
    </svg>
  ),
  form: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="56"
        y="18"
        width="30"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="56"
        y="27"
        width="88"
        height="18"
        rx="5"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="56"
        y="53"
        width="38"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="56"
        y="62"
        width="88"
        height="18"
        rx="5"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="56"
        y="88"
        width="88"
        height="18"
        rx="5"
        className="fill-primary"
      />
      <rect x="86" y="95" width="28" height="4" rx="2" className="fill-bg" />
    </svg>
  ),
  header: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="28"
        y="44"
        width="144"
        height="32"
        rx="7"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <circle cx="44" cy="60" r="6" className="fill-primary" />
      <rect
        x="74"
        y="58"
        width="18"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect x="98" y="58" width="18" height="4" rx="2" className="fill-muted" />
      <rect
        x="122"
        y="58"
        width="18"
        height="4"
        rx="2"
        className="fill-muted"
      />
      <circle cx="158" cy="60" r="7" className="fill-muted" />
    </svg>
  ),
  icon: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="72"
        y="32"
        width="56"
        height="56"
        rx="12"
        className="fill-muted"
      />
      <path
        d="M100 44 L104.7 54.6 L116 55.8 L107.6 63.5 L110 74.8 L100 69 L90 74.8 L92.4 63.5 L84 55.8 L95.3 54.6 Z"
        className="fill-fg-muted"
      />
    </svg>
  ),
  kbd: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="62"
        y="46"
        width="28"
        height="28"
        rx="6"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <path
        d="M68 74 L84 74"
        className="stroke-border"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <rect
        x="70"
        y="58"
        width="12"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="98"
        y="46"
        width="40"
        height="28"
        rx="6"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <path
        d="M104 74 L132 74"
        className="stroke-border"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <rect
        x="108"
        y="58"
        width="20"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect x="42" y="48" width="30" height="4" rx="2" className="fill-muted" />
      <rect
        x="78"
        y="48"
        width="44"
        height="4"
        rx="2"
        className="fill-primary"
      />
      <line
        x1="78"
        y1="57"
        x2="122"
        y2="57"
        className="stroke-fg-muted"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        x="128"
        y="48"
        width="30"
        height="4"
        rx="2"
        className="fill-muted"
      />
      <rect x="42" y="64" width="76" height="4" rx="2" className="fill-muted" />
    </svg>
  ),
  list: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <circle cx="56" cy="38" r="3" className="fill-fg-muted" />
      <rect x="68" y="35" width="76" height="4" rx="2" className="fill-muted" />
      <circle cx="56" cy="60" r="3" className="fill-fg-muted" />
      <rect x="68" y="57" width="60" height="4" rx="2" className="fill-muted" />
      <circle cx="56" cy="82" r="3" className="fill-fg-muted" />
      <rect x="68" y="79" width="68" height="4" rx="2" className="fill-muted" />
    </svg>
  ),
  loading: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <circle
        cx="100"
        cy="60"
        r="18"
        className="stroke-border"
        strokeWidth="4"
        fill="none"
      />
      <path
        d="M100 42 A18 18 0 0 1 117.1 54.4"
        className="stroke-fg-muted"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  ),
}

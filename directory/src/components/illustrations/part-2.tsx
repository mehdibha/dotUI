import type { ReactNode } from "react"

/**
 * Component-card illustrations, batch 2 (carousel → empty-state).
 * Shares the spec documented in part-1.tsx.
 */
export const illustrationsPart2: Record<string, ReactNode> = {
  carousel: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="14"
        y="32"
        width="26"
        height="56"
        rx="6"
        className="fill-muted"
      />
      <rect
        x="160"
        y="32"
        width="26"
        height="56"
        rx="6"
        className="fill-muted"
      />
      <rect
        x="52"
        y="24"
        width="96"
        height="72"
        rx="8"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <circle cx="90" cy="106" r="3" className="fill-primary" />
      <circle cx="100" cy="106" r="3" className="fill-muted" />
      <circle cx="110" cy="106" r="3" className="fill-muted" />
    </svg>
  ),
  checkbox: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="58"
        y="38"
        width="16"
        height="16"
        rx="4"
        className="fill-primary"
      />
      <path
        d="M62 46 L65.5 49.5 L70.5 42.5"
        className="stroke-bg"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="84"
        y="44"
        width="52"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="58"
        y="66"
        width="16"
        height="16"
        rx="4"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect x="84" y="72" width="40" height="4" rx="2" className="fill-muted" />
    </svg>
  ),
  combobox: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="48"
        y="20"
        width="104"
        height="24"
        rx="6"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="58"
        y="30"
        width="40"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <path
        d="M134 30 L138 35 L142 30"
        className="stroke-fg-muted"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="48"
        y="50"
        width="104"
        height="50"
        rx="6"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="52"
        y="55"
        width="96"
        height="12"
        rx="4"
        className="fill-muted"
      />
      <rect
        x="60"
        y="59"
        width="44"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect x="60" y="76" width="36" height="4" rx="2" className="fill-muted" />
      <rect x="60" y="89" width="52" height="4" rx="2" className="fill-muted" />
    </svg>
  ),
  "date-picker": (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="48"
        y="18"
        width="104"
        height="24"
        rx="6"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="58"
        y="28"
        width="44"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="128"
        y="24"
        width="13"
        height="12"
        rx="2"
        fill="none"
        className="stroke-fg-muted"
        strokeWidth="1.5"
      />
      <line
        x1="128"
        y1="28.5"
        x2="141"
        y2="28.5"
        className="stroke-fg-muted"
        strokeWidth="1.5"
      />
      <rect
        x="60"
        y="50"
        width="80"
        height="52"
        rx="6"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => {
          const selected = row === 1 && col === 2
          return (
            <circle
              key={`${row}-${col}`}
              cx={74 + col * 17.5}
              cy={63 + row * 13}
              r={selected ? 4.5 : 2}
              className={selected ? "fill-primary" : "fill-muted"}
            />
          )
        }),
      )}
    </svg>
  ),
  dialog: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="20"
        y="10"
        width="160"
        height="100"
        rx="8"
        className="fill-muted"
        opacity="0.5"
      />
      <rect
        x="48"
        y="28"
        width="104"
        height="64"
        rx="8"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="60"
        y="40"
        width="48"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="60"
        y="51"
        width="80"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="60"
        y="59"
        width="64"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="86"
        y="71"
        width="24"
        height="12"
        rx="4"
        className="fill-muted"
      />
      <rect
        x="116"
        y="71"
        width="24"
        height="12"
        rx="4"
        className="fill-primary"
      />
    </svg>
  ),
  divider: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="52"
        y="32"
        width="96"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="52"
        y="40"
        width="72"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <line
        x1="40"
        y1="60"
        x2="160"
        y2="60"
        className="stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="52"
        y="77"
        width="96"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="52"
        y="85"
        width="60"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
    </svg>
  ),
  drawer: (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="52"
        y="16"
        width="72"
        height="4"
        rx="2"
        className="fill-muted"
        opacity="0.6"
      />
      <rect
        x="52"
        y="26"
        width="96"
        height="3"
        rx="1.5"
        className="fill-muted"
        opacity="0.6"
      />
      <rect
        x="36"
        y="46"
        width="128"
        height="84"
        rx="10"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect x="88" y="54" width="24" height="4" rx="2" className="fill-muted" />
      <rect
        x="50"
        y="68"
        width="44"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="50"
        y="80"
        width="100"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="50"
        y="88"
        width="76"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
    </svg>
  ),
  "dropdown-menu": (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="64"
        y="14"
        width="72"
        height="22"
        rx="6"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="74"
        y="23"
        width="32"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <path
        d="M116 22.5 L120 27 L124 22.5"
        className="stroke-fg-muted"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="64"
        y="42"
        width="72"
        height="62"
        rx="6"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="68"
        y="47"
        width="64"
        height="12"
        rx="4"
        className="fill-muted"
      />
      <rect
        x="76"
        y="51"
        width="32"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect x="76" y="66" width="40" height="4" rx="2" className="fill-muted" />
      <rect x="76" y="78" width="28" height="4" rx="2" className="fill-muted" />
      <line
        x1="64"
        y1="87"
        x2="136"
        y2="87"
        className="stroke-border"
        strokeWidth="1.5"
      />
      <rect x="76" y="93" width="36" height="4" rx="2" className="fill-muted" />
    </svg>
  ),
  "empty-state": (
    <svg viewBox="0 0 200 120" aria-hidden="true" className="h-auto w-full">
      <rect
        x="44"
        y="16"
        width="112"
        height="88"
        rx="8"
        className="fill-bg stroke-border"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      <circle cx="100" cy="42" r="10" className="fill-muted" />
      <line
        x1="95.5"
        y1="42"
        x2="104.5"
        y2="42"
        className="stroke-fg-muted"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="37.5"
        x2="100"
        y2="46.5"
        className="stroke-fg-muted"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        x="76"
        y="60"
        width="48"
        height="4"
        rx="2"
        className="fill-fg-muted"
      />
      <rect
        x="68"
        y="70"
        width="64"
        height="3"
        rx="1.5"
        className="fill-muted"
      />
      <rect
        x="82"
        y="82"
        width="36"
        height="12"
        rx="4"
        className="fill-primary"
      />
      <rect x="90" y="86" width="20" height="4" rx="2" className="fill-bg" />
    </svg>
  ),
}

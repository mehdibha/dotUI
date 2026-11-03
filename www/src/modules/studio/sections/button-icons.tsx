/* The Button page's row icons: 16px strokes, drawn in the row's ink. */

const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {children}
  </svg>
)

const BAR =
  "M6.5 9.75H4.25a2.5 2.5 0 0 1-2.5-2.5v-2a2.5 2.5 0 0 1 2.5-2.5h7.5a2.5 2.5 0 0 1 2.5 2.5V7"

export const ICONS = {
  style: (
    <Icon>
      <rect
        x="1.75"
        y="4.25"
        width="12.5"
        height="7.5"
        rx="2.5"
        fill="currentColor"
        stroke="none"
        opacity="0.25"
      />
      <rect x="1.75" y="4.25" width="12.5" height="7.5" rx="2.5" />
      <path d="M5.75 8h4.5" />
    </Icon>
  ),
  variants: (
    <Icon>
      <rect x="1.75" y="7.25" width="12.5" height="6.5" rx="2.25" />
      <path d="M3.75 4.25h8.5" opacity="0.6" />
      <path d="M5.75 1.75h4.5" opacity="0.35" />
    </Icon>
  ),
  sizes: (
    <Icon>
      <rect
        x="1.75"
        y="1.75"
        width="12.5"
        height="12.5"
        rx="2.5"
        opacity="0.4"
      />
      <rect x="1.75" y="8.25" width="6" height="6" rx="1.75" />
      <path d="M9.5 6.5 11.5 4.5M9.5 4.5h2v2" />
    </Icon>
  ),
  radius: (
    <Icon>
      <path d="M2.75 13.25V8.25a5.5 5.5 0 0 1 5.5-5.5h5" />
      <path d="M2.75 5V2.75H5" opacity="0.4" />
    </Icon>
  ),
  shadow: (
    <Icon>
      <rect x="1.75" y="1.75" width="9.5" height="9.5" rx="2.5" />
      <path d="M13.75 5.75v5.5a2.5 2.5 0 0 1-2.5 2.5h-5.5" opacity="0.4" />
    </Icon>
  ),
  weight: (
    <Icon>
      <path d="M4.25 2.75h4a2.5 2.5 0 0 1 0 5h-4zM4.25 7.75h5a2.75 2.75 0 0 1 0 5.5h-5z" />
    </Icon>
  ),
  case: (
    <Icon>
      <path d="M1.5 13.25 4.5 2.75l3 10.5M2.65 9.25h3.7" />
      <circle cx="11.75" cy="10.75" r="2.5" />
      <path d="M14.25 8.25v5" />
    </Icon>
  ),
  cursor: (
    <Icon>
      <path d="M2.75 2.75 13.25 7 8.4 8.4 7 13.25z" />
    </Icon>
  ),
  hover: (
    <Icon>
      <path d={BAR} />
      <path
        d="M9 9 14.75 11.35 12.1 12.1 11.35 14.75z"
        fill="currentColor"
        strokeWidth={1}
      />
    </Icon>
  ),
  press: (
    <Icon>
      <path d="M6.75 6.75 14.1 9.7 10.7 10.7 9.7 14.1z" />
      <path d="M6.75 1.75v1.75M1.75 6.75H3.5M10.5 3 9.25 4.25M3 10.5l1.25-1.25" />
    </Icon>
  ),
  focus: (
    <Icon>
      <rect x="1.75" y="3.25" width="12.5" height="9.5" rx="4" />
      <rect
        x="4.25"
        y="5.75"
        width="7.5"
        height="4.5"
        rx="1.5"
        fill="currentColor"
        stroke="none"
      />
    </Icon>
  ),
  disabled: (
    <Icon>
      <path d={BAR} />
      <circle cx="11.5" cy="11.5" r="2.75" />
      <path d="M9.55 9.55 13.45 13.45" />
    </Icon>
  ),
  pending: (
    <Icon>
      <path d={BAR} />
      <circle cx="11.5" cy="11.5" r="2.75" opacity="0.35" />
      <path d="M11.5 8.75a2.75 2.75 0 1 1-2.75 2.75" />
    </Icon>
  ),
}

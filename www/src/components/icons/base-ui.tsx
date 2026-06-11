import type { SVGProps } from 'react'

// Official Base UI (base-ui.com) logo mark, via svgl. Monochrome — forced to the
// foreground color so it matches the adjacent label (mirrors ShadcnIcon's `stroke-fg`).
export function BaseUiIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 17 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        className="fill-fg"
        d="M9.5 7.015A.477.477 0 0 0 9 7.5V23a8 8 0 0 0 .5-15.985ZM8 9.8V23c-4.418 0-8-3.94-8-8.8V1c4.418 0 8 3.94 8 8.8Z"
      />
    </svg>
  )
}

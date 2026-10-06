import type { SVGProps } from "react"

// Lovable heart silhouette, via svgl. Monochrome.
export function LovableIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 121 122"
      fill="currentColor"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36.069 0c19.92 0 36.068 16.155 36.068 36.084v13.713h12.004c19.92 0 36.069 16.156 36.069 36.084 0 19.928-16.149 36.083-36.069 36.083H0v-85.88C0 16.155 16.148 0 36.069 0Z"
      />
    </svg>
  )
}

import type { SVGProps } from "react"

// Bolt (bolt.new) "b" mark, cropped from the svgl wordmark. Monochrome.
export function BoltIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 47 53 68"
      fill="currentColor"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30.117 106.195c-4.707 0-9.41-1.566-11.922-5.332l-.941 4.39L0 114.353l1.883-9.098L14.43 48.156h15.375L25.41 68.234c3.453-3.765 6.902-5.332 11.297-5.332 9.41 0 15.371 5.961 15.371 17.254 0 11.293-7.215 26.04-21.96 26.04Zm5.961-22.902c0 5.336-3.766 9.414-8.785 9.414-5.02 0-5.332-.941-6.902-2.824l2.511-10.352c1.883-1.883 3.766-2.824 6.274-2.824 3.765 0 6.902 2.824 6.902 6.902Zm0 0"
      />
    </svg>
  )
}

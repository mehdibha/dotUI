"use client"

import * as ProgressBarPrimitives from "react-aria-components/ProgressBar"

import { cn } from "@/registry/lib/utils"

interface LoaderProps extends ProgressBarPrimitives.ProgressBarProps {}

const blades = Array.from({ length: 8 }, (_, i) => i)

function Loader({ className, ...props }: LoaderProps) {
  return (
    <ProgressBarPrimitives.ProgressBar
      data-loader=""
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center",
        className,
      )}
      aria-label="loading..."
      {...props}
      isIndeterminate
    >
      <svg
        role="status"
        aria-label="Loading"
        viewBox="0 0 24 24"
        fill="none"
        className="size-full animate-loader-blades"
      >
        {blades.map((i) => (
          <rect
            key={i}
            className="fill-current"
            x="11"
            y="2.5"
            width="2"
            height="6.5"
            rx="1"
            opacity={0.15 + (i / 7) * 0.85}
            transform={`rotate(${i * 45} 12 12)`}
          />
        ))}
      </svg>
    </ProgressBarPrimitives.ProgressBar>
  )
}

export type { LoaderProps }
export { Loader }

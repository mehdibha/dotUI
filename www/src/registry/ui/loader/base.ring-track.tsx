"use client"

import * as ProgressBarPrimitives from "react-aria-components/ProgressBar"

import { cn } from "@/registry/lib/utils"

interface LoaderProps extends ProgressBarPrimitives.ProgressBarProps {}

const Loader = ({ className, ...props }: LoaderProps) => {
  return (
    <ProgressBarPrimitives.ProgressBar
      data-loader=""
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center",
        className,
      )}
      aria-label="Loading"
      {...props}
      isIndeterminate
    >
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="size-full animate-spin"
      >
        <circle cx="8" cy="8" r="7" strokeOpacity="0.25" />
        <path d="M15 8a7 7 0 0 0-7-7" strokeLinecap="round" />
      </svg>
    </ProgressBarPrimitives.ProgressBar>
  )
}

// MARK: Separator

export type { LoaderProps }
export { Loader }

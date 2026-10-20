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
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="size-full animate-spin"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </ProgressBarPrimitives.ProgressBar>
  )
}

// MARK: Separator

export type { LoaderProps }
export { Loader }

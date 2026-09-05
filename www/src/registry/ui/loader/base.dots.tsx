"use client"

import * as ProgressBarPrimitives from "react-aria-components/ProgressBar"

import { cn } from "@/registry/lib/utils"

interface LoaderProps extends ProgressBarPrimitives.ProgressBarProps {}

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
      <span
        role="status"
        aria-label="Loading"
        className="flex size-full items-center justify-center gap-[12.5%]"
      >
        <span className="size-[25%] animate-loader-dots rounded-full bg-current" />
        <span className="size-[25%] animate-loader-dots rounded-full bg-current [animation-delay:150ms]" />
        <span className="size-[25%] animate-loader-dots rounded-full bg-current [animation-delay:300ms]" />
      </span>
    </ProgressBarPrimitives.ProgressBar>
  )
}

export type { LoaderProps }
export { Loader }

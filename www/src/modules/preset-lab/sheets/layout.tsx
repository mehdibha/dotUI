import type { ReactNode } from "react"

import { cn } from "@/registry/lib/utils"

/** The 1280×900 capture frame; content past it is cropped, so sheets stay inside. */
export function Sheet({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "mx-auto grid h-[900px] w-[1280px] content-start gap-x-10 gap-y-7 overflow-hidden p-10",
        className,
      )}
    >
      {children}
    </div>
  )
}

/** A labeled specimen; the mono label names what the agent is looking at. */
export function Cell({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: ReactNode
}) {
  return (
    <section className="flex min-w-0 flex-col gap-2.5">
      <p className="font-mono text-[10px] tracking-wider text-fg-muted uppercase">
        {label}
      </p>
      <div className={cn("flex flex-wrap items-center gap-3", className)}>
        {children}
      </div>
    </section>
  )
}

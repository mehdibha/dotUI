"use client"

/* The panel on a phone held upright: the main page's rows as cards in one
   strip under the preview, and the pages they open as inset sheets. */

import type { ReactNode, Ref } from "react"
import { ChevronLeftIcon, XIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"

import { INSET_SHEET } from "./rows"

/** Every chapter's rows, side by side: styles.css lays each out as a card. */
export function CardStrip({ children }: { children: ReactNode }) {
  return (
    <div
      data-cards=""
      className="-mx-2 -my-2 no-scrollbar flex snap-x scroll-px-2 gap-2 overflow-x-auto overscroll-x-contain p-2"
    >
      {children}
    </div>
  )
}

/** An open page over the strip. A tap outside closes it, like a picker's. */
export function PageSheet({
  id,
  label,
  backLabel,
  onBack,
  onClose,
  focusRef,
  children,
}: {
  id: string
  label: string
  /** Where Back leads, when the page was opened from another. */
  backLabel?: string
  onBack: () => void
  onClose: () => void
  focusRef: Ref<HTMLButtonElement>
  children: ReactNode
}) {
  return (
    <>
      <div aria-hidden className="fixed inset-0 z-40" onPointerDown={onClose} />
      <section
        data-page={id}
        aria-label={label}
        onKeyDown={(event) => event.key === "Escape" && onClose()}
        className={cn(
          INSET_SHEET,
          "z-40 flex flex-col overflow-hidden [--panel-surface:var(--color-card)]",
        )}
      >
        <div className="flex h-13 shrink-0 items-center gap-1 pr-1.5 pl-1.5">
          {backLabel ? (
            <Button
              ref={focusRef}
              variant="quiet"
              isIconOnly
              aria-label={`Back to ${backLabel}`}
              onPress={onBack}
              className="data-icon-only:size-10"
            >
              <ChevronLeftIcon />
            </Button>
          ) : (
            <span className="w-2.5" />
          )}
          <h2 className="min-w-0 flex-1 truncate text-sm font-medium">
            {label}
          </h2>
          <Button
            ref={backLabel ? undefined : focusRef}
            variant="quiet"
            isIconOnly
            aria-label="Close"
            onPress={onClose}
            className="data-icon-only:size-10"
          >
            <XIcon />
          </Button>
        </div>
        <div className="no-scrollbar flex min-h-0 flex-col gap-1.5 overflow-y-auto overscroll-contain px-2 pb-2">
          {children}
        </div>
      </section>
    </>
  )
}

"use client"

/* An open page's header. Exploration: `useTweak` switches the layout and
   each action, so the variants can be compared on the real pages. */

import type { ReactNode, Ref } from "react"
import {
  ArrowUpRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { useTweak } from "@/dev/tweaker"

const GROUP = "Page header"

export function usePageHeaderTweaks() {
  const layout = useTweak("Layout", {
    type: "select",
    options: ["bar", "merged", "inline", "attached", "crumbs", "large"],
    default: "bar",
    group: GROUP,
  })
  const steps = useTweak("Prev / next", {
    type: "select",
    options: ["off", "header", "footer"],
    default: "off",
    group: GROUP,
  })
  const resetPage = useTweak("Reset page", {
    type: "boolean",
    default: false,
    group: GROUP,
  })
  const docs = useTweak("Docs link", {
    type: "boolean",
    default: false,
    group: GROUP,
  })
  return { layout, steps, resetPage, docs }
}

export type PageHeaderTweaks = ReturnType<typeof usePageHeaderTweaks>

function Action({
  label,
  onPress,
  href,
  isDisabled,
  children,
}: {
  label: string
  onPress?: () => void
  href?: string
  isDisabled?: boolean
  children: ReactNode
}) {
  const button = (
    <Button
      size="sm"
      variant="quiet"
      isIconOnly
      aria-label={label}
      onPress={
        onPress ?? (href ? () => window.open(href, "_blank") : undefined)
      }
      isDisabled={isDisabled}
      className="text-fg-muted data-icon-only:size-6 pointer-coarse:data-icon-only:size-9"
    >
      {children}
    </Button>
  )
  return (
    <Tooltip delay={0}>
      {button}
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export interface PageHeaderProps {
  title: string
  /** Where Back leads. */
  parent: string
  onBack: () => void
  backRef: Ref<HTMLButtonElement>
  /** The slide the title takes as the page swaps. */
  titleClass?: string
  steps?: {
    prev?: { label: string; go: () => void }
    next?: { label: string; go: () => void }
  }
  /** Shown while the page differs from where the design system started. */
  onReset?: () => void
  docs?: string
}

export function PageActions({
  title,
  steps,
  onReset,
  docs,
}: Pick<PageHeaderProps, "title" | "steps" | "onReset" | "docs">) {
  if (!steps && !onReset && !docs) return null
  return (
    <span className="flex shrink-0 items-center gap-0.5">
      {onReset && (
        <Tooltip delay={0}>
          <Button
            size="sm"
            variant="quiet"
            onPress={onReset}
            className="h-6 px-1.5 text-xs text-fg-muted pointer-coarse:h-9"
          >
            Reset
          </Button>
          <TooltipContent>
            Reset {title} to how the design system started
          </TooltipContent>
        </Tooltip>
      )}
      {docs && (
        <Action label={`${title} docs`} href={docs}>
          <ArrowUpRightIcon />
        </Action>
      )}
      {steps && (
        <>
          <Action
            label={steps.prev ? `Previous: ${steps.prev.label}` : "Previous"}
            onPress={steps.prev?.go}
            isDisabled={!steps.prev}
          >
            <ChevronLeftIcon />
          </Action>
          <Action
            label={steps.next ? `Next: ${steps.next.label}` : "Next"}
            onPress={steps.next?.go}
            isDisabled={!steps.next}
          >
            <ChevronRightIcon />
          </Action>
        </>
      )}
    </span>
  )
}

function Back({
  parent,
  onBack,
  backRef,
  className,
  children,
}: Pick<PageHeaderProps, "parent" | "onBack" | "backRef"> & {
  className?: string
  children?: ReactNode
}) {
  return (
    <Button
      ref={backRef}
      size="sm"
      variant="quiet"
      isIconOnly={!children}
      aria-label={`Back to ${parent}`}
      onPress={onBack}
      className={cn(
        children
          ? "min-w-0 shrink gap-0.5 pr-1.5 pl-1 text-fg/60 hover:text-fg"
          : "data-icon-only:size-7 pointer-coarse:data-icon-only:size-9",
        className,
      )}
    >
      <ChevronLeftIcon />
      {children}
    </Button>
  )
}

/** The pinned bar under the chrome; null for `merged`, which the chrome
 *  draws itself. */
export function PageHeader({
  layout,
  ...props
}: PageHeaderProps & { layout: PageHeaderTweaks["layout"] }) {
  const { title, parent, onBack, backRef, titleClass } = props
  const actions = <PageActions {...props} />

  if (layout === "crumbs")
    return (
      <div className="flex h-11 shrink-0 items-center gap-1 border-b border-fg/6 px-2">
        {parent === "Back" ? (
          <Back parent={parent} onBack={onBack} backRef={backRef} />
        ) : (
          <>
            <Back parent={parent} onBack={onBack} backRef={backRef}>
              <span className="truncate">{parent}</span>
            </Back>
            <span aria-hidden className="text-[13px] text-fg/25">
              /
            </span>
          </>
        )}
        <span
          className={cn(
            "min-w-0 flex-1 truncate pl-1 text-[13px] font-medium",
            titleClass,
          )}
        >
          {title}
        </span>
        {actions}
      </div>
    )

  if (layout === "large")
    return (
      <div className="flex shrink-0 flex-col border-b border-fg/6 px-2 pt-1.5 pb-3">
        <div className="flex h-7 items-center justify-between gap-1">
          <Back parent={parent} onBack={onBack} backRef={backRef}>
            <span className="truncate">{parent}</span>
          </Back>
          {actions}
        </div>
        <h2
          className={cn(
            "truncate px-2.5 pt-1.5 text-base/6 font-semibold",
            titleClass,
          )}
        >
          {title}
        </h2>
      </div>
    )

  if (layout === "merged" || layout === "inline" || layout === "attached")
    return null

  return (
    <div className="flex h-11 shrink-0 items-center gap-1 border-b border-fg/6 px-2">
      <Back parent={parent} onBack={onBack} backRef={backRef} />
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-[13px] font-medium",
          titleClass,
        )}
      >
        {title}
      </span>
      {actions}
    </div>
  )
}

/** `merged`: the page takes the chrome's row from the design-system picker. */
export function MergedTitle({
  title,
  parent,
  onBack,
  backRef,
  titleClass,
}: PageHeaderProps) {
  return (
    <span className="flex min-w-0 shrink items-center gap-0.5">
      <Back parent={parent} onBack={onBack} backRef={backRef} />
      <span className={cn("min-w-0 truncate text-sm font-medium", titleClass)}>
        {title}
      </span>
    </span>
  )
}

/** Prev / next as the page's last rows. */
export function PageSteps({ steps }: Pick<PageHeaderProps, "steps">) {
  if (!steps) return null
  const { prev, next } = steps
  return (
    <nav
      aria-label="Components"
      className="mt-3 flex gap-1.5 border-t border-fg/6 pt-3"
    >
      {[prev, next].map((step, i) =>
        step ? (
          <Button
            key={i}
            data-step={i === 0 ? "prev" : "next"}
            variant="quiet"
            size="sm"
            onPress={step.go}
            className={cn(
              "h-12 min-w-0 flex-1 flex-col gap-0 rounded-lg tint-3 px-2.5 hover:tint-6",
              i === 0 ? "items-start" : "items-end",
            )}
          >
            <span className="text-[11px] font-normal text-fg/50">
              {i === 0 ? "Previous" : "Next"}
            </span>
            <span className="flex max-w-full items-center gap-0.5 text-[13px] font-medium">
              {i === 0 && <ChevronLeftIcon className="size-3.5 shrink-0" />}
              <span className="truncate">{step.label}</span>
              {i === 1 && <ChevronRightIcon className="size-3.5 shrink-0" />}
            </span>
          </Button>
        ) : (
          <span key={i} className="flex-1" />
        ),
      )}
    </nav>
  )
}

/** `inline`: no pinned bar; the page opens on its own title, which scrolls
 *  with the rows. */
export function InlineTitle(props: PageHeaderProps) {
  const { title, parent, onBack, backRef } = props
  // A page the main page opens has no parent worth naming: Back sits by the
  // title.
  const named = parent !== "Back"
  return (
    <div className="flex flex-col gap-1 pb-2 max-lg:pt-2">
      {named && (
        <Back
          parent={parent}
          onBack={onBack}
          backRef={backRef}
          className="self-start"
        >
          <span className="truncate">{parent}</span>
        </Back>
      )}
      <div
        className={cn(
          "flex min-h-8 items-center justify-between gap-1",
          named && "pl-2.5",
        )}
      >
        <span className="flex min-w-0 items-center gap-0.5">
          {!named && <Back parent={parent} onBack={onBack} backRef={backRef} />}
          <h2 className="min-w-0 truncate text-base/6 font-semibold">
            {title}
          </h2>
        </span>
        <PageActions {...props} />
      </div>
    </div>
  )
}

/** `attached`: a second row inside the chrome, one hairline for both. */
export function AttachedTitle(props: PageHeaderProps) {
  const { title, parent, onBack, backRef, titleClass } = props
  return (
    <div className="mt-1.5 flex h-8 items-center gap-0.5 rounded-lg tint-4 pr-1">
      <Back
        parent={parent}
        onBack={onBack}
        backRef={backRef}
        className="data-icon-only:size-8"
      />
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-[13px] font-medium",
          titleClass,
        )}
      >
        {title}
      </span>
      <PageActions {...props} />
    </div>
  )
}

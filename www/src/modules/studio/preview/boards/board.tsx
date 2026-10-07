"use client"

// What the preview shows while the panel edits a chapter or family: one section per member.

import { createContext, useContext, useEffect, useRef } from "react"

import { cn } from "@/registry/lib/utils"
import {
  NO_INSET,
  usePreviewFocusMessages,
} from "@/modules/studio/preset/iframe-sync"
import type { PreviewFocusMessage } from "@/modules/studio/preset/iframe-sync"

import { BoardsIndex } from "."

const BoardFocusContext = createContext<PreviewFocusMessage>({
  popover: false,
  inset: NO_INSET,
})

// Its own component, so a focus message re-renders only the boards reading it.
export function BoardFocusProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <BoardFocusContext.Provider value={usePreviewFocusMessages()}>
      {children}
    </BoardFocusContext.Provider>
  )
}

/** The panel's focus: which member and key it is editing. */
export const useBoardFocus = () => useContext(BoardFocusContext)

const RING_MS = 1200

function focusedSection(root: Element, member?: string, axis?: string) {
  const of = member && `[data-board-member="${CSS.escape(member)}"]`
  const holds = axis && `[data-board-axes~="${CSS.escape(axis)}"]`
  const selectors = [of && holds && of + holds, holds, of].filter(Boolean)
  for (const selector of selectors as string[]) {
    const section = root.querySelector<HTMLElement>(selector)
    if (section) return section
  }
}

export function Board({
  id,
  className,
  children,
}: {
  /** The panel page or chapter it shows. */
  id: string
  className?: string
  children: React.ReactNode
}) {
  const { member, axis, inset } = useBoardFocus()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = ref.current && focusedSection(ref.current, member, axis)
    if (!section) return
    section.scrollIntoView({ behavior: "smooth", block: "center" })
    section.dataset.focused = ""
    const timer = setTimeout(() => delete section.dataset.focused, RING_MS)
    return () => {
      clearTimeout(timer)
      delete section.dataset.focused
    }
  }, [member, axis])

  return (
    <div
      ref={ref}
      data-board=""
      style={
        {
          paddingLeft: inset.left,
          paddingBottom: inset.bottom,
          "--board-inset-bottom": `${inset.bottom}px`,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-5xl min-w-0 flex-col gap-10 px-4 py-10 sm:px-10",
          className,
        )}
      >
        <h1 className="text-sm font-medium text-fg-muted">
          {BoardsIndex[id]?.title}
        </h1>
        {children}
      </div>
    </div>
  )
}

/** `member`: the panel's member id or row group; `axes`: the keys whose rows land here. */
export function BoardSection({
  member,
  axes = [],
  title,
  className,
  children,
}: {
  member: string
  axes?: readonly string[]
  title: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      data-board-member={member}
      data-board-axes={axes.join(" ")}
      aria-label={title}
      // Centred in what the docked popover leaves visible.
      className="group/section flex min-w-0 scroll-mt-6 scroll-mb-[calc(--spacing(6)+var(--board-inset-bottom,0px))] flex-col gap-3"
    >
      <h2 className="text-xs font-medium text-fg-muted">{title}</h2>
      <div
        className={cn(
          "flex min-w-0 flex-wrap items-center justify-center gap-4 rounded-(--studio-radius-panel) border bg-bg p-8 ring-accent/40 transition-shadow duration-500 group-data-focused/section:ring-4 max-sm:p-5",
          className,
        )}
      >
        {children}
      </div>
    </section>
  )
}

export type StateName =
  | "rest"
  | "hover"
  | "pressed"
  | "focus"
  | "selected"
  | "disabled"
  | "invalid"

const STATE_ATTRIBUTE: Record<StateName, string | null> = {
  rest: null,
  hover: "data-hovered",
  pressed: "data-pressed",
  focus: "data-focus-visible",
  selected: "data-selected",
  disabled: "data-disabled",
  invalid: "data-invalid",
}

const STATE_LABEL: Record<StateName, string> = {
  rest: "Rest",
  hover: "Hover",
  pressed: "Pressed",
  focus: "Focus",
  selected: "Selected",
  disabled: "Disabled",
  invalid: "Invalid",
}

/** react-aria's state attributes, so registry classes style a plain element as if live. */
export function stateProps(...states: StateName[]) {
  const props: Record<string, string> = { "data-rac": "" }
  for (const state of states) {
    const attribute = STATE_ATTRIBUTE[state]
    if (attribute) props[attribute] = "true"
  }
  if (states.includes("pressed")) props["data-hovered"] = "true"
  if (states.includes("disabled")) props["aria-disabled"] = "true"
  return props
}

/** Frozen specimens side by side: spread `children`'s props on the styled element. */
export function StateRow({
  states = ["rest", "hover", "pressed", "focus", "disabled"],
  children,
}: {
  states?: readonly StateName[]
  children: (
    props: ReturnType<typeof stateProps>,
    state: StateName,
  ) => React.ReactNode
}) {
  return (
    <div
      inert
      className="flex flex-wrap items-end justify-center gap-x-6 gap-y-4"
    >
      {states.map((state) => (
        <div key={state} className="flex flex-col items-center gap-2">
          {children(stateProps(state), state)}
          <span className="text-[11px] text-fg-muted">
            {STATE_LABEL[state]}
          </span>
        </div>
      ))}
    </div>
  )
}

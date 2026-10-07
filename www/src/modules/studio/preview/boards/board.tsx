"use client"

/* A board: what the preview shows while the panel works on a chapter or a
   family — one section per member or row group, the focused one scrolled to. */

import { createContext, useContext, useEffect, useRef } from "react"

import { cn } from "@/registry/lib/utils"

import { BoardsIndex } from "."

export interface BoardFocus {
  member?: string
  axis?: string
  /** A panel popover covers the preview's left edge. */
  popover: boolean
}

export const BoardFocusContext = createContext<BoardFocus>({ popover: false })

/** The panel's focus: which member and key it is editing. */
export const useBoardFocus = () => useContext(BoardFocusContext)

const RING_MS = 1200

function focusedSection(root: Element, { member, axis }: BoardFocus) {
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
  const focus = useBoardFocus()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = ref.current && focusedSection(ref.current, focus)
    if (!section) return
    section.scrollIntoView({ behavior: "smooth", block: "center" })
    section.dataset.focused = ""
    const timer = setTimeout(() => delete section.dataset.focused, RING_MS)
    return () => {
      clearTimeout(timer)
      delete section.dataset.focused
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus.member, focus.axis])

  return (
    // Padded clear of the panel popover over the preview's left edge.
    <div
      ref={ref}
      data-board=""
      className={focus.popover ? "pl-68" : undefined}
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

/** One member (or row group): `member` is the panel's member id, `axes` the
 *  keys whose rows land here. */
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
      className="group/section flex min-w-0 scroll-my-6 flex-col gap-3"
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

/** The attributes react-aria sets in a state, so registry classes
 *  (`hover:` = `[data-rac][data-hovered]`) style a plain element as if live.
 *  Pressed implies hover, as it does under a pointer. */
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

/** One specimen per state, side by side and frozen: `children` renders the
 *  specimen from the state's attributes (spread them on the styled element). */
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

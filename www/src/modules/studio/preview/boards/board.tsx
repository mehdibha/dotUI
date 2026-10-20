"use client"

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"

import { useParamSelections } from "@/lib/styles"
import { cn } from "@/registry/lib/utils"
import { useMessage } from "@/modules/studio/preset/iframe-sync"
import type { PreviewFocus } from "@/modules/studio/preset/iframe-sync"

import { BOARD_TITLES } from "./titles"
import type { BoardId } from "./titles"

const BoardFocusContext = createContext<PreviewFocus>({ popover: false })

// Its own component, so a focus message re-renders only the boards reading it.
export function BoardFocusProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [focus, setFocus] = useState<PreviewFocus>({ popover: false })
  useMessage("preview-focus", ({ axis, holds, popover }) => {
    const next = { axis, holds, popover }
    setFocus((prev) =>
      JSON.stringify(prev) === JSON.stringify(next) ? prev : next,
    )
  })
  return (
    <BoardFocusContext.Provider value={focus}>
      {children}
    </BoardFocusContext.Provider>
  )
}

/** The row the panel is editing, for emphasis and replays. */
export const useBoardFocus = () => useContext(BoardFocusContext)

export function Board({
  id,
  className,
  children,
}: {
  id: BoardId
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      data-board={id}
      className={cn(
        // The bottom clears the preview's floating toolbar.
        "mx-auto flex w-full max-w-5xl min-w-0 flex-col gap-8 px-4 pt-8 pb-16 sm:px-10",
        className,
      )}
    >
      <h1 className="text-lg font-semibold">{BOARD_TITLES[id]}</h1>
      {children}
    </div>
  )
}

export function BoardSection({
  title,
  className,
  children,
}: {
  title: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      aria-label={title}
      className="@container/section flex min-w-0 flex-col gap-3"
    >
      <h2 className="text-xs font-medium text-fg-muted">{title}</h2>
      <div
        className={cn(
          "flex min-w-0 flex-wrap items-center justify-center gap-4 rounded-(--studio-radius-panel) border bg-bg p-8 max-sm:p-4",
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
          <span className={CAPTION}>{STATE_LABEL[state]}</span>
        </div>
      ))}
    </div>
  )
}

/** A specimen's label. */
export const CAPTION = "text-[11px] text-fg-muted"

/** A specimen over its label. */
export function Specimen({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("flex min-w-0 flex-col items-center gap-3", className)}>
      {children}
      <span className={CAPTION}>{label}</span>
    </div>
  )
}

/** Flips every `ms` while `active`; back to `rest` when it stops. */
export function useLoop(active: boolean, ms: number, rest = false) {
  const [on, setOn] = useState(rest)
  useEffect(() => {
    if (!active) return
    const timer = setInterval(() => setOn((value) => !value), ms)
    return () => {
      clearInterval(timer)
      setOn(rest)
    }
  }, [active, ms, rest])
  return on
}

const LINGER_MS = 3000

/** The panel edits one of `keys` or the global Motion. */
function useEdited(keys: string[]) {
  const { axis, holds } = useBoardFocus()
  return [axis, ...(holds ?? [])].some(
    (key) => !!key && (key === "motion" || keys.includes(key)),
  )
}

/** A page's motion demo: it runs while the panel edits one of `keys` or the global Motion, and a moment after. */
export interface Replay {
  running: boolean
  /** Bumps when editing starts and on each design change while it lasts. */
  replay: number
}

export function useReplay(...keys: string[]): Replay {
  const edited = useEdited(keys)
  const { axis } = useBoardFocus()
  const params = useParamSelections()
  const [lingering, setLingering] = useState(false)
  const [replay, setReplay] = useState(0)
  useEffect(() => {
    if (edited) return setLingering(true)
    const timer = setTimeout(() => setLingering(false), LINGER_MS)
    return () => clearTimeout(timer)
  }, [edited])
  useEffect(() => {
    if (edited) setReplay((count) => count + 1)
  }, [edited, axis, params])
  return { running: edited || lingering, replay }
}

/** Counts a step every `period` while running; a replay steps at once. */
export function useSteps({ running, replay }: Replay, period: number) {
  const [step, setStep] = useState(0)
  const replayed = useRef(replay)
  useEffect(() => {
    if (!running) return
    const next = () => setStep((count) => count + 1)
    if (replayed.current !== replay) next()
    replayed.current = replay
    const timer = setInterval(next, period)
    return () => clearInterval(timer)
  }, [replay, period, running])
  return step
}

/** `driven` while running; at rest, a value the viewer controls. */
export function useDriven<T>(running: boolean, driven: T, initial: T) {
  const [own, setOwn] = useState(initial)
  return [running ? driven : own, setOwn] as const
}

export type Phase = "closed" | "entering" | "open" | "exiting"

/** react-aria's overlay states. */
export const RAC_STATE: Partial<Record<Phase, Record<string, string>>> = {
  entering: { "data-entering": "" },
  exiting: { "data-exiting": "" },
}

/** Base UI's overlay states. */
export const BASE_STATE: Partial<Record<Phase, Record<string, string>>> = {
  entering: { "data-starting-style": "" },
  exiting: { "data-ending-style": "" },
}

/** An overlay opening and closing on a loop while running, open at rest; a replay reopens it at once. */
export function usePresence(
  ref: React.RefObject<HTMLElement | null>,
  { running, replay }: Replay,
  { open = 2200, closed = 900 } = {},
) {
  const [phase, setPhase] = useState<Phase>("open")
  const quick = useRef(false)

  useEffect(() => {
    if (!replay) return
    quick.current = true
    setPhase("closed")
  }, [replay])

  useEffect(() => {
    if (!running) setPhase("open")
  }, [running])

  useLayoutEffect(() => {
    if (phase !== "entering") return
    // Commit the entering styles, so leaving them transitions.
    ref.current?.getBoundingClientRect()
    setPhase("open")
  }, [phase, ref])

  useEffect(() => {
    if (!running) return
    if (phase === "exiting") {
      const transitions =
        ref.current
          ?.getAnimations({ subtree: true })
          .filter((animation) => animation instanceof CSSTransition)
          .map((animation) => animation.finished) ?? []
      let live = true
      void Promise.allSettled(transitions).then(() => {
        if (live) setPhase("closed")
      })
      return () => {
        live = false
      }
    }
    const [next, wait]: [Phase, number] | [] =
      phase === "closed"
        ? ["entering", quick.current ? 0 : closed]
        : phase === "open"
          ? ["exiting", open]
          : []
    if (!next) return
    const timer = setTimeout(() => {
      quick.current = false
      setPhase(next)
    }, wait)
    return () => clearTimeout(timer)
  }, [phase, running, open, closed, ref])

  return phase
}

// The provider writes tokens onto <html>'s style.
function subscribeRoot(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["style"],
  })
  return () => observer.disconnect()
}

/** A root token as the preview resolves it. */
export const useRootToken = (name: string) =>
  useSyncExternalStore(
    subscribeRoot,
    () =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim(),
    () => "",
  )

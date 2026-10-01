import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { flushSync } from "react-dom"
import { continueRender, delayRender } from "remotion"

import { ApprovalPrompt } from "@/components/showcase/approval-prompt"
import { Booking } from "@/components/showcase/booking"
import { CommandMenu } from "@/components/showcase/command-menu"
import { Controls } from "@/components/showcase/controls"
import { CookiePreferences } from "@/components/showcase/cookie-preferences"
import { CustomDomain } from "@/components/showcase/custom-domain"
import { DisplaySettings } from "@/components/showcase/display-settings"
import { Faq } from "@/components/showcase/faq"
import { PricingPlans } from "@/components/showcase/pricing-plans"
import { Storage } from "@/components/showcase/storage"
import { SupportChat } from "@/components/showcase/support-chat"
import { TeamName } from "@/components/showcase/team-name"
import { TwoFactor } from "@/components/showcase/two-factor"

import { facesReady } from "../../lib/theme"
import type { State } from "../../lib/theme"
import { COLUMNS as AXES_COLUMNS } from "../axes/layout"
import {
  Alerts,
  Appearance,
  Billing,
  Deploys,
  Invoice,
  Onboarding,
  Profile,
  Quotas,
  Shipping,
  SignIn,
  Tasks,
  Team,
  Topics,
} from "./cards"

export const COLUMN = 340
export const GAP = 24
const PITCH = COLUMN + GAP

/* Showcase cards from SAFE_SHOWCASE plus a few of our own, with rough
   default-density heights: the layout is planned on these (so every render
   plans the same board) and placed on each look's measured ones. */
const CARDS = {
  controls: { card: <Controls />, height: 360 },
  command: { card: <CommandMenu />, height: 350 },
  booking: { card: <Booking />, height: 515 },
  "two-factor": { card: <TwoFactor />, height: 250 },
  pricing: { card: <PricingPlans />, height: 360 },
  appearance: { card: <Appearance />, height: 235 },
  signin: { card: <SignIn />, height: 360 },
  team: { card: <Team />, height: 260 },
  alerts: { card: <Alerts />, height: 300 },
  onboarding: { card: <Onboarding />, height: 350 },
  topics: { card: <Topics />, height: 190 },
  billing: { card: <Billing />, height: 360 },
  quotas: { card: <Quotas />, height: 270 },
  shipping: { card: <Shipping />, height: 330 },
  storage: { card: <Storage />, height: 265 },
  cookies: { card: <CookiePreferences />, height: 355 },
  display: { card: <DisplaySettings />, height: 243 },
  faq: { card: <Faq />, height: 400 },
  teamname: { card: <TeamName />, height: 180 },
  domain: { card: <CustomDomain />, height: 250 },
  approval: { card: <ApprovalPrompt />, height: 320 },
  chat: { card: <SupportChat />, height: 460 },
  profile: { card: <Profile />, height: 400 },
  deploys: { card: <Deploys />, height: 330 },
  invoice: { card: <Invoice />, height: 330 },
  tasks: { card: <Tasks />, height: 250 },
} satisfies Record<string, { card: ReactNode; height: number }>

type CardId = keyof typeof CARDS
const IDS = Object.keys(CARDS) as CardId[]
const INDEX = new Map(IDS.map((id, i) => [id, i]))

/* Plane px. The home row at y 0 is Axes' preview canvas card for card —
   the same columns, tops aligned, so the last frame here is the first
   there. Around it, the cards the macro glide passes; the rest is filled so
   no card has a twin in view. */
const HOME_COLUMNS: CardId[][] = AXES_COLUMNS.map((cards) =>
  cards.map(([id]) => id).filter((id) => id in CARDS),
)
export const HOME = { first: 2, count: HOME_COLUMNS.length }

/** Cards stacked directly above the home columns, left to right. */
const ABOVE: CardId[][] = [
  ["billing"],
  ["onboarding"],
  ["alerts"],
  ["shipping"],
]

const PLAN: Array<{
  y: number
  down: CardId[]
  up: CardId[]
  /** Nothing below `down` — the canvas ends there, as in Axes. */
  closed?: boolean
}> = [
  { y: -300, down: ["approval"], up: [] },
  { y: 110, down: ["signin", "quotas"], up: ["team", "faq"] },
  ...HOME_COLUMNS.map((down, i) => ({
    y: 0,
    down: [...down],
    up: [...(ABOVE[i] ?? [])],
    closed: true,
  })),
  { y: 60, down: ["topics", "appearance"], up: ["teamname"] },
  { y: -80, down: ["chat"], up: [] },
]

export const BOARD_WIDTH = PLAN.length * PITCH - GAP
const TOP = -2300
const BOTTOM = 1000

type Placed = { id: CardId; col: number; y0: number; y1: number }

/** Extend every column up to TOP and down to BOTTOM, each time taking the
 *  card whose nearest twin is farthest away. */
function plan() {
  const placed: Placed[] = []
  const columns = PLAN.map((col, c) => {
    let y = col.y
    const down = col.down.map((id) => {
      placed.push({ id, col: c, y0: y, y1: y + CARDS[id].height })
      y += CARDS[id].height + GAP
      return id
    })
    let top = col.y
    const up = col.up.map((id) => {
      top -= CARDS[id].height + GAP
      placed.push({ id, col: c, y0: top, y1: top + CARDS[id].height })
      return id
    })
    return { anchor: col.y, down, up, top, bottom: col.closed ? BOTTOM : y }
  })
  const distance = (id: CardId, col: number, y: number) =>
    Math.min(
      Infinity,
      ...placed
        .filter((p) => p.id === id)
        .map((p) => Math.hypot((p.col - col) * PITCH, (p.y0 + p.y1) / 2 - y)),
    )
  for (;;) {
    const open = columns
      .map((col, c) => ({ col, c }))
      .filter(({ col }) => col.top > TOP || col.bottom < BOTTOM)
    if (open.length === 0) break
    for (const { col, c } of open) {
      const upward = col.top > TOP
      let best: CardId = IDS[0]!
      let far = -1
      for (const id of IDS) {
        const h = CARDS[id].height
        const y0 = upward ? col.top - GAP - h : col.bottom
        const d = distance(id, c, y0 + h / 2)
        if (d > far + 1e-6) {
          far = d
          best = id
        }
      }
      const h = CARDS[best].height
      const y0 = upward ? col.top - GAP - h : col.bottom
      placed.push({ id: best, col: c, y0, y1: y0 + h })
      if (upward) {
        col.up.push(best)
        col.top = y0
      } else {
        col.down.push(best)
        col.bottom = y0 + h + GAP
      }
    }
  }
  return columns.map(({ anchor, down, up }) => ({ anchor, down, up }))
}

const COLUMNS = plan()

/** A rect of the plane that the camera sees (plane px). */
export type View = { x0: number; x1: number; y0: number; y1: number }

/* Chrome restyles and relayouts the whole document twice per captured frame
   (the screenshot resizes the viewport), so the board mounts only the cards
   in view. To place them without their neighbours, each look's card heights
   are measured once — every card, in that look, once its faces are in. The
   measure mounts outside the camera (no zoom), in the look's Theme. */
const measured = new Map<State, number[]>()

export function useCardHeights(state: State) {
  const [heights, setHeights] = useState(() => measured.get(state))
  const measure = heights ? null : (
    <Measure
      state={state}
      onMeasure={(h) => {
        measured.set(state, h)
        setHeights(h)
      }}
    />
  )
  return [heights, measure] as const
}

export function Board({
  heights,
  view,
}: {
  heights: readonly number[]
  view: View
}) {
  const h = (id: CardId) => heights[INDEX.get(id)!]!
  const cards: ReactNode[] = []
  COLUMNS.forEach((column, c) => {
    const left = c * PITCH
    if (left + COLUMN < view.x0 || left > view.x1) return
    const place = (id: CardId, top: number, key: string) => {
      if (top + h(id) < view.y0 || top > view.y1) return
      cards.push(
        <div
          key={key}
          className="absolute"
          style={{ left, top, width: COLUMN }}
        >
          {CARDS[id].card}
        </div>,
      )
    }
    let y = column.anchor
    column.down.forEach((id, i) => {
      place(id, y, `${c}d${i}`)
      y += h(id) + GAP
    })
    y = column.anchor
    column.up.forEach((id, i) => {
      y -= h(id) + GAP
      place(id, y, `${c}u${i}`)
    })
  })
  return <div className="absolute inset-0 isolate text-fg">{cards}</div>
}

function Measure({
  state,
  onMeasure,
}: {
  state: State
  onMeasure: (heights: number[]) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const done = useRef(onMeasure)
  const [handle] = useState(() => delayRender("measure cards"))
  useEffect(() => {
    void facesReady(state).then(() => {
      const el = ref.current
      if (el) {
        const heights = [...el.children].map(
          (c) => (c as HTMLElement).offsetHeight,
        )
        // Commit the placed cards before the frame is released.
        flushSync(() => done.current(heights))
      }
      continueRender(handle)
    })
  }, [handle, state])
  return (
    <div
      ref={ref}
      className="invisible absolute text-fg"
      style={{ width: COLUMN }}
    >
      {IDS.map((id) => (
        <div key={id}>{CARDS[id].card}</div>
      ))}
    </div>
  )
}

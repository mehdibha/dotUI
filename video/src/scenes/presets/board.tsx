import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { flushSync } from "react-dom"
import { continueRender, delayRender } from "remotion"

import { Appearance } from "@/components/showcase/appearance"
import { ApprovalPrompt } from "@/components/showcase/approval-prompt"
import { Booking } from "@/components/showcase/booking"
import { CommandMenu } from "@/components/showcase/command-menu"
import { Controls } from "@/components/showcase/controls"
import { CookiePreferences } from "@/components/showcase/cookie-preferences"
import { CustomDomain } from "@/components/showcase/custom-domain"
import { DisplaySettings } from "@/components/showcase/display-settings"
import { Faq } from "@/components/showcase/faq"
import { Filters } from "@/components/showcase/filters"
import { PricingPlans } from "@/components/showcase/pricing-plans"
import { Storage } from "@/components/showcase/storage"
import { SupportChat } from "@/components/showcase/support-chat"
import { TeamName } from "@/components/showcase/team-name"
import { TwoFactor } from "@/components/showcase/two-factor"

import type { State } from "../../lib/theme"
import {
  Alerts,
  Billing,
  Onboarding,
  Quotas,
  Shipping,
  SignIn,
  Team,
  Topics,
} from "./cards"
import { facesReady } from "./faces"

export const COLUMN = 340
export const GAP = 24

/* Landing showcase cards (the ones without charts, names, logos or remote
   images) plus a few of our own. Heights are rough (default density) — only
   used to know when a column has run the length of the board. */
const POOL: Array<{ card: ReactNode; height: number }> = [
  { card: <Controls />, height: 360 },
  { card: <SignIn />, height: 360 },
  { card: <Booking />, height: 515 },
  { card: <Onboarding />, height: 350 },
  { card: <PricingPlans />, height: 360 },
  { card: <Appearance />, height: 235 },
  { card: <Billing />, height: 360 },
  { card: <Alerts />, height: 300 },
  { card: <Filters />, height: 460 },
  { card: <CommandMenu />, height: 350 },
  { card: <TwoFactor />, height: 250 },
  { card: <Storage />, height: 265 },
  { card: <Team />, height: 260 },
  { card: <Shipping />, height: 330 },
  { card: <Quotas />, height: 270 },
  { card: <ApprovalPrompt />, height: 320 },
  { card: <CookiePreferences />, height: 355 },
  { card: <DisplaySettings />, height: 243 },
  { card: <Faq />, height: 400 },
  { card: <TeamName />, height: 180 },
  { card: <CustomDomain />, height: 250 },
  { card: <Topics />, height: 190 },
  { card: <SupportChat />, height: 460 },
]

/** Seven columns spanning plane y [top, bottom]; the middle five are in
 *  frame. A stride of 10 through the pool keeps a card's twin far away. */
function columns(top: number, bottom: number) {
  return Array.from({ length: 7 }, (_, i) => {
    const start = top + ((i * 53) % 140)
    const cards: number[] = []
    let y = start
    for (let j = (i * 10) % POOL.length; y < bottom; j++) {
      cards.push(j % POOL.length)
      y += POOL[j % POOL.length]!.height + GAP
    }
    return { top: start, cards }
  })
}

const COLUMNS = columns(-720, 2120)

export const BOARD_WIDTH = COLUMNS.length * COLUMN + (COLUMNS.length - 1) * GAP

/** The part of the plane in frame (plane px). */
export type View = { x0: number; x1: number; y0: number; y1: number }

/* Chrome restyles and relayouts the whole document twice per captured frame
   (the screenshot resizes the viewport), so the board mounts only the cards
   in view. To place them without their neighbours, each look's card heights
   are measured once — every card, in that look, once its faces are in. */
const measured = new Map<State, number[]>()

export function Board({ state, view }: { state: State; view: View }) {
  const [heights, setHeights] = useState(() => measured.get(state))
  if (!heights)
    return (
      <Measure
        state={state}
        onMeasure={(h) => {
          measured.set(state, h)
          setHeights(h)
        }}
      />
    )
  return (
    <div className="absolute inset-0 isolate text-fg">
      {COLUMNS.map((column, i) => {
        const left = i * (COLUMN + GAP)
        if (left + COLUMN < view.x0 || left > view.x1) return null
        let y = column.top
        return column.cards.map((card, j) => {
          const top = y
          y += heights[card]! + GAP
          if (y < view.y0 || top > view.y1) return null
          return (
            <div
              key={`${i}-${j}`}
              className="absolute"
              style={{ left, top, width: COLUMN }}
            >
              {POOL[card]!.card}
            </div>
          )
        })
      })}
    </div>
  )
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
      {POOL.map(({ card }, i) => (
        <div key={i}>{card}</div>
      ))}
    </div>
  )
}

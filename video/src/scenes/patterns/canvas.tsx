import type { ReactNode } from "react"
import { useLayoutEffect, useRef } from "react"
import { Easing } from "remotion"

import { AgentTasks } from "@/components/showcase/agent-tasks"
import { Appearance } from "@/components/showcase/appearance"
import { ApprovalPrompt } from "@/components/showcase/approval-prompt"
import { Booking } from "@/components/showcase/booking"
import { ColorEditorCard } from "@/components/showcase/color-editor"
import { CookiePreferences } from "@/components/showcase/cookie-preferences"
import { CustomDomain } from "@/components/showcase/custom-domain"
import { DisplaySettings } from "@/components/showcase/display-settings"
import { PricingPlans } from "@/components/showcase/pricing-plans"
import { Storage } from "@/components/showcase/storage"
import { TeamName } from "@/components/showcase/team-name"
import { TwoFactor } from "@/components/showcase/two-factor"

import { lerp, progress } from "../../lib/motion"
import { CardStage, CENTERED, Newsletter } from "../compose/steps"
import { TILE_H, TILE_W } from "./tiles"

/* The centre tile: Compose's finished card at the heart of a canvas of real
   pattern cards. Compose collapsed its light preview surface onto the card;
   here the surface grows back out of it, past its old bounds, to a whole
   screen of patterns. */

const COL = 340
const GAP = 24
/** Room for the Compose card's column. */
const MID = 372

const cx = TILE_W / 2
const left1 = cx - MID / 2 - GAP - COL
const left2 = left1 - GAP - COL
const right1 = cx + MID / 2 + GAP
const right2 = right1 + COL + GAP

type Stack = { x: number; top: number; cards: ReactNode[] }

// Built once: the frame-driven wrappers re-render, the cards never do.
const SIDES: Stack[] = [
  {
    x: left2,
    top: -96,
    cards: [<ColorEditorCard key="a" />, <Appearance key="b" />],
  },
  {
    x: left1,
    top: 40,
    cards: [<TwoFactor key="a" />, <Booking key="b" />],
  },
  {
    x: right1,
    top: -40,
    cards: [<PricingPlans key="a" />, <CookiePreferences key="b" />],
  },
  {
    x: right2,
    top: 72,
    cards: [
      <AgentTasks key="a" />,
      <DisplaySettings key="b" />,
      <Storage key="c" />,
    ],
  },
]
const ABOVE = [<CustomDomain key="a" />, <TeamName key="b" />]
const BELOW = <ApprovalPrompt />
/** Sizes the gap in the centre column. */
const SPACER = <Newsletter />
/** Laid out exactly as Compose's <HandoffCard />: its stage, centred. */
const CARD = (
  <CardStage zoom={1}>
    <div style={CENTERED}>
      <Newsletter />
    </div>
  </CardStage>
)

/** Clears the card's edge by frame 4, lands soft. */
const GROW = Easing.bezier(0.3, 0, 0.15, 1)

/** How far the surface has grown out of the card (0 at the cut). */
export const growAt = (frame: number) => progress(frame, 0, 64, GROW)

const RADIUS = 22

export function Canvas({ frame }: { frame: number }) {
  const root = useRef<HTMLDivElement>(null)
  const surface = useRef<HTMLDivElement>(null)
  const t = growAt(frame)

  // The surface's edge starts tucked inside the card's own edge — where
  // Compose's surface vanished. Measured, since the card's size is the theme's.
  useLayoutEffect(() => {
    const el = surface.current
    const card = root.current?.querySelector<HTMLElement>("[data-compose-card]")
    if (!el || !card) return
    const w = card.offsetWidth
    const h = card.offsetHeight
    const r0 = parseFloat(getComputedStyle(card).borderTopLeftRadius) || 12
    const x = lerp((TILE_W - w) / 2 + 8, 0, t)
    const y = lerp((TILE_H - h) / 2 + 8, 0, t)
    el.style.clipPath =
      t >= 1 ? "" : `inset(${y}px ${x}px round ${lerp(r0, RADIUS, t)}px)`
    el.style.visibility = t <= 0 ? "hidden" : ""
  })

  return (
    <div ref={root} style={{ position: "absolute", inset: 0 }}>
      <div ref={surface} style={{ position: "absolute", inset: 0 }}>
        <div
          className="absolute inset-0 bg-bg"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1.2px), radial-gradient(ellipse 80% 75% at 50% 45%, transparent 55%, rgba(0,0,0,0.045) 100%)",
            backgroundSize: "22px 22px, 100% 100%",
            backgroundPosition: "center, center",
          }}
        />
        {SIDES.map((stack, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: stack.x,
              top: stack.top,
              width: COL,
              display: "flex",
              flexDirection: "column",
              gap: GAP,
            }}
          >
            {stack.cards}
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            left: cx - MID / 2,
            top: 0,
            width: MID,
            height: TILE_H,
            display: "grid",
            gridTemplateRows: "minmax(0, 1fr) auto minmax(0, 1fr)",
            rowGap: GAP,
          }}
        >
          <div
            style={{
              alignSelf: "end",
              display: "flex",
              flexDirection: "column",
              gap: GAP,
            }}
          >
            {ABOVE}
          </div>
          <div style={{ visibility: "hidden", justifySelf: "center" }}>
            {SPACER}
          </div>
          <div style={{ alignSelf: "start" }}>{BELOW}</div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {CARD}
      </div>
    </div>
  )
}

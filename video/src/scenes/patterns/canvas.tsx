import type { ReactNode } from "react"
import { useLayoutEffect, useRef } from "react"

import { AccountMenu } from "@/components/showcase/account-menu"
import { Appearance } from "@/components/showcase/appearance"
import { ApprovalPrompt } from "@/components/showcase/approval-prompt"
import { Booking } from "@/components/showcase/booking"
import { CookiePreferences } from "@/components/showcase/cookie-preferences"
import { Filters } from "@/components/showcase/filters"
import { InviteMembers } from "@/components/showcase/invite-members"
import { PricingPlans } from "@/components/showcase/pricing-plans"
import { TeamName } from "@/components/showcase/team-name"
import { TwoFactor } from "@/components/showcase/two-factor"
import { UploadAvatar } from "@/components/showcase/upload-avatar"

import { ease, lerp, progress } from "../../lib/motion"
import { Newsletter } from "./newsletter"
import { TILE_H, TILE_W } from "./tiles"

/* The center tile: the Compose card at the heart of a canvas of real pattern
   cards (the landing showcase). Compose collapsed its light preview surface
   onto the card; here the surface grows back out of it — past its old bounds,
   to a whole screen of patterns. */

const COL = 340
const GAP = 24
const CARD_W = 352

const cx = TILE_W / 2
const left1 = cx - CARD_W / 2 - GAP - COL
const left2 = left1 - GAP - COL
const right1 = cx + CARD_W / 2 + GAP
const right2 = right1 + COL + GAP

type Stack = { x: number; top: number; cards: ReactNode[] }

// Elements built once: the frame-driven wrappers re-render, the cards never do.
const SIDES: Stack[] = [
  {
    x: left2,
    top: -150,
    cards: [<Filters key="Filters" />, <AccountMenu key="AccountMenu" />],
  },
  {
    x: left1,
    top: 28,
    cards: [
      <TwoFactor key="TwoFactor" />,
      <InviteMembers key="InviteMembers" />,
    ],
  },
  {
    x: right1,
    top: -70,
    cards: [<PricingPlans key="PricingPlans" />, <Booking key="Booking" />],
  },
  {
    x: right2,
    top: 64,
    cards: [
      <Appearance key="Appearance" />,
      <CookiePreferences key="CookiePreferences" />,
    ],
  },
]
const ABOVE = <TeamName />
const BELOW = [
  <ApprovalPrompt key="ApprovalPrompt" />,
  <UploadAvatar key="UploadAvatar" />,
]
const CARD = <Newsletter />

/** How far the surface has grown out of the card (0 at the cut, 1 by ~frame 52). */
export const expandAt = (frame: number) => progress(frame, 2, 50, ease.camera)

export function Canvas({ frame }: { frame: number }) {
  const root = useRef<HTMLDivElement>(null)
  const surface = useRef<HTMLDivElement>(null)
  const edge = useRef<HTMLDivElement>(null)
  const t = expandAt(frame)

  // The surface's edge starts on the card's own edge; measured, since the
  // card's size comes from the theme.
  useLayoutEffect(() => {
    const el = surface.current
    const card = root.current?.querySelector<HTMLElement>(
      "[data-patterns-card]",
    )
    if (!el || !card) return
    const w = card.offsetWidth
    const h = card.offsetHeight
    const r0 = parseFloat(getComputedStyle(card).borderTopLeftRadius) || 12
    // Starts tucked just inside the card, where Compose's surface vanished.
    const x = lerp((TILE_W - w) / 2 + 8, 0, t)
    const y = lerp((TILE_H - h) / 2 + 8, 0, t)
    const clip = `inset(${y}px ${x}px round ${lerp(r0, 22, t)}px)`
    el.style.clipPath = t >= 1 ? "" : clip
    if (edge.current) {
      edge.current.style.inset = `${y}px ${x}px`
      edge.current.style.borderRadius = `${lerp(r0, 22, t)}px`
    }
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
            left: cx - CARD_W / 2,
            top: 0,
            width: CARD_W,
            height: TILE_H,
            display: "grid",
            gridTemplateRows: "minmax(0, 1fr) auto minmax(0, 1fr)",
            justifyItems: "center",
            rowGap: GAP,
          }}
        >
          <div style={{ alignSelf: "end", width: CARD_W }}>{ABOVE}</div>
          <div style={{ visibility: "hidden" }}>{CARD}</div>
          <div
            style={{
              alignSelf: "start",
              width: CARD_W,
              display: "flex",
              flexDirection: "column",
              gap: GAP,
            }}
          >
            {BELOW}
          </div>
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
      <div
        ref={edge}
        style={{
          position: "absolute",
          pointerEvents: "none",
          boxShadow: `inset 0 0 0 1.5px rgba(0,0,0,${0.08 * t})`,
        }}
      />
    </div>
  )
}

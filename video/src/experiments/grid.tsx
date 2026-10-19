import { useLayoutEffect, useMemo, useRef, useState } from "react"
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  getRemotionEnvironment,
  useCurrentFrame,
} from "remotion"

import { AccountMenu } from "@/components/showcase/account-menu"
import { AgentTasks } from "@/components/showcase/agent-tasks"
import { AiPrompt } from "@/components/showcase/ai-prompt"
import { Appearance } from "@/components/showcase/appearance"
import { ApprovalPrompt } from "@/components/showcase/approval-prompt"
import { Booking } from "@/components/showcase/booking"
import { ColorEditorCard } from "@/components/showcase/color-editor"
import { CommandMenu } from "@/components/showcase/command-menu"
import { ComputerUse } from "@/components/showcase/computer-use"
import { ConnectedTools } from "@/components/showcase/connected-tools"
import { Controls } from "@/components/showcase/controls"
import { CookiePreferences } from "@/components/showcase/cookie-preferences"
import { CustomDomain } from "@/components/showcase/custom-domain"
import { DisplaySettings } from "@/components/showcase/display-settings"
import { EmptyState } from "@/components/showcase/empty-state"
import { Faq } from "@/components/showcase/faq"
import { Filters } from "@/components/showcase/filters"
import { InviteMembers } from "@/components/showcase/invite-members"
import { LoginForm } from "@/components/showcase/login-form"
import { Metrics } from "@/components/showcase/metrics"
import { Notifications } from "@/components/showcase/notifications"
import { Payment } from "@/components/showcase/payment"
import { PricingPlans } from "@/components/showcase/pricing-plans"
import { Storage } from "@/components/showcase/storage"
import { SupportChat } from "@/components/showcase/support-chat"
import { TeamName } from "@/components/showcase/team-name"
import { TwoFactor } from "@/components/showcase/two-factor"
import { UploadAvatar } from "@/components/showcase/upload-avatar"
import { UsageCredits } from "@/components/showcase/usage-credits"

import { ease, lerp, progress } from "../lib/motion"
import { preset, Theme, WarmIcons } from "../lib/theme"
import type { Look, Rgba } from "./steps"
import {
  cardWidth,
  measureCard,
  noise,
  ORDER,
  paintCard,
  paintPage,
  presetFaces,
  rgbaOf,
  STEPS_SIZE,
  swapAt,
} from "./steps"

/* The Controls card morphing through every preset (the Steps film), then the
   camera pulls back and the rest of the "cards" block assembles around it:
   every card, drawn whole like Controls, flies in from beyond it to its
   place in the studio canvas, nearest first, all keeping up with the look. */

const LOOKS = [...new Set(ORDER)]

/** The pull-back: from the Controls card at true size to the whole canvas. */
const ZOOM_AT = 210
const ZOOM_FOR = 180
/** Frame margin around the canvas once pulled back. */
const EDGE = 28
/** Cards start arriving as the pull-back starts, nearest first. */
const ARRIVE_AT = ZOOM_AT + 10
const ARRIVE_SPREAD = 110
const ARRIVE_FOR = 60

// The studio's "cards" canvas, its columns as wide as the Controls card in
// the Steps film (per density) (www CardsCanvas), laid out flat: no
// content-visibility, which would size the off-screen probes' cards at a
// guess.
const CARDS = {
  accountMenu: <AccountMenu />,
  agentTasks: <AgentTasks />,
  aiPrompt: <AiPrompt />,
  appearance: <Appearance />,
  approvalPrompt: <ApprovalPrompt />,
  booking: <Booking />,
  colorEditor: <ColorEditorCard />,
  commandMenu: <CommandMenu />,
  computerUse: <ComputerUse />,
  connectedTools: <ConnectedTools />,
  controls: <Controls />,
  cookiePreferences: <CookiePreferences />,
  customDomain: <CustomDomain />,
  displaySettings: <DisplaySettings />,
  emptyState: <EmptyState />,
  faq: <Faq />,
  filters: <Filters />,
  inviteMembers: <InviteMembers />,
  loginForm: <LoginForm className="max-w-none" />,
  metrics: <Metrics />,
  notifications: <Notifications className="h-100" />,
  payment: <Payment />,
  pricingPlans: <PricingPlans />,
  storage: <Storage />,
  supportChat: <SupportChat />,
  teamName: <TeamName />,
  twoFactor: <TwoFactor />,
  uploadAvatar: <UploadAvatar />,
  usageCredits: <UsageCredits />,
}
type CardKey = keyof typeof CARDS

const GAP = 24

function Column({ cards }: { cards: CardKey[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
      {cards.map((key) => (
        <div key={key} data-grid-card={key}>
          {CARDS[key]}
        </div>
      ))}
    </div>
  )
}

function Canvas({ col }: { col: number }) {
  return (
    <div
      style={{
        display: "grid",
        width: col * 6 + GAP * 7,
        gridTemplateColumns: `repeat(6, ${col}px)`,
        alignItems: "start",
        gap: GAP,
        padding: GAP,
      }}
    >
      <Column
        cards={[
          "controls",
          "twoFactor",
          "filters",
          "accountMenu",
          "customDomain",
        ]}
      />
      <Column
        cards={["commandMenu", "payment", "storage", "loginForm", "emptyState"]}
      />
      <div
        style={{
          gridColumn: "span 2",
          display: "flex",
          flexDirection: "column",
          gap: GAP,
        }}
      >
        <Column cards={["aiPrompt"]} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "start",
            gap: GAP,
          }}
        >
          <Column
            cards={["metrics", "booking", "agentTasks", "connectedTools"]}
          />
          <Column
            cards={[
              "uploadAvatar",
              "pricingPlans",
              "supportChat",
              "approvalPrompt",
            ]}
          />
        </div>
      </div>
      <Column
        cards={[
          "computerUse",
          "notifications",
          "faq",
          "displaySettings",
          "usageCredits",
        ]}
      />
      <Column
        cards={[
          "inviteMembers",
          "appearance",
          "colorEditor",
          "cookiePreferences",
          "teamName",
        ]}
      />
    </div>
  )
}

interface Placed {
  x: number
  y: number
  look: Look
}

interface Layout {
  page: Rgba
  width: number
  cards: Map<string, Placed>
}

async function measure(probe: HTMLElement): Promise<Layout | null> {
  const grid = probe.firstElementChild as HTMLElement | null
  if (!grid?.offsetHeight) return null
  const page = rgbaOf(getComputedStyle(probe).backgroundColor)
  const origin = grid.getBoundingClientRect()
  const cards = new Map<string, Placed>()
  for (const slot of probe.querySelectorAll<HTMLElement>("[data-grid-card]")) {
    // Each card's root is its surface (the AI prompt is a plain div).
    const card = slot.firstElementChild as HTMLElement | null
    if (!card) continue
    const r = card.getBoundingClientRect()
    cards.set(slot.dataset.gridCard!, {
      x: r.x - origin.x,
      y: r.y - origin.y,
      look: await measureCard(card, page),
    })
  }
  return { page, width: origin.width, cards }
}

const centerOf = (a: Placed, b: Placed, t: number) => ({
  x: lerp(a.x + a.look.card.width / 2, b.x + b.look.card.width / 2, t),
  y: lerp(a.y + a.look.card.height / 2, b.y + b.look.card.height / 2, t),
})

function draw(
  ctx: CanvasRenderingContext2D,
  a: Layout,
  b: Layout,
  t: number,
  frame: number,
  dpr: number,
) {
  const { width: W, height: H } = ctx.canvas
  const rand = getRemotionEnvironment().isRendering ? noise(frame + 1) : null
  paintPage(ctx, a.page, b.page, t, rand)

  // The camera starts on Controls at true size and ends with the canvas
  // filling the frame width (it widens with density), top cards just under
  // the edge.
  const home = centerOf(a.cards.get("controls")!, b.cards.get("controls")!, t)
  const p = progress(frame, ZOOM_AT, ZOOM_FOR, ease.camera)
  const width = lerp(a.width, b.width, t)
  const fit = (STEPS_SIZE.width - 2 * EDGE) / (width - 2 * GAP)
  const zoom = Math.exp(lerp(0, Math.log(fit), p))
  const wide = { x: width / 2, y: GAP + (STEPS_SIZE.height / 2 - EDGE) / fit }
  const cam = { x: lerp(home.x, wide.x, p), y: lerp(home.y, wide.y, p) }
  const scale = dpr * zoom
  const ox = W / 2 - cam.x * scale
  const oy = H / 2 - cam.y * scale

  for (const [key, pa] of a.cards) {
    const pb = b.cards.get(key)
    if (!pb) continue
    let [dx, dy, alpha] = [0, 0, 1]
    if (key !== "controls") {
      // Each card comes in from further out along the line from Controls,
      // the nearest first.
      const c = centerOf(pa, pb, t)
      const [vx, vy] = [c.x - home.x, c.y - home.y]
      const start =
        ARRIVE_AT + Math.min(Math.hypot(vx, vy) / 2000, 1) * ARRIVE_SPREAD
      const q = progress(frame, start, ARRIVE_FOR, ease.out)
      if (q <= 0) continue
      ;[dx, dy, alpha] = [vx * 0.3 * (1 - q), vy * 0.3 * (1 - q), q]
    }
    const x = ox + (lerp(pa.x, pb.x, t) + dx) * scale
    const y = oy + (lerp(pa.y, pb.y, t) + dy) * scale
    const w = lerp(pa.look.card.width, pb.look.card.width, t) * scale
    const h = lerp(pa.look.card.height, pb.look.card.height, t) * scale
    // Off-frame cards cost a whole card of text each: skip them.
    if (x > W || y > H || x + w < 0 || y + h < 0) continue
    ctx.globalAlpha = alpha
    paintCard(ctx, pa.look, pb.look, t, x, y, scale, rand)
  }
  ctx.globalAlpha = 1
}

const layouts = new Map<string, Layout>()

export function GridStep() {
  const frame = useCurrentFrame()
  const { from, to, t } = swapAt(frame)
  const canvas = useRef<HTMLCanvasElement>(null)
  const probes = useRef<Record<string, HTMLDivElement | null>>({})
  const dpr = window.devicePixelRatio
  const [measured, setMeasured] = useState(layouts.size === LOOKS.length)

  useLayoutEffect(() => {
    const handle = delayRender("grid step")
    let raf = 0
    let tries = 0
    let alive = true
    const attempt = async () => {
      // Every look up front (a second or so each), then the probes go:
      // sixteen canvases of cards in the page would slow every frame.
      for (const id of LOOKS) {
        const probe = probes.current[id]
        const layout = !layouts.has(id) && probe && (await measure(probe))
        if (layout) layouts.set(id, layout)
      }
      const [a, b] = [layouts.get(from), layouts.get(to)]
      if (!alive) return
      if (layouts.size === LOOKS.length) setMeasured(true)
      if (a && b && canvas.current) {
        draw(canvas.current.getContext("2d")!, a, b, t, frame, dpr)
        continueRender(handle)
      } else if (tries++ < 600)
        raf = requestAnimationFrame(() => void attempt())
      else continueRender(handle)
    }
    void presetFaces().then(() => {
      raf = requestAnimationFrame(() => void attempt())
    })
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      continueRender(handle)
    }
  }, [from, to, t, frame])

  return (
    <AbsoluteFill>
      <WarmIcons />
      {useMemo(
        () =>
          !measured &&
          LOOKS.map((id) => (
            <Theme key={id} state={preset(id)}>
              <div
                ref={(el) => {
                  probes.current[id] = el
                }}
                className="bg-bg"
                style={{ position: "absolute", opacity: 0 }}
              >
                <Canvas col={cardWidth(id)} />
              </div>
            </Theme>
          )),
        [measured],
      )}
      <canvas
        ref={canvas}
        width={Math.round(STEPS_SIZE.width * dpr)}
        height={Math.round(STEPS_SIZE.height * dpr)}
        style={{ width: "100%", height: "100%" }}
      />
    </AbsoluteFill>
  )
}

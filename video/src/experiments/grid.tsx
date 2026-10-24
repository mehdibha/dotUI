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
import { CHAPTERS } from "@/modules/studio/chapters"
import { PanelPage } from "@/modules/studio/page"

import { ease, lerp, progress } from "../lib/motion"
import { panelSystem, studioAt } from "../lib/studio"
import { preset, Theme, WarmIcons } from "../lib/theme"
import { Outro, OUTRO_FRAMES } from "./outro"
import type { Look, Rgba } from "./steps"
import {
  cardWidth,
  css,
  measureCard,
  noise,
  ORDER,
  paintCard,
  paintPage,
  presetFaces,
  rgbaOf,
  STEPS_SIZE,
} from "./steps"

/* The Controls card morphing through the presets, then the studio around
   it. At 7 s, in one move, the camera pulls back from Controls into the
   studio's "cards" canvas (Controls to its top left) while the other cards
   slide in from the right and bottom, the frame closes in to the preview's
   rounded border, and the panel slides in from the left beside it. The
   cards arrive slowly, one after another, the last as Controls lands. The
   presets run on at the same pace throughout; then a pause and the end
   screens. */

const LOOKS = [...new Set(ORDER)]

/** The move from Controls at true size into the studio. */
const PULL_AT = 420
const PULL_FOR = 220
/** Cards arrive through the move, nearest Controls first, the farthest in
    the preview (this far from Controls) as Controls lands. */
const ARRIVE_AT = PULL_AT + 15
const ARRIVE_FOR = 100
const ARRIVE_SPREAD = PULL_AT + PULL_FOR - ARRIVE_FOR - ARRIVE_AT
const ARRIVE_REACH = 1300

/** /studio in a laptop browser window (1512 px wide, as on a MacBook),
    cropped to the frame's 16:9. */
const SCREEN = { width: 1512, height: (1512 * 9) / 16 }
const ZOOM_TO = STEPS_SIZE.width / SCREEN.width
const STUDIO = {
  panel: { x: 24, y: 24, width: 256, height: SCREEN.height - 48 },
  preview: {
    x: 304,
    y: 24,
    width: SCREEN.width - 304 - 24,
    height: SCREEN.height - 48,
  },
  radius: 12,
}

/** Every swap of look: the frame it's centered on and how long it morphs. */
const SWAPS = (() => {
  const swaps: { at: number; morph: number }[] = []
  // One look a second, through the studio coming in, every preset once and
  // back to the first.
  for (let k = 1; k <= LOOKS.length; k++) swaps.push({ at: k * 60, morph: 44 })
  return swaps
})()
const lookOf = (i: number) => LOOKS[i % LOOKS.length]!
const STOP = SWAPS.at(-1)!.at + SWAPS.at(-1)!.morph / 2
/** The pause on the last look, then the end screens. */
const OUTRO_AT = STOP + 45
export const GRID_FRAMES = OUTRO_AT + OUTRO_FRAMES

/** The look pair and eased progress at `frame`. */
function lookAt(frame: number) {
  const k = SWAPS.findIndex(
    ({ at, morph }) => frame >= at - morph / 2 && frame < at + morph / 2,
  )
  if (k >= 0) {
    const { at, morph } = SWAPS[k]!
    return {
      from: lookOf(k),
      to: lookOf(k + 1),
      t: progress(frame, at - morph / 2, morph, ease.camera),
    }
  }
  const settled = SWAPS.filter(({ at, morph }) => frame >= at + morph / 2)
  return { from: lookOf(settled.length), to: lookOf(settled.length), t: 0 }
}

// Every showcase card, laid out flat: no content-visibility, which would
// size the off-screen probes' cards at a guess.
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

/** The studio's "cards" canvas (www CardsCanvas), its columns as wide as
    the Controls card in the Steps film, per density. */
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
  /** Card corners from the canvas' corner. */
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
  return { page, cards }
}

const centerOf = (a: Placed, b: Placed, t: number) => ({
  x: lerp(a.x + a.look.card.width / 2, b.x + b.look.card.width / 2, t),
  y: lerp(a.y + a.look.card.height / 2, b.y + b.look.card.height / 2, t),
})

type Rect = { x: number; y: number; width: number; height: number }
const scaleRect = (r: Rect, s: number) => ({
  x: r.x * s,
  y: r.y * s,
  width: r.width * s,
  height: r.height * s,
})

/** How far into the move the panel's gap opens: the preview's left edge
    has come in by the gap. Its other edges are home by then, so the panel
    meets a preview of its own height. */
const GAP_OPENS = (() => {
  const gap = STUDIO.preview.x - STUDIO.panel.x - STUDIO.panel.width
  let u = 0
  while (ease.camera(u) < gap / STUDIO.preview.x) u += 0.001
  return u
})()

/** The move at `frame`: its progress, the preview's edges' progress, the
    preview's rect in the frame (frame px) and the canvas' scale inside it. */
function previewAt(frame: number) {
  const p = progress(frame, PULL_AT, PULL_FOR, ease.camera)
  const edges = progress(frame, PULL_AT, PULL_FOR * GAP_OPENS, ease.camera)
  const to = scaleRect(STUDIO.preview, ZOOM_TO)
  const top = lerp(0, to.y, edges)
  const right = lerp(STEPS_SIZE.width, to.x + to.width, edges)
  const left = lerp(0, to.x, p)
  return {
    p,
    edges,
    view: {
      x: left,
      y: top,
      width: right - left,
      height: lerp(STEPS_SIZE.height, to.height, edges),
    },
    radius: lerp(0, STUDIO.radius * ZOOM_TO, edges),
    zoom: Math.exp(lerp(0, Math.log(ZOOM_TO), p)),
  }
}

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

  // First Controls at true size on the frame's center; the move brings the
  // canvas' corner to the preview's.
  const { p, edges, view, radius, zoom } = previewAt(frame)
  const home = centerOf(a.cards.get("controls")!, b.cards.get("controls")!, t)
  const center = { x: STEPS_SIZE.width / 2, y: STEPS_SIZE.height / 2 }
  const end = previewAt(PULL_AT + PULL_FOR)
  const corner = {
    x: (center.x - end.view.x) / end.zoom,
    y: (center.y - end.view.y) / end.zoom,
  }
  const focus = { x: lerp(home.x, corner.x, p), y: lerp(home.y, corner.y, p) }
  const scale = dpr * zoom
  const ox = center.x * dpr - focus.x * scale
  const oy = center.y * dpr - focus.y * scale

  // Cards right of or below the preview are hidden by the chrome: skip.
  const right = (view.x + view.width) * dpr
  const bottom = (view.y + view.height) * dpr
  for (const [key, pa] of a.cards) {
    const pb = b.cards.get(key)
    if (!pb) continue
    let x = ox + lerp(pa.x, pb.x, t) * scale
    let y = oy + lerp(pa.y, pb.y, t) * scale
    if (key !== "controls") {
      // Each card slides in from the frame's right edge, or its bottom one
      // when it sits more below Controls than beside it; the nearest first.
      const c = centerOf(pa, pb, t)
      const [vx, vy] = [c.x - home.x, c.y - home.y]
      const start =
        ARRIVE_AT +
        Math.min(Math.hypot(vx, vy) / ARRIVE_REACH, 1) * ARRIVE_SPREAD
      const q = progress(frame, start, ARRIVE_FOR, ease.soft)
      if (q <= 0) continue
      if (vy > vx) y = lerp(Math.max(y, Math.min(H, bottom)), y, q)
      else x = lerp(Math.max(x, Math.min(W, right)), x, q)
    }
    const w = lerp(pa.look.card.width, pb.look.card.width, t) * scale
    const h = lerp(pa.look.card.height, pb.look.card.height, t) * scale
    if (x > Math.min(W, right) || y > Math.min(H, bottom) || x + w < 0) continue
    if (y + h < 0) continue
    paintCard(ctx, pa.look, pb.look, t, x, y, scale, rand)
  }

  // The site's chrome around the preview, with its hairline.
  if (edges > 0 && chrome) {
    const r = {
      x: view.x * dpr,
      y: view.y * dpr,
      width: view.width * dpr,
      height: view.height * dpr,
    }
    ctx.beginPath()
    ctx.rect(0, 0, W, H)
    ctx.roundRect(r.x, r.y, r.width, r.height, radius * dpr)
    ctx.fillStyle = css(chrome.fill)
    ctx.fill("evenodd")
    ctx.beginPath()
    ctx.roundRect(r.x, r.y, r.width, r.height, radius * dpr)
    ctx.strokeStyle = css(chrome.border, chrome.border[3] * edges)
    ctx.lineWidth = ZOOM_TO * dpr
    ctx.stroke()
  }
}

/** The site's dark chrome around the preview: its background and hairline. */
let chrome: { fill: Rgba; border: Rgba } | null = null

const layouts = new Map<string, Layout>()

export function GridStep() {
  const frame = useCurrentFrame()
  const outro = frame >= OUTRO_AT
  // The canvas holds its last look through the outro.
  const { from, to, t } = lookAt(outro ? OUTRO_AT - 1 : frame)
  const canvas = useRef<HTMLCanvasElement>(null)
  const probes = useRef<Record<string, HTMLDivElement | null>>({})
  const chromeProbe = useRef<HTMLDivElement>(null)
  const dpr = window.devicePixelRatio
  const [measured, setMeasured] = useState(layouts.size === LOOKS.length)

  useLayoutEffect(() => {
    const handle = delayRender("grid step")
    if (outro) {
      continueRender(handle)
      return
    }
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
      if (!chrome && chromeProbe.current) {
        const cs = getComputedStyle(chromeProbe.current)
        chrome = {
          fill: rgbaOf(cs.backgroundColor),
          border: rgbaOf(cs.borderTopColor),
        }
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
  }, [from, to, t, frame, outro])

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
      <Theme mode="dark">
        <div
          ref={chromeProbe}
          className="border border-border/45 bg-bg"
          style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
        />
      </Theme>
      <canvas
        ref={canvas}
        width={Math.round(STEPS_SIZE.width * dpr)}
        height={Math.round(STEPS_SIZE.height * dpr)}
        style={{ width: "100%", height: "100%" }}
      />
      {!outro && <Panel frame={frame} look={t < 0.5 ? from : to} />}
      {outro && <Outro frame={frame - OUTRO_AT} />}
    </AbsoluteFill>
  )
}

/** The real studio panel in the site's dark chrome, at its place on screen,
    its right edge pushing the preview's left; it shows the look on screen. */
function Panel({ frame, look }: { frame: number; look: string }) {
  const { p, view } = previewAt(frame)
  if (p <= 0) return null
  const { panel } = STUDIO
  const state = preset(look)
  // The panel keeps the studio's gap to the preview's edge.
  const shift = view.x / ZOOM_TO - STUDIO.preview.x
  return (
    <div
      style={{
        position: "absolute",
        width: SCREEN.width,
        height: SCREEN.height,
        transform: `scale(${ZOOM_TO})`,
        transformOrigin: "0 0",
      }}
    >
      <Theme mode="dark">
        <div
          className="flex flex-col text-fg"
          style={{
            position: "absolute",
            left: panel.x,
            top: panel.y,
            width: panel.width,
            height: panel.height,
            transform: `translateX(${shift}px)`,
          }}
        >
          <PanelPage
            chapters={CHAPTERS}
            studio={studioAt(state)}
            system={panelSystem("My design system", state.brand ?? "#888")}
          />
        </div>
      </Theme>
    </div>
  )
}

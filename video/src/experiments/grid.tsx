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
import { PanelPage } from "@/modules/studio/page"
import { CHAPTERS } from "@/modules/studio/state"

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
   it. At 7 s the camera pulls back from Controls into the studio's "cards"
   canvas (Controls at its top left) while the other cards arrive. At 11 s,
   on a held look, it eases out a little further to show the preview's frame;
   then the panel slides in from the left, pushing the preview narrower. The
   presets run at a varying tempo: steady, slow through the studio reveal,
   then faster and faster until a hard stop, a pause, and the end screens. */

const LOOKS = [...new Set(ORDER)]

/** The pull-back from Controls at true size into the preview. */
const PULL_AT = 420
const PULL_FOR = 220
/** Cards arrive as the pull-back starts, nearest Controls first. */
const ARRIVE_AT = PULL_AT + 10
const ARRIVE_SPREAD = 110
const ARRIVE_FOR = 60
/** The preview's frame comes into view. */
const REVEAL_AT = 660
const REVEAL_FOR = 55
/** The panel pushes in, slow and linear. */
const PUSH_AT = REVEAL_AT + REVEAL_FOR
const PUSH_FOR = 140

/** /studio at 1920×1080: the preview alone (padded), then the panel and the
    preview beside it, drawn at the frame's 1200/1920. */
const ZOOM_TO = STEPS_SIZE.width / 1920
const STUDIO = {
  alone: { x: 24, y: 24, width: 1872, height: 1032 },
  panel: { x: 24, y: 24, width: 256, height: 1032 },
  preview: { x: 304, y: 24, width: 1592, height: 1032 },
  radius: 12,
}
/** Before the reveal, the preview overfills the frame by this much. */
const BLEED = 10
const ZOOM_IN = (STEPS_SIZE.height + 2 * BLEED) / STUDIO.alone.height

/** Every swap of look: the frame it's centered on and how long it morphs. */
const SWAPS = (() => {
  const swaps: { at: number; morph: number }[] = []
  // Steady, one look a second, Controls alone.
  for (let at = 60; at <= 420; at += 60) swaps.push({ at, morph: 44 })
  // Slower through the pull-back; none during the reveal; one, slower
  // still, as the panel pushes in.
  swaps.push({ at: 515, morph: 70 }, { at: 615, morph: 70 })
  swaps.push({ at: 785, morph: 90 })
  // Then faster and faster, to a hard stop back on the first look.
  let at = 870
  for (const gap of [
    54, 46, 39, 33, 28, 24, 20, 17, 15, 13, 11, 10, 9, 8, 8, 8, 8, 8, 8, 8, 8,
  ]) {
    swaps.push({ at, morph: Math.min(44, Math.round(gap * 0.8)) })
    at += gap
  }
  swaps.push({ at, morph: 6 })
  return swaps
})()
const lookOf = (i: number) => LOOKS[i % LOOKS.length]!
const STOP = SWAPS.at(-1)!.at + 3
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
const lerpRect = (a: Rect, b: Rect, t: number) => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  width: lerp(a.width, b.width, t),
  height: lerp(a.height, b.height, t),
})
const scaleRect = (r: Rect, s: number) => ({
  x: r.x * s,
  y: r.y * s,
  width: r.width * s,
  height: r.height * s,
})

/** The preview's rect in the frame (frame px) at `frame`, and the canvas'
    scale inside it. */
function previewAt(frame: number) {
  const reveal = progress(frame, REVEAL_AT, REVEAL_FOR, ease.camera)
  const push = progress(frame, PUSH_AT, PUSH_FOR, ease.linear)
  const bled = {
    x: -BLEED,
    y: -BLEED,
    width: STUDIO.alone.width * ZOOM_IN,
    height: STUDIO.alone.height * ZOOM_IN,
  }
  const alone = scaleRect(STUDIO.alone, ZOOM_TO)
  const beside = scaleRect(STUDIO.preview, ZOOM_TO)
  return {
    reveal,
    push,
    view: lerpRect(lerpRect(bled, alone, reveal), beside, push),
    zoom: Math.exp(lerp(Math.log(ZOOM_IN), Math.log(ZOOM_TO), reveal)),
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

  // First Controls at true size on the frame's center; the pull-back brings
  // the canvas' corner to the preview's, the preview just past the frame.
  const { reveal, view, zoom } = previewAt(frame)
  const home = centerOf(a.cards.get("controls")!, b.cards.get("controls")!, t)
  const pull = progress(frame, PULL_AT, PULL_FOR, ease.camera)
  const z = pull < 1 ? Math.exp(lerp(0, Math.log(zoom), pull)) : zoom
  const center = { x: STEPS_SIZE.width / 2, y: STEPS_SIZE.height / 2 }
  const corner = {
    x: (center.x - view.x) / zoom,
    y: (center.y - view.y) / zoom,
  }
  const focus = {
    x: lerp(home.x, corner.x, pull),
    y: lerp(home.y, corner.y, pull),
  }
  const scale = dpr * z
  const ox = center.x * dpr - focus.x * scale
  const oy = center.y * dpr - focus.y * scale

  // Cards right of or below the preview are hidden by the chrome: skip.
  const right = (view.x + view.width) * dpr
  const bottom = (view.y + view.height) * dpr
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
    if (x > Math.min(W, right) || y > Math.min(H, bottom) || x + w < 0) continue
    if (y + h < 0) continue
    ctx.globalAlpha = alpha
    paintCard(ctx, pa.look, pb.look, t, x, y, scale, rand)
  }
  ctx.globalAlpha = 1

  // The site's chrome around the preview, with its hairline.
  if (reveal > 0 && chrome) {
    const r = {
      x: view.x * dpr,
      y: view.y * dpr,
      width: view.width * dpr,
      height: view.height * dpr,
    }
    const radius = STUDIO.radius * ZOOM_TO * dpr
    ctx.beginPath()
    ctx.rect(0, 0, W, H)
    ctx.roundRect(r.x, r.y, r.width, r.height, radius)
    ctx.fillStyle = css(chrome.fill)
    ctx.fill("evenodd")
    ctx.beginPath()
    ctx.roundRect(r.x, r.y, r.width, r.height, radius)
    ctx.strokeStyle = css(chrome.border, chrome.border[3] * reveal)
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

/** The real studio panel in the site's dark chrome, at its 1920×1080 place,
    its right edge pushing the preview's left; it shows the look on screen. */
function Panel({ frame, look }: { frame: number; look: string }) {
  const { push, view } = previewAt(frame)
  if (push <= 0) return null
  const { panel } = STUDIO
  const state = preset(look)
  // The panel keeps the studio's gap to the preview's edge.
  const shift = view.x / ZOOM_TO - STUDIO.preview.x
  return (
    <div
      style={{
        position: "absolute",
        width: 1920,
        height: 1080,
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

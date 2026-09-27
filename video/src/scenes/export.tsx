import { AbsoluteFill, useCurrentFrame } from "remotion"

import { ArrowUpRightIcon, FileCodeIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"

import { Cursor } from "../lib/cursor"
import {
  clamp01,
  ease,
  keys,
  lerp,
  progress,
  random,
  springAt,
} from "../lib/motion"
import { Camera, Stage } from "../lib/stage"
import { Theme } from "../lib/theme"
import { BlurWords, HEADLINE, Headline } from "../lib/type"
import { C, EDITOR, FILES, FLIGHT, FLY_AT, SANS, T, TERM } from "./export/data"
import { Editor } from "./export/editor"
import type { Pose } from "./export/layout"
import {
  editorPose,
  flight,
  poseTransform,
  project,
  terminalFileAnchor,
  terminalPose,
  treeFileAnchor,
  treeRows,
} from "./export/layout"
import { Terminal } from "./export/terminal"

/* Export — the CLI installs, the files fly into the app, the editor opens the
   real shipped button.tsx. */

export function Export() {
  const frame = useCurrentFrame()
  const term = terminalPose(frame)
  const ed = editorPose(frame)
  // In on the gap while the files fly, back out for the line.
  const push = keys(
    frame,
    [
      [150, 0],
      [202, 1],
      [236, 1],
      [294, 0],
    ],
    ease.camera,
  )
  const camera = {
    x: push * 290,
    y: push * -10,
    rotateX: keys(
      frame,
      [
        [0, 9],
        [150, 5],
        [359, 2.5],
      ],
      ease.soft,
    ),
    rotateY: keys(
      frame,
      [
        [0, -5],
        [359, 4],
      ],
      ease.linear,
    ),
    scale:
      keys(
        frame,
        [
          [0, 0.95],
          [359, 1.02],
        ],
        ease.linear,
      ) * lerp(1, 1.14, push),
  }

  return (
    <Stage
      gridOffset={[
        -frame * 0.4 - camera.rotateY * 10 + camera.x * 0.3,
        -frame * 0.12,
      ]}
    >
      <Camera {...camera}>
        <Glow frame={frame} term={term} ed={ed} />
        {ed.opacity > 0 ? (
          <Panel pose={ed} w={EDITOR.w} h={EDITOR.h}>
            <Editor frame={frame} />
            <Cursor
              path={[
                [204, 700, 720],
                [236, 150, cursorRowY(frame)],
                [250, 150, cursorRowY(frame)],
                [284, 196, cursorRowY(frame) + 70],
              ]}
              clicks={[T.open]}
              from={204}
              to={276}
            />
          </Panel>
        ) : null}
        {term.opacity > 0 ? (
          <Panel pose={term} w={TERM.w} h={TERM.h}>
            <Terminal frame={frame} />
          </Panel>
        ) : null}
      </Camera>
      {/* One layer per file: over both windows, never slicing each other. */}
      {[...FILES].reverse().map((name) => (
        <Camera key={name} {...camera}>
          <Chip
            frame={frame}
            i={FILES.indexOf(name)}
            name={name}
            term={term}
            ed={ed}
          />
        </Camera>
      ))}

      <Headline
        lines={[{ text: "Install with the shadcn CLI." }]}
        start={16}
        end={T.enter + 50}
        size={72}
        y={-300}
      />

      <Hero frame={frame} />
    </Stage>
  )
}

function cursorRowY(frame: number) {
  const row = treeRows(frame).find((r) => r.key === "button.tsx")!
  return row.top + row.height / 2
}

function Panel({
  pose,
  w,
  h,
  children,
}: {
  pose: Pose
  w: number
  h: number
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: pose.x - w / 2,
        top: pose.y - h / 2,
        width: w,
        height: h,
        transform: poseTransform(pose),
        opacity: pose.opacity,
        filter: pose.blur > 0.1 ? `blur(${pose.blur}px)` : undefined,
      }}
    >
      {children}
    </div>
  )
}

/* A card pops off the output line, arcs toward the lens from the terminal's
   plane to the editor's, and dissolves into its tree row. */
function Chip({
  frame,
  i,
  name,
  term,
  ed,
}: {
  frame: number
  i: number
  name: string
  term: Pose
  ed: Pose
}) {
  const raw = flight(frame, i)
  if (frame < FLY_AT[i]! || raw >= 1) return null
  const t = ease.camera(raw)
  const [ax, ay, az] = project(term, ...terminalFileAnchor(frame, i))
  const [bx, by, bz] = project(ed, ...treeFileAnchor(frame, i))
  const arc = Math.sin(Math.PI * t)
  const x = lerp(ax, bx, t) + arc * (random(i, 5) - 0.5) * 60
  const y = lerp(ay, by, t) - arc * (60 + random(i, 3) * 70)
  const pop = springAt(frame, FLY_AT[i]!, "pop")
  const z =
    lerp(az, bz, t) + arc * (200 + random(i, 7) * 160) + 90 * pop * (1 - t)
  const rx = lerp(term.rx, ed.rx, t)
  const ry = lerp(term.ry, ed.ry, t) + arc * (random(i, 9) - 0.5) * 20
  const rz = arc * (random(i, 11) - 0.5) * 10
  const s = lerp(term.s, ed.s, t) * lerp(0.8, 1, pop)
  const card = 1 - progress(raw, 0.7, 0.3, ease.soft)
  const speed = Math.abs(ease.camera(clamp01(raw + 1 / FLIGHT)) - t)
  const blur = Math.min(2.2, Math.max(0, speed * 30 - 0.6))
  const w = name.length * 7.9
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 0,
        height: 0,
        transformOrigin: "0 0",
        transform: `translateZ(${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`,
        filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
        opacity: clamp01(raw / 0.1),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -32,
          top: -16,
          width: w + 46,
          height: 32,
          borderRadius: 9,
          background: "linear-gradient(180deg, #2a2b34, #1e1f27)",
          boxShadow: [
            "inset 0 0 0 1px rgba(255,255,255,0.16)",
            "inset 0 1px 0 rgba(255,255,255,0.1)",
            `0 ${6 + 16 * arc}px ${16 + 30 * arc}px rgba(0,0,0,0.55)`,
            `0 0 ${36 * arc}px rgba(110,140,255,${0.3 * arc})`,
          ].join(", "),
          opacity: card,
        }}
      />
      <span
        style={{
          position: "absolute",
          left: 0,
          top: -EDITOR.row / 2,
          fontFamily: SANS,
          fontSize: 15,
          letterSpacing: "-0.005em",
          lineHeight: `${EDITOR.row}px`,
          whiteSpace: "nowrap",
          color: `rgba(255,255,255,${lerp(0.78, 0.96, card)})`,
        }}
      >
        <span
          style={{
            position: "absolute",
            left: -23,
            top: 6,
            color: C.blue,
            display: "flex",
          }}
        >
          <FileCodeIcon size={16} strokeWidth={1.75} />
        </span>
        {name}
      </span>
    </div>
  )
}

/* A soft key light that follows the action. */
function Glow({ frame, term, ed }: { frame: number; term: Pose; ed: Pose }) {
  const k = progress(frame, T.created, 90, ease.camera)
  const x = lerp(term.x, ed.x, k)
  const y = lerp(term.y, ed.y, k)
  return (
    <div
      style={{
        position: "absolute",
        left: x - 900,
        top: y - 600,
        width: 1800,
        height: 1200,
        transform: "translateZ(-400px)",
        background:
          "radial-gradient(closest-side, rgba(110,140,255,0.16), rgba(110,140,255,0.05) 55%, transparent)",
        opacity: clamp01(frame / 30),
      }}
    />
  )
}

/* Bar 3: the line, and the pill that lands last. */
function Hero({ frame }: { frame: number }) {
  const pop = springAt(frame, T.pill, "pop")
  const ring = progress(frame, T.pill + 6, 30, ease.out)
  const drift = keys(
    frame,
    [
      [T.headline, 10],
      [359, -6],
    ],
    ease.linear,
  )
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          ...HEADLINE,
          position: "absolute",
          left: 128,
          top: 348 + drift,
          fontSize: 124,
        }}
      >
        <div>
          <BlurWords text="It's your" start={T.headline} stagger={5} />
        </div>
        <div>
          <BlurWords text="code." start={T.headline + 12} stagger={5} />
        </div>
      </div>
      {frame >= T.pill ? (
        <div
          style={{
            position: "absolute",
            left: 132,
            top: 664 + drift,
            transformOrigin: "0 50%",
            transform: `translateY(${(1 - pop) * 26}px) scale(${lerp(0.7, 1, pop)})`,
            opacity: progress(frame, T.pill, 8, ease.linear),
          }}
        >
          <div
            style={{ position: "relative", display: "inline-block", zoom: 1.6 }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 999,
                boxShadow: "0 0 0 1px rgba(255,255,255,0.7)",
                transform: `scale(${1 + 0.35 * ring})`,
                opacity: 0.55 * (1 - ring),
              }}
            />
            <Theme mode="dark">
              <Button variant="primary" size="lg" className="rounded-full px-4">
                Open in v0
                <ArrowUpRightIcon data-icon="inline-end" />
              </Button>
            </Theme>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  )
}

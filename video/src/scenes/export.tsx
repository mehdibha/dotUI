import { AbsoluteFill, useCurrentFrame } from "remotion"

import { clamp01, ease, lerp, progress, random } from "../lib/motion"
import { Stage } from "../lib/stage"
import { BlurWords, HEADLINE, TOP_ANCHOR, TYPE } from "../lib/type"
import { Chips } from "./export/chips"
import { T } from "./export/data"
import { ExportPiece } from "./export/handoff"
import { cameraAt, editorPose, onScreen, terminalPose } from "./export/layout"
import { TerminalPlane } from "./export/planes"

/* Export — init with the preset URL, add the components, the files fly into
   the app, the editor opens the shipped button.tsx: "Own the code." */

export function Export() {
  const frame = useCurrentFrame()
  const cam = cameraAt(frame)
  return (
    <AbsoluteFill>
      <Stage
        gridOffset={[
          -frame * 0.35 + cam.x * 0.25 - cam.rotateY * 8,
          -frame * 0.1 + cam.y * 0.25,
        ]}
      >
        <Glow frame={frame} />
        <TerminalPlane />
        {/* The closing pieces go through the handoff, exactly as End gets them. */}
        <ExportPiece piece="editor" frame={frame} />
        <Chips frame={frame} />
        <Title frame={frame} />
        <ExportPiece piece="line" frame={frame} />
        <ExportPiece piece="pill" frame={frame} />
      </Stage>
      <Dither frame={frame} />
    </AbsoluteFill>
  )
}

/** Cap height of Geist as a fraction of the size, for top-anchored type. */
const CAP_TOP = 0.163

function Title({ frame }: { frame: number }) {
  if (frame > T.addEnter + 16) return null
  return (
    <AbsoluteFill style={{ alignItems: "center", pointerEvents: "none" }}>
      <div
        style={{
          ...HEADLINE,
          position: "absolute",
          top: TOP_ANCHOR - TYPE.label * CAP_TOP,
          fontSize: TYPE.label,
          whiteSpace: "nowrap",
        }}
      >
        <BlurWords
          text="Install with the shadcn CLI."
          start={0}
          end={T.addEnter}
          stagger={4}
        />
      </div>
    </AbsoluteFill>
  )
}

const NOISE = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='n' color-interpolation-filters='sRGB'><feTurbulence type='fractalNoise' baseFrequency='0.9' stitchTiles='stitch'/><feColorMatrix values='.33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 0 1'/><feComponentTransfer><feFuncR type='discrete' tableValues='0 1'/><feFuncG type='discrete' tableValues='0 1'/><feFuncB type='discrete' tableValues='0 1'/></feComponentTransfer></filter><rect width='256' height='256' filter='url(#n)'/></svg>",
)}")`

/* Binary grain at 0.8 % — ±1 LSB, moving every frame — so the re-encode
   can't band the big near-black gradients (glow, vignette). */
function Dither({ frame }: { frame: number }) {
  return (
    <AbsoluteFill
      style={{
        backgroundImage: NOISE,
        backgroundPosition: `${Math.floor(random(frame, 1) * 256)}px ${Math.floor(random(frame, 2) * 256)}px`,
        opacity: 0.008,
        pointerEvents: "none",
      }}
    />
  )
}

/* A soft key light that follows the action from window to window. */
function Glow({ frame }: { frame: number }) {
  const term = onScreen(frame, terminalPose(frame), 0, 0)
  const ed = onScreen(frame, editorPose(frame), 0, 0)
  const k = progress(frame, 150, 110, ease.camera)
  const x = lerp(term.x, ed.x, k)
  const y = lerp(term.y, ed.y, k)
  return (
    <div
      style={{
        position: "absolute",
        left: x - 1000,
        top: y - 640,
        width: 2000,
        height: 1280,
        background:
          "radial-gradient(closest-side, rgba(110,140,255,0.15), rgba(110,140,255,0.05) 55%, transparent)",
        opacity: 0.7 + 0.3 * clamp01(frame / 40),
      }}
    />
  )
}

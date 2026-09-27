import { AbsoluteFill, useCurrentFrame } from "remotion"

import { clamp01, ease, lerp, progress } from "../lib/motion"
import { Stage } from "../lib/stage"
import { BlurWords, HEADLINE, TOP_ANCHOR, TYPE } from "../lib/type"
import { Chips } from "./export/chips"
import { T } from "./export/data"
import { ExportPiece } from "./export/handoff"
import {
  cameraAt,
  editorPose,
  onScreen,
  terminalPose,
  topCovered,
} from "./export/layout"
import { TerminalPlane } from "./export/planes"

/* Export — init with the preset URL, add the components, the files fly into
   the app, the editor opens the shipped button.tsx: "Own the code." */

export function Export() {
  const frame = useCurrentFrame()
  const cam = cameraAt(frame)
  return (
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
      <Scrim amount={topCovered(frame)} />
      <Title frame={frame} />
      <ExportPiece piece="line" frame={frame} />
      <ExportPiece piece="pill" frame={frame} />
    </Stage>
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

/** A clean band for the headline when the terminal fills the top. */
function Scrim({ amount }: { amount: number }) {
  if (amount <= 0) return null
  return (
    <AbsoluteFill
      style={{
        opacity: amount,
        background:
          "linear-gradient(180deg, rgba(8,8,10,0.97) 0%, rgba(8,8,10,0.9) 20%, rgba(8,8,10,0) 40%)",
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

import type { ReactNode } from "react"
import { useCurrentFrame } from "remotion"

import { Camera } from "../../lib/stage"
import { EDITOR, TERM, TERM_H, TERM_W } from "./data"
import { Editor } from "./editor"
import type { Pose } from "./layout"
import { cameraAt, editorPose, poseTransform, terminalPose } from "./layout"
import { Terminal } from "./terminal"

/* Each window is its own camera layer (the two never intersect in depth; the
   editor always draws over the terminal). Content renders at the window's
   native zoom and the transform only scales it down. */

function Plane({
  pose,
  w,
  h,
  zoom,
  children,
}: {
  pose: Pose
  w: number
  h: number
  zoom: number
  children: ReactNode
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: pose.x - (w * zoom) / 2,
        top: pose.y - (h * zoom) / 2,
        width: w * zoom,
        height: h * zoom,
        transform: poseTransform(pose, zoom),
        opacity: pose.opacity,
        filter: pose.blur > 0.1 ? `blur(${pose.blur.toFixed(2)}px)` : undefined,
      }}
    >
      <div style={{ zoom, width: w, height: h }}>{children}</div>
    </div>
  )
}

export function TerminalPlane() {
  const frame = useCurrentFrame()
  const pose = terminalPose(frame)
  if (pose.opacity <= 0) return null
  return (
    <Camera {...cameraAt(frame)}>
      <Plane pose={pose} w={TERM_W} h={TERM_H} zoom={TERM.zoom}>
        <Terminal frame={frame} />
      </Plane>
    </Camera>
  )
}

export function EditorPlane() {
  const frame = useCurrentFrame()
  const pose = editorPose(frame)
  if (pose.opacity <= 0) return null
  return (
    <Camera {...cameraAt(frame)}>
      <Plane pose={pose} w={EDITOR.w} h={EDITOR.h} zoom={EDITOR.zoom}>
        <Editor frame={frame} />
      </Plane>
    </Camera>
  )
}

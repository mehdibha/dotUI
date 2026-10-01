import { AbsoluteFill, Freeze } from "remotion"

import { CLOSER, drift, Line, Pill } from "./closer"
import { EDITOR } from "./data"
import { editorPose, onScreen } from "./layout"
import { EditorPlane } from "./planes"

/* Export → End. End seeds its collapse with Export's closing elements:
   each piece renders exactly as Export draws it at an Export-local frame, as
   a full-frame layer (1920×1080) — wrap it in your own transform, origin
   (960, 540), to carry it into the dot. Frames past EXPORT_LAST keep every
   drift going (code scroll, camera, column), so End's frame n is
   <ExportPiece frame={EXPORT_LAST + 1 + n} />. */

export const EXPORT_LAST = 359

export type ExportPieceId = "editor" | "pill" | "line"

export function ExportPiece({
  piece,
  frame,
}: {
  piece: ExportPieceId
  frame: number
}) {
  return (
    <Freeze frame={frame}>
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {piece === "editor" ? (
          <EditorPlane />
        ) : piece === "pill" ? (
          <Pill />
        ) : (
          <Line />
        )}
      </AbsoluteFill>
    </Freeze>
  )
}

export type ScreenRect = {
  x: number
  y: number
  width: number
  height: number
  cx: number
  cy: number
}

function rect(x: number, y: number, width: number, height: number) {
  return { x, y, width, height, cx: x + width / 2, cy: y + height / 2 }
}

/* Measured boxes (screen px) of the line and the settled pill (at
   TYPE.statement and TYPE.cta — re-measure if either changes). */
const LINE = { width: 452, height: 266 }
const PILL = { width: 401, height: 123 }

/** Where each piece sits on screen at `frame` (bounds of its projection). */
export function exportRects(
  frame = EXPORT_LAST,
): Record<ExportPieceId, ScreenRect> {
  const pose = editorPose(frame)
  const corners = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ].map(([u, v]) =>
    onScreen(frame, pose, (u! * EDITOR.w) / 2, (v! * EDITOR.h) / 2),
  )
  const xs = corners.map((c) => c.x)
  const ys = corners.map((c) => c.y)
  const dy = drift(frame)
  return {
    editor: rect(
      Math.min(...xs),
      Math.min(...ys),
      Math.max(...xs) - Math.min(...xs),
      Math.max(...ys) - Math.min(...ys),
    ),
    line: rect(CLOSER.left, CLOSER.top + dy, LINE.width, LINE.height),
    pill: rect(CLOSER.left + 4, CLOSER.pillTop + dy, PILL.width, PILL.height),
  }
}

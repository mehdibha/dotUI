"use client"

/* Motion — one row: every animated component's timing on one board. There
   is no system-wide motion to set; each component owns its own, and its
   family's popover shows the same control. */

import { DialTrigger } from "../dial"
import { BoardSummary, MotionBoard } from "../motion-board"
import type { Studio } from "../state"

export function MotionSection({ studio }: { studio: Studio }) {
  return (
    <DialTrigger label="Timeline" value={<BoardSummary state={studio.state} />}>
      <MotionBoard studio={studio} />
    </DialTrigger>
  )
}

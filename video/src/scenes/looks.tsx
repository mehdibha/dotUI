import { AbsoluteFill, useCurrentFrame } from "remotion"

import { hold } from "../lib/motion"
import { StudioSet } from "../lib/set"
import { preset } from "../lib/theme"
import { BEAT } from "../lib/timing"

/* Every preset, one per beat. First draft: still the full studio; the shot
   is the preview cards alone (see STORYBOARD.md). */
const ORDER = [
  "origin",
  "claude",
  "carbon",
  "duolingo",
  "material3",
  "vercel",
  "airbnb",
  "linear",
  "supabase",
  "polaris",
  "stripe",
  "notion",
  "radix",
  "spotify",
  "untitled",
  "github",
] as const

const LOOKS = ORDER.map((id, i) => [i * BEAT, id] as const)

export function Looks() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill>
      <StudioSet state={preset(hold(frame, LOOKS))} />
    </AbsoluteFill>
  )
}

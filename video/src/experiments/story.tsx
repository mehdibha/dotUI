import { AbsoluteFill, Series, useCurrentFrame } from "remotion"

import { Theme } from "../lib/theme"
import { BAR, BEAT, FPS } from "../lib/timing"
import { BLOCKS_FRAMES, BlocksScene } from "./blocks"
import { GRID_FRAMES, GridStep } from "./grid"
import { Outro, OUTRO_FRAMES } from "./outro"
import { Caption } from "./shared"

/* The whole film in storyboard order. Built scenes play as they are; a
   scene still to make is a slate: what it will show and the reference it
   borrows from (the Launch Video Refs board), under its real on-screen
   line. Swap a slate for the scene once it's made (catalog.tsx, demos.tsx,
   export.tsx and agent.tsx hold the first takes). */

type Slate = {
  title: string
  shows: string
  refs: string
  lines: ReadonlyArray<readonly [at: number, text: string]>
}

const CREATE_FRAMES = GRID_FRAMES - OUTRO_FRAMES

const SLATES = {
  Catalog: {
    title: "Every component",
    shows:
      "The docs components grid wearing the look just made. The camera glides up the page and pushes into Button.",
    refs: "Magic UI's bento montage · Graphical",
    lines: [[BEAT * 2, "Every component."]],
  },
  Demos: {
    title: "Your demos",
    shows:
      "Button's interactive demo: one control per beat, preview and code follow. Then the preview swaps looks on the beat and lands back on yours.",
    refs: "shadcn/typeset, one value at a time · Luma",
    lines: [[BAR * 2, "Docs in your design system."]],
  },
  Export: {
    title: "Export",
    shows:
      "The export dialog: Copy command flips to Copied, then the eight Start with AI builders come in one per half beat.",
    refs: "shadcn/create · React Grab",
    lines: [
      [BEAT, "One command."],
      [BAR, "Or 8 AI builders."],
    ],
  },
  Agent: {
    title: "Agent ready",
    shows:
      "The Button docs page wipes into its .md twin, llms.txt scrolls by, then Copy prompt and the line an agent runs.",
    refs: "shadcn/ui skills with DESIGN.md · /improve-animations",
    lines: [[BEAT + 6, "Agent ready."]],
  },
} satisfies Record<string, Slate>

export const SCENES = [
  { id: "Create", frames: CREATE_FRAMES, Scene: GridStep },
  { id: "Blocks", frames: BLOCKS_FRAMES, Scene: BlocksScene },
  { id: "Catalog", frames: BAR * 2, Scene: slate("Catalog") },
  { id: "Demos", frames: BAR * 4, Scene: slate("Demos") },
  { id: "Export", frames: BAR * 3, Scene: slate("Export") },
  { id: "Agent", frames: BAR * 3, Scene: slate("Agent") },
  { id: "End", frames: OUTRO_FRAMES, Scene: End },
] as const

export const STORY_FRAMES = SCENES.reduce((sum, s) => sum + s.frames, 0)

function End() {
  return <Outro frame={useCurrentFrame()} />
}

function slate(id: keyof typeof SLATES) {
  return function SlateScene() {
    return <SlateCard {...SLATES[id]} id={id} />
  }
}

function SlateCard({ id, title, shows, refs, lines }: Slate & { id: string }) {
  const frame = useCurrentFrame()
  const number = SCENES.findIndex((s) => s.id === id) + 1
  const { frames } = SCENES[number - 1]!
  return (
    <Theme mode="dark">
      <div className="absolute inset-0 bg-bg">
        <div
          className="absolute inset-6 rounded-xl border border-dashed"
          style={{
            borderColor:
              "color-mix(in oklab, var(--color-fg) 22%, transparent)",
          }}
        />
        <div
          className="absolute top-6 left-6 h-0.5 rounded-full bg-fg-muted"
          style={{
            width: `calc((100% - 48px) * ${frame / frames})`,
            opacity: 0.5,
          }}
        />
        <div
          className="absolute flex flex-col gap-5"
          style={{ left: 64, top: 64, width: 760 }}
        >
          <div
            className="font-mono text-fg-muted uppercase"
            style={{ fontSize: 22, letterSpacing: "0.06em" }}
          >
            {String(number).padStart(2, "0")} · {title} ·{" "}
            {(frames / FPS).toFixed(0)} s · to build
          </div>
          <div className="text-fg" style={{ fontSize: 30, lineHeight: 1.35 }}>
            {shows}
          </div>
          <div className="text-fg-muted" style={{ fontSize: 22 }}>
            Ref: {refs}
          </div>
        </div>
        <Caption frame={frame} lines={lines} />
      </div>
    </Theme>
  )
}

export function Story() {
  return (
    <AbsoluteFill>
      <Series>
        {SCENES.map(({ id, frames, Scene }) => (
          <Series.Sequence key={id} durationInFrames={frames} name={id}>
            <Scene />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  )
}

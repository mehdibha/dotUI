import { AbsoluteFill, useCurrentFrame } from "remotion"

import { BAR, BEAT } from "../lib/timing"

/* A scene not yet made: its name, its brief, and where the frame sits on the
   beat grid, so the edit can be timed before the shots exist. */
export function Placeholder({
  title,
  brief,
}: {
  title: string
  brief: string
}) {
  const frame = useCurrentFrame()
  const bar = Math.floor(frame / BAR) + 1
  const beat = Math.floor((frame % BAR) / BEAT) + 1
  return (
    <AbsoluteFill className="items-center justify-center gap-6 bg-[#08080a] font-sans text-white">
      <div className="text-[96px] font-medium tracking-[-0.05em]">{title}</div>
      <div className="max-w-[1100px] text-center text-[32px] text-white/55">
        {brief}
      </div>
      <div className="flex gap-3">
        {[1, 2, 3, 4].map((b) => (
          <div
            key={b}
            className="size-4 rounded-full"
            style={{
              background: b === beat ? "#fff" : "rgb(255 255 255 / 0.15)",
            }}
          />
        ))}
      </div>
      <div className="font-mono text-[24px] text-white/40 tabular-nums">
        bar {bar} · beat {beat} · frame {frame}
      </div>
    </AbsoluteFill>
  )
}

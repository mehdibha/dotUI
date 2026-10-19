import { useLayoutEffect, useRef, useState } from "react"
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  useCurrentFrame,
} from "remotion"

import { Cursor } from "../lib/cursor"
import { boxWithin, type Box } from "../lib/measure"
import { ease, keys, lerp, progress, punches } from "../lib/motion"
import { Theme } from "../lib/theme"
import { BAR, BEAT } from "../lib/timing"
import { ButtonDocs } from "./demos"
import { ExportSurface, PROMPT } from "./export"
import { BUTTON_MD, LLMS_TXT } from "./generated/agent-text"
import { Caption, H, W, YOURS } from "./shared"

/* Agent ready: what dotui.org already serves agents. Bar 0: the Button docs
   page wipes into its markdown twin (the page's URL plus .md). Bar 1:
   llms.txt, every docs page in one list, scrolling fast. Bar 2: the export
   dialog's "Copy prompt", and the prompt it copies, one line an agent runs
   with. The text is the live site's, fetched into generated/agent-text.ts. */

export const AGENT_FRAMES = BAR * 3

const WIPE_AT = BEAT
const WIPE_FOR = 18
const COPY_AT = BAR * 2 + BEAT

/** A plain text document as a browser shows it: the URL, then the text. */
function TextPage({
  url,
  text,
  scroll,
}: {
  url: string
  text: string
  scroll: number
}) {
  return (
    <div className="absolute inset-0 flex flex-col bg-bg">
      <div className="flex h-12 shrink-0 items-center border-b px-6">
        <span className="rounded-md bg-muted px-3 py-1 font-mono text-sm text-fg-muted">
          {url}
        </span>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <pre
          className="absolute inset-x-0 px-12 py-6 font-mono text-sm/relaxed whitespace-pre-wrap text-fg"
          style={{ top: -scroll }}
        >
          {text}
        </pre>
      </div>
    </div>
  )
}

let promptBox: Box | null = null

function CopyPrompt({ frame }: { frame: number }) {
  const surface = useRef<HTMLDivElement>(null)
  const prompt = useRef<HTMLDivElement>(null)
  const [, setMeasured] = useState(!!promptBox)
  useLayoutEffect(() => {
    if (promptBox) return
    const handle = delayRender("prompt box")
    void document.fonts.ready.then(() => {
      promptBox = boxWithin(prompt.current!, surface.current!)
      setMeasured(true)
      continueRender(handle)
    })
  }, [])

  const p = promptBox ?? { x: 400, y: 400, w: 100, h: 24 }
  // The dialog sits so its "Copy prompt" lands upper right of center.
  const ox = W * 0.62 - (p.x + p.w / 2)
  const oy = H * 0.24 - (p.y + p.h / 2)
  const zoom = 1.6 * (1 + punches(frame, [COPY_AT], 0.012))
  const at = [ox + p.x + p.w / 2, oy + p.y + p.h / 2] as const
  const reveal = progress(frame, COPY_AT + 6, 36, ease.out)
  const lines = PROMPT.split("\n").slice(0, 7).join("\n")
  return (
    <AbsoluteFill className="bg-bg" style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transformOrigin: `${at[0]}px ${at[1]}px`,
          transform: `scale(${zoom})`,
        }}
      >
        <div ref={surface} style={{ position: "absolute", left: ox, top: oy }}>
          <ExportSurface copied={false} promptCopied={frame >= COPY_AT} refs={{ prompt }} />
        </div>
        {promptBox && (
          <Cursor
            path={[
              [BAR * 2 + 4, at[0] + 90, at[1] + 70],
              [COPY_AT - 6, at[0] + 10, at[1]],
            ]}
            clicks={[COPY_AT]}
            from={BAR * 2 + 4}
            size={0.6}
          />
        )}
      </div>
      {/* The clipboard: the prompt's first lines, rising in under the
          button. */}
      <div
        className="absolute rounded-lg border bg-card shadow-lg"
        style={{
          left: 60,
          right: 60,
          top: lerp(H, H * 0.4, reveal),
          opacity: reveal,
        }}
      >
        <pre className="px-6 py-5 font-mono text-sm/relaxed whitespace-pre-wrap text-fg">
          {lines}
        </pre>
      </div>
    </AbsoluteFill>
  )
}

export function Agent() {
  const frame = useCurrentFrame()
  const wipe = progress(frame, WIPE_AT, WIPE_FOR, ease.inOut)
  return (
    <AbsoluteFill>
      <Theme mode="dark">
        <AbsoluteFill className="bg-bg" style={{ overflow: "hidden" }}>
          {frame < BAR && (
            <>
              <div
                className="absolute"
                style={{
                  left: (W / 1.12 - 960) / 2,
                  top: 40,
                  transformOrigin: "0 0",
                  transform: "scale(1.12)",
                }}
              >
                <ButtonDocs
                  look={YOURS}
                  values={{
                    children: "Button",
                    variant: "secondary",
                    size: "md",
                    isDisabled: false,
                    isPending: false,
                  }}
                />
              </div>
              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)` }}
              >
                <TextPage
                  url="dotui.org/docs/components/button.md"
                  text={BUTTON_MD}
                  scroll={keys(frame, [
                    [WIPE_AT + WIPE_FOR, 0],
                    [BAR, 120],
                  ], ease.linear)}
                />
              </div>
            </>
          )}
          {frame >= BAR && frame < BAR * 2 && (
            <TextPage
              url="dotui.org/llms.txt"
              text={LLMS_TXT}
              scroll={keys(
                frame,
                [
                  [BAR, 0],
                  [BAR * 2, 1900],
                ],
                ease.soft,
              )}
            />
          )}
          {frame >= BAR * 2 && <CopyPrompt frame={frame} />}
          {frame < BAR * 2 && (
            <Caption frame={frame} lines={[[WIPE_AT + 6, "Agent ready."]]} />
          )}
        </AbsoluteFill>
      </Theme>
    </AbsoluteFill>
  )
}

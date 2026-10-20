import { useLayoutEffect, useRef, useState } from "react"
import { Fragment, jsx, jsxs } from "react/jsx-runtime"
import { toJsxRuntime } from "hast-util-to-jsx-runtime"
import { ChevronDownIcon, XIcon } from "lucide-react"
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  useCurrentFrame,
} from "remotion"

import { Button } from "@/registry/ui/button"
import ButtonPlayground from "@/registry/ui/button/demos/playground"
import { CodeBlock, Pre } from "@/modules/docs/code-block"
import { renderCode, type CodeTemplate } from "@/modules/docs/codegen/code-template"
import { highlightTsx } from "@/modules/docs/highlight"
import { Controls } from "@/modules/docs/interactive-demo/controls"
import type {
  ControlValues,
  SerializableControl,
} from "@/modules/docs/interactive-demo/types"

import { Cursor, type CursorKey } from "../lib/cursor"
import { boxWithin, type Box } from "../lib/measure"
import { ease, keys, punches } from "../lib/motion"
import { preset, Theme, WarmIcons } from "../lib/theme"
import { BAR, BEAT } from "../lib/timing"
import playground from "./generated/button-playground.json"
import { Caption, H, W, YOURS } from "./shared"

/* Your demos: the Button docs page with its interactive demo open (www
   docs/interactive-demo), preview, controls and live code. The cursor
   changes one control per beat and the preview and code follow; then the
   camera pushes into the preview and it swaps design system on every beat,
   the way the docs follow whatever system you make, and lands back on
   yours. The controls and code template are the ones the docs build makes
   (generated/button-playground.json, from codegen/source-overlay). */

export const DEMOS_FRAMES = BAR * 4

const CONTROLS = playground.controls as SerializableControl[]
const TEMPLATE = playground.codeTemplate as unknown as CodeTemplate

/** Page width at true size, and the zoom it's filmed at. */
const PAGE_W = 960
const ZOOM = 1.12

const TYPED = "Get started"
const TYPE_AT = BEAT * 4 + 6
const TYPE_EVERY = 3

/** The control values at `frame`: one change per beat. */
export function valuesAt(frame: number): ControlValues {
  const typed = Math.max(0, Math.floor((frame - TYPE_AT) / TYPE_EVERY) + 1)
  return {
    children:
      frame < BEAT * 4 ? "Button" : TYPED.slice(0, Math.min(typed, TYPED.length)),
    variant: frame < BEAT * 2 ? "secondary" : "primary",
    size: frame < BEAT * 3 ? "md" : "lg",
    isDisabled: false,
    isPending: frame >= BEAT * 6 && frame < BEAT * 7,
  }
}

/** The look on the preview: yours, others on each beat of bar 2, yours. */
const SWAPS = [
  [0, YOURS],
  [BAR * 2, "claude"],
  [BAR * 2 + BEAT, "duolingo"],
  [BAR * 2 + BEAT * 2, "material3"],
  [BAR * 2 + BEAT * 3, "stripe"],
  [BAR * 3, YOURS],
] as const
const lookAt = (frame: number) =>
  SWAPS.filter(([at]) => frame >= at).at(-1)![1]

function Code({ values }: { values: ControlValues }) {
  return toJsxRuntime(highlightTsx(renderCode(TEMPLATE, values, { expanded: false })), {
    Fragment,
    jsx,
    jsxs,
    components: {
      pre: (props: React.ComponentProps<"pre">) => <Pre {...props} />,
    },
  })
}

/** The Button docs page's head and its interactive demo, open. */
export function ButtonDocs({
  look,
  values,
  previewRef,
  controlsRef,
  previewScale = 1,
}: {
  look: string
  values: ControlValues
  previewRef?: React.Ref<HTMLDivElement>
  controlsRef?: React.Ref<HTMLDivElement>
  previewScale?: number
}) {
  return (
    <div style={{ width: PAGE_W }}>
      <h1 className="text-3xl font-semibold text-fg">Button</h1>
      <p className="mt-2 text-lg text-fg-muted">
        Displays a button or a component that looks like a button.
      </p>
      <div className="mt-8 flex flex-row">
        <div
          ref={previewRef}
          className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border bg-bg"
        >
          <Theme state={preset(look)}>
            <div className="flex min-h-56 flex-1 items-center justify-center bg-bg p-10 pt-14">
              <div style={{ transform: `scale(${previewScale})` }}>
                <ButtonPlayground {...values} />
              </div>
            </div>
          </Theme>
        </div>
        <div className="ml-3 flex w-56 shrink-0 overflow-hidden">
          <div className="min-h-full w-full overflow-hidden rounded-lg border bg-card **:data-field:gap-1 **:data-label:text-[0.8125rem] **:data-label:text-fg-muted">
            <div className="flex w-55.5 flex-col gap-4 p-4">
              <div className="-my-1 -mr-2 flex items-center justify-between">
                <p className="text-xs font-medium text-fg-muted">Controls</p>
                <Button
                  variant="quiet"
                  size="xs"
                  isIconOnly
                  aria-label="Hide controls"
                  className="text-fg-muted"
                >
                  <XIcon />
                </Button>
              </div>
              <div ref={controlsRef} className="contents">
                <Controls
                  controls={CONTROLS}
                  values={values}
                  onChange={() => {}}
                  layout="horizontal"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <CodeBlock
        className="mt-3 rounded-lg"
        actions={
          <Button
            variant="quiet"
            size="sm"
            className="h-7 gap-1 pr-2 pl-1 text-xs"
          >
            <ChevronDownIcon /> Expand
          </Button>
        }
      >
        <Code values={values} />
      </CodeBlock>
    </div>
  )
}

/** Where the cursor clicks, read once off the laid-out page. */
let targets: { controls: Box[]; preview: Box } | null = null

export function Demos() {
  const frame = useCurrentFrame()
  const page = useRef<HTMLDivElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const controls = useRef<HTMLDivElement>(null)
  const [, setMeasured] = useState(!!targets)

  useLayoutEffect(() => {
    if (targets) return
    const handle = delayRender("demos targets")
    void document.fonts.ready.then(() => {
      const root = page.current!
      const wrappers = [...controls.current!.children] as HTMLElement[]
      targets = {
        controls: wrappers.map((el, i) => {
          // Aim at the field itself, not its label; for size, at "lg".
          const field =
            i === 2
              ? ([...el.querySelectorAll("button, [role=radio]")].find(
                  (b) => b.textContent === "lg",
                ) as HTMLElement | undefined)
              : (el.querySelector(
                  "input, button, [role=switch], label:last-child",
                ) as HTMLElement | null)
          return boxWithin(field ?? el, root)
        }),
        preview: boxWithin(preview.current!, root),
      }
      setMeasured(true)
      continueRender(handle)
    })
  }, [])

  // Page origin in the frame (true size, before the zoom).
  const ox = (W / ZOOM - PAGE_W) / 2
  const oy = 40
  // From bar 2, push into the preview.
  const pv = targets?.preview
  const push = keys(
    frame,
    [
      [BAR * 2 - BEAT, 0],
      [BAR * 2, 1],
    ],
    ease.camera,
  )
  const beat = punches(
    frame,
    SWAPS.slice(1).map(([at]) => at),
    0.02,
  )
  const zoom = (ZOOM + push * 0.45) * (1 + beat)
  const rest = { x: W / ZOOM / 2, y: H / ZOOM / 2 }
  const focus = pv ? { x: ox + pv.x + pv.w / 2, y: oy + pv.y + pv.h / 2 } : rest
  const fx = rest.x + (focus.x - rest.x) * push
  const fy = rest.y + (focus.y - rest.y) * push

  const at = (i: number) => {
    const b = targets?.controls[i]
    return b ? ([ox + b.x + b.w * 0.6, oy + b.y + b.h / 2] as const) : ([0, 0] as const)
  }
  const path: CursorKey[] = targets
    ? [
        [10, ox + 600, oy + 420],
        [52, ...at(1)],
        [60, ...at(1)],
        [82, ...at(2)],
        [120, ...at(0)],
        [172, ...at(4)],
        [212, ...at(4)],
        [230, ox + 700, oy + 380],
      ]
    : [[0, 0, 0]]

  return (
    <AbsoluteFill>
      <WarmIcons />
      <Theme mode="dark">
        <AbsoluteFill className="bg-bg" style={{ overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              transformOrigin: "0 0",
              transform: `translate(${W / 2}px, ${H / 2}px) scale(${zoom}) translate(${-fx}px, ${-fy}px)`,
            }}
          >
            <div ref={page} style={{ position: "absolute", left: ox, top: oy }}>
              <ButtonDocs
                look={lookAt(frame)}
                values={valuesAt(frame)}
                previewRef={preview}
                controlsRef={controls}
              />
            </div>
            {targets && (
              <Cursor
                path={path}
                clicks={[60, 90, 120, 180, 210]}
                from={10}
                to={232}
              />
            )}
          </div>
          <Caption
            frame={frame}
            lines={[[BAR * 2, "Docs in your design system."]]}
          />
        </AbsoluteFill>
      </Theme>
    </AbsoluteFill>
  )
}

import { useLayoutEffect, useRef, useState } from "react"
import { CheckIcon, CopyIcon, Settings2Icon, XIcon } from "lucide-react"
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  useCurrentFrame,
} from "remotion"

import { cn } from "@/registry/lib/utils"
import { Button, LinkButton } from "@/registry/ui/button"
import { DialogBody, DialogFooter, DialogHeader } from "@/registry/ui/dialog"
import { Label } from "@/registry/ui/field"
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioIndicator,
} from "@/registry/ui/radio-group"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { Surface } from "@/modules/docs/components-list/overlay"
import {
  buildInitCommands,
  buildInstallCommands,
  PACKAGE_MANAGERS,
} from "@/modules/docs/install-commands"
import { buildPrompt } from "@/modules/studio/export/prompt"
import { OPEN_IN_TARGETS } from "@/modules/studio/export/targets"

import { Cursor } from "../lib/cursor"
import { boxWithin, type Box } from "../lib/measure"
import { clamp01, ease, keys, punches } from "../lib/motion"
import { Theme } from "../lib/theme"
import { BAR, BEAT } from "../lib/timing"
import { Caption, H, W, YOURS } from "./shared"

/* Export: /studio's export dialog (www studio/export/export-dialog), open
   and inline in a close shot. "Copy command" flips to "Copied", then the
   camera drops to "Start with AI" and its eight builders come in one per
   half beat, a bar for all eight, and the cursor opens one. The dialog's
   markup is export-dialog.tsx's own, rebuilt here with the same registry
   components: the real one fetches a snapshot id as it opens. The URL is
   the preset's own registry path, which needs none. */

export const EXPORT_FRAMES = BAR * 3

/** Builder names and logos on screen? Brands stay off screen unless Mehdi
    says otherwise, so they're blurred past reading. */
export const SHOW_BUILDERS = false

export const exportUrl = (file: string) =>
  `https://dotui.org/r/p/${YOURS}/${file}.json`

const TEMPLATES = ["Next.js", "TanStack Start", "Vite", "React Router"]

/** The dialog, as export-dialog.tsx draws it for a new project. */
export function ExportSurface({
  copied,
  promptCopied = false,
  builder = () => 1,
  refs = {},
}: {
  copied: boolean
  promptCopied?: boolean
  /** Each builder's presence, 0 to 1. */
  builder?: (index: number) => number
  refs?: {
    copy?: React.Ref<HTMLDivElement>
    builders?: React.Ref<HTMLDivElement>
    prompt?: React.Ref<HTMLDivElement>
  }
}) {
  const init = buildInitCommands(exportUrl("init")).npm
  const add = buildInstallCommands(["button"]).npm
  const command = `${init} --template next --name my-app && cd my-app && ${add} --overwrite --yes`
  return (
    <Surface variant="modal" className="relative flex w-lg flex-col gap-4">
      <Button
        variant="quiet"
        size="sm"
        isIconOnly
        aria-label="Close"
        className="absolute top-2 right-2"
      >
        <XIcon />
      </Button>
      <DialogHeader>
        <SegmentedControl aria-label="Project type" selectedKeys={["new"]}>
          <SegmentedControlItem id="new">New project</SegmentedControlItem>
          <SegmentedControlItem id="existing">
            Existing project
          </SegmentedControlItem>
        </SegmentedControl>
      </DialogHeader>
      <DialogBody className="gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-fg-muted">Framework</span>
          <RadioGroup
            aria-label="Framework"
            value="Next.js"
            className="grid grid-cols-2 gap-2"
          >
            {TEMPLATES.map((t) => (
              <Radio key={t} value={t}>
                <RadioControl>
                  <RadioIndicator />
                  <Label>{t}</Label>
                </RadioControl>
              </Radio>
            ))}
          </RadioGroup>
        </div>
        <div className="rounded-md border bg-muted/40">
          <div className="flex items-center justify-between border-b pr-1.5">
            <div className="flex items-center gap-1 px-2 py-1.5">
              {PACKAGE_MANAGERS.map((pm) => (
                <span
                  key={pm}
                  className={cn(
                    "rounded-sm px-1.5 py-0.5 font-mono text-xs text-fg-muted",
                    pm === "npm" && "bg-neutral text-fg",
                  )}
                >
                  {pm}
                </span>
              ))}
            </div>
            <Button variant="quiet" size="xs">
              <Settings2Icon />
              Code style
            </Button>
          </div>
          <div className="flex items-center gap-2 py-1.5 pr-1.5 pl-3">
            <code className="min-w-0 flex-1 overflow-hidden font-mono text-xs whitespace-nowrap text-fg [mask-image:linear-gradient(to_right,black_85%,transparent)]">
              {command}
            </code>
            <Button variant="quiet" size="xs" isIconOnly aria-label="Copy">
              {copied ? <CheckIcon /> : <CopyIcon />}
            </Button>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="flex-col sm:flex-col">
        <div ref={refs.copy} className="w-full">
          <Button variant="primary" className="w-full">
            {copied ? "Copied" : "Copy command"}
          </Button>
        </div>
        <div className="flex w-full flex-col gap-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-fg-muted">
              Start with AI
            </span>
            <div ref={refs.prompt}>
              <Button variant="quiet" size="xs">
                {promptCopied ? <CheckIcon /> : <CopyIcon />}
                {promptCopied ? "Copied" : "Copy prompt"}
              </Button>
            </div>
          </div>
          <div
            ref={refs.builders}
            className="grid grid-cols-4 gap-1.5"
            style={SHOW_BUILDERS ? undefined : { filter: "blur(4px)" }}
          >
            {OPEN_IN_TARGETS.map((target, i) => {
              const p = builder(i)
              return (
                <div
                  key={target.id}
                  style={{
                    opacity: 0.15 + 0.85 * p,
                    transform: `scale(${0.92 + 0.08 * p})`,
                  }}
                >
                  <LinkButton variant="secondary" size="sm" className="w-full">
                    {target.wordmark ? (
                      <target.icon className="h-2.5 w-auto" />
                    ) : (
                      <>
                        <target.icon />
                        {target.name}
                      </>
                    )}
                  </LinkButton>
                </div>
              )
            })}
          </div>
        </div>
      </DialogFooter>
    </Surface>
  )
}

/** The prompt "Copy prompt" puts on the clipboard. */
export const PROMPT = buildPrompt(exportUrl)

const BUILDERS_AT = BAR
const BUILDER_EVERY = BEAT / 2
const COPY_AT = BEAT * 2
const OPEN_AT = BAR * 2 + BEAT

let boxes: { copy: Box; builders: Box; surface: Box } | null = null

export function Export() {
  const frame = useCurrentFrame()
  const surface = useRef<HTMLDivElement>(null)
  const copy = useRef<HTMLDivElement>(null)
  const builders = useRef<HTMLDivElement>(null)
  const [, setMeasured] = useState(!!boxes)

  useLayoutEffect(() => {
    if (boxes) return
    const handle = delayRender("export boxes")
    void document.fonts.ready.then(() => {
      const root = surface.current!
      boxes = {
        copy: boxWithin(copy.current!, root),
        builders: boxWithin(builders.current!, root),
        surface: { x: 0, y: 0, w: root.offsetWidth, h: root.offsetHeight },
      }
      setMeasured(true)
      continueRender(handle)
    })
  }, [])

  // The dialog's top-left in the plane, centered in the frame at true size.
  const s = boxes?.surface ?? { x: 0, y: 0, w: 512, h: 560 }
  const ox = (W - s.w) / 2
  const oy = (H - s.h) / 2
  // Close on the command, then down to the builders.
  const down = keys(frame, [
    [BAR - BEAT, 0],
    [BAR, 1],
  ])
  const b = boxes?.builders ?? { x: 0, y: s.h - 80, w: s.w, h: 60 }
  const fx = ox + s.w / 2
  // First the command and its button, centered; then the builders.
  const cmd = boxes ? boxes.copy.y - 24 : s.h * 0.6
  const fy = oy + (1 - down) * cmd + down * (b.y + b.h / 2)
  const zoom =
    (1.35 + down * 0.25) *
    (1 + punches(frame, [COPY_AT, OPEN_AT], 0.012))

  const builder = (i: number) =>
    clamp01((frame - (BUILDERS_AT + i * BUILDER_EVERY)) / 6)
  const target = (i: number) => {
    const col = i % 4
    const row = Math.floor(i / 4)
    const w = (b.w - 3 * 6) / 4
    return [ox + b.x + col * (w + 6) + w / 2, oy + b.y + row * 38 + 16] as const
  }
  const c = boxes?.copy
  const copyAt = c
    ? ([ox + c.x + c.w * 0.55, oy + c.y + c.h / 2] as const)
    : ([0, 0] as const)

  return (
    <AbsoluteFill>
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
            <div
              ref={surface}
              style={{ position: "absolute", left: ox, top: oy }}
            >
              <ExportSurface
                copied={frame >= COPY_AT}
                builder={builder}
                refs={{ copy, builders }}
              />
            </div>
            {boxes && (
              <Cursor
                path={[
                  [8, copyAt[0] + 140, copyAt[1] + 90],
                  [COPY_AT - 8, ...copyAt],
                  [BAR + BEAT, ...copyAt],
                  [OPEN_AT - 8, ...target(1)],
                ]}
                clicks={[COPY_AT, OPEN_AT]}
                from={8}
                size={0.7}
              />
            )}
          </div>
          <Caption
            frame={frame}
            lines={[
              [BEAT, "One command."],
              [BUILDERS_AT, "Or 8 AI builders."],
            ]}
          />
        </AbsoluteFill>
      </Theme>
    </AbsoluteFill>
  )
}

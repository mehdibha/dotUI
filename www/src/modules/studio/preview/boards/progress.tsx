"use client"

import { Label } from "@/registry/ui/field"
import {
  ProgressBar,
  ProgressBarControl,
  ProgressBarOutput,
} from "@/registry/ui/progress-bar"

import { Board, BoardSection, useReplay, useSteps } from "./board"

const STEPS = [12, 38, 64, 87, 100]

const BARS = [
  { label: "Storage", value: 92 },
  { label: "Onboarding", value: 60, valueLabel: "3 of 5 steps" },
  { label: "Indexing", indeterminate: true },
]

const FILES = [
  { name: "brand-guidelines.pdf", size: "4.2 MB", value: 100 },
  { name: "launch-video.mp4", size: "86 MB", value: 46 },
  { name: "product-shots.zip", size: "212 MB", value: 18 },
  { name: "changelog.md", size: "12 KB", value: 0 },
]

function Bar({
  label,
  value,
  valueLabel,
  indeterminate,
}: {
  label: string
  value?: number
  valueLabel?: string
  indeterminate?: boolean
}) {
  return (
    <ProgressBar
      value={value}
      valueLabel={valueLabel}
      isIndeterminate={indeterminate}
      className="w-full"
    >
      <div className="flex items-center justify-between gap-4">
        <Label>{label}</Label>
        {!indeterminate && <ProgressBarOutput />}
      </div>
      <ProgressBarControl />
    </ProgressBar>
  )
}

/** Steps through an upload; a fresh bar each cycle, so 100 → 12 restarts instead of sliding back. */
function Upload() {
  const motion = useReplay("progressMotion")
  const step = useSteps(motion, 1400)
  return (
    <Bar
      key={Math.floor(step / STEPS.length)}
      label="Uploading assets"
      value={motion.running ? STEPS[step % STEPS.length] : 64}
    />
  )
}

export default function ProgressBoard() {
  return (
    <Board id="progress">
      <BoardSection
        title="Variants"
        className="grid items-start justify-stretch gap-x-12 gap-y-8 sm:grid-cols-2"
      >
        <Upload />
        {BARS.map((bar) => (
          <Bar key={bar.label} {...bar} />
        ))}
      </BoardSection>
      <BoardSection title="In context" className="block">
        <ul className="grid w-full gap-5">
          {FILES.map((file) => (
            <li
              key={file.name}
              className="grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-x-6 gap-y-2 sm:grid-cols-[14rem_minmax(0,1fr)_3rem]"
            >
              <span className="flex min-w-0 items-baseline gap-2 text-sm max-sm:col-span-2">
                <span className="truncate font-medium">{file.name}</span>
                <span className="shrink-0 text-xs text-fg-muted">
                  {file.size}
                </span>
              </span>
              <ProgressBar
                aria-label={file.name}
                value={file.value}
                className="w-full"
              >
                <ProgressBarControl />
              </ProgressBar>
              <span className="text-right text-sm text-fg-muted tabular-nums">
                {file.value === 100
                  ? "Done"
                  : file.value
                    ? `${file.value}%`
                    : "Queued"}
              </span>
            </li>
          ))}
        </ul>
      </BoardSection>
    </Board>
  )
}

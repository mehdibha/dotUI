'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowUpIcon,
  ImageIcon,
  LinkIcon,
  MonitorIcon,
  PanelRightCloseIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TriangleAlertIcon,
  Undo2Icon,
} from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { DEFAULT_COLOR_CONFIG, resolveColorConfig } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { solidContrastReport } from '../colors/contrast'
import { useDesignSystem } from '../preset'
import { QUICK_PROMPTS } from './ai/engine'
import { GENERATORS, type Generator } from './ai/generators'
import { type ChatMessage, useStudio } from './store'

/* ----------------------------------------------------------------------------
 * The AI copilot — the headline of the rethink. Natural language in, live
 * design-system changes out, each turn undoable. It also volunteers insight
 * (real WCAG contrast on the current palette) and accepts richer inputs
 * ("generate from" an image / URL / screenshot). The "model" here is local and
 * simulated, but every change it makes is real and visible on the canvas.
 * -------------------------------------------------------------------------- */

export function Copilot() {
  const { thread, thinking, setCopilotOpen, clearThread } = useStudio()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [thread, thinking])

  return (
    <aside className="z-20 flex w-[340px] shrink-0 flex-col border-l bg-card">
      <header className="flex items-center gap-2 border-b px-4 py-3">
        <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
          <SparklesIcon className="size-3.5" />
        </span>
        <div className="flex-1">
          <h2 className="text-sm leading-none font-medium">Copilot</h2>
          <p className="mt-1 text-[11px] leading-none text-fg-muted">
            Describe it — I'll tune it live
          </p>
        </div>
        <Button
          size="sm"
          variant="quiet"
          className="h-7 px-2 text-xs text-fg-muted"
          onPress={clearThread}
        >
          Clear
        </Button>
        <Button
          size="sm"
          variant="quiet"
          isIconOnly
          aria-label="Collapse copilot"
          onPress={() => setCopilotOpen(false)}
        >
          <PanelRightCloseIcon />
        </Button>
      </header>

      <ContrastInsight />

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4"
      >
        <div className="flex flex-col gap-4">
          {thread.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {thinking && <Thinking />}
        </div>
      </div>

      <Composer />
    </aside>
  )
}

/* ------------------------------- Insight -------------------------------- */

function ContrastInsight() {
  const { designSystem, setColorAlgorithm } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const report = useMemo(
    () => solidContrastReport(resolveColorConfig(config)),
    [config],
  )
  const fails = report.filter((r) => r.level === 'fail')

  if (report.length === 0) return null

  if (fails.length === 0) {
    return (
      <div className="flex items-center gap-2 border-b bg-success/5 px-4 py-2.5 text-xs">
        <ShieldCheckIcon className="size-4 shrink-0 text-success" />
        <span className="text-fg-muted">
          All <span className="font-medium text-fg">{report.length}</span>{' '}
          palettes pass WCAG AA.
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 border-b bg-warning/5 px-4 py-2.5 text-xs">
      <TriangleAlertIcon className="size-4 shrink-0 text-warning" />
      <span className="flex-1 text-fg-muted">
        <span className="font-medium text-fg">{fails.length}</span>{' '}
        {fails.map((f) => f.name).join(', ')} fail AA on text.
      </span>
      <Button
        size="sm"
        variant="default"
        className="h-6 px-2 text-[11px]"
        onPress={() => setColorAlgorithm('contrast')}
      >
        Fix
      </Button>
    </div>
  )
}

/* ------------------------------- Messages ------------------------------- */

function MessageBubble({ message }: { message: ChatMessage }) {
  const { undoTurn } = useStudio()
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3 py-2 text-sm text-fg-on-primary">
          {message.text}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <SparklesIcon className="size-3" />
        </span>
        <p className="text-sm leading-relaxed text-balance text-fg">
          {message.text}
        </p>
      </div>
      {message.changed && (
        <ButtonPrimitives.Button
          onPress={() => undoTurn(message)}
          className="ml-7 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-fg-muted focus-reset transition-colors hover:bg-neutral hover:text-fg focus-visible:focus-ring"
        >
          <Undo2Icon className="size-3" />
          Undo this change
        </ButtonPrimitives.Button>
      )}
    </div>
  )
}

function Thinking() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <SparklesIcon className="size-3" />
      </span>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 animate-bounce rounded-full bg-fg-muted/60"
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: '0.9s',
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ------------------------------- Composer ------------------------------- */

function Composer() {
  const { runPrompt, runAction, thinking } = useStudio()
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const rotations = useRef<Record<string, number>>({})

  function submit() {
    const text = value.trim()
    if (!text || thinking) return
    runPrompt(text)
    setValue('')
  }

  function generate(id: Generator['id']) {
    const pool = GENERATORS[id]
    const n = rotations.current[id] ?? 0
    rotations.current[id] = n + 1
    const gen = pool[n % pool.length]
    if (gen) runAction(gen.userText, gen.assistantText, gen.mutate)
  }

  return (
    <div className="border-t p-3">
      {/* Quick prompts */}
      <div className="mb-2.5 flex flex-wrap gap-1.5">
        {QUICK_PROMPTS.map((q) => (
          <ButtonPrimitives.Button
            key={q.label}
            isDisabled={thinking}
            onPress={() => runPrompt(q.prompt)}
            className="rounded-full border px-2.5 py-1 text-xs text-fg-muted focus-reset transition-colors hover:bg-neutral hover:text-fg focus-visible:focus-ring disabled:opacity-50"
          >
            {q.label}
          </ButtonPrimitives.Button>
        ))}
      </div>

      {/* Generate from */}
      <div className="mb-2.5 flex items-center gap-1.5">
        <span className="text-[10px] tracking-wider text-fg-muted/70 uppercase">
          Generate from
        </span>
        <div className="flex items-center gap-1">
          <GenButton
            icon={ImageIcon}
            label="Image"
            onPress={() => generate('image')}
          />
          <GenButton
            icon={LinkIcon}
            label="URL"
            onPress={() => generate('url')}
          />
          <GenButton
            icon={MonitorIcon}
            label="Screenshot"
            onPress={() => generate('screenshot')}
          />
        </div>
      </div>

      {/* Input */}
      <div className="flex items-end gap-2 rounded-xl border bg-bg p-2 focus-within:border-border-focus">
        <textarea
          ref={inputRef}
          value={value}
          rows={1}
          placeholder="Make it warmer, more editorial…"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          className="max-h-28 min-h-[24px] flex-1 resize-none bg-transparent px-1 text-sm outline-none placeholder:text-fg-muted"
        />
        <Button
          size="sm"
          isIconOnly
          aria-label="Send"
          isDisabled={!value.trim() || thinking}
          onPress={submit}
        >
          <ArrowUpIcon />
        </Button>
      </div>
    </div>
  )
}

function GenButton({
  icon: Icon,
  label,
  onPress,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onPress: () => void
}) {
  const { thinking } = useStudio()
  return (
    <Tooltip delay={300}>
      <ButtonPrimitives.Button
        isDisabled={thinking}
        onPress={onPress}
        aria-label={`Generate from ${label}`}
        className="flex size-7 items-center justify-center rounded-md border text-fg-muted focus-reset transition-colors hover:bg-neutral hover:text-fg focus-visible:focus-ring disabled:opacity-50"
      >
        <Icon className="size-3.5" />
      </ButtonPrimitives.Button>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

/* ------------------------------ Collapsed rail ------------------------------ */

export function CopilotRail() {
  const { setCopilotOpen } = useStudio()
  return (
    <div className="z-20 flex w-12 shrink-0 flex-col items-center border-l bg-card py-3">
      <Tooltip delay={250}>
        <ButtonPrimitives.Button
          onPress={() => setCopilotOpen(true)}
          aria-label="Open copilot"
          className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary focus-reset transition-colors hover:bg-primary/20 focus-visible:focus-ring"
        >
          <SparklesIcon className="size-[18px]" />
        </ButtonPrimitives.Button>
        <TooltipContent placement="left">Open copilot</TooltipContent>
      </Tooltip>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'
import * as DialogPrimitives from 'react-aria-components/Dialog'

import { measure } from '@/lib/color-math'
import { cn } from '@/lib/utils'
import { Popover } from '@/ui/popover'

import { checkerboard, isPaintable } from './swatch'

interface MeasuredPair {
  label: string
  fg: string
  bg: string
}

interface SwatchPopoverProps {
  /** Dossier heading, e.g. "blue · 9". */
  title: string
  /** The value painted on the chip (active mode). */
  value: string
  /** Every mode's value, shown in the dossier. */
  values: Record<string, string>
  refText?: string | null
  note?: string | null
  /** Pairs to measure live (APCA + WCAG), e.g. this step on the scale's step-2. */
  measured?: MeasuredPair[]
  className?: string
}

function CopyValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <ButtonPrimitives.Button
      onPress={() => {
        void navigator.clipboard?.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
      }}
      className="group/copy inline-flex min-w-0 cursor-pointer items-center gap-1.5 rounded-sm font-mono text-xs outline-offset-2 focus-visible:outline-2"
    >
      <span className="truncate">{value}</span>
      {copied ? (
        <CheckIcon className="size-3 flex-none text-fg-success" />
      ) : (
        <CopyIcon className="size-3 flex-none text-fg-muted opacity-0 transition-opacity group-hover/copy:opacity-100" />
      )}
    </ButtonPrimitives.Button>
  )
}

/** A palette chip that opens a full dossier: per-mode values, references, live measurements. */
export function SwatchPopover({
  title,
  value,
  values,
  refText,
  note,
  measured = [],
  className,
}: SwatchPopoverProps) {
  const paintable = isPaintable(value)
  const measurements = measured
    .map((pair) => ({ ...pair, result: measure(pair.fg, pair.bg) }))
    .filter((pair) => pair.result !== null)

  return (
    <DialogPrimitives.DialogTrigger>
      <ButtonPrimitives.Button
        aria-label={`${title} · ${value}`}
        className={cn(
          'relative block h-8 min-w-4 flex-1 cursor-pointer overflow-hidden outline-offset-1 focus-visible:z-10 focus-visible:outline-2',
          !paintable && 'border border-dashed',
          className,
        )}
        style={paintable ? checkerboard : undefined}
      >
        {paintable ? (
          <span
            className="absolute inset-0"
            style={{ backgroundColor: value }}
          />
        ) : (
          <span className="flex h-full items-center justify-center px-1 font-mono text-[9px] text-fg-muted">
            {value.length > 10 ? 'var' : value}
          </span>
        )}
      </ButtonPrimitives.Button>
      <Popover placement="top">
        <DialogPrimitives.Dialog className="w-72 p-4 outline-none">
          <p className="font-mono text-xs font-medium">{title}</p>
          <dl className="mt-3 flex flex-col gap-1.5">
            {Object.entries(values).map(([mode, modeValue]) => (
              <div
                key={mode}
                className="grid grid-cols-[3.5rem_1.25rem_1fr] items-center gap-2"
              >
                <dt className="font-mono text-[11px] text-fg-muted">{mode}</dt>
                <dd
                  className="size-5 rounded-sm border"
                  style={
                    isPaintable(modeValue)
                      ? { backgroundColor: modeValue }
                      : undefined
                  }
                />
                <dd className="min-w-0">
                  <CopyValue value={modeValue} />
                </dd>
              </div>
            ))}
          </dl>
          {refText && (
            <p className="mt-3 font-mono text-[11px] break-words text-fg-muted">
              → {refText}
            </p>
          )}
          {measurements.length > 0 && (
            <div className="mt-3 border-t pt-3">
              {measurements.map((pair) => (
                <p
                  key={pair.label}
                  className="flex items-baseline justify-between gap-2 font-mono text-[11px]"
                >
                  <span className="text-fg-muted">{pair.label}</span>
                  <span>
                    Lc {pair.result!.apca.toFixed(1)} ·{' '}
                    {pair.result!.wcag.toFixed(2)}:1
                  </span>
                </p>
              ))}
              <p className="mt-1.5 text-[10px] text-fg-muted">
                measured from shipped values, not documentation
              </p>
            </div>
          )}
          {note && <p className="mt-3 text-xs text-fg-muted">{note}</p>}
        </DialogPrimitives.Dialog>
      </Popover>
    </DialogPrimitives.DialogTrigger>
  )
}

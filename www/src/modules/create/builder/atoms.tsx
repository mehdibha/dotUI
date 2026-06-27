'use client'

import type { ReactNode } from 'react'
import { ChevronDownIcon, type LucideIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'

import { BindingDot } from '../panel/primitives'
import type { Binding } from '../panel/types'
import { useBuilderUi } from './use-builder-ui'

/* Strong UI curves (see emil-design-eng): the built-in CSS easings lack punch. */
export const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'

/* ------------------------------- Aspect card ------------------------------ */

/**
 * One row of the rail. Collapsed it shows a live *readout* of its own output
 * (the macro glance); expanded it reveals the micro controls beneath. Opening
 * is a local height expansion — it never moves the preview or loses scroll —
 * so "graduating" from quick to deep costs nothing and loses nothing.
 */
export function AspectCard({
  id,
  icon: Icon,
  title,
  readout,
  accent = false,
  children,
}: {
  id: string
  icon: LucideIcon
  title: string
  /** The live mini-preview shown on the right of the head, collapsed or open. */
  readout?: ReactNode
  accent?: boolean
  children: ReactNode
}) {
  const { open, toggleCard, flashId } = useBuilderUi()
  const isOpen = open[id] ?? false
  const flashing = flashId === id

  return (
    <section
      data-card={id}
      className={cn(
        'scroll-mt-2 border-b transition-shadow duration-500',
        accent && 'bg-primary/[0.035]',
        flashing && 'shadow-[inset_2px_0_0_0_var(--color-primary)]',
      )}
    >
      <ButtonPrimitives.Button
        onPress={() => toggleCard(id)}
        aria-expanded={isOpen}
        className="group flex w-full items-center gap-3 px-3 py-3 text-left focus-reset transition-colors hover:bg-neutral/40 focus-visible:focus-ring"
      >
        <Icon className="size-4 shrink-0 text-fg-muted" />
        <span className="shrink-0 text-sm font-medium text-fg">{title}</span>
        <div className="ml-auto flex min-w-0 items-center justify-end">
          {readout}
        </div>
        <ChevronDownIcon
          className={cn(
            'size-4 shrink-0 text-fg-muted transition-transform duration-300',
            isOpen && 'rotate-180',
          )}
          style={{ transitionTimingFunction: EASE_OUT }}
        />
      </ButtonPrimitives.Button>

      {/* grid-rows height spring — smooth, no JS measuring. */}
      <div
        className="grid transition-[grid-template-rows] duration-300"
        style={{
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transitionTimingFunction: EASE_OUT,
        }}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              'px-3 pt-1 pb-4 transition-opacity duration-200',
              isOpen ? 'opacity-100 delay-75' : 'opacity-0',
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Body atoms ------------------------------- */

/** Indented stack of micro controls under a faint guide line — depth made spatial. */
export function MicroGroup({ children }: { children: ReactNode }) {
  return (
    <div className="mt-1 flex flex-col gap-4 border-l border-border/60 pl-3.5">
      {children}
    </div>
  )
}

/** A labelled control row inside a card body (stacked label over widget). */
export function Field({
  label,
  binding,
  hint,
  children,
}: {
  label: string
  binding?: Binding
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-[13px] font-medium text-fg">{label}</span>
        {binding && <BindingDot binding={binding} />}
      </div>
      {hint && <p className="text-xs leading-snug text-fg-muted">{hint}</p>}
      {children}
    </div>
  )
}

/** A glanceable head readout: muted caption + emphasized value. */
export function Readout({
  caption,
  value,
  mono = false,
}: {
  caption?: string
  value: ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex min-w-0 items-baseline gap-1.5">
      {caption && (
        <span className="shrink-0 text-[10px] tracking-wide text-fg-muted/80 uppercase">
          {caption}
        </span>
      )}
      <span
        className={cn(
          'truncate text-xs font-medium text-fg-muted',
          mono && 'font-mono tabular-nums',
        )}
      >
        {value}
      </span>
    </div>
  )
}

/** A small live color chip used across heads and editors. */
export function Swatch({
  color,
  className,
}: {
  color: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'size-5 shrink-0 rounded-md ring-1 ring-black/10 ring-inset',
        className,
      )}
      style={{ backgroundColor: color }}
      aria-hidden
    />
  )
}

/** A "drill into the deep editor" affordance — the door to a focused sub-editor. */
export function DrillButton({
  label,
  hint,
  onPress,
}: {
  label: string
  hint?: string
  onPress: () => void
}) {
  return (
    <ButtonPrimitives.Button
      onPress={onPress}
      className="group flex w-full items-center gap-2 rounded-lg border bg-neutral/40 px-3 py-2.5 text-left focus-reset transition-[colors,transform] hover:bg-neutral focus-visible:focus-ring active:scale-[0.99]"
    >
      <div className="flex flex-1 flex-col">
        <span className="text-[13px] font-medium text-fg">{label}</span>
        {hint && <span className="text-xs text-fg-muted">{hint}</span>}
      </div>
      <ChevronDownIcon className="size-4 -rotate-90 text-fg-muted transition-transform group-hover:translate-x-0.5" />
    </ButtonPrimitives.Button>
  )
}

'use client'

import type { ReactNode } from 'react'
import { ChevronDownIcon, type LucideIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'

import { type Binding, BindingDot } from './primitives'

export interface SpineRowProps {
  id: string
  title: string
  icon?: LucideIcon
  binding?: Binding
  /** Live spec-sheet shown on the right when collapsed (swatches, values). */
  summary?: ReactNode
  /** The inspector revealed on expand. */
  children?: ReactNode
  isOpen: boolean
  onToggle: () => void
  /** Dim + disable rows that have nothing to edit (e.g. param-less components). */
  disabled?: boolean
}

export function SpineRow({
  id,
  title,
  icon: Icon,
  binding,
  summary,
  children,
  isOpen,
  onToggle,
  disabled,
}: SpineRowProps) {
  return (
    <div
      data-row={id}
      data-open={isOpen ? '' : undefined}
      className={cn(
        'group/row relative scroll-mt-2 rounded-lg border border-transparent transition-colors',
        isOpen && 'border-border bg-neutral/40',
        disabled && 'opacity-45',
      )}
    >
      {/* Active accent bar when open */}
      {isOpen && (
        <span
          className="absolute top-2 bottom-2 left-0 w-0.5 rounded-full bg-primary"
          aria-hidden
        />
      )}

      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-expanded={isOpen}
        className={cn(
          'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left outline-none focus-visible:focus-ring',
          !isOpen && !disabled && 'hover:bg-neutral/60',
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              'size-4 shrink-0 transition-colors',
              isOpen ? 'text-fg' : 'text-fg-muted',
            )}
          />
        )}
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="text-sm font-medium whitespace-nowrap text-fg">
            {title}
          </span>
          {binding && <BindingDot binding={binding} />}
        </span>

        {/* Spec-sheet summary — hidden once open (the inspector replaces it). */}
        <span
          className={cn(
            'ml-auto flex min-w-0 items-center justify-end gap-1.5 transition-opacity',
            isOpen && 'opacity-0',
          )}
        >
          {!isOpen && summary}
        </span>

        <ChevronDownIcon
          className={cn(
            'size-4 shrink-0 text-fg-muted transition-transform duration-300',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {/* Expand-in-place via the grid-rows 0fr→1fr trick: no height measuring,
          survives re-renders (the preview-switch navigate used to interrupt a
          Framer height:auto animation and leave it stuck). */}
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              'px-3 pt-1 pb-4 transition-opacity duration-200',
              isOpen ? 'opacity-100 delay-100' : 'opacity-0',
            )}
          >
            {isOpen ? children : null}
          </div>
        </div>
      </div>
    </div>
  )
}

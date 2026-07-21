/**
 * The single export surface for /create: one dialog with a target picker
 * (shadcn CLI, v0, upcoming tools) and the code-style options. The trigger is
 * passed as children (the navbar CTA, the panel lab's footer button).
 */

import { useState, type ReactNode } from 'react'
import { ArrowUpRightIcon, CheckIcon, Code2Icon, CopyIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { createPersistedStore, enumCodec } from '@/lib/persisted-store'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { cn } from '@/registry/lib/utils'
import { buttonStyles } from '@/registry/ui/button'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Modal } from '@/registry/ui/modal'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'
import { ShadcnIcon } from '@/components/icons/shadcn'
import {
  buildInitCommands,
  buildInstallCommands,
  PACKAGE_MANAGERS,
  packageManagerStore,
} from '@/modules/docs/install-commands'
import type { PackageManager } from '@/modules/docs/install-commands'

import { CodeOptionsControls, CodeOptionsPreview } from '../code-options'
import { DEEPLINK_TARGETS, UPCOMING_TARGETS } from './targets'
import type { DeeplinkTarget } from './targets'
import { useExportUrl } from './use-export-url'

// Remembered so reopening lands on the tool the user actually exports to.
const lastTargetStore = createPersistedStore<string>(
  'dotui-export-target',
  'shadcn',
  enumCodec(['shadcn', ...DEEPLINK_TARGETS.map((t) => t.id)], 'shadcn'),
)

export function ExportDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      {children}
      <Modal className="h-[min(34rem,85svh)] w-[min(58rem,92vw)] sm:max-w-none">
        <DialogContent
          showCloseButton
          aria-label="Export design system"
          className="gap-0 overflow-hidden p-0"
        >
          <ExportDialogBody />
        </DialogContent>
      </Modal>
    </Dialog>
  )
}

function ExportDialogBody() {
  const [view, setView] = useState(() => lastTargetStore.get())

  function selectTarget(id: string) {
    setView(id)
    lastTargetStore.set(id)
  }

  const deeplink = DEEPLINK_TARGETS.find((t) => t.id === view)

  return (
    <div className="flex h-full min-h-0 flex-col md:flex-row">
      {/* On mobile the wrapper insets the strip's scrollport so rows never
          slide under the close button; `md:contents` dissolves it on desktop. */}
      <div className="shrink-0 max-md:border-b max-md:pr-12 md:contents">
        <nav
          aria-label="Export options"
          className="flex gap-1 overflow-x-auto p-2 max-md:items-center md:w-48 md:shrink-0 md:flex-col md:overflow-y-auto md:border-r md:p-3"
        >
          <SectionLabel className="max-md:hidden">Export to</SectionLabel>
          <NavRow
            isSelected={view === 'shadcn'}
            onPress={() => selectTarget('shadcn')}
          >
            <ShadcnIcon className="size-4 shrink-0" />
            shadcn CLI
          </NavRow>
          {DEEPLINK_TARGETS.map((target) => (
            <NavRow
              key={target.id}
              label={target.name}
              isSelected={view === target.id}
              onPress={() => selectTarget(target.id)}
            >
              <span aria-hidden className="flex items-center">
                {target.wordmark}
              </span>
            </NavRow>
          ))}
          {UPCOMING_TARGETS.map((target) => (
            <NavRow
              key={target.id}
              label={`${target.name} (coming soon)`}
              isDisabled
            >
              <span aria-hidden className="flex items-center">
                {target.wordmark}
              </span>
              <span className="ml-auto rounded-full border px-1.5 py-px text-[10px] max-md:ml-1">
                Soon
              </span>
            </NavRow>
          ))}
          <SectionLabel className="mt-3 max-md:hidden">Options</SectionLabel>
          <NavRow
            isSelected={view === 'code-style'}
            onPress={() => setView('code-style')}
          >
            <Code2Icon className="size-4 shrink-0" />
            Code style
          </NavRow>
        </nav>
      </div>

      <div className="min-h-0 min-w-0 flex-1">
        {view === 'code-style' ? (
          <CodeStylePane />
        ) : deeplink ? (
          <DeeplinkPane target={deeplink} />
        ) : (
          <ShadcnPane />
        )}
      </div>
    </div>
  )
}

/* --------------------------------- Panes -------------------------------- */

function ShadcnPane() {
  const presetUrl = useExportUrl()
  const packageManager = packageManagerStore.useValue()
  const initCommand = buildInitCommands(presetUrl('/r/init'))[packageManager]
  const addCommand = buildInstallCommands(['button'])[packageManager]

  return (
    <div className="flex h-full min-h-0 flex-col gap-5 overflow-y-auto p-5">
      <header className="pr-8">
        <h2 className="text-sm font-medium">shadcn CLI</h2>
        <p className="mt-0.5 text-xs text-fg-muted">
          Install the design system into your own codebase — you own the code.
        </p>
      </header>
      <ToggleButtonGroup
        aria-label="Package manager"
        size="sm"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[packageManager]}
        onSelectionChange={(keys) => {
          const next = keys.values().next().value
          if (typeof next === 'string') {
            packageManagerStore.set(next as PackageManager)
          }
        }}
        className="self-start"
      >
        {PACKAGE_MANAGERS.map((pm) => (
          <ToggleButton key={pm} id={pm}>
            {pm}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <Step
        n={1}
        title="Initialize"
        description="Run in your project root. Registers this design system, so components resolve to it."
      >
        <CommandCard command={initCommand} label="Copy init command" />
      </Step>
      <Step
        n={2}
        title="Add components"
        description="Every component installs already themed to your system."
      >
        <CommandCard command={addCommand} label="Copy add command" />
      </Step>
    </div>
  )
}

function DeeplinkPane({ target }: { target: DeeplinkTarget }) {
  const presetUrl = useExportUrl()

  return (
    <div className="flex h-full flex-col items-center justify-center gap-1.5 overflow-y-auto p-8 text-center">
      <h2 className="text-sm font-medium">Open in {target.name}</h2>
      <p className="max-w-xs text-xs text-fg-muted">{target.description}</p>
      <a
        href={target.href(presetUrl)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonStyles({ variant: 'primary' }), 'mt-4')}
      >
        Open in {target.name}
        <ArrowUpRightIcon data-icon-end="" />
      </a>
    </div>
  )
}

function CodeStylePane() {
  return (
    <div className="flex h-full min-h-0 flex-col md:flex-row">
      <div className="flex w-full shrink-0 flex-col overflow-y-auto border-b p-5 md:w-72 md:border-r md:border-b-0">
        <h2 className="text-sm font-medium">Code style</h2>
        <p className="mt-0.5 mb-4 text-xs text-fg-muted">
          Shape the exported code to match your codebase — applies to every
          export target.
        </p>
        <CodeOptionsControls />
      </div>
      <CodeOptionsPreview />
    </div>
  )
}

/* ------------------------------ Primitives ------------------------------ */

function NavRow({
  label,
  isSelected = false,
  isDisabled = false,
  onPress,
  children,
}: {
  /** Accessible name for rows whose visible content is a brand wordmark. */
  label?: string
  isSelected?: boolean
  isDisabled?: boolean
  onPress?: () => void
  children: ReactNode
}) {
  return (
    <ButtonPrimitives.Button
      aria-label={label}
      onPress={onPress}
      isDisabled={isDisabled}
      aria-current={isSelected ? 'true' : undefined}
      className={cn(
        'flex h-8 shrink-0 items-center gap-2 rounded-md px-2.5 text-sm focus-reset transition-colors focus-visible:focus-ring md:w-full',
        isSelected
          ? 'bg-neutral text-fg'
          : 'text-fg-muted hover:bg-neutral hover:text-fg',
        isDisabled &&
          'text-fg-muted/60 hover:bg-transparent hover:text-fg-muted/60',
      )}
    >
      {children}
    </ButtonPrimitives.Button>
  )
}

function Step({
  n,
  title,
  description,
  children,
}: {
  n: number
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="flex gap-3">
      <span
        aria-hidden
        className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium text-fg-muted"
      >
        {n}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div>
          <h3 className="text-sm">{title}</h3>
          <p className="mt-0.5 text-xs text-fg-muted">{description}</p>
        </div>
        {children}
      </div>
    </div>
  )
}

function SectionLabel({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'px-2.5 pt-1 pb-1.5 text-[10px] tracking-widest text-fg-muted uppercase',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** A copy-able command box. Click copies the command to the clipboard. */
function CommandCard({ command, label }: { command: string; label: string }) {
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <ButtonPrimitives.Button
      onPress={() => copyToClipboard(command)}
      aria-label={label}
      className="group/command flex w-full items-start gap-2 rounded-md border bg-bg p-2 text-left font-mono text-[11px] leading-tight text-fg-muted focus-reset transition-colors hover:bg-neutral-hover focus-visible:focus-ring"
    >
      <span className="min-w-0 flex-1 break-all">{command}</span>
      <span className="mt-0.5 text-fg-muted/60 group-hover/command:text-fg">
        {isCopied ? (
          <CheckIcon className="size-3.5" />
        ) : (
          <CopyIcon className="size-3.5" />
        )}
      </span>
    </ButtonPrimitives.Button>
  )
}

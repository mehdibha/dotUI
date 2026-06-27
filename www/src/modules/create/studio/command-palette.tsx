'use client'

import { CornerDownLeftIcon } from 'lucide-react'

import {
  Command,
  CommandContent,
  CommandInput,
  CommandItem,
} from '@/registry/ui/command'
import { Input } from '@/registry/ui/input'
import { Kbd } from '@/registry/ui/kbd'
import { Modal } from '@/registry/ui/modal'

import { useStudio } from './context'
import type { WorkspaceId } from './context'

interface ControlEntry {
  id: string
  label: string
  workspace: WorkspaceId
  workspaceLabel: string
  anchor?: string
  keywords?: string
}

/** Every reachable control, flattened for search. */
const CONTROL_INDEX: ControlEntry[] = [
  // Color
  [
    'brand-color',
    'Brand / accent color',
    'color',
    'Color',
    'brand-color',
    'accent primary hue seed',
  ],
  [
    'base-color',
    'Base / gray color',
    'color',
    'Color',
    'base-color',
    'neutral gray grey',
  ],
  [
    'color-algorithm',
    'Generation algorithm',
    'color',
    'Color',
    'color-algorithm',
    'oklch tailwind material contrast',
  ],
  [
    'status-colors',
    'Status colors',
    'color',
    'Color',
    'status-colors',
    'success warning danger info',
  ],
  [
    'color-engine',
    'Fine-tune ramps',
    'color',
    'Color',
    'color-engine',
    'chroma contrast knobs',
  ],
  // Typography
  [
    'heading-font',
    'Display font',
    'typography',
    'Typography',
    'heading-font',
    'heading title',
  ],
  [
    'body-font',
    'Body font',
    'typography',
    'Typography',
    'body-font',
    'text paragraph',
  ],
  [
    'type-scale',
    'Type scale ratio',
    'typography',
    'Typography',
    'type-scale',
    'modular ratio',
  ],
  [
    'base-size',
    'Base font size',
    'typography',
    'Typography',
    'base-size',
    'rem',
  ],
  [
    'letter-spacing',
    'Letter spacing',
    'typography',
    'Typography',
    'letter-spacing',
    'tracking kerning',
  ],
  // Shape
  [
    'radius-factor',
    'Radius factor',
    'shape',
    'Shape',
    'radius-factor',
    'corner rounding',
  ],
  [
    'border-width',
    'Border width',
    'shape',
    'Shape',
    'border-width',
    'stroke hairline',
  ],
  // Spacing
  [
    'density',
    'Density',
    'spacing',
    'Spacing',
    'density',
    'compact comfortable',
  ],
  [
    'spacing-scale',
    'Spacing scale',
    'spacing',
    'Spacing',
    'spacing-scale',
    'padding gap',
  ],
  // Surface
  [
    'style-family',
    'Style family',
    'surface',
    'Surface',
    'style-family',
    'flat soft glass 3d neumorphism',
  ],
  [
    'shadow-intensity',
    'Shadow intensity',
    'surface',
    'Surface',
    'shadow-intensity',
    'elevation',
  ],
  [
    'backdrop-blur',
    'Backdrop blur',
    'surface',
    'Surface',
    'backdrop-blur',
    'frost glass',
  ],
  // Motion
  [
    'duration',
    'Motion duration',
    'motion',
    'Motion',
    'duration',
    'speed transition',
  ],
  // Icons
  [
    'icon-library',
    'Icon library',
    'icons',
    'Iconography',
    'icon-library',
    'lucide tabler remix',
  ],
  [
    'icon-stroke',
    'Icon stroke width',
    'icons',
    'Iconography',
    'icon-stroke',
    'weight',
  ],
  // Interaction
  [
    'cursor-interactive',
    'Interactive cursor',
    'interaction',
    'Interaction',
    'cursor-interactive',
    'pointer',
  ],
  [
    'cursor-disabled',
    'Disabled cursor',
    'interaction',
    'Interaction',
    'cursor-disabled',
    'not-allowed',
  ],
  [
    'focus-ring-width',
    'Focus ring width',
    'interaction',
    'Interaction',
    'focus-ring-width',
    'a11y outline',
  ],
  [
    'default-mode',
    'Default mode',
    'interaction',
    'Interaction',
    'default-mode',
    'light dark system',
  ],
  // Components
  [
    'components',
    'Browse all components',
    'components',
    'Components',
    undefined,
    'button input card tweak',
  ],
].map(([id, label, workspace, workspaceLabel, anchor, keywords]) => ({
  id: id as string,
  label: label as string,
  workspace: workspace as WorkspaceId,
  workspaceLabel: workspaceLabel as string,
  anchor: anchor as string | undefined,
  keywords: keywords as string | undefined,
}))

const BY_ID = new Map(CONTROL_INDEX.map((c) => [c.id, c]))

export function CommandPalette() {
  const { commandOpen, setCommandOpen, goTo } = useStudio()

  return (
    <Modal
      isOpen={commandOpen}
      onOpenChange={setCommandOpen}
      isDismissable
      className="w-[min(34rem,92vw)] overflow-hidden p-0"
    >
      <Command
        aria-label="Search every control"
        className="flex max-h-[min(28rem,70vh)] flex-col"
      >
        <CommandInput
          aria-label="Search every control"
          autoFocus
          className="w-full border-b p-2.5"
        >
          <Input placeholder="Jump to any control…" className="w-full" />
        </CommandInput>
        <CommandContent
          aria-label="Controls"
          className="min-h-0 flex-1 overflow-y-auto p-2"
          onAction={(key) => {
            const entry = BY_ID.get(String(key))
            if (entry) goTo(entry.workspace, entry.anchor)
          }}
        >
          {CONTROL_INDEX.map((entry) => (
            <CommandItem
              key={entry.id}
              id={entry.id}
              textValue={`${entry.label} ${entry.workspaceLabel} ${entry.keywords ?? ''}`}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="truncate">{entry.label}</span>
                <span className="shrink-0 font-mono text-[10px] tracking-wide text-fg-muted/70 uppercase">
                  {entry.workspaceLabel}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandContent>
        <div className="flex items-center justify-between gap-2 border-t px-3 py-2 text-[11px] text-fg-muted">
          <span>Search every axis of the system</span>
          <span className="flex items-center gap-1">
            <Kbd>
              <CornerDownLeftIcon className="size-3" />
            </Kbd>
            to jump
          </span>
        </div>
      </Command>
    </Modal>
  )
}

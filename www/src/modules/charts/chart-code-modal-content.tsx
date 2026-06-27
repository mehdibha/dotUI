'use client'

import { Suspense, use } from 'react'

import { DialogTitle } from '@/registry/ui/dialog'
import { CodeBlock } from '@/modules/docs/code-block'
import {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from '@/modules/docs/code-block-tabs'
import { DynamicPre } from '@/modules/docs/dynamic-pre'

import {
  demoSource,
  getDemoComponent,
  installCommands,
  installItems,
  PACKAGE_MANAGERS,
} from './data'

interface ChartCodeModalContentProps {
  /** Demo key, e.g. `chart-bar/demos/multiple`. */
  demoKey: string
  /** Human label, e.g. `multiple`. */
  label: string
}

/**
 * Body of the "Show code" modal — title, live preview, and install command on
 * the left; the variant's source filling the full modal height on the right.
 * Lazily mounted (see chart-code-modal), so its heavy imports (the highlighter)
 * load only on first open. Source is read via `use()` against a cached promise,
 * so the modal suspends until it resolves.
 */
export default function ChartCodeModalContent({
  demoKey,
  label,
}: ChartCodeModalContentProps) {
  const Component = getDemoComponent(demoKey)
  const source = use(demoSource(demoKey))
  const commands = installCommands(installItems(demoKey, source))

  return (
    <div className="flex h-full min-h-0 flex-col md:flex-row">
      {/* LEFT: title, live preview, install command */}
      <div className="flex min-h-0 flex-col md:w-2/5 md:border-r lg:w-1/2">
        <DialogTitle className="shrink-0 px-4 pt-3 text-sm text-fg-muted capitalize">
          {label}
        </DialogTitle>
        <div className="flex min-h-56 flex-1 items-center justify-center overflow-auto p-6 sm:p-8">
          {Component ? (
            <Suspense fallback={null}>
              <Component />
            </Suspense>
          ) : null}
        </div>
        <div className="shrink-0 border-t p-4">
          <p className="mb-2 text-xs font-medium text-fg-muted">Install</p>
          <CodeBlockTabs
            groupId="package-manager"
            defaultValue="pnpm"
            className="gap-2"
          >
            <CodeBlockTabsList>
              {PACKAGE_MANAGERS.map((pm) => (
                <CodeBlockTabsTrigger key={pm} value={pm}>
                  {pm}
                </CodeBlockTabsTrigger>
              ))}
            </CodeBlockTabsList>
            {PACKAGE_MANAGERS.map((pm) => (
              <CodeBlockTab key={pm} value={pm}>
                <CodeBlock>
                  <pre className="overflow-x-auto px-3 py-2.5 font-mono text-[0.8125rem] text-fg">
                    {commands[pm]}
                  </pre>
                </CodeBlock>
              </CodeBlockTab>
            ))}
          </CodeBlockTabs>
        </div>
      </div>

      {/* RIGHT: variant source, filling the full modal height */}
      <div className="flex min-h-0 flex-1 flex-col border-t bg-card md:border-t-0">
        <div className="min-h-0 flex-1 overflow-auto">
          {source ? (
            <CodeBlock className="rounded-none border-0 bg-transparent">
              <DynamicPre lang="tsx">{source}</DynamicPre>
            </CodeBlock>
          ) : (
            <p className="p-4 text-sm text-fg-muted">Source unavailable.</p>
          )}
        </div>
      </div>
    </div>
  )
}

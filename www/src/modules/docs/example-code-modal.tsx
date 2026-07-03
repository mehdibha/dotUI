import type React from 'react'
import { CodeIcon, XIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/registry/ui/dialog'
import { Modal } from '@/registry/ui/modal'

import { CodeBlock, Pre } from './code-block'
import {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from './code-block-tabs'
import { DemoPreset } from './demo-preset'
import { buildInstallCommands, PACKAGE_MANAGERS } from './install-commands'

export interface ExampleCodeModalProps {
  /** Modal title — the example's title. */
  title: string
  /** The live demo component, rendered as the preview. */
  component: React.ComponentType
  /** Pre-highlighted source (the `DemoCode` slot content built at MDX build time). */
  code: React.ReactNode
  /** Demo file name shown as the code block title, e.g. `disabled.tsx`. */
  file?: string
  /** Registry items to install, e.g. `["button"]`. */
  install: string[]
}

/**
 * The example card's "Show code" action: a quiet trigger that opens a large
 * modal with the live preview and install command on the left and the example's
 * source on the right — mirroring the gallery modal on /charts. The source is
 * already highlighted at build time (passed in as `code`), so nothing here pulls
 * in the syntax highlighter.
 */
export function ExampleCodeModal({
  title,
  component: Component,
  code,
  file,
  install,
}: ExampleCodeModalProps) {
  const commands = buildInstallCommands(install)

  return (
    <Dialog>
      <Button variant="quiet" size="sm" className="text-fg-muted hover:text-fg">
        <CodeIcon />
        Show code
      </Button>
      <Modal className="h-[80vh] w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl">
        <DialogContent
          aria-label={`${title} code`}
          className="relative flex h-full min-h-0 flex-col rounded-[inherit] p-0"
        >
          {/* Close sits just outside the panel's top-right corner. Kept inside
              the dialog (so slot="close" works) but escaping the rounded body. */}
          <Button
            slot="close"
            variant="quiet"
            size="sm"
            isIconOnly
            aria-label="Close"
            className="absolute -top-10 right-0 z-10 text-fg-muted hover:bg-inverse/10 hover:text-fg"
          >
            <XIcon />
          </Button>
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[inherit] md:flex-row">
            {/* LEFT: title, live preview, install command */}
            <div className="flex min-h-0 min-w-0 flex-col md:w-2/5 md:border-r lg:w-1/2">
              <DialogTitle className="shrink-0 px-4 pt-3 text-sm text-fg-muted">
                {title}
              </DialogTitle>
              <div className="flex min-h-56 flex-1 items-center justify-center overflow-auto p-6 sm:p-8">
                <DemoPreset>
                  <Component />
                </DemoPreset>
              </div>
              {install.length > 0 ? (
                <div className="shrink-0 border-t p-4">
                  <p className="mb-2 text-xs font-medium text-fg-muted">
                    Install
                  </p>
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
              ) : null}
            </div>

            {/* RIGHT: example source, filling the full modal height */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col border-t bg-card md:border-t-0">
              <CodeBlock
                title={file}
                className="flex min-h-0 flex-1 flex-col rounded-none border-0 bg-transparent"
                contentClassName="no-scrollbar min-h-0 flex-1 scroll-fade-y overflow-y-auto"
              >
                <Pre className="no-scrollbar w-full scroll-fade-x overflow-x-auto *:[code]:w-max *:[code]:min-w-full">
                  {code}
                </Pre>
              </CodeBlock>
            </div>
          </div>
        </DialogContent>
      </Modal>
    </Dialog>
  )
}

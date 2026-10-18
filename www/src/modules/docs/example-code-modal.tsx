import type React from "react"
import { CodeIcon, XIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/registry/ui/dialog"
import { Modal } from "@/registry/ui/modal"

import { CodeBlock, Pre } from "./code-block"
import {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
} from "./code-block-tabs"
import { DemoPreset } from "./demo-preset"
import { buildInstallCommands, PACKAGE_MANAGERS } from "./install-commands"

/** Class for the `<pre>` passed as `CodeModalBody`'s `code`. */
export const CODE_MODAL_PRE_CLASS =
  "no-scrollbar w-full scroll-fade-x overflow-x-auto *:[code]:w-max *:[code]:min-w-full"

/** A quiet "Show code" trigger and the large modal it opens. */
export function CodeModal({
  label,
  children,
}: {
  /** Accessible name of the dialog. */
  label: string
  children: React.ReactNode
}) {
  return (
    <Dialog>
      <Button variant="quiet" size="sm" className="text-fg-muted hover:text-fg">
        <CodeIcon />
        Show code
      </Button>
      <Modal className="h-[80vh] w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl">
        <DialogContent
          aria-label={label}
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
          {children}
        </DialogContent>
      </Modal>
    </Dialog>
  )
}

/** Title, live preview and install command on the left; the source on the right. */
export function CodeModalBody({
  title,
  preview,
  install,
  file,
  code,
}: {
  title: React.ReactNode
  preview: React.ReactNode
  /** Registry items to install, e.g. `["button"]`. */
  install: string[]
  /** File name shown as the code block title, e.g. `disabled.tsx`. */
  file?: string
  /** The source as a `<pre>` (see `CODE_MODAL_PRE_CLASS`). */
  code: React.ReactNode
}) {
  const commands = buildInstallCommands(install)

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[inherit] md:flex-row">
      <div className="flex min-h-0 min-w-0 flex-col md:w-2/5 md:border-r lg:w-1/2">
        <DialogTitle className="shrink-0 px-4 pt-3 text-sm text-fg-muted">
          {title}
        </DialogTitle>
        <div className="flex min-h-56 flex-1 items-center justify-center overflow-auto p-6 sm:p-8">
          {preview}
        </div>
        {install.length > 0 ? (
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
        ) : null}
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col border-t bg-card md:border-t-0">
        <CodeBlock
          title={file}
          className="flex min-h-0 flex-1 flex-col rounded-none border-0 bg-transparent"
          contentClassName="no-scrollbar min-h-0 flex-1 scroll-fade-y overflow-y-auto"
        >
          {code}
        </CodeBlock>
      </div>
    </div>
  )
}

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

/** An example card's "Show code" modal. The source is highlighted at build time. */
export function ExampleCodeModal({
  title,
  component: Component,
  code,
  file,
  install,
}: ExampleCodeModalProps) {
  return (
    <CodeModal label={`${title} code`}>
      <CodeModalBody
        title={title}
        preview={
          <DemoPreset>
            <Component />
          </DemoPreset>
        }
        install={install}
        file={file}
        code={<Pre className={CODE_MODAL_PRE_CLASS}>{code}</Pre>}
      />
    </CodeModal>
  )
}

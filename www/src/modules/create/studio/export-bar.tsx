'use client'

import { useState } from 'react'
import { CheckIcon, Code2Icon, CopyIcon, Share2Icon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { Button } from '@/registry/ui/button'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { CodeOptionsDialog } from '../code-options'
import { EXPORT_TARGETS } from '../export/targets'
import { useExportUrl } from '../export/use-export-url'

function useClipboard() {
  const [copied, setCopied] = useState(false)
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* no-op on clipboard failure */
    }
  }
  return { copied, copy }
}

/**
 * The export payoff in two tight rows instead of three fat blocks: a single-line,
 * copyable install command (the long preset URL stays hidden behind the copy),
 * then a compact action row — code style, the deeplink targets, and share.
 */
export function ExportBar() {
  const presetUrl = useExportUrl()
  const command = EXPORT_TARGETS.find((t) => t.kind === 'command')
  const deeplinks = EXPORT_TARGETS.filter((t) => t.kind === 'deeplink')
  const cmd = useClipboard()
  const share = useClipboard()

  return (
    <div className="flex flex-col gap-2 border-t p-2.5">
      {command?.kind === 'command' && (
        <CompactCommand
          command={command.command(presetUrl)}
          copied={cmd.copied}
          onCopy={() => cmd.copy(command.command(presetUrl))}
        />
      )}

      <div className="flex items-center gap-1.5">
        <CodeOptionsDialog
          trigger={
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              aria-label="Code style"
            >
              <Code2Icon />
            </Button>
          }
        />

        {deeplinks.map((t) =>
          t.kind === 'deeplink' ? (
            <a
              key={t.id}
              href={t.href(presetUrl)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.ariaLabel ?? t.label}
              className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-primary text-sm font-medium text-fg-on-primary focus-reset transition-colors hover:bg-primary-hover focus-visible:focus-ring"
            >
              {t.label} {t.icon}
            </a>
          ) : null,
        )}

        <Tooltip delay={300}>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label="Copy share link"
            onPress={() => share.copy(window.location.href)}
          >
            {share.copied ? <CheckIcon /> : <Share2Icon />}
          </Button>
          <TooltipContent>
            {share.copied ? 'Link copied' : 'Copy share link'}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

function CompactCommand({
  command,
  copied,
  onCopy,
}: {
  command: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <ButtonPrimitives.Button
      onPress={onCopy}
      aria-label="Copy install command"
      className="group/cmd flex h-8 w-full items-center gap-2 rounded-md border bg-bg px-2 text-left font-mono text-[11px] text-fg-muted focus-reset transition-colors hover:bg-neutral-hover focus-visible:focus-ring"
    >
      <span className="shrink-0 text-fg-muted/40 select-none">$</span>
      <span className="min-w-0 flex-1 truncate">{command}</span>
      <span className="shrink-0 text-fg-muted/60 group-hover/cmd:text-fg">
        {copied ? (
          <CheckIcon className="size-3.5" />
        ) : (
          <CopyIcon className="size-3.5" />
        )}
      </span>
    </ButtonPrimitives.Button>
  )
}

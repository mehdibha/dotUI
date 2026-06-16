import { type ReactNode, useState } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

/**
 * A copy-able command box (the shadcn CLI install command). Click copies the
 * command to the clipboard.
 */
export function CommandCard({
  command,
  label,
}: {
  command: string
  label: string
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* no-op on clipboard failure */
    }
  }

  return (
    <ButtonPrimitives.Button
      onPress={copy}
      aria-label={label}
      className="group/command flex w-full items-start gap-2 rounded-md border bg-bg p-2 text-left font-mono text-[11px] leading-tight text-fg-muted hover:bg-neutral-hover"
    >
      <span className="flex-1 break-all">{command}</span>
      <span className="mt-0.5 text-fg-muted/60 group-hover/command:text-fg">
        {copied ? (
          <CheckIcon className="size-3.5" />
        ) : (
          <CopyIcon className="size-3.5" />
        )}
      </span>
    </ButtonPrimitives.Button>
  )
}

/**
 * A primary-button anchor that opens an export target in a new tab (e.g. v0).
 */
export function DeeplinkButton({
  href,
  label,
  ariaLabel,
  icon,
}: {
  href: string
  label: string
  ariaLabel?: string
  icon: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-fg-on-primary transition-colors hover:bg-primary-hover"
    >
      {label} {icon}
    </a>
  )
}

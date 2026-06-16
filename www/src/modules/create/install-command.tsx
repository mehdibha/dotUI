/**
 * Footer block on the customizer panel: shows the `shadcn init` command
 * the user can paste into their project to install the current preset.
 *
 * Updates live as the design system changes (the encoded preset is part of
 * the URL fragment behind `?preset=`). Provides a one-click copy.
 */

import { useEffect, useMemo, useState } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { siteConfig } from '@/config/site'

import { useDesignSystem } from './preset'
import { encodePreset } from './preset/codec'

const DEFAULT_REGISTRY_HOST: string = siteConfig.url

function getRegistryHost(): string {
  if (typeof window === 'undefined') return DEFAULT_REGISTRY_HOST
  // On a deployed origin the command points back at it; on localhost / file we
  // fall back to the public host, since v0 and the shadcn CLI can't fetch a local
  // URL. Match on `hostname` (not the full origin) so any dev port still counts.
  const { origin, hostname } = window.location
  if (
    origin === 'null' ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    origin.startsWith('file:')
  ) {
    return DEFAULT_REGISTRY_HOST
  }
  return origin
}

export function InstallCommand() {
  const { designSystem } = useDesignSystem()
  const [host, setHost] = useState(DEFAULT_REGISTRY_HOST)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setHost(getRegistryHost())
  }, [])

  const command = useMemo(() => {
    const encoded = encodePreset(designSystem)
    const url = encoded ? `${host}/r/init?preset=${encoded}` : `${host}/r/init`
    // `shadcn init <url>` is the right command for our `registry:base` item:
    //  - `init` is the only command that merges the item's `config.registries`
    //    into the consumer's components.json, so a later
    //    `shadcn add @dotui/<name>` resolves with the same preset baked in.
    //  - it also installs the deps, writes the theme css/cssVars, and ships
    //    `src/lib/utils.ts` — everything `add` did, plus the registry wiring.
    //  - `shadcn add <url>` silently drops `config.registries` on a project that
    //    already has components.json, which breaks per-component installs.
    return `npx shadcn init ${url}`
  }, [designSystem, host])

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
      aria-label="Copy install command"
      className="group/install flex w-full items-start gap-2 rounded-md border bg-bg p-2 text-left font-mono text-[11px] leading-tight text-fg-muted hover:bg-neutral-hover"
    >
      <span className="flex-1 break-all">{command}</span>
      <span className="mt-0.5 text-fg-muted/60 group-hover/install:text-fg">
        {copied ? (
          <CheckIcon className="size-3.5" />
        ) : (
          <CopyIcon className="size-3.5" />
        )}
      </span>
    </ButtonPrimitives.Button>
  )
}

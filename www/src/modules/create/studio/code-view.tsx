'use client'

import { useMemo, useState } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import {
  DEFAULT_COLOR_CONFIG,
  emitPrimitivesCss,
  resolveColorConfig,
} from '@/registry/theme'
import { Button } from '@/registry/ui/button'

import { useExportUrl } from '../export/use-export-url'
import { useDesignSystem } from '../preset'

type Tab = 'css' | 'install'

/** The "code you own" — the real generated primitive CSS + the install command. */
export function CodeView() {
  const { designSystem } = useDesignSystem()
  const presetUrl = useExportUrl()
  const [tab, setTab] = useState<Tab>('css')
  const [copied, setCopied] = useState(false)

  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const css = useMemo(
    () => emitPrimitivesCss(resolveColorConfig(config), { onColors: true }),
    [config],
  )
  const install = `npx shadcn init ${presetUrl('/r/init')}`
  const content = tab === 'css' ? css : install

  function copy() {
    navigator.clipboard?.writeText(content).then(
      () => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1400)
      },
      () => {},
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b px-4 py-2.5">
        <div className="flex gap-1 rounded-md bg-neutral p-0.5">
          {(
            [
              { id: 'css', label: 'theme.css' },
              { id: 'install', label: 'Install' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'rounded px-2.5 py-1 font-mono text-[12px] transition-colors',
                tab === t.id
                  ? 'bg-card text-fg shadow-sm'
                  : 'text-fg-muted hover:text-fg',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Button
          size="sm"
          variant="quiet"
          onPress={copy}
          className={cn('ml-auto gap-1.5', copied && 'text-success')}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-bg p-4">
        <pre className="font-mono text-[12px] leading-relaxed text-fg-muted">
          <code>{content}</code>
        </pre>
      </div>
    </div>
  )
}

/**
 * Live preview of the exported button component. Fetches the real `/r/button`
 * registry endpoint (same publisher + oxfmt the user gets on install),
 * debounced and same-origin, so every codeOptions toggle shows the actual
 * resulting source. Highlighting reuses the docs `DynamicPre` (synchronous
 * shiki).
 */

import { useEffect, useMemo, useState } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { Button } from '@/registry/ui/button'
import { DynamicPre } from '@/modules/docs/dynamic-pre'

import { useDesignSystem } from '../preset'
import { encodePreset } from '../preset/codec'

const PREVIEW_FILE = 'components/ui/button.tsx'

export function CodeOptionsPreview() {
  const { designSystem } = useDesignSystem()
  const encoded = useMemo(() => encodePreset(designSystem), [designSystem])

  // Debounce so dragging a slider / flipping switches doesn't spam the endpoint.
  const [debounced, setDebounced] = useState(encoded)
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(encoded), 300)
    return () => window.clearTimeout(t)
  }, [encoded])

  const [code, setCode] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    // Same-origin fetch — works on localhost and on the deployed site. The
    // endpoint runs the real publisher + oxfmt for the current preset.
    const url = debounced ? `/r/button?preset=${debounced}` : '/r/button'
    fetch(url, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status}`))))
      .then((json) => {
        setCode(json?.files?.[0]?.content ?? '')
        setError(false)
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true)
      })
    return () => controller.abort()
  }, [debounced])

  const { isCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-card">
      <div className="flex items-center justify-between gap-2 border-b py-2 pr-10 pl-3">
        <span className="truncate font-mono text-xs text-fg-muted">
          {PREVIEW_FILE}
        </span>
        <Button
          variant="quiet"
          size="xs"
          isIconOnly
          isDisabled={!code}
          onPress={() => code && copyToClipboard(code)}
          aria-label={isCopied ? 'Copied!' : 'Copy code'}
        >
          {isCopied ? <CheckIcon /> : <CopyIcon />}
        </Button>
      </div>
      <div className="relative min-h-0 flex-1 overflow-auto">
        {code ? (
          <DynamicPre lang="tsx">{code}</DynamicPre>
        ) : (
          <div className="p-4 font-mono text-xs text-fg-muted">
            {error ? "Couldn't load the preview." : 'Generating preview…'}
          </div>
        )}
      </div>
    </div>
  )
}

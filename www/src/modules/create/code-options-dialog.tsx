/**
 * Footer entry point for `codeOptions`: a "Code style" button that opens a
 * split modal — the code-style controls on the left, a live preview of the
 * exported button component on the right. The preview fetches the real
 * `/r/button` registry endpoint (same publisher + oxfmt the user gets on
 * install), debounced, so every toggle shows the actual resulting source.
 */

import { useEffect, useMemo, useState } from 'react'
import { CheckIcon, Code2Icon, CopyIcon } from 'lucide-react'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { Button } from '@/registry/ui/button'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Overlay } from '@/registry/ui/overlay'
import { DynamicPre } from '@/modules/docs/dynamic-pre'

import { CodeConfig } from './code-config'
import { useDesignSystem } from './preset'
import { encodePreset } from './preset/codec'

const PREVIEW_FILE = 'components/ui/button.tsx'

export function CodeOptionsDialog() {
  return (
    <Dialog>
      <Button variant="default" size="sm" className="w-full">
        <Code2Icon data-icon-start="" />
        Code style
      </Button>
      <Overlay
        type="modal"
        mobileType={null}
        modalProps={{
          className: 'h-[min(38rem,82vh)] w-[min(64rem,92vw)] sm:max-w-none',
        }}
      >
        <DialogContent
          showCloseButton
          aria-label="Code style"
          className="gap-0 overflow-hidden p-0"
        >
          <div className="flex h-full min-h-0 flex-col md:flex-row">
            <div className="flex w-full shrink-0 flex-col overflow-y-auto border-b p-4 md:w-80 md:border-r md:border-b-0">
              <h2 className="text-sm font-medium">Code style</h2>
              <p className="mt-0.5 mb-4 text-xs text-fg-muted">
                Shape the exported code to match your codebase.
              </p>
              <CodeConfig />
            </div>
            <CodePreview />
          </div>
        </DialogContent>
      </Overlay>
    </Dialog>
  )
}

function CodePreview() {
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

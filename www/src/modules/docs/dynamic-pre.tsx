import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import type { Root } from 'hast'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'

import { cn } from '@/registry/lib/utils'

import { Pre } from './code-block'
import type { highlightTsx } from './highlight'

export interface DynamicPreProps {
  lang: 'tsx'
  children: string
  className?: string
  /**
   * Build-time highlighted HAST for the INITIAL `children`. When provided, the
   * initial render paints highlighted without the runtime highlighter — shiki
   * loads lazily only once `children` diverges (i.e. a control moved). Consumers
   * without it (chart modal, /create preview) fall back to plain text until the
   * highlighter loads on first interaction.
   */
  initialHast?: Root
}

// Module-scoped so the runtime highlighter loads once per session; after that,
// re-highlights are synchronous.
let highlightFn: typeof highlightTsx | null = null
let highlightPromise: Promise<typeof highlightTsx> | null = null
function loadHighlighter(): Promise<typeof highlightTsx> {
  if (highlightFn) return Promise.resolve(highlightFn)
  if (!highlightPromise) {
    highlightPromise = import('./highlight').then((m) => {
      highlightFn = m.highlightTsx
      return m.highlightTsx
    })
  }
  return highlightPromise
}

function renderHast(hast: Root, className?: string) {
  return toJsxRuntime(hast, {
    Fragment,
    jsx,
    jsxs,
    components: {
      pre: (props) => (
        <Pre {...props} className={cn(props.className, className)} />
      ),
    },
  })
}

/**
 * Highlighted <pre> for code generated at runtime. First paint uses the
 * build-time `initialHast` (see ./highlight); the shiki highlighter is loaded
 * lazily and only after the code changes, keeping it off the entry/critical path.
 * `useDeferredValue` keeps control interactions responsive under load.
 */
export function DynamicPre({
  children: code,
  className,
  initialHast,
}: DynamicPreProps) {
  const initialCodeRef = useRef(code)
  const deferredCode = useDeferredValue(code)
  const [hast, setHast] = useState<Root | null>(initialHast ?? null)

  useEffect(() => {
    // The initial value is covered by the build-time HAST — no runtime highlighter.
    if (initialHast && deferredCode === initialCodeRef.current) {
      setHast(initialHast)
      return
    }
    if (highlightFn) {
      setHast(highlightFn(deferredCode))
      return
    }
    let cancelled = false
    void loadHighlighter().then((fn) => {
      if (!cancelled) setHast(fn(deferredCode))
    })
    return () => {
      cancelled = true
    }
  }, [deferredCode, initialHast])

  return useMemo(() => {
    if (hast) return renderHast(hast, className)
    // Not yet highlighted (no initialHast + highlighter still loading): plain text.
    return (
      <Pre className={className}>
        <code>{deferredCode}</code>
      </Pre>
    )
  }, [hast, deferredCode, className])
}

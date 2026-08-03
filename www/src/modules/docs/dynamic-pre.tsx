import { useDeferredValue, useMemo } from "react"

import { Pre } from "./code-block"
import { highlightTsxHtml } from "./highlight"

export interface DynamicPreProps {
  lang: "tsx"
  children: string
  className?: string
}

/**
 * Highlighted <pre> for code generated at runtime. Highlighting is fully
 * synchronous (see ./highlight), so SSR output and the first client render are
 * already highlighted — no fallback state. `useDeferredValue` keeps control
 * interactions responsive by letting React defer re-highlights under load.
 */
export function DynamicPre({ children: code, className }: DynamicPreProps) {
  const deferredCode = useDeferredValue(code)
  const html = useMemo(() => highlightTsxHtml(deferredCode), [deferredCode])
  return (
    <Pre className={className}>
      {/* Markup is escaped token spans from our own highlighter, not user HTML. */}
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </Pre>
  )
}

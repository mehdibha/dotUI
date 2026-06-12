import { useDeferredValue, useMemo } from 'react'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'

import { Pre } from './code-block'
import { highlightTsx } from './highlight'

export interface DynamicPreProps {
  lang: 'tsx'
  children: string
}

/**
 * Highlighted <pre> for code generated at runtime. Highlighting is fully
 * synchronous (see ./highlight), so SSR output and the first client render are
 * already highlighted — no fallback state. `useDeferredValue` keeps control
 * interactions responsive by letting React defer re-highlights under load.
 */
export function DynamicPre({ children: code }: DynamicPreProps) {
  const deferredCode = useDeferredValue(code)
  return useMemo(
    () =>
      toJsxRuntime(highlightTsx(deferredCode), {
        Fragment,
        jsx,
        jsxs,
        components: { pre: Pre },
      }),
    [deferredCode],
  )
}

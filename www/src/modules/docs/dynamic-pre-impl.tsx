import { useDeferredValue, useMemo } from 'react'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'

import { cn } from '@/registry/lib/utils'

import { Pre } from './code-block'
import type { DynamicPreProps } from './dynamic-pre'
import { highlightTsx } from './highlight'

/**
 * The highlighting half of DynamicPre, split into its own chunk so shiki
 * (grammar + themes ≈ 35KB gzipped) stays out of the shared entry bundle.
 * Highlighting itself is synchronous: SSR output and every render after the
 * chunk loads are fully highlighted. `useDeferredValue` keeps control
 * interactions responsive by letting React defer re-highlights under load.
 */
export function DynamicPreImpl({ children: code, className }: DynamicPreProps) {
  const deferredCode = useDeferredValue(code)
  return useMemo(
    () =>
      toJsxRuntime(highlightTsx(deferredCode), {
        Fragment,
        jsx,
        jsxs,
        components: {
          pre: (props) => (
            <Pre {...props} className={cn(props.className, className)} />
          ),
        },
      }),
    [deferredCode, className],
  )
}

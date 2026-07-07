import { lazy, Suspense } from 'react'

import { Pre } from './code-block'

const DynamicPreImpl = lazy(() =>
  import('./dynamic-pre-impl').then((m) => ({ default: m.DynamicPreImpl })),
)

export interface DynamicPreProps {
  lang: 'tsx'
  children: string
  className?: string
}

/**
 * Highlighted <pre> for code generated at runtime (playground output). The
 * highlighter lives in a lazy chunk (see ./dynamic-pre-impl): SSR resolves it
 * and emits highlighted HTML, which Suspense keeps on screen while the client
 * loads the chunk — the plain fallback only shows for client-only mounts.
 */
export function DynamicPre(props: DynamicPreProps) {
  return (
    <Suspense fallback={<PlainPre {...props} />}>
      <DynamicPreImpl {...props} />
    </Suspense>
  )
}

/** Same line structure as shiki's output so swapping in highlights doesn't shift layout. */
function PlainPre({ children: code, className }: DynamicPreProps) {
  return (
    <Pre className={className}>
      <code>
        {code.split('\n').map((line, i) => (
          <span key={i} className="line">
            {line}
          </span>
        ))}
      </code>
    </Pre>
  )
}

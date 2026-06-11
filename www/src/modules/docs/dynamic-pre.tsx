import { Suspense, useDeferredValue, useId } from 'react'
import type { HighlightOptions } from 'fumadocs-core/highlight'
import { useShiki } from 'fumadocs-core/highlight/client'

import { Pre } from './code-block'

export interface DynamicPreProps {
  lang: string
  children: string
  options?: Omit<HighlightOptions, 'lang'>
}

export function DynamicPre({ lang, children: code, options }: DynamicPreProps) {
  const id = useId()
  const shikiOptions = {
    lang,
    ...options,
    components: {
      pre: Pre,
      ...options?.components,
    },
  } satisfies HighlightOptions

  return (
    <Suspense
      fallback={
        <Placeholder code={code} components={shikiOptions.components} />
      }
    >
      <ShikiHighlighter
        id={id}
        {...useDeferredValue({ code, options: shikiOptions })}
      />
    </Suspense>
  )
}

function Placeholder({
  code,
  components = {},
}: {
  code: string
  components: HighlightOptions['components']
}) {
  const { pre: PreComponent = 'pre', code: Code = 'code' } =
    components as Record<string, React.FC>

  if (!code) {
    return (
      <PreComponent>
        <Code />
      </PreComponent>
    )
  }

  const lineCounts = new Map<string, number>()
  const lines = code.split('\n').map((line) => {
    const count = lineCounts.get(line) ?? 0
    lineCounts.set(line, count + 1)
    return { key: `${line}-${count}`, line }
  })

  return (
    <PreComponent>
      <Code>
        {lines.map(({ key, line }) => (
          <span key={key} className="line">
            {line}
          </span>
        ))}
      </Code>
    </PreComponent>
  )
}

function ShikiHighlighter({
  id,
  code,
  options,
}: {
  id: string
  code: string
  options: HighlightOptions
}) {
  return useShiki(code, options, [id, options.lang, code])
}

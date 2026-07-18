'use client'

import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
  useHighlightedCode,
} from '@/registry/ui/code-block'

const code = `export const description = 'A design-system builder: compose colors, typography, icons, density and per-component styles, then export the result as code you own.'`

export default function Demo() {
  const html = useHighlightedCode(code, 'ts')
  return (
    <CodeBlock className="w-full max-w-md">
      <CodeBlockHeader>
        <CodeBlockTitle>description.ts</CodeBlockTitle>
        <CodeBlockCopyButton />
      </CodeBlockHeader>
      <CodeBlockContent code={code} html={html ?? undefined} wrap />
    </CodeBlock>
  )
}

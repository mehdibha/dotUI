'use client'

import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  useHighlightedCode,
} from '@/registry/ui/code-block'

const code = `npx shadcn@latest add @dotui/code-block`

export default function Demo() {
  const html = useHighlightedCode(code, 'bash')
  return (
    <CodeBlock className="w-full max-w-md">
      <CodeBlockContent code={code} html={html ?? undefined} />
      <CodeBlockCopyButton className="absolute top-1.5 right-1.5" />
    </CodeBlock>
  )
}

'use client'

import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
  useHighlightedCode,
} from '@/registry/ui/code-block'

const code = `import { Button } from '@/components/ui/button'

export function Save() {
  return <Button variant="primary">Save changes</Button>
}`

export default function Demo() {
  const html = useHighlightedCode(code)
  return (
    <CodeBlock className="w-full max-w-md">
      <CodeBlockHeader>
        <CodeBlockTitle>save.tsx</CodeBlockTitle>
        <CodeBlockCopyButton />
      </CodeBlockHeader>
      <CodeBlockContent code={code} html={html ?? undefined} />
    </CodeBlock>
  )
}
